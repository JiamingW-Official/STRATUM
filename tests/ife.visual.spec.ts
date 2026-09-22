import { test, expect, type Locator, type Page } from "@playwright/test";
import { stubMapTiles } from "./tiles";

/**
 * What every screen looks like, kept.
 *
 * The other gate tests behaviour: that a button opens a screen, that a
 * timetable has seven rows, that the glass fits. It passed every run of the
 * day the type scale, the corner scale and the spacing scale were all
 * replaced — including two runs where a value had been snapped onto the wrong
 * rule and a screen's margin had silently moved. Behaviour is not the whole
 * of a design, and a suite that only reads the DOM cannot see a layout drift.
 *
 * So: one picture per screen, compared against a kept one.
 *
 * ── What is masked, and why ────────────────────────────────────────────────
 * Most of this cabin is deliberately alive — a clock that moves, an aircraft
 * that flies, a record that is playing, a sudoku dealt fresh every time. None
 * of that can be compared against a picture taken yesterday, and none of it is
 * what this gate is for. Playwright paints a flat box over each masked
 * locator before comparing, so the box's *position and size* are still part
 * of the picture: if the countdown moves or changes size, that fails; if it
 * counts down, it does not.
 *
 * The list below is therefore as short as it can be. Anything added to it is
 * a piece of the screen this gate stops watching, so it wants a reason.
 *
 * ── When it fails ──────────────────────────────────────────────────────────
 * A failure is a prompt to look at the diff Playwright writes, not a verdict.
 * If the change was intended, re-record:
 *
 *     UPDATE_BASELINE=1 npx playwright test tests/ife.visual.spec.ts
 *
 * and the new pictures land in tests/baseline/. Recording is never automatic:
 * a gate that rewrites its own expectation when it fails is not a gate.
 */

const BENCH = "/dev/ife/";
const GLASS = ".bench-glass";

/**
 * A fixed viewport, because the glass is 1920 scaled to fit the window: at a
 * different size every edge lands on a different fraction of a pixel and the
 * whole picture is noise. 2200x1400 leaves the bench its chrome and the glass
 * a whole number of pixels.
 */
test.use({ viewport: { width: 2200, height: 1400 } });

const UPDATE = process.env.UPDATE_BASELINE === "1";

/** 2x2 of dusk, stretched over whatever the photograph would have been. */
const FLAT_IMAGE =
  "data:image/svg+xml;base64," +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3">' +
      '<rect width="4" height="3" fill="#24303f"/>' +
      '<rect width="4" height="1" fill="#3a4559"/></svg>',
  ).toString("base64");

/**
 * What is left after the stubs: two dealt boards and a live camera.
 *
 * The first version of this list was much longer and most of it was wrong —
 * it named containers rather than the values inside them, and a mask covers
 * the element's whole box, so masking `.ife-photo` (inset: 0 of the home
 * screen) or `.ife-figures` painted over the screen this gate exists to
 * watch. The baseline for Dining came out as a magenta rectangle with a
 * strip and a rail around it.
 *
 * The fix was not a better list. Almost everything that varies here varies
 * because of the clock or the network, and both of those can be answered
 * instead of hidden: the clock is fixed below, the weather, the tiles and
 * the destination photograph are all served from here. What genuinely
 * cannot be answered is a board dealt at random and a globe drawing itself,
 * and that is the whole list.
 */
function volatileParts(page: Page): Locator[] {
  return [
    page.locator(".ife-mini-sudoku"),
    page.locator(".ife-mini-2048"),
  ];
}

/**
 * The map's own, for the one test that looks at it.
 *
 * Not in the list above, and this is the second time the same trap was
 * sprung: the map is built once on boot and never taken down, so its canvas
 * is `inset: 0` of the stage on every screen even while it is invisible.
 * Masking it from the shared list painted Dining, Movies and the rest
 * magenta — the same mistake as masking `.ife-photo`, found the same way,
 * by looking at the recorded picture instead of at the passing run.
 */
function mapParts(page: Page): Locator[] {
  return [page.locator(".ife-map canvas"), page.locator(".ife-map-strip")];
}

