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

    // Weather comes from the Worker route the sky view already uses, which
    // fronts a third party that can and does rate-limit. Both outcomes are
    // correct behaviour and the test says which one it saw: a temperature when
    // the feed answered, the placeholder when it did not. Asserting only the
    // happy path made this test fail for running it too often.
    const wx = await page
      .waitForResponse((r) => r.url().includes("/api/weather"), {
        timeout: 30_000,
      })
      .catch(() => null);
    const temp = page.locator(".ife-home-wx-temp");
    if (wx && wx.ok()) {
      await expect(temp).not.toHaveText("--°", { timeout: 20_000 });
    } else {
      console.log(
        `[ife] weather feed unavailable (${wx ? wx.status() : "no response"}); the screen shows its placeholder`,
      );
      await expect(temp).toHaveText("--°");
    }

    // A Wikimedia photograph is credited or it is not shown.
    if (await page.locator(".ife-home .ife-photo").count()) {
      await expect(page.locator(".ife-credit")).toContainText(
        "Wikimedia Commons",
      );
    }

    // A rail of cards the hand pushes sideways, with one tall card breaking
    // the rhythm so it is a composition rather than a contact sheet.
    const cards = page.locator(".ife-card");
    await expect(cards).toHaveCount(6);
    await expect(page.locator('.ife-card[data-tall="true"]')).toHaveCount(2);

    const rail = page.locator(".ife-rail-cards");
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
    await expect(page.locator(".ife-rail-cards")).toContainText("航班信息");
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

  test("music belongs to the seat, not to the music page", async ({ page }) => {
    await openBench(page);
    await page.locator(".ife-idle").click();
    await page.getByRole("button", { name: "Music" }).click();

    // It opens on the shelf: the first question is which station, not which
    // song.
    await expect(page.locator(".ife-album")).toHaveCount(4);
    await expect(page.locator(".ife-track")).toHaveCount(0);

    await page.locator(".ife-album").first().click();
    await page.locator(".ife-track").first().click();

    // Playing puts a handle in the rail, and the handle does not leave when
    // the screen does.
    const mini = page.locator(".ife-mini");
    await expect(mini).toHaveCount(1, { timeout: 15_000 });
    await page.getByRole("button", { name: "Home", exact: true }).click();
    await page.getByRole("button", { name: "Flight information" }).click();
    expect(await screenName(page)).toBe("flightInfo");
    await expect(mini).toHaveCount(1);
  });

  test("an announcement takes the sound too, and gives it back", async ({
    page,
  }) => {
    await openBench(page);
    await page.locator(".ife-idle").click();
    await page.getByRole("button", { name: "Music" }).click();
    await page.locator(".ife-album").first().click();
    await page.locator(".ife-track").first().click();
    await expect(page.locator(".ife-mini")).toHaveCount(1, { timeout: 15_000 });

    await page.getByRole("button", { name: "Safety" }).click();
    await expect(page.locator(".ife-pa")).toHaveCount(1);
    // An announcement you can listen past is not an announcement.
    await expect(page.locator(".ife-mini")).toHaveCount(0);

    await page.getByRole("button", { name: "None" }).click();
    await expect(page.locator(".ife-pa")).toHaveCount(0);
    await expect(page.locator(".ife-mini")).toHaveCount(1, { timeout: 15_000 });
  });

  test("the film shelf is real, and so is the film", async ({ page }) => {
    await openBench(page);
    await page.locator(".ife-idle").click();
    await page.getByRole("button", { name: "Movies" }).click();

    // Eight real public-domain films, each with a year and a runtime.
    const films = page.locator(".ife-film");
    await expect(films).toHaveCount(8);
    await expect(films.first()).toContainText("1956");

    await films.first().click();
    await expect(page.locator(".ife-film-detail-title")).toHaveText(
      "Jet Mainliner Flight 803",
    );
    // The archive has no description for this one, and the page says so
    // rather than filling the hole.
    await expect(page.locator(".ife-film-detail-nodesc")).toHaveCount(1);

    await page.getByRole("button", { name: "Play", exact: true }).click();
    const video = page.locator("video");
    await expect(video).toHaveCount(1);
    // It really plays: the element gets metadata and the clock moves.
    await expect
      .poll(async () => video.evaluate((v: HTMLVideoElement) => v.currentTime), {
        timeout: 60_000,
        intervals: [1000],
      })
      .toBeGreaterThan(0);

    // The film has the whole surface: no journey strip, no rail, and the
    // element is the full 1920x1080 rather than a pane inside it.
    expect(await screenName(page)).toBe("film");
    await expect(page.locator(".ife-strip")).toHaveCount(0);
    await expect(page.locator(".ife-rail")).toHaveCount(0);
    expect(
      await video.evaluate((v: HTMLVideoElement) => [
        v.offsetWidth,
        v.offsetHeight,
      ]),
    ).toEqual([1920, 1080]);

    // The controls are this project's, not the browser's. The native set
    // lives in a closed shadow root and could never be reached once this
    // screen hangs on a seat in a 3D cabin.
    expect(
      await video.evaluate((v: HTMLVideoElement) => v.hasAttribute("controls")),
    ).toBe(false);
    await expect(page.locator(".ife-seek")).toHaveCount(1);

    // The controls get out of the way on their own and come back on a touch,
    // which is also why the seek below has to wake them first: hidden, they
    // take no pointer events and the click lands on the picture instead.
    const shell = page.locator(".ife-screening");
    await expect
      .poll(async () => shell.getAttribute("data-chrome"), { timeout: 15_000 })
      .toBe("false");
    await shell.hover();
    await expect(shell).toHaveAttribute("data-chrome", "true");

    // Seeking works, and works through the element's own coordinates rather
    // than a bounding rect — which is what survives a 3D transform.
    const seek = page.locator(".ife-seek");
    const box = (await seek.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.6, box.y + box.height / 2);
    const total = await video.evaluate((v: HTMLVideoElement) => v.duration);
    await expect
      .poll(async () => video.evaluate((v: HTMLVideoElement) => v.currentTime), {
        timeout: 15_000,
      })
      .toBeGreaterThan(total * 0.5);

    // And the announcement takes the picture too, then gives back the frame
    // it took. The panel is outside the glass, so it needs no waking.
    await page.getByRole("button", { name: "Captain" }).click();
    await expect
      .poll(async () => video.evaluate((v: HTMLVideoElement) => v.paused), {
        timeout: 10_000,
      })
      .toBe(true);
    const held = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
    await page.getByRole("button", { name: "None" }).click();
    await expect
      .poll(async () => video.evaluate((v: HTMLVideoElement) => v.paused), {
        timeout: 10_000,
      })
      .toBe(false);
    expect(
      await video.evaluate((v: HTMLVideoElement) => v.currentTime),
    ).toBeGreaterThanOrEqual(held - 0.5);
  });

  test("sudoku deals a board that can only be solved one way", async ({
    page,
  }) => {
    await openBench(page);
    await page.locator(".ife-idle").click();
    await page.getByRole("button", { name: "Games" }).click();
    await page.getByRole("button", { name: "Sudoku" }).click();

    const cells = page.locator(".ife-cell");
    await expect(cells).toHaveCount(81);
    const given = await page.locator('.ife-cell[data-given="true"]').count();
    expect(given).toBeGreaterThan(20);
    expect(given).toBeLessThan(60);

    // A blank cell takes a digit, and only a blank one does.
    const blank = page.locator('.ife-cell[data-given="false"]').first();
    await blank.click();
    await page.locator('.ife-key', { hasText: /^5$/ }).click();
    await expect(blank).toHaveText("5");

    // Harder deals leave fewer givens. This is the only property of the
    // generator a test can see from out here; its uniqueness is checked where
    // it is generated.
    await page.getByRole("button", { name: "Hard" }).click();
    const hardGiven = await page.locator('.ife-cell[data-given="true"]').count();
    expect(hardGiven).toBeLessThan(given);
  });

  test("the quiz marks an answer and shows where it comes from", async ({
    page,
  }) => {
    await openBench(page);
    await page.locator(".ife-idle").click();
    await page.getByRole("button", { name: "Games" }).click();
    await page.getByRole("button", { name: "Overhead" }).click();

    await expect(page.locator(".ife-quiz-q")).toContainText("ADS-B");
    await page.locator(".ife-quiz-option").nth(1).click();
    // The right answer is marked whichever one was picked, and the wrong pick
    // is marked too.
    await expect(page.locator('.ife-quiz-option[data-right="true"]')).toHaveCount(1);
    await expect(page.locator('.ife-quiz-option[data-wrong="true"]')).toHaveCount(1);
    // Every answer says where it comes from.
    await expect(page.locator(".ife-quiz-source")).toContainText("ICAO");

    await page.getByRole("button", { name: "Next" }).click();
    // The counter is the big one beside the question, not a caption in the head.
    await expect(page.locator(".ife-quiz-n")).toHaveText("02/6");
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
