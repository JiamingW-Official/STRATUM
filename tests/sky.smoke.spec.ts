import { test, expect, type Page, type ConsoleMessage } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

// Where the sky view lives. Phase 0 it is the site root; from phase 2 it is
// /sky. Override with SKY_PATH so the same gate follows the migration.
const SKY_PATH = process.env.SKY_PATH ?? "/";
// Set once routing exists (phase 3), enabling the leave-and-return leak check.
const HAS_ROUTING = process.env.SKY_ROUTING === "1";
const BASELINE_DIR = path.join("tests", "baseline");
const BASELINE_FILE = path.join(BASELINE_DIR, "sky.png");
// Writes the baseline instead of comparing against it. Only the author decides
// when a visual change is expected, so this is never set automatically.
const UPDATE_BASELINE = process.env.UPDATE_BASELINE === "1";

// Third-party feeds STRATUM deliberately races and falls back from. A 403 or a
// timeout here is the upstream's weather, not a regression — but it is reported
// rather than swallowed, so a run that passed on fallbacks says so.
const UPSTREAM_PREFIXES = [
  "/api/adsboe",
  "/api/adsbfi",
  "/api/adsbx",
  "/api/trace",
  "/api/ovp-",
  "/api/hexdb",
  "/api/opensky",
  "/api/adsbdb",
  "/api/fir",
  "/api/navaids",
  "/api/liveatc",
];
const isUpstream = (url: string) =>
  UPSTREAM_PREFIXES.some((p) => url.includes(p)) ||
  !url.startsWith("http://localhost");

type Collected = {
  consoleErrors: string[];
  upstreamNotes: string[];
  pageErrors: string[];
  apiFailures: string[];
};

function collect(page: Page): Collected {
  const c: Collected = {
    consoleErrors: [],
    upstreamNotes: [],
    pageErrors: [],
    apiFailures: [],
  };
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() !== "error") return;
    const where = m.location()?.url ?? "";
    const line = `${m.text().slice(0, 300)} @ ${where}`;
    (isUpstream(where) ? c.upstreamNotes : c.consoleErrors).push(line);
  });
  page.on("pageerror", (e) => c.pageErrors.push(String(e).slice(0, 400)));
  page.on("response", (r) => {
    const u = r.url();
    if (!u.includes("/api/") || r.status() < 400) return;
    (isUpstream(u) ? c.upstreamNotes : c.apiFailures).push(
      `${r.status()} ${u.slice(0, 140)}`,
    );
  });
  return c;
}

// Counts the resources a second mount must not duplicate. Installed before any
// page script runs.
const INSTRUMENT = () => {
  const w = window as any;
  w.__leak = { webgl: 0, intervals: 0, timeouts: 0, sockets: 0 };
  const getContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type: any, ...rest: any[]) {
    if (typeof type === "string" && type.startsWith("webgl")) w.__leak.webgl++;
    return getContext.call(this, type, ...rest);
  } as any;
  const setInterval_ = w.setInterval;
  w.setInterval = (...a: any[]) => {
    w.__leak.intervals++;
    return setInterval_(...a);
  };
  const clearInterval_ = w.clearInterval;
  w.clearInterval = (...a: any[]) => {
    w.__leak.intervals--;
    return clearInterval_(...a);
  };
  const WS = w.WebSocket;
  if (WS) {
    w.WebSocket = class extends WS {
      constructor(...a: any[]) {
        super(...a);
        w.__leak.sockets++;
        this.addEventListener("close", () => w.__leak.sockets--);
      }
    };
  }
};

async function openSky(page: Page) {
  // `load` never settles: the page keeps long-lived media and tile requests
  // open by design, so wait for the app's own signals instead.
  await page.goto(SKY_PATH, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector("#scene", { timeout: 30_000 });
}

// First visit puts the airspace picker in front of the scene, and a low-coverage
// check can raise a dialog later. Both swallow clicks meant for the toolbar, so
// the gate clears them before judging anything.
async function dismissOverlays(page: Page) {
  const closers = [
    "#city-overlay:not(.hidden) #city-overlay-close",
    "#no-coverage-backdrop:not(.hidden) #no-coverage-close",
    ".overlay-backdrop:not(.hidden) .overlay-close-btn",
  ];
  for (const sel of closers) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click({ timeout: 5_000 }).catch(() => {});
      await page.waitForTimeout(400);
    }
  }
}

// The scene is judged ready when the receiver-fed count on the HUD is non-zero:
// that number only moves when positions actually arrived and were placed.
async function waitForAircraft(page: Page, timeout = 90_000) {
  await expect
    .poll(
      async () =>
        Number(
          (await page.locator("#hud-count").textContent())?.replace(/\D/g, "") ||
            0,
        ),
      { timeout, intervals: [1000] },
    )
    .toBeGreaterThan(0);
  return Number(
    (await page.locator("#hud-count").textContent())?.replace(/\D/g, "") || 0,
  );
}