/**
 * Nothing is judged while a picture is still arriving.
 *
 * The film's frame and the records' sleeves are local files, but local is not
 * instant, and a fixed wait is a guess that is right most mornings: one run
 * in four recorded the Chinese first-run screen a frame before the still had
 * decoded and the next run disagreed with it. This asks the page instead.
 */
async function settled(page: Page) {
  await page
    .waitForFunction(
      async () => {
        const imgs = [...document.querySelectorAll(".bench-glass img")];
        if (!imgs.every((i) => (i as HTMLImageElement).complete)) return false;
        // And the ones that are not <img> at all. The film's frame on the
        // home card is a background-image, which `complete` knows nothing
        // about — one recording in four caught that card empty and the next
        // run disagreed with it. Asking the browser to decode the same URL
        // again is free once it is in the cache and blocks until it is.
        const urls = new Set<string>();
        for (const el of document.querySelectorAll(".bench-glass *")) {
          const bg = getComputedStyle(el).backgroundImage;
          for (const m of bg.matchAll(/url\("?([^")]+)"?\)/g)) urls.add(m[1]);
        }
        await Promise.all(
          [...urls].map(
            (u) =>
              new Promise((done) => {
                const i = new Image();
                i.onload = i.onerror = () => done(null);
                i.src = u;
              }),
          ),
        );
        return true;
      },
      null,
      { timeout: 15_000 },
    )
    .catch(() => {});
  await page.evaluate(() => document.fonts.ready);
}

async function shot(page: Page, name: string, extra: Locator[] = []) {
  await settled(page);
  const glass = page.locator(GLASS);
  const mask = [...volatileParts(page), ...extra];
  if (UPDATE) {
    // The same options the assertion below uses, and this is not tidiness.
    // toHaveScreenshot disables animations; Locator.screenshot does not. So
    // a baseline recorded here was caught with transitions in flight and
    // then compared against a frame where they were pinned to their end
    // state, and the gate failed by a few thousand pixels of type — a
    // different few thousand every run, which is what sent this looking for
    // a flake in the cabin instead of in the gate.
    await glass.screenshot({
      path: `tests/baseline/${name}.png`,
      mask,
      animations: "disabled",
      caret: "hide",
    });
    return;
  }
  await expect(glass).toHaveScreenshot(`${name}.png`, {
    mask,
    // Tight. The point of this gate is to notice 4px, which is what the
    // spacing scale moved things by — the sky gate's 0.35 is for a different
    // question ("did the renderer die"). Antialiasing on type still needs a
    // little room, so it is not zero.
    maxDiffPixelRatio: 0.004,
    threshold: 0.25,
    animations: "disabled",
  });
}

/**
 * The bench, opened the same way every time.
 *
 * Tiles are stubbed for the same reason the behaviour gate stubs them: a
 * picture of this cabin is not a picture of somebody's raster service, and a
 * run should not go red because Esri was busy.
 */
async function openBench(page: Page) {
  /**
   * One clock for every run.
   *
   * The bench works out the departure and the arrival from `Date.now()` when
   * it boots, so a picture taken at 14:16 and compared at 17:41 differs in
   * every figure on the strip — measured, nothing on these screens moves
   * once the sim is paused, but each run starts from a different instant.
   * `setFixedTime` pins what the page reads and leaves its timers alone, so
   * animations, fetches and the paused sim all behave as they do in a cabin.
   */
  await page.clock.setFixedTime(new Date("2026-03-14T09:00:00Z"));
  await stubMapTiles(page);
  /**
   * The destination photograph, answered rather than masked.
   *
   * It is a Wikipedia lookup followed by a several-megabyte download that
   * fades in when it decodes, so the home screen looks different depending
   * on how fast the morning is. What the gate is watching there is the
   * column of type and the rail on top of it, not the picture, so the
   * picture is a flat colour it can rely on — and the scrim, the type and
   * every box are still exactly where they were.
   */
  await page.route("**/api/rest_v1/page/summary/**", (r) =>
    r.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        title: "Baseline",
        originalimage: { source: FLAT_IMAGE },
        thumbnail: { source: FLAT_IMAGE },
        extract: "",
      }),
    }),
  );
  // The weather card is the one panel whose *shape* depends on a third party
  // — with no reading it has a title and no table. Answering it here keeps
  // the picture the same on a rate-limited afternoon as on a quiet morning.
  await page.route("**/api/weather*", (r) =>
    r.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        current: {
          temperature_2m: 12.4,
          apparent_temperature: 10.1,
          wind_speed_10m: 19,
          wind_direction_10m: 228,
          weather_code: 3,
        },
      }),
    }),
  );
  await page.goto(BENCH, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(GLASS);
  await page.getByRole("button", { name: "Pause" }).click();
  // Type is most of this design, so nothing is judged until the faces are in.
  await page.evaluate(() => document.fonts.ready);
}

