import { test, expect, type Page } from "@playwright/test";

const BENCH = "/dev/ife/";
const GLASS = ".bench-glass";
const SCREEN_W = 1920;
const SCREEN_H = 1080;
const BEZEL = 28;

async function openBench(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(BENCH, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(GLASS);
  // Stop the clock so assertions are about the screen, not about timing.
  await page.getByRole("button", { name: "Pause" }).click();
  return errors;
}

// The glass is scaled to fit the window, so an element's rendered box is not
// 1920 wide. Click targets by role or by centre; never by a coordinate taken
// from the IFE's own coordinate space.
const screenName = (page: Page) =>
  page.locator(".ife-root").getAttribute("data-screen");

test.describe("IFE bench", () => {
  test("idle to home to map and back", async ({ page }) => {
    const errors = await openBench(page);

    expect(await screenName(page)).toBe("idle");
    await expect(page.locator(".ife-idle-seat")).toHaveText("12K");

    await page.locator(".ife-idle").click();
    expect(await screenName(page)).toBe("home");

    await page.getByRole("button", { name: "Flight map" }).click();
    expect(await screenName(page)).toBe("map");
    await expect(page.locator(".ife-map canvas")).toHaveCount(1);

    // The strip's back control returns to home from any screen.
    await page.getByRole("button", { name: "Back" }).click();
    expect(await screenName(page)).toBe("home");
    // And from home it puts the screen away.
    await page.getByRole("button", { name: "Back" }).click();
    expect(await screenName(page)).toBe("idle");

    expect(errors).toEqual([]);
  });

  test("the map draws heard track solid and unheard track broken", async ({
    page,
  }) => {
    await openBench(page);
    await page.locator(".ife-idle").click();
    await page.getByRole("button", { name: "Flight map" }).click();
    await page.waitForFunction(
      () => (window as any).__ifeMap?.isStyleLoaded?.() === true,
      undefined,
      { timeout: 60_000 },
    );

    const runs = () =>
      page.evaluate(() => {
        const m = (window as any).__ifeMap;
        const src = (id: string) => m.getStyle().sources[id]?.data?.features ?? [];
        return {
          heard: src("flown-heard").length,
          unheard: src("flown-unheard").length,
          ahead: src("ahead").length,
        };
      });

    const before = await runs();
    expect(before.heard, "flown track should exist").toBeGreaterThan(0);
    expect(before.unheard, "nothing unheard yet").toBe(0);
    expect(before.ahead, "route ahead should be drawn").toBe(1);

    // Silence the receiver and scrub the flight forward through the gap. The
    // clock stays stopped so the assertion does not depend on wall time.
    await page.getByRole("button", { name: "Not heard" }).click();
    const timeline = page.locator("#sim-prog");
    const at = Number(await timeline.inputValue());
    await timeline.fill(String(at + 90));
    await timeline.dispatchEvent("change");

    const during = await runs();
    expect(during.unheard, "a gap should have opened").toBeGreaterThan(0);
    await expect(page.locator(".ife-plane-marker")).toHaveAttribute(
      "data-heard",
      "false",
    );

    // While nothing is heard, the arrival estimate says it is an estimate.
    await expect(page.locator(".ife-strip-remaining .ife-inferred")).toHaveCount(
      1,
    );

    await page.getByRole("button", { name: "Heard", exact: true }).click();
    await expect(page.locator(".ife-plane-marker")).toHaveAttribute(
      "data-heard",
      "true",
    );
    await expect(page.locator(".ife-strip-remaining .ife-inferred")).toHaveCount(
      0,
    );
    // The gap stays on the map: it happened, and the record keeps it.
    expect((await runs()).unheard).toBeGreaterThan(0);
  });

  test("reading light and the attendant call leave the screen", async ({
    page,
  }) => {
    await openBench(page);
    await page.locator(".ife-idle").click();

    const seatState = () =>
      page.evaluate(() => {
        const el = document.querySelector('.bench-cabin button[data-self="true"]');
        return el?.textContent ?? "";
      });

    const light = page.getByRole("button", { name: "Reading light" });
    await light.click();
    await expect(light).toHaveAttribute("aria-pressed", "true");
    // It reached the cabin, not just this screen.
    expect(await seatState()).toContain("L");

    await light.click();
    await expect(light).toHaveAttribute("aria-pressed", "false");

    const call = page.getByRole("button", { name: "Call attendant" });
    await call.click();
    // A placed call says so and offers to take it back.
    const cancel = page.getByRole("button", { name: "Cancel call" });
    await expect(cancel).toHaveAttribute("aria-pressed", "true");
    expect(await seatState()).toContain("C");
    await cancel.click();
    await expect(page.getByRole("button", { name: "Call attendant" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  test("an announcement takes the screen and gives it back", async ({ page }) => {
    await openBench(page);
    await page.locator(".ife-idle").click();
    await page.getByRole("button", { name: "Flight information" }).click();
    expect(await screenName(page)).toBe("flightInfo");

    await page.getByRole("button", { name: "Captain" }).click();
    await expect(page.locator(".ife-pa")).toHaveCount(1);
    // Nothing on it can be pressed to leave.
    expect(await page.locator(".ife-pa button").count()).toBe(0);

    await page.getByRole("button", { name: "None" }).click();
    await expect(page.locator(".ife-pa")).toHaveCount(0);
    // Back exactly where the passenger was.
    expect(await screenName(page)).toBe("flightInfo");
  });

  test("home is the destination: city, weather, credit and a tile panel", async ({
    page,
  }) => {
    await openBench(page);
    await page.locator(".ife-idle").click();
    expect(await screenName(page)).toBe("home");

    await expect(page.locator(".ife-home-city")).toHaveText("London");

    // Weather comes from the Worker route the sky view already uses.
    await expect(page.locator(".ife-home-wx-temp")).not.toHaveText("--°", {
      timeout: 30_000,
    });

    // A Wikimedia photograph is credited or it is not shown.
    if (await page.locator(".ife-home .ife-photo").count()) {
      await expect(page.locator(".ife-credit")).toContainText(
        "Wikimedia Commons",
      );
    }

    // Two rows of squares that scroll sideways, and the squares are square
    // enough that the icon and the label each get their own axis.
    const tiles = page.locator(".ife-tile");
    await expect(tiles).toHaveCount(5);
    const first = await tiles.first().boundingBox();
    expect(first!.width / first!.height).toBeCloseTo(1, 1);

    const rail = page.locator(".ife-tiles");
    const scroll = await rail.evaluate((el) => ({
      w: el.clientWidth,
      sw: el.scrollWidth,
    }));
    expect(scroll.sw, "the panel should have more tiles than it shows").toBeGreaterThan(
      scroll.w,
    );
  });

  test("the language switch reaches every surface", async ({ page }) => {
    await openBench(page);
    await page.locator(".ife-idle").click();
    await expect(page.locator(".ife-rail")).toContainText("Reading light");

    await page.getByRole("button", { name: "中文" }).click();
    // Chrome, menu and the journey strip all follow.
    await expect(page.locator(".ife-rail")).toContainText("阅读灯");
    await expect(page.locator(".ife-tiles")).toContainText("航班信息");
    await expect(page.locator(".ife-strip")).toContainText("还有");
    // Including the units inside a duration, which is where a half-translated
    // interface always shows.
    await expect(page.locator(".ife-strip-remaining")).toContainText("小时");

    await page.getByRole("button", { name: "EN", exact: true }).click();
    await expect(page.locator(".ife-rail")).toContainText("Reading light");
  });

  test("changing the seat updates the idle screen", async ({ page }) => {
    await openBench(page);
    await expect(page.locator(".ife-idle-seat")).toHaveText("12K");

    const seat = page.locator("#sim-seat");
    await seat.fill("02A");
    await expect(page.locator(".ife-idle-seat")).toHaveText("02A");

    await page.getByRole("button", { name: "Business" }).click();
    await expect(page.locator(".ife-idle")).toContainText("Business");
  });

  // The glass is a fixed 1920x1080 surface wherever it hangs. What must hold
  // at every window size is that all of it is visible and none of it is
  // stretched — that is the contract the 3D cabin will rely on.
  for (const [w, h] of [
    [1920, 1080],
    [1280, 720],
    [720, 900],
  ] as const) {
    test(`fits whole and unstretched at ${w}x${h}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await openBench(page);

      const box = await page.locator(".bench-bezel").boundingBox();
      const stage = await page.locator(".bench-stage").boundingBox();
      expect(box, "bezel not laid out").not.toBeNull();
      expect(stage).not.toBeNull();

      const scale = box!.width / (SCREEN_W + BEZEL * 2);
      // Same factor both ways: no stretching.
      expect(box!.height / (SCREEN_H + BEZEL * 2)).toBeCloseTo(scale, 2);
      expect(scale).toBeGreaterThan(0);
      expect(scale, "never blown up past 1:1").toBeLessThanOrEqual(1.001);

      // Inside the stage, with a pixel of slack for rounding.
      expect(box!.width).toBeLessThanOrEqual(stage!.width + 1);
      expect(box!.height).toBeLessThanOrEqual(stage!.height + 1);

      // And the IFE itself still measures 1920x1080 in its own coordinates.
      const inner = await page.evaluate(() => {
        const el = document.querySelector(".ife-root") as HTMLElement;
        return { w: el.offsetWidth, h: el.offsetHeight };
      });
      expect(inner).toEqual({ w: SCREEN_W, h: SCREEN_H });
    });
  }
});