test.describe("/sky", () => {
  test("renders live traffic without errors", async ({ page }) => {
    const c = collect(page);
    await openSky(page);

    const count = await waitForAircraft(page);
    await dismissOverlays(page);
    console.log(`[verify:sky] aircraft on HUD: ${count}`);

    // A canvas with a WebGL context and real pixels behind it.
    const canvas = await page.evaluate(() => {
      const el = document.getElementById("scene") as HTMLCanvasElement | null;
      const r = (window as any)._renderer;
      return el
        ? {
            cssW: el.clientWidth,
            cssH: el.clientHeight,
            bufW: el.width,
            bufH: el.height,
            hasRenderer: !!r,
            geometries: r?.info?.memory?.geometries ?? null,
            textures: r?.info?.memory?.textures ?? null,
          }
        : null;
    });
    expect(canvas, "#scene canvas missing").not.toBeNull();
    expect(canvas!.cssW).toBeGreaterThan(0);
    expect(canvas!.cssH).toBeGreaterThan(0);
    expect(canvas!.bufW).toBeGreaterThan(0);
    expect(canvas!.hasRenderer, "window._renderer missing").toBe(true);
    console.log(
      `[verify:sky] canvas ${canvas!.cssW}x${canvas!.cssH}, geometries ${canvas!.geometries}, textures ${canvas!.textures}`,
    );

    // Airspace picker: the toolbar button raises the city overlay and the
    // close button puts it away. This is the one modal every other interaction
    // has to get past, so it is worth asserting both directions.
    const airspace = page.locator("#fab-airspace");
    if (await airspace.count()) {
      await airspace.click();
      await expect(page.locator("#city-overlay")).not.toHaveClass(/hidden/);
      await page.locator("#city-overlay-close").click();
      await expect(page.locator("#city-overlay")).toHaveClass(/hidden/);
    }

    // Weather lives in the HUD widget, which is present from first paint.
    await expect(page.locator("#hud-wx-rose")).toHaveCount(1);

    // Display layers are keyboard-driven (G distance rings, V ghost layer).
    // What is being checked is that toggling them does not stop the render
    // loop or throw — the visual result is the baseline screenshot's job.
    const frameOf = () =>
      page.evaluate(
        () => (window as any)._renderer?.info?.render?.frame ?? null,
      );
    for (const key of ["g", "v", "v", "g"]) {
      await page.keyboard.press(key);
      await page.waitForTimeout(700);
    }
    const f1 = await frameOf();
    await page.waitForTimeout(1500);
    const f2 = await frameOf();
    expect(f1, "renderer frame counter unavailable").not.toBeNull();
    expect(f2, "render loop stalled after toggling layers").toBeGreaterThan(
      f1 as number,
    );

    if (c.upstreamNotes.length) {
      console.log(
        `[verify:sky] upstream feeds degraded (not a regression, but the run leaned on fallbacks):\n  ${c.upstreamNotes.slice(0, 10).join("\n  ")}`,
      );
    }
    expect(c.pageErrors, "uncaught page errors").toEqual([]);
    expect(c.consoleErrors, "console errors from our own code").toEqual([]);
    expect(c.apiFailures, "failed requests to our own Worker routes").toEqual(
      [],
    );
  });

  test("leaving and returning does not leak the renderer", async ({ page }) => {
    test.skip(!HAS_ROUTING, "routing does not exist yet (phase 3+)");
    await page.addInitScript(INSTRUMENT);
    const c = collect(page);

    await openSky(page);
    await waitForAircraft(page);
    const before = await page.evaluate(() => ({ ...(window as any).__leak }));

    await page.goto("/dev", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(2000);
    await openSky(page);
    await waitForAircraft(page);
    await page.waitForTimeout(3000);
    const after = await page.evaluate(() => ({ ...(window as any).__leak }));

    console.log(
      `[verify:sky] leak counters before ${JSON.stringify(before)} after ${JSON.stringify(after)}`,
    );
    expect(after.webgl, "a second WebGL context was created").toBe(before.webgl);
    expect(
      after.intervals,
      "intervals left running after unmount",
    ).toBeLessThanOrEqual(before.intervals);
    expect(
      after.sockets,
      "websockets left open after unmount",
    ).toBeLessThanOrEqual(before.sockets);
    expect(c.pageErrors).toEqual([]);
  });

  // Live sky, live traffic and a moving sun mean the pixels never repeat. This
  // catches a page that went black or lost its chrome, not a subtle restyle —
  // the threshold is deliberately loose and a failure is a prompt to look, not
  // a verdict.
  test("looks like the baseline", async ({ page }) => {
    await openSky(page);
    await waitForAircraft(page);
    await dismissOverlays(page);
    await page.waitForTimeout(4000);

    if (UPDATE_BASELINE || !fs.existsSync(BASELINE_FILE)) {
      fs.mkdirSync(BASELINE_DIR, { recursive: true });
      await page.screenshot({ path: BASELINE_FILE });
      console.log(`[verify:sky] baseline written to ${BASELINE_FILE}`);
      return;
    }
    await expect(page).toHaveScreenshot("sky.png", {
      maxDiffPixelRatio: 0.35,
      threshold: 0.35,
      animations: "disabled",
    });
  });
});