const wake = async (page: Page, lang: string) => {
  await page.locator(".ife-idle").click();
  await page.getByRole("button", { name: lang, exact: true }).click();
  await page.getByRole("button", { name: SKIP[lang], exact: true }).click();
};

const menu = async (page: Page, row: string) => {
  await page.locator(".ife-strip").getByRole("button").first().click();
  await page
    .locator(".ife-drawer")
    .getByRole("button", { name: row, exact: true })
    .click();
};

/** The rows of the menu, in both languages, keyed by the picture's name. */
const SCREENS = {
  English: {
    movies: "Movies",
    music: "Music",
    games: "Games",
    dining: "Dining",
    shop: "Duty free",
    info: "Flight information",
    chat: "Seat messages",
  },
  简体中文: {
    movies: "电影",
    music: "音乐",
    games: "游戏",
    dining: "餐食",
    shop: "免税购物",
    info: "航班信息",
    chat: "座位消息",
  },
} as const;

const SKIP: Record<string, string> = {
  English: "Skip",
  简体中文: "跳过",
  繁體中文: "跳過",
  日本語: "スキップ",
  Español: "Omitir",
  Français: "Passer",
  Русский: "Пропустить",
};

for (const lang of ["English", "简体中文"] as const) {
  const tag = lang === "English" ? "en" : "zh";

  test.describe(`IFE, ${lang}`, () => {
    test(`first run and home`, async ({ page }) => {
      await openBench(page);
      await shot(page, `ife-${tag}-idle`);

      await page.locator(".ife-idle").click();
      await page.waitForTimeout(600);
      await shot(page, `ife-${tag}-language`);

      await page.getByRole("button", { name: lang, exact: true }).click();
      await page.waitForTimeout(600);
      await shot(page, `ife-${tag}-start`);

      await page.getByRole("button", { name: SKIP[lang], exact: true }).click();
      await page.waitForTimeout(1200);
      await shot(page, `ife-${tag}-home`);

      // And the menu over it, which is the one panel that is drawn twice.
      await page.locator(".ife-strip").getByRole("button").first().click();
      await page.waitForTimeout(600);
      await shot(page, `ife-${tag}-menu`);
    });

    test(`every screen behind the menu`, async ({ page }) => {
      await openBench(page);
      await wake(page, lang);
      await page.waitForTimeout(1200);
      for (const [name, row] of Object.entries(SCREENS[lang])) {
        await menu(page, row);
        await page.waitForTimeout(1400);
        await shot(page, `ife-${tag}-${name}`);
      }
    });
  });
}

/**
 * The other five, one picture each.
 *
 * English and Chinese get every screen because their copy was written here,
 * line by line, and a change to it is a change somebody made on purpose. The
 * five that came later are translations of that copy: what can go wrong with
 * them is not a layout drift but a string that is suddenly too long for the
 * box it is in, or a fallback that has quietly stopped working and left
 * English on a French screen. The home screen shows the strip, the rail, a
 * hero, a caption, a reading and a countdown — enough of each to catch that,
 * and one picture rather than eleven, because seventy-seven baselines in a
 * repository is a repository with a picture problem.
 */
for (const [lang, tag] of [
  ["繁體中文", "hant"],
  ["日本語", "ja"],
  ["Español", "es"],
  ["Français", "fr"],
  ["Русский", "ru"],
] as const) {
  test(`IFE, ${lang}`, async ({ page }) => {
    await openBench(page);
    await page.locator(".ife-idle").click();
    await page.getByRole("button", { name: lang, exact: true }).click();
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: SKIP[lang], exact: true }).click();
    await page.waitForTimeout(1600);
    await shot(page, `ife-${tag}-home`);
  });
}
