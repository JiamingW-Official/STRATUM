import { test, expect, type Locator, type Page } from "@playwright/test";
import { decodeBcbp, encodeBcbp } from "../src/booking/bcbp";
import { clockSaid, clockShift } from "../src/booking/format";
import { arcPoints, skyAt } from "../src/booking/Arc";
import { AIRPORTS } from "../src/flight-state/airports";
import {
  HUBS,
  advanceFactor,
  blockMinutes,
  disruptionFor,
  fareFamily,
  SELL_CUTOFF_MIN,
  checkInIsOpen,
  serviceFor,
  isNonstop,
  nextBookableDate,
  priceItinerary,
  priceOf,
  routeKm,
  searchFlights,
  searchItineraries,
  taxesFor,
  familyFor,
  familiesFor,
} from "../src/booking/schedule";

const BENCH = "/dev/book/";
const GLASS = ".bookbench-glass";

/**
 * The phone is scaled to fit the window, exactly as the seat-back glass is, so
 * nothing here may click a coordinate taken from the app's own 390x844 space.
 * Everything is found by role and name.
 */
async function openBench(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 200));
  });
  await page.goto(BENCH, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(GLASS);
  return errors;
}

/**
 * The departures that can still be bought. A cancelled one stays on the list
 * — a flight vanishing is how a passenger loses track of what happened to it
 * — and it is not clickable, so nothing in a test should try.
 */
const bookable = (page: Page) => page.locator(".bk-farebar:not([disabled])");

/**
 * Choose a flight, which now takes two taps because it takes two decisions.
 *
 * The row is a departure and the cheapest way onto it; the fares are inside
 * it, and picking one is what buys the seat. Standard is the middle fare and
 * the one a test that is not about fares should be on.
 */
async function pick(page: Page, row?: Locator, fare = "Standard") {
  await (row ?? bookable(page).first()).click();
  // By the fare's name, not by the first word on the card: the card now opens
  // with the cabin above the name.
  const card = page
    .locator('.bk-flight-item[data-open="true"] .bk-fare')
    .filter({ has: page.locator(".bk-fare-brand", { hasText: fare }) });
  // The countdown on the island re-renders the app every second, so an
  // element resolved for a scroll can be replaced before the scroll lands.
  // Clicking is retried by Playwright; scrolling into view is not, so let the
  // click do both rather than asking for the scroll separately.
  await card.getByRole("button", { name: "Select" }).click();
}

/** Turn the return off. A one-way is one flight and one seat. */
async function oneWay(page: Page) {
  await page.getByRole("button", { name: "One way", exact: true }).click();
}

/**
 * Search and pick the flights, landing on the seat map for the outbound.
 *
 * A return is the default, so this picks twice unless the trip has been set
 * to one way — which is the flow the app actually opens on and therefore the
 * flow the tests should walk by default.
 */
async function toSeatMap(page: Page) {
  const returning = await page
    .getByRole("button", { name: "Return", exact: true })
    .getAttribute("data-on");
  await page.getByRole("button", { name: "Search flights" }).click();
  await pick(page);
  if (returning === "true") await pick(page);
  await expect(page.locator(".bk-deck-row").first()).toBeVisible();
}

/** Everything from the seat map to an issued pass, keeping the offered seat. */
async function toBoardingPass(page: Page) {
  // The seat map now says which seat is under your finger in its own panel,
  // so that is where the seat number is read from.
  const seat = (await page.locator(".bk-seatcard-no").textContent())!.trim();
  // On a return there are two aeroplanes to seat before there is anything to
  // pay for, and the seat map says so.
  const next = page.getByRole("button", { name: /^Next flight/ });
  if (await next.isVisible().catch(() => false)) await next.click();
  await page.getByRole("button", { name: "Review and pay" }).click();

  // One screen for the name and the card, which is what buying a seat is.
  await page.getByPlaceholder("LARSSON").fill("LARSSON");
  await page.getByPlaceholder("MAJ").fill("MAJ");
  await page.getByPlaceholder("4242 4242 4242 4242").fill("4242424242424242");
  await page.getByPlaceholder("MM/YY").fill("1230");
  await page.getByPlaceholder("000", { exact: true }).fill("123");
  await page.getByRole("button", { name: /^Pay / }).click();

  // The reference lives with the booking, on its own row, at the size it is
  // read out at a desk.
  await expect(page.locator(".bk-pnr b")).toHaveText(/^[A-Z0-9]{6}$/);
  await page.getByRole("button", { name: /^Check in · / }).click();

  // The passport is asked for here, where the border wants it, and not on the
  // way to paying.
  await page.locator(".bk-field select").selectOption("United Kingdom");
  await page.getByPlaceholder("P4471902").fill("P4471902");
  await page.locator('input[type="date"]').first().fill("2031-08-30");
  await page.getByRole("button", { name: /not carrying any of these/ }).click();
  await page.getByRole("button", { name: /^Check in( for both flights)?$/ }).click();
  await expect(page.locator(".bk-plate svg")).toBeVisible();
  return seat;
}

/**
 * One morning, for all of it.
 *
 * Almost every test here walks the booking flow, and every step of that flow
 * has a deadline in it: a departure stops being sellable forty-five minutes
 * out, bag drop shuts an hour before a long-haul, the check-in window opens a
 * day ahead, extra bags cannot be bought once the hold is closed. Run the
 * suite at the wrong hour and the day the search offers has nothing bookable
 * left on it — which is not a bug in the app, it is the app being right, and
 * it made seven different tests fail at seven different times of night.
 *
 * So the clock is a fixture rather than a thing each test remembers to pin.
 * Six in the morning UTC: before the first bank of departures anywhere on the
 * network, so every route has a full day ahead of it. Tests that are about
 * the clock move it with `setSystemTime`, which is the same jump `install`
 * was making and does not fight the fixture.
 */
const MORNING = "2026-09-20T06:00:00Z";

test.describe("booking", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.install({ time: new Date(MORNING) });
  });

  test("a fare, a seat, a check-in and a pass", async ({ page }) => {
    const errors = await openBench(page);
    await toSeatMap(page);
    const seat = await toBoardingPass(page);

    expect(seat).toMatch(/^\d+[A-K]$/);
    // The seat the passenger chose is the seat printed on the pass, in the
    // first of the three boxes a gate reads.
    await expect(
      page.locator(".bk-pass-facts dd").first(),
    ).toHaveText(seat);
    // Nothing on a boarding pass may be negative. The first version printed
    // gate A-10 and sequence -130, because a 32-bit hash shifted with >> is
    // signed.
    for (const v of await page
      .locator(".bk-pass-facts dd, .bk-pass-foot dd")
      .allTextContents()) {
      expect(v).not.toContain("-");
    }
    expect(errors).toEqual([]);
  });

  test("the code on the pass actually scans", async ({ page }) => {
    await openBench(page);
    await toSeatMap(page);
    const seat = await toBoardingPass(page);

    // Decoded by the browser's own barcode reader rather than by the encoder
    // that drew it, which is the only reading that proves anything. If this
    // engine has no detector the assertion cannot be made, and a test that
    // silently passes on a missing capability is worse than one that says so.
    const decoded = await page.evaluate(async () => {
      const Detector = (window as unknown as { BarcodeDetector?: new (o: unknown) => { detect(s: unknown): Promise<Array<{ rawValue: string }>> } }).BarcodeDetector;
      if (!Detector) return { supported: false as const };
      const svg = document.querySelector(".bk-plate svg")!;
      const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
        type: "image/svg+xml",
      });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 720;
      canvas.height = 720;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 720, 720);
      ctx.drawImage(img, 0, 0, 720, 720);
      URL.revokeObjectURL(url);
      const found = await new Detector({ formats: ["qr_code"] }).detect(canvas);
      return { supported: true as const, value: found[0]?.rawValue ?? null };
    });

    expect(
      decoded.supported,
      "this browser has no BarcodeDetector, so the code was never read",
    ).toBe(true);
    expect(decoded.supported && decoded.value).toBeTruthy();

    const url = new URL(decoded.supported ? decoded.value! : "");
    expect(url.pathname).toBe("/dev/ife/");
    const pass = decodeBcbp(url.searchParams.get("bp")!);
    expect(pass?.seat).toBe(seat);
    expect(pass?.name).toBe("LARSSON/MAJ");
  });

  test("scanning the pass opens that seat's screen", async ({ page }) => {
    await openBench(page);
    await toSeatMap(page);
    const seat = await toBoardingPass(page);

    const href = await page.getByRole("link", { name: /^Open seat/ }).getAttribute("href");
    await page.goto(href!, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".bench-glass");
    // The cabin is now this passenger's cabin: its seat, its flight, its route.
    await expect(page.locator(".ife-idle-seat")).toHaveText(seat);
    await expect(page.locator("#sim-seat")).toHaveValue(seat);
    await expect(page.locator("#sim-no")).toHaveValue(/^STR /);
    await expect(page.locator("#sim-from")).toHaveValue("JFK");
    await expect(page.locator("#sim-to")).toHaveValue("LHR");
  });

  test("the cabin fits the glass, nine abreast", async ({ page }) => {
    await openBench(page);
    await toSeatMap(page);
    // JFK to LHR is an A350: nine abreast in threes. At a fixed 34px that is
    // 434px of aeroplane inside 350px of glass, and the K column fell off the
    // right-hand edge.
    await expect(page.locator(".bk-head p")).toContainText("A350");
    const overflow = await page.evaluate(() => {
      const body = document.querySelector(".bk-body")!;
      return body.scrollWidth - body.clientWidth;
    });
    expect(overflow).toBe(0);
    const row = page.locator(".bk-deck-row").first();
    await expect(row.locator(".bk-seat")).toHaveCount(9);
    await expect(row.locator(".bk-aisle")).toHaveCount(2);
    await expect(page.getByRole("button", { name: /^Seat \d+K/ }).first()).toBeVisible();
  });

  test("an exit row has room left in it", async ({ page }) => {
    await openBench(page);
    await toSeatMap(page);
    // Extra legroom is the last thing to sell, because it is the thing people
    // pay extra for. The first version filled it like any other row, so the
    // one colour on the map worth pointing at could never be seen.
    const free = page.locator('.bk-seat[data-zone="legroom"]:not([data-taken="true"])');
    expect(await free.count()).toBeGreaterThan(8);
  });

  /** Pick an airport on the search screen, through the sheet the app uses. */
  async function setRoute(page: Page, from: string, to: string) {
    // The code appears twice on this screen once the sheet is open — on the
    // button that opened it and on the row inside it — so say which.
    // The picker is searched now, not scrolled: twenty-eight cities is a list
    // with a field on it, and the code is at the end of the row rather than
    // the start.
    const inSheet = (code: string) =>
      page.locator(".bk-sheet .bk-port-row", { hasText: code });
    await page.locator('.bk-port[data-side="from"]').click();
    await page.locator(".bk-find input").fill(from);
    await inSheet(from).click();
    await page.locator('.bk-port[data-side="to"]').click();
    await page.locator(".bk-find input").fill(to);
    await inSheet(to).click();
    await page.getByRole("button", { name: "Search flights" }).click();
  }

  test("each Airbus is its own room", async ({ page }) => {
        await openBench(page);
    await oneWay(page);

    // A320 on the short hop: one aisle, three and three.
    await setRoute(page, "LHR", "CDG");
    await pick(page);
    await expect(page.locator(".bk-head p")).toContainText("A320");
    const narrow = page.locator(".bk-deck-row").first();
    await expect(narrow.locator(".bk-seat")).toHaveCount(6);
    await expect(narrow.locator(".bk-aisle")).toHaveCount(1);

    // A330 in the middle distance: eight abreast, and the difference from the
    // A350 is all in the width of the centre block.
    // Seats, then the list, then the form: a one-way has no return list in
    // between.
    await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("button", { name: "Back" }).click();
    await setRoute(page, "JFK", "LAX");
    await pick(page);
    await expect(page.locator(".bk-head p")).toContainText("A330");
    const mid = page.locator(".bk-deck-row").first();
    await expect(mid.locator(".bk-seat")).toHaveCount(8);
    await expect(mid.locator(".bk-aisle")).toHaveCount(2);

    // Business on a wide-body is 1-2-1: four seats, two aisles, and every one
    // of them has its own way out.
    await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("button", { name: "Business" }).click();
    await pick(page, undefined, "Saver");
    const j = page.locator(".bk-deck-row").first();
    await expect(j.locator(".bk-seat")).toHaveCount(4);
    await expect(j.locator(".bk-aisle")).toHaveCount(2);
  });

  test("the card comes back next time, and the number does not", async ({ page }) => {
    await openBench(page);
    await toSeatMap(page);
    await toBoardingPass(page);

    // What is actually in the browser store, read back raw. A saved card that
    // keeps the number is not a saved card, it is a stored card number.
    const stored = await page.evaluate(() =>
      window.localStorage.getItem("stratum.air.profile"),
    );
    expect(stored).toBeTruthy();
    expect(stored).toContain("4242");
    expect(stored).not.toContain("4242424242424242");
    expect(stored!.toLowerCase()).not.toContain("cvv");
    expect(stored).not.toContain("123");
    // The passport is kept in full, on purpose: it is the difference between
    // checking in in ten seconds and typing a document number at an airport.
    expect(stored).toContain("P4471902");

    // Second visit: the name is already there and the card is offered.
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector(GLASS);
    await toSeatMap(page);
    const next2 = page.getByRole("button", { name: /^Next flight/ });
    if (await next2.isVisible().catch(() => false)) await next2.click();
    await page.getByRole("button", { name: "Review and pay" }).click();
    await expect(page.getByText(/Visa ending 4242/)).toBeVisible();
    await expect(page.getByText("LARSSON / MAJ")).toBeVisible();

    // And the security code is still asked for, because it was never kept.
    const pay = page.getByRole("button", { name: /^Pay / });
    await expect(pay).toBeDisabled();
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await expect(pay).toBeEnabled();

    // And the document is already in the boxes at check-in, which is the
    // whole reason for keeping it.
    await pay.click();
    await page.getByRole("button", { name: /^Check in · / }).click();
    await expect(page.getByPlaceholder("P4471902")).toHaveValue("P4471902");
    await expect(page.locator(".bk-field select")).toHaveValue("United Kingdom");
    // It can be taken back off the phone from the screen that collected it.
    await page.getByRole("button", { name: "Forget" }).click();
    await expect(page.getByPlaceholder("P4471902")).toHaveValue("");
    expect(
      await page.evaluate(() => window.localStorage.getItem("stratum.air.profile")),
    ).not.toContain("P4471902");
  });

  test("the island carries the pass, and says the same thing it does", async ({
    page,
  }) => {
    await openBench(page);
    // Nothing to say yet, so it is just the pill the hardware is.
    await expect(page.locator(".bk-island")).toHaveAttribute("data-state", "idle");

    await toSeatMap(page);
    const seat = await toBoardingPass(page);

    const island = page.locator(".bk-island");
    await expect(island).toHaveAttribute("data-state", "live");

    // One fact, in two places, never disagreeing: the compact island and the
    // live strip on the pass are both counting to the same instant. Both are
    // read in one go — sampling them a second apart let the minute tick over
    // between them and the test disagreed with itself.
    const { compact, strip } = await page.evaluate(() => ({
      compact: document.querySelector(".bk-island")!.textContent!.trim(),
      strip: document.querySelector(".bk-live-k")!.textContent!,
    }));
    expect(compact).toMatch(/^(\d+h \d\dm|\d+m|Now)$/);
    expect(strip).toContain(compact === "Now" ? "now" : compact.replace("m", ""));

    // Touched, it becomes the expanded presentation and carries what a
    // passenger checks between the lounge and the gate.
    await island.click();
    await expect(island).toHaveAttribute("data-state", "open");
    const activity = (await page.locator(".bk-la").textContent())!;
    expect(activity).toContain(seat);
    expect(activity).toContain("JFK");
    expect(activity).toContain("LHR");
    await island.click();
    await expect(island).toHaveAttribute("data-state", "live");
  });

  test("the trip is still there tomorrow, and the Trips tab opens it", async ({
    page,
  }) => {
    await openBench(page);
    // Nothing booked yet, so there is nowhere for that tab to go and it says
    // so by being unavailable rather than by opening an apology.
    await expect(page.getByRole("button", { name: "Trips" })).toBeDisabled();

    await toSeatMap(page);
    const seat = await toBoardingPass(page);

    // Closed and opened again. A booking that does not survive that is not a
    // booking. The app opens on Book — booking is what the Book tab is for —
    // and the trip is one tap away on the tab that holds trips.
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector(GLASS);
    await expect(page.locator(".bk-masthead")).toBeVisible();
    await page.getByRole("button", { name: "Trips" }).click();

    // A panel per flight on the booking; the outbound is the first of them
    // and it is the way in.
    const panel = page.locator(".bk-panel").first();
    await expect(panel).toContainText("JFK");
    await expect(panel).toContainText("LHR");
    await expect(panel).toContainText(seat);
    await expect(panel).toContainText("Checked in");
    await panel.click();
    // A pushed page keeps its tab. The trip opens out of Trips, so Trips is
    // still where you are: the black capsule used to stay put while the tab
    // under it went grey, which reads as nothing being selected at all.
    await expect(page.getByRole("button", { name: "Trips" })).toHaveAttribute(
      "data-on",
      "true",
    );

    await page.getByRole("button", { name: "Boarding pass" }).click();
    await expect(page.locator(".bk-plate svg")).toBeVisible();
    await expect(page.locator(".bk-island")).toHaveAttribute("data-state", "live");
  });

  test("the seat learns what the passenger booked, and nothing else", async ({
    page,
  }) => {
        await openBench(page);
    await oneWay(page);
    await toSeatMap(page);
    await page.getByRole("button", { name: "Review and pay" }).click();
    await page.getByPlaceholder("LARSSON").fill("LARSSON");
    await page.getByPlaceholder("MAJ").fill("MAJ");
    await page.getByPlaceholder("4242 4242 4242 4242").fill("4242424242424242");
    await page.getByPlaceholder("MM/YY").fill("1230");
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^Pay / }).click();
    await page.getByRole("button", { name: /^Check in · / }).click();
    await page.locator(".bk-field select").selectOption("United Kingdom");
    await page.getByPlaceholder("P4471902").fill("P4471902");
    await page.locator('input[type="date"]').first().fill("2031-08-30");
    // Two bags, so there is something for the cabin to be told.
    await page.getByRole("button", { name: "+2 bags" }).click();
    await page.getByRole("button", { name: /not carrying any of these/ }).click();
    await page.getByRole("button", { name: /^Check in( for both flights)?$/ }).click();

    const pnr = (await page
      .locator(".bk-pass-foot", { hasText: "Ref" })
      .locator("dd")
      .nth(2)
      .textContent())!.trim();
    const href = await page
      .getByRole("link", { name: /^Open seat/ })
      .getAttribute("href");
    await page.goto(href!, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".bench-glass");

    // Straight to the page a passenger checks things on.
    await page.locator(".ife-idle").click();
    await page.getByRole("button", { name: "English" }).click();
    await page.getByRole("button", { name: "Skip" }).click();
    await page.locator(".ife-strip-menu").click();
    await page.locator(".ife-drawer-row", { hasText: "Flight information" }).click();

    const line = page.locator(".ife-fi-booking");
    await expect(line).toContainText(pnr);
    await expect(line).toContainText("Economy");
    // One included plus the two bought at check-in.
    await expect(line).toContainText("3");
    // And not the one thing this cabin has never carried.
    await expect(line).not.toContainText("LARSSON");
  });

  test("out and back, which is what almost everybody buys", async ({ page }) => {
    
    await openBench(page);
    // Return is the default. A booking form that opens on a one-way is one
    // that has never watched anybody use it.
    await expect(
      page.getByRole("button", { name: "Return", exact: true }),
    ).toHaveAttribute("data-on", "true");

    await page.getByRole("button", { name: "Search flights" }).click();
    await expect(page.locator(".bk-act-sum .bk-cap")).toContainText("Flight 1 of 2");
    await expect(page.locator(".bk-leg-pin")).toHaveCount(0);
    await expect(page.locator(".bk-head h1")).toHaveText("JFK→LHR");

    const outTime = (await page.locator(".bk-flight .bk-rl-end b").first().textContent())!;
    await pick(page);

    // Now the way home: the route reads backwards, the flight already chosen
    // is pinned at the top, and the list quotes differences rather than whole
    // fares because a trip total is being built.
    await expect(page.locator(".bk-act-sum .bk-cap")).toContainText("Flight 2 of 2");
    const pin = page.locator(".bk-leg-pin");
    await expect(pin).toContainText("JFK → LHR");
    await expect(pin).toContainText(outTime.trim());
    // The heading is the route, the right way round for the leg being chosen.
    await expect(page.locator(".bk-head h1")).toHaveText("LHR→JFK");
    // Which half of the return this is lives on the bar at the foot, once;
    // the line under the heading that repeated it is gone.
    await expect(page.locator(".bk-act")).toContainText(/returning/i);
    // The list is in time order, not price order, so the cheapest is wherever
    // it happens to be — but exactly one return adds nothing to the trip, and
    // every other one says what it adds.
    // At least one return adds nothing — the cheapest — and it is not
    // necessarily only one: three departures on one day can land in the same
    // fare bucket once the fare is rounded to five dollars, and they do.
    expect(
      await page.locator(".bk-farebar-p", { hasText: "included" }).count(),
    ).toBeGreaterThanOrEqual(1);
    for (const t of await page.locator(".bk-farebar-p").allTextContents()) {
      expect(t.trim()).toMatch(/^(included|\+\$[\d,]+)$/);
    }
    await pick(page, bookable(page).nth(1));

    // Two aeroplanes, two seats, and the seat map says which one it is on.
    await expect(page.locator(".bk-head p")).toContainText("Flight 1 of 2");
    await expect(page.locator(".bk-head h1")).toHaveText("JFK→LHR");
    await page.getByRole("button", { name: /^Next flight/ }).click();
    await expect(page.locator(".bk-head p")).toContainText("Flight 2 of 2");
    await expect(page.locator(".bk-head h1")).toHaveText("LHR→JFK");
    await page.getByRole("button", { name: "Review and pay" }).click();

    // Both legs priced, and each pays the tax of the country it leaves from.
    // Air Passenger Duty makes the way home out of London the dearer half,
    // which is a real fact about flying and not an average.
    await expect(page.locator(".bk-leg")).toHaveCount(2);
    const money = (t: string) => Number(t.replace(/[^0-9]/g, ""));
    const taxOut = await page
      .locator(".bk-bill-row", { hasText: "Taxes and charges · JFK" })
      .locator("b")
      .textContent();
    const taxBack = await page
      .locator(".bk-bill-row", { hasText: "Taxes and charges · LHR" })
      .locator("b")
      .textContent();
    expect(money(taxBack!)).toBeGreaterThan(money(taxOut!));

    await page.getByPlaceholder("LARSSON").fill("LARSSON");
    await page.getByPlaceholder("MAJ").fill("MAJ");
    await page.getByPlaceholder("4242 4242 4242 4242").fill("4242424242424242");
    await page.getByPlaceholder("MM/YY").fill("1230");
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^Pay / }).click();

    // Both flights, one card each, under one name for the trip. The name is
    // the only place the cities are written out in words: the cards carry the
    // route line, which says the same thing in codes and times.
    await expect(page.locator(".bk-tripmast-t")).toHaveText("New York⇄London");
    await expect(page.locator(".bk-body > .bk-card .bk-route-line")).toHaveCount(
      2,
    );
    // Check-in is per leg and opens a day before each departure, so a week
    // out the way home cannot be checked into yet — and the screen says so
    // rather than offering one button that is about to be wrong.
    await expect(page.getByRole("button", { name: /^Check in · JFK → LHR/ })).toBeEnabled();
    await page.getByRole("button", { name: /^Check in · JFK → LHR/ }).click();
    await page.locator(".bk-field select").selectOption("United Kingdom");
    await page.getByPlaceholder("P4471902").fill("P4471902");
    await page.locator('input[type="date"]').first().fill("2031-08-30");
    await page.getByRole("button", { name: /not carrying any of these/ }).click();
    await page.getByRole("button", { name: /^Check in( for both flights)?$/ }).click();

    // The pass is for the leg that was checked in, and says which.
    await expect(page.locator(".bk-pass-no")).toContainText("Departing");
    await expect(page.locator(".bk-pass-port b").first()).toHaveText("JFK");
  });

  test("a party of three is three seats, not one and two apologies", async ({
    page,
  }) => {
    await openBench(page);
    await oneWay(page);
    await page.locator(".bk-field select").selectOption("3");
    await toSeatMap(page);

    // One chip per traveller, each carrying the seat it has — and three
    // different seats, because handing a party the same seat number is worse
    // than handing them none.
    const chips = page.locator(".bk-pax-b");
    await expect(chips).toHaveCount(3);
    const offered = await chips.locator("b").allTextContents();
    expect(new Set(offered).size).toBe(3);

    // Tapping a seat gives it to whoever is selected and moves on. Taking a
    // seat somebody else on the booking already has takes it off them.
    await chips.nth(0).click();
    const mine = offered[1];
    await page.getByRole("button", { name: `Seat ${mine}`, exact: true }).click();
    const after = await chips.locator("b").allTextContents();
    expect(after[0]).toBe(mine);
    expect(after[1]).toBe("—");
    // Which means it cannot be paid for yet.
    await expect(page.getByRole("button", { name: /^Choose a seat for everyone/ }))
      .toBeDisabled();

    // Give the second traveller a seat back, and it can.
    await chips.nth(1).click();
    const free = page.locator('.bk-seat:not([data-taken="true"]):not([data-mine="true"]):not([data-party="true"])');
    await free.nth(3).click();
    await page.getByRole("button", { name: "Review and pay" }).click();

    // Three names asked for, three passes issued.
    await expect(page.getByPlaceholder("LARSSON")).toHaveCount(3);
    for (const [i, n] of [["LARSSON", "MAJ"], ["LARSSON", "PER"], ["NILSSON", "EVA"]].entries()) {
      await page.getByPlaceholder("LARSSON").nth(i).fill(n[0]);
      await page.getByPlaceholder("MAJ").nth(i).fill(n[1]);
    }
    await page.getByPlaceholder("4242 4242 4242 4242").fill("4242424242424242");
    await page.getByPlaceholder("MM/YY").fill("1230");
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^Pay / }).click();
    await page.getByRole("button", { name: /^Check in · / }).click();
    await page.locator(".bk-field select").first().selectOption("United Kingdom");
    await page.getByPlaceholder("P4471902").fill("P4471902");
    await page.locator('input[type="date"]').first().fill("2031-08-30");
    await page.getByRole("button", { name: /not carrying any of these/ }).click();
    await page.getByRole("button", { name: /^Check in( for both flights)?$/ }).click();

    // Three passes and a way between them: a party at a gate is three codes,
    // and the reader wants them one at a time.
    const passChips = page.locator(".bk-pax-b");
    await expect(passChips).toHaveCount(3);
    const first = await page.locator(".bk-pass-facts dd").first().textContent();
    await passChips.nth(2).click();
    const third = await page.locator(".bk-pass-facts dd").first().textContent();
    expect(third).not.toBe(first);
    await expect(page.locator(".bk-pass-name")).toContainText("NILSSON");
  });

  test("a booking can be moved and dropped, by the rules it was sold under", async ({
    page,
  }) => {
    await openBench(page);
    await oneWay(page);
    // Flex is the fare that can be moved for nothing, which is the fare whose
    // promise the app could not previously keep.
    await page.getByRole("button", { name: "Search flights" }).click();
    await pick(page, undefined, "Flex");
    await page.getByRole("button", { name: "Review and pay" }).click();
    await page.getByPlaceholder("LARSSON").fill("LARSSON");
    await page.getByPlaceholder("MAJ").fill("MAJ");
    await page.getByPlaceholder("4242 4242 4242 4242").fill("4242424242424242");
    await page.getByPlaceholder("MM/YY").fill("1230");
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^Pay / }).click();

    const before = await page.locator(".bk-card .bk-rl-end b").first().textContent();
    await page.getByRole("button", { name: /^Change this flight/ }).click();
    await expect(page.locator(".bk-notice")).toContainText("No change fee");
    // Whichever departure is still for sale and is not the one already
    // booked. Taking the last row is not the same thing: how many rows there
    // are depends on the time of day, and late enough in the evening the last
    // one for sale is the one already in the booking.
    const rows = page.locator(".bk-flight-item");
    let target: Locator | null = null;
    for (let i = 0; i < (await rows.count()); i++) {
      const row = rows.nth(i);
      const bar = row.locator(".bk-farebar");
      const at = (await row.locator(".bk-rl-end b").first().textContent())!.trim();
      if (at !== before!.trim() && !(await bar.isDisabled())) {
        target = bar;
        break;
      }
    }
    expect(target, "nothing else is still for sale to move to").toBeTruthy();
    await pick(page, target!, "Flex");

    // The difference, the fee, and what it adds up to — before anything is
    // charged.
    const sheet = page.locator(".bk-sheet");
    await expect(sheet).toContainText("Change fee");
    await expect(sheet).toContainText("Flex");
    await sheet.getByRole("button", { name: /and change|Confirm the change/ }).click();
    const after = await page.locator(".bk-card .bk-rl-end b").first().textContent();
    expect(after).not.toBe(before);

    // Dropped: Flex gives the fare back as well as the taxes.
    await page.getByRole("button", { name: /^Cancel the booking/ }).click();
    const cancel = page.locator(".bk-sheet");
    await expect(cancel).not.toContainText("Not refundable");
    await cancel.getByRole("button", { name: /^Cancel and refund/ }).click();
    await expect(page.locator(".bk-trip")).toHaveCount(0);
    await expect(page.locator(".bk-notice")).toContainText("Booking cancelled");
  });

  test("a party is seated together, and told when it is not", async ({ page }) => {
    await openBench(page);
    await oneWay(page);
    await page.locator(".bk-field select").selectOption("3");
    await toSeatMap(page);

    // Offered together from the start, which is what an airline does: one
    // row, one block, no aisle in the middle.
    const chips = page.locator(".bk-pax-b");
    const offered = await chips.locator("b").allTextContents();
    const rows = offered.map((x) => x.replace(/\D/g, ""));
    expect(new Set(rows).size).toBe(1);
    const letters = offered.map((x) => x.slice(-1)).sort();
    expect(letters.every((c, i) => i === 0 || c.charCodeAt(0) === letters[i - 1].charCodeAt(0) + 1))
      .toBe(true);
    await expect(page.getByText("You are not sitting together")).toHaveCount(0);

    // Break it up, and the screen says so rather than letting a party find out
    // at the gate.
    await chips.nth(2).click();
    const far = page.locator('.bk-seat:not([data-taken="true"]):not([data-mine="true"]):not([data-party="true"])');
    await far.last().click();
    await expect(page.getByText("You are not sitting together")).toBeVisible();

    // And the fix is attached to the warning.
    await page.getByRole("button", { name: "Sit together" }).click();
    await expect(page.getByText("You are not sitting together")).toHaveCount(0);
    const after = await chips.locator("b").allTextContents();
    expect(new Set(after.map((x) => x.replace(/\D/g, ""))).size).toBe(1);
  });

  test("nothing is ever late next Tuesday", () => {
    const flights = searchFlights({
      fromIata: "JFK",
      toIata: "LHR",
      date: new Date().toISOString().slice(0, 10),
      returnDate: null,
      pax: 1,
    });
    // Beyond the window nobody knows yet, so nothing is disrupted. This is the
    // rule that keeps the feature honest rather than decorative: a flight next
    // week cannot be running late.
    const far = new Date(Date.now() + 9 * 86400_000).toISOString();
    for (const f of flights) {
      expect(disruptionFor(f.flightNo, far).status).toBe("onTime");
    }

    // Inside it, the same flight always gives the same answer — a delay that
    // changes every time the screen re-renders is worse than no delay at all.
    const soon = new Date(Date.now() + 2 * 3600_000).toISOString();
    for (const f of flights) {
      const a = disruptionFor(f.flightNo, soon);
      const b = disruptionFor(f.flightNo, soon);
      expect(a).toEqual(b);
      if (a.status === "delayed") {
        expect(a.minutes).toBeGreaterThanOrEqual(15);
        expect(a.minutes % 5).toBe(0);
        expect(a.reason).toBeTruthy();
      }
    }

    // And over a day of departures it happens to some and not to most, which
    // is what a departure board looks like.
    const day = Array.from({ length: 200 }, (_, i) =>
      disruptionFor(`STR ${100 + i}`, soon),
    );
    const late = day.filter((d) => d.status === "delayed").length;
    const off = day.filter((d) => d.status === "cancelled").length;
    expect(late).toBeGreaterThan(20);
    expect(late).toBeLessThan(90);
    expect(off).toBeGreaterThan(0);
    expect(off).toBeLessThan(25);
  });

  test("a delay reaches the list, the pass and the island", async ({ page }) => {
    // Disruption only exists in the last six hours before a departure, so
    // whether anything is late depends on what time it is. Rather than hope,
    // hold the clock still at an hour when one of the day's departures is —
    // found here with the same rule the app uses, so the test is asserting
    // the screens rather than re-deriving them.
    const found = findDelayed();
    expect(found, "no hour of the day has a delayed departure").toBeTruthy();
    const { at, flightNo } = found!;
    await page.clock.setSystemTime(new Date(at));

    await openBench(page);
    await oneWay(page);
    await page.getByRole("button", { name: "Search flights" }).click();
    // The panel carries the flag, and the flight number is at the top of the
    // panel it belongs to.
    const item = page
      .locator(".bk-flight-item", { hasText: "Delayed" })
      .first();
    await expect(item.locator(".bk-flag")).toContainText("Delayed");
    await expect(item.locator(".bk-flight-top")).toContainText(flightNo);
    await pick(page, item.locator(".bk-farebar"));
    await page.getByRole("button", { name: "Review and pay" }).click();
    await page.getByPlaceholder("LARSSON").fill("LARSSON");
    await page.getByPlaceholder("MAJ").fill("MAJ");
    await page.getByPlaceholder("4242 4242 4242 4242").fill("4242424242424242");
    await page.getByPlaceholder("MM/YY").fill("1230");
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^Pay / }).click();
    await page.getByRole("button", { name: /^Check in · / }).click();
    await page.locator(".bk-field select").first().selectOption("United Kingdom");
    await page.getByPlaceholder("P4471902").fill("P4471902");
    await page.locator('input[type="date"]').first().fill("2031-08-30");
    await page.getByRole("button", { name: /not carrying any of these/ }).click();
    await page.getByRole("button", { name: /^Check in( for both flights)?$/ }).click();

    // The pass says it, and says why.
    await expect(page.locator(".bk-live")).toContainText("Delayed");
    // The notice leads with the new boarding time as a fact, not a sentence.
    await expect(page.locator(".bk-notice")).toContainText("Boards");

    // And the island is carrying it, which is the whole reason that component
    // exists: an island that only ever counts down has never had anything to
    // say.
    const island = page.locator(".bk-island");
    await expect(island).toHaveAttribute("data-alert", "true");
    await island.click();
    await expect(page.locator(".bk-la-status")).toContainText("Delayed");
  });

  /** An instant, and a flight that is running late at it. */
  function findDelayed(): { at: number; flightNo: string } | null {
    // Three departures a day is a small sample, so walk forward until a day
    // has one that is late. With the clock held at that moment the app's own
    // "today" is that day, so nothing else in the flow has to be told.
    for (let day = 0; day < 14; day++) {
      const date = new Date(Date.parse(MORNING) + day * 86400_000)
        .toISOString()
        .slice(0, 10);
      const flights = searchFlights({
        fromIata: "JFK",
        toIata: "LHR",
        date,
        returnDate: null,
        pax: 1,
      });
      for (const f of flights) {
        // Two hours out: inside the window, and still long enough before the
        // gate for a boarding countdown to be worth drawing.
        const at = Date.parse(f.departureUtc) - 2 * 3600_000;
        if (at < Date.parse(MORNING)) continue;
        if (disruptionFor(f.flightNo, f.departureUtc, at).status === "delayed") {
          return { at, flightNo: f.flightNo };
        }
      }
    }
    return null;
  }

  test("a city pair off the network is flown through a hub", async ({ page }) => {
        await openBench(page);
    await oneWay(page);
    // Paris to Tokyo touches neither hub, so there is no nonstop and the
    // airline sells it the way it actually flies it: two aeroplanes meeting at
    // one of its two bases, and London is barely a detour on that line.
    await setRoute(page, "CDG", "HND");

    const row = page.locator(".bk-flight-item").first();
    // The line says where you change, and the chip under it says how long you
    // are on the ground for.
    await expect(row.locator(".bk-rl-stops")).toContainText("via LHR");
    await expect(row.locator(".bk-rl-track i")).toHaveCount(1);
    await expect(row.locator(".bk-flight-stop")).toContainText("in LHR");
    // Both flight numbers, at the top of the panel.
    await expect(row.locator(".bk-flight-top")).toContainText("+");

    await pick(page, row.locator(".bk-farebar"));
    // Two aeroplanes, two seat maps, and the map says which one it is on.
    await expect(page.locator(".bk-head p")).toContainText("Flight 1 of 2");
    await page.getByRole("button", { name: /^Next flight/ }).click();
    await expect(page.locator(".bk-head p")).toContainText("Flight 2 of 2");
    await page.getByRole("button", { name: "Review and pay" }).click();

    // The change is its own line, with the time on the ground on it: it is the
    // part of a journey people worry about and folding it into one row is how
    // it gets missed.
    await expect(page.locator(".bk-leg-meta")).toHaveCount(2);
    await expect(page.locator(".bk-leg-wait")).toContainText("in");

    await page.getByPlaceholder("LARSSON").fill("LARSSON");
    await page.getByPlaceholder("MAJ").fill("MAJ");
    await page.getByPlaceholder("4242 4242 4242 4242").fill("4242424242424242");
    await page.getByPlaceholder("MM/YY").fill("1230");
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^Pay / }).click();
    await page.getByRole("button", { name: /^Check in · / }).click();
    await page.locator(".bk-field select").first().selectOption("France");
    await page.getByPlaceholder("P4471902").fill("P4471902");
    await page.locator('input[type="date"]').first().fill("2031-08-30");
    await page.getByRole("button", { name: /not carrying any of these/ }).click();
    await page.getByRole("button", { name: /^Check in( for both flights)?$/ }).click();

    // An airline checks you in for the journey, so a change in the middle is
    // two passes — and the second one is what you hold across the hub.
    const segChips = page.locator(".bk-pax-b");
    await expect(segChips).toHaveCount(2);
    await expect(page.locator(".bk-pass-no")).toContainText("Flight 1 of 2");
    const firstTo = await page.locator(".bk-pass-port b").last().textContent();
    await segChips.nth(1).click();
    await expect(page.locator(".bk-pass-no")).toContainText("Flight 2 of 2");
    await expect(page.locator(".bk-pass-port b").first()).toHaveText(firstTo!);
  });

  test("the seat is told which row of the board is its own", async ({ page }) => {
        await openBench(page);
    await oneWay(page);
    await setRoute(page, "CDG", "HND");
    await pick(page);
    await page.getByRole("button", { name: /^Next flight/ }).click();
    await page.getByRole("button", { name: "Review and pay" }).click();
    await page.getByPlaceholder("LARSSON").fill("LARSSON");
    await page.getByPlaceholder("MAJ").fill("MAJ");
    await page.getByPlaceholder("4242 4242 4242 4242").fill("4242424242424242");
    await page.getByPlaceholder("MM/YY").fill("1230");
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^Pay / }).click();
    await page.getByRole("button", { name: /^Check in · / }).click();
    await page.locator(".bk-field select").first().selectOption("France");
    await page.getByPlaceholder("P4471902").fill("P4471902");
    await page.locator('input[type="date"]').first().fill("2031-08-30");
    await page.getByRole("button", { name: /not carrying any of these/ }).click();
    await page.getByRole("button", { name: /^Check in( for both flights)?$/ }).click();

    // The first pass is the one that opens the cabin, and it carries the
    // onward flight with it.
    const href = await page
      .getByRole("link", { name: /^Open seat/ })
      .getAttribute("href");
    const url = new URL(href!);
    const onward = url.searchParams.get("on");
    expect(onward).toBeTruthy();
    expect(url.searchParams.get("tier")).toBeTruthy();

    await page.goto(href!, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".bench-glass");
    await page.locator(".ife-idle").click();
    await page.getByRole("button", { name: "English" }).click();
    await page.getByRole("button", { name: "Skip" }).click();
    await page.locator(".ife-strip-menu").click();
    await page.locator(".ife-drawer-row", { hasText: "Flight information" }).click();
    // The cabin knows the card and the change, and still knows no name.
    const line = page.locator(".ife-fi-booking");
    await expect(line).toContainText("Changing to");
    await expect(line).toContainText(onward!);
    await expect(line).toContainText("Card");
    await expect(line).not.toContainText("LARSSON");
  });

  test("the card is issued, earns, and is worth something", async ({ page }) => {
    await openBench(page);
    await oneWay(page);
    // Nothing yet: a card is issued on the first booking, not on arrival.
    await page.getByRole("button", { name: "Club" }).click();
    await expect(page.locator(".bk-member")).toHaveCount(0);
    await page.getByRole("button", { name: "Book" }).click();
    await toSeatMap(page);
    await toBoardingPass(page);

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector(GLASS);
    await page.getByRole("button", { name: "Club" }).click();
    const card = page.locator(".bk-member");
    await expect(card).toBeVisible();
    await expect(card.locator(".bk-member-tier")).toHaveText("Blue");
    const miles = Number(
      (await card.locator(".bk-member-miles").textContent())!.replace(/\D/g, ""),
    );
    expect(miles).toBeGreaterThan(1000);

    // A card that has flown far enough stops paying for seats, which is the
    // benefit people notice and therefore the one that has to reach the sum
    // rather than only a list on a card.
    await page.addInitScript(() => {
      const raw = window.localStorage.getItem("stratum.air.profile");
      const p = raw ? JSON.parse(raw) : {};
      p.member = { number: "ST0000001", miles: 70000 };
      window.localStorage.setItem("stratum.air.profile", JSON.stringify(p));
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector(GLASS);
    await page.getByRole("button", { name: "Club" }).click();
    await expect(page.locator(".bk-member-tier")).toHaveText("Gold");
    await page.getByRole("button", { name: "Book" }).click();
    await oneWay(page);
    await toSeatMap(page);
    await page.getByRole("button", { name: "Review and pay" }).click();
    await expect(page.getByText(/included at Gold/)).toBeVisible();
    // Miles are on the bill, beside it rather than in the column of money.
    await expect(page.locator(".bk-earnbar")).toContainText("on ST");
  });

  test("a network, and what it does to a fare", () => {
    // Everything STRATUM flies touches a hub. That is what makes it an airline
    // with a network rather than a table of every pair of cities in the file.
    expect(isNonstop("JFK", "LHR")).toBe(true);
    expect(isNonstop("LHR", "CDG")).toBe(true);
    expect(isNonstop("CDG", "HND")).toBe(false);

    // And a pair its hubs cannot reach without doubling the journey is one it
    // simply does not fly. Shanghai to Los Angeles through New York is
    // twenty-two hours for a ten thousand kilometre line, and no airline
    // sells that.
    expect(
      searchItineraries({
        fromIata: "PVG",
        toIata: "LAX",
        date: nextBookableDate("PVG", "LAX"),
        returnDate: null,
        pax: 1,
      }),
    ).toHaveLength(0);
    for (const h of HUBS) expect(isNonstop(h, "SIN")).toBe(true);

    // The first day this route still has something to sell: late in the day
    // the answer for today is legitimately none.
    const date = nextBookableDate("CDG", "HND");
    const via = searchItineraries({
      fromIata: "CDG",
      toIata: "HND",
      date,
      returnDate: null,
      pax: 1,
    });
    expect(via.length).toBeGreaterThan(0);
    for (const it of via) {
      expect(it.segments).toHaveLength(2);
      // The change is at a hub, the two halves meet, and the wait is one an
      // airline would actually sell.
      expect(HUBS).toContain(it.segments[0].to.iata);
      expect(it.segments[0].to.iata).toBe(it.segments[1].from.iata);
      expect(it.layoverMin[0]).toBeGreaterThanOrEqual(60);
      expect(it.layoverMin[0]).toBeLessThanOrEqual(330);
      expect(it.totalMin).toBe(
        it.segments[0].blockMin + it.layoverMin[0] + it.segments[1].blockMin,
      );

      // Two flights sold as one journey cost less than the two sold apart —
      // an airline would rather fill the second aeroplane than lose the first.
      const through = priceItinerary(it, "economy", "standard");
      const apart =
        priceOf(it.segments[0], "economy", "standard").total +
        priceOf(it.segments[1], "economy", "standard").total;
      expect(through.total).toBeLessThan(apart);
    }
  });

  // The rules underneath the screens, checked against the world rather than
  // against themselves. None of these needs a browser.

  test("the return is the long way, because the wind is", () => {
    const km = routeKm("JFK", "LHR");
    const east = blockMinutes(km, "JFK", "LHR");
    const west = blockMinutes(km, "LHR", "JFK");
    // The jet stream runs west to east at these latitudes, so the westbound
    // leg is the long one — by about an hour on the Atlantic, which is what
    // the timetables say and what the first version of this could not say at
    // all, printing one number for both directions.
    expect(west).toBeGreaterThan(east);
    expect(west - east).toBeGreaterThan(45);
    expect(west - east).toBeLessThan(90);
    // And a flight that goes nowhere east or west gets none of it.
    const flat = routeKm("HND", "PVG");
    expect(Math.abs(blockMinutes(flat, "HND", "PVG") - blockMinutes(flat, "PVG", "HND")))
      .toBeLessThan(25);
  });

  test("the tax is the departure country's, not a percentage", () => {
    const km = routeKm("JFK", "LHR");
    // Air Passenger Duty is the famous one: the same seat costs more leaving
    // London than leaving New York, and by a lot.
    expect(taxesFor("LHR", km, "economy")).toBeGreaterThan(
      taxesFor("JFK", km, "economy") + 30,
    );
    // It is charged per departure, so a short hop pays far less than a
    // long-haul out of the same airport.
    expect(taxesFor("LHR", routeKm("LHR", "CDG"), "economy")).toBeLessThan(
      taxesFor("LHR", km, "economy"),
    );
    // And every duty in the table charges the front of the aeroplane more.
    expect(taxesFor("LHR", km, "business")).toBeGreaterThan(
      taxesFor("LHR", km, "economy"),
    );
  });

  test("three fares under one cabin, and they differ where it matters", () => {
    const [today] = searchFlights({
      fromIata: "JFK",
      toIata: "LHR",
      date: nextBookableDate("JFK", "LHR"),
      returnDate: null,
      pax: 1,
    });
    const light = priceOf(today, "economy", "light");
    const standard = priceOf(today, "economy", "standard");
    const flex = priceOf(today, "economy", "flex");
    expect(light.fare).toBeLessThan(standard.fare);
    expect(flex.fare).toBeGreaterThan(standard.fare);
    // The tax is the government's and does not care which fare was bought.
    expect(light.tax).toBe(flex.tax);
    // Light is the fare with no hold bag, which is the thing passengers most
    // often get wrong at the airport.
    expect(fareFamily("light").checked).toBe(0);
    expect(fareFamily("flex").seatIncluded).toBe(true);
    // Business is sold as two fares, Saver and Flex, a fifth apart — and
    // never as Light: a business seat with no bag is not a product anybody
    // sells, so asking for one gets you Saver.
    const saver = priceOf(today, "business", "standard").fare;
    const jFlex = priceOf(today, "business", "flex").fare;
    expect(jFlex).toBeGreaterThan(saver);
    expect(jFlex / saver).toBeCloseTo(1.2, 1);
    expect(familyFor("business", "light")).toBe("standard");
    expect(priceOf(today, "business", familyFor("business", "light")).fare).toBe(saver);
    // First is one fare: there is nothing left to take out of it.
    expect(familiesFor("first")).toEqual(["flex"]);
  });

  test("a seat bought this morning is not the price of one bought in May", () => {
    const soon = new Date(Date.now() + 12 * 3600_000).toISOString();
    const later = new Date(Date.now() + 40 * 86400_000).toISOString();
    expect(advanceFactor(soon)).toBeGreaterThan(advanceFactor(later) * 1.8);
    // Monotonic the whole way out: no day is dearer than a day closer in.
    const days = [0, 2, 5, 10, 16, 30, 90];
    const factors = days.map((d) =>
      advanceFactor(new Date(Date.now() + d * 86400_000).toISOString()),
    );
    for (let i = 1; i < factors.length; i++) {
      expect(factors[i]).toBeLessThanOrEqual(factors[i - 1]);
    }
  });

  test("a cancelled booking takes its miles back", async ({ page }) => {
    await openBench(page);
    await oneWay(page);
    await toSeatMap(page);
    await toBoardingPass(page);

    // Out of the pass and onto a screen that has the tabs.
    await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("button", { name: "Club" }).click();
    const earned = Number(
      (await page.locator(".bk-member-miles").textContent())!.replace(/\D/g, ""),
    );
    expect(earned).toBeGreaterThan(0);
    // The statement is a room of its own off the hub.
    await page.getByRole("button", { name: /^Activity/ }).click();
    await expect(page.locator(".bk-hist-row")).toHaveCount(1);
    await page.getByRole("button", { name: "Back" }).click();

    // Cancel it, and the statement no longer lists a flight that was refunded.
    await page.getByRole("button", { name: "Trips" }).click();
    await page.locator(".bk-panel").first().click();
    await page.getByRole("button", { name: /^Cancel the booking/ }).click();
    await page
      .locator(".bk-sheet")
      .getByRole("button", { name: /^Cancel and refund/ })
      .click();
    await page.getByRole("button", { name: "Club" }).click();
    await page.getByRole("button", { name: /^Activity/ }).click();
    await expect(page.locator(".bk-hist-row")).toHaveCount(0);
    await page.getByRole("button", { name: "Back" }).click();
    // The card itself stays — it was issued, and an airline does not
    // un-issue a number. What goes is the balance it was given.
    await expect(page.locator(".bk-member-miles")).toContainText("0");
    expect(
      Number(
        (await page.locator(".bk-member-miles").textContent())!.replace(/\D/g, ""),
      ),
    ).toBe(0);
  });

  test("the activity does not sit on top of the status bar", async ({ page }) => {
    await openBench(page);
    await oneWay(page);
    await toSeatMap(page);
    await toBoardingPass(page);

    // The compact activity is centred and the status items are not, so the
    // one that can grow has to stay inside what the other two leave. It used
    // to be drawn over the signal bars.
    const box = await page.evaluate(() => {
      const at = (s: string) => {
        const e = document.querySelector(s) as HTMLElement;
        const g = (document.querySelector(".bk-root") as HTMLElement).getBoundingClientRect();
        const b = e.getBoundingClientRect();
        return { l: b.left - g.left, r: b.right - g.left };
      };
      return {
        time: at(".bk-status-time"),
        island: at(".bk-island"),
        icons: at(".bk-status-icons"),
      };
    });
    expect(box.island.l).toBeGreaterThan(box.time.r);
    expect(box.island.r).toBeLessThan(box.icons.l);
  });

  test("the line is coloured by where the sun is", () => {
    // Solar time is the clock plus four minutes a degree, which is what a
    // time zone rounds off. Noon UTC is the middle of the day on the meridian
    // and the middle of the night on the other side of the world.
    const noonUtc = Date.UTC(2026, 8, 20, 12, 0);
    expect(skyAt(0, noonUtc)).toBe("day");
    expect(skyAt(180, noonUtc)).toBe("night");
    // New York at noon UTC is eight in the morning, solar-ish.
    expect(skyAt(AIRPORTS.JFK.lon, noonUtc)).toBe("day");
    // And at midnight UTC it is the small hours there.
    expect(skyAt(AIRPORTS.JFK.lon, Date.UTC(2026, 8, 20, 4, 0))).toBe("night");
    // Dawn and dusk get their own answer rather than being rounded to one.
    expect(skyAt(0, Date.UTC(2026, 8, 20, 6, 0))).toBe("twilight");
    expect(skyAt(0, Date.UTC(2026, 8, 20, 18, 0))).toBe("twilight");
  });

  test("the arc is the real great circle, not a swoosh", () => {
    const P = (c: string) => AIRPORTS[c];
    const pts = arcPoints(P("JFK"), P("LHR"));
    expect(pts[0][0]).toBeCloseTo(P("JFK").lat, 3);
    expect(pts.at(-1)![0]).toBeCloseTo(P("LHR").lat, 3);
    // The bend is the point: halfway along, the track is far north of the
    // halfway point between the two latitudes. That gap is what a straight
    // line on a flat map cannot show and what everyone recognises from a
    // route map.
    const midLat = pts[Math.floor(pts.length / 2)][0];
    const mean = (P("JFK").lat + P("LHR").lat) / 2;
    expect(midLat).toBeGreaterThan(mean + 5);
    // Due west across a continent barely bends at all by comparison.
    const flat = arcPoints(P("JFK"), P("LAX"));
    const flatMid = flat[Math.floor(flat.length / 2)][0];
    expect(flatMid - (P("JFK").lat + P("LAX").lat) / 2).toBeLessThan(3);
    // New York to Tokyo is the one everybody is surprised by: it goes over
    // the Arctic, not across the Pacific, and the drawing has to show that.
    const polar = arcPoints(P("JFK"), P("HND"));
    expect(Math.max(...polar.map(([lat]) => lat))).toBeGreaterThan(68);
    // A hop between two European cities is flat, and the drawing must not
    // inflate it: the ends are less than two degrees apart.
    const hop = arcPoints(P("AMS"), P("LHR"));
    const rise =
      Math.max(...hop.map(([lat]) => lat)) - Math.min(...hop.map(([lat]) => lat));
    expect(rise).toBeLessThan(2);
  });

  test("a booking can be moved to the front of the aeroplane", async ({ page }) => {
    await openBench(page);
    await oneWay(page);
    await toSeatMap(page);
    await page.getByRole("button", { name: "Review and pay" }).click();
    await page.getByPlaceholder("LARSSON").fill("LARSSON");
    await page.getByPlaceholder("MAJ").fill("MAJ");
    await page.getByPlaceholder("4242 4242 4242 4242").fill("4242424242424242");
    await page.getByPlaceholder("MM/YY").fill("1230");
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^Pay / }).click();

    const paid = Number(
      (await page.locator(".bk-row", { hasText: "Paid" }).locator(".bk-row-v").textContent())!
        .replace(/[^0-9]/g, ""),
    );

    // The offer is the difference, not the business fare.
    const move = page.getByRole("button", { name: /^Move to Business/ });
    const asked = Number(
      (await move.locator(".bk-upsell").textContent())!.replace(/[^0-9]/g, ""),
    );
    expect(asked).toBeGreaterThan(0);
    await move.click();
    await page.getByRole("button", { name: /and choose a seat/ }).click();

    // A different room: 1-2-1, and every seat to be chosen again.
    await expect(page.locator(".bk-head p")).toContainText("Business");
    const row = page.locator(".bk-deck-row").first();
    await expect(row.locator(".bk-seat")).toHaveCount(4);
    await expect(page.locator('.bk-seat[data-mine="true"]')).toHaveCount(0);

    await page.locator(".bk-seat:not([disabled])").first().click();
    await page.getByRole("button", { name: "Save seats" }).click();

    // Back on the trip, and it is now worth the business fare.
    const now = Number(
      (await page.locator(".bk-row", { hasText: "Paid" }).locator(".bk-row-v").textContent())!
        .replace(/[^0-9]/g, ""),
    );
    expect(now).toBeGreaterThan(paid);
    await expect(page.getByRole("button", { name: /^Move to Business/ })).toHaveCount(0);

    // And the card earns at the cabin you actually fly in: business is twice
    // the distance rate and Flex is a quarter more again.
    await page.getByRole("button", { name: "Club" }).click();
    const balance = Number(
      (await page.locator(".bk-member-miles").textContent())!.replace(/\D/g, ""),
    );
    // The statement is a room off the hub.
    await page.getByRole("button", { name: /^Activity/ }).click();
    const credited = Number(
      (await page.locator(".bk-hist-miles").first().textContent())!.replace(/\D/g, ""),
    );
    expect(credited).toBe(balance);
    expect(balance).toBeGreaterThan(0);
  });

  test("the gate calls a group, not just boarding", () => {
    // Four minutes a group, in order, capped at nine. The pass knows which
    // group it is in, so the strip can say whether it is your turn yet
    // instead of saying "Boarding now" at somebody in group seven.
    const called = (minsSinceBoarding: number) =>
      Math.min(9, 1 + Math.floor(minsSinceBoarding / 4));
    expect(called(0)).toBe(1);
    expect(called(3)).toBe(1);
    expect(called(4)).toBe(2);
    expect(called(20)).toBe(6);
    expect(called(90)).toBe(9);
  });

  test("the list can be sorted, and the default is the clock", async ({ page }) => {
    
    await openBench(page);
    await oneWay(page);
    await page.getByRole("button", { name: "Search flights" }).click();

    const times = () =>
      page.locator(".bk-flight-item .bk-rl-end b").first().allTextContents();
    const firstTimes = await page
      .locator('.bk-flight-item .bk-rl-end:first-child b')
      .allTextContents();
    // Departure time, earliest first, without being asked.
    const asNumbers = firstTimes.map((t) => Number(t.replace(":", "")));
    expect([...asNumbers].sort((a, b) => a - b)).toEqual(asNumbers);

    await page.getByRole("button", { name: /^Sorted by/ }).click();
    await page.getByRole("button", { name: /^Price/ }).click();
    await expect(page.getByRole("button", { name: /^Sorted by/ })).toContainText(
      "price",
    );
    const money = (t: string) => Number(t.replace(/[^0-9]/g, ""));
    const prices = (await page.locator(".bk-farebar-p").allTextContents()).map(money);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);

    // And by how long it takes.
    await page.getByRole("button", { name: /^Sorted by/ }).click();
    await page.getByRole("button", { name: /^How long it takes/ }).click();
    const mins = (await page.locator(".bk-rl-dur").allTextContents()).map((t) => {
      const [, h, m] = /(\d+)h (\d+)m/.exec(t) ?? [];
      return Number(h) * 60 + Number(m);
    });
    expect([...mins].sort((a, b) => a - b)).toEqual(mins);
    void times;
  });

  test("a document that has run out stops the check-in", async ({ page }) => {
    await openBench(page);
    await oneWay(page);
    await toSeatMap(page);
    await page.getByRole("button", { name: "Review and pay" }).click();
    await page.getByPlaceholder("LARSSON").fill("LARSSON");
    await page.getByPlaceholder("MAJ").fill("MAJ");
    await page.getByPlaceholder("4242 4242 4242 4242").fill("4242424242424242");
    await page.getByPlaceholder("MM/YY").fill("1230");
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^Pay / }).click();
    await page.getByRole("button", { name: /^Check in · / }).click();
    await page.locator(".bk-field select").first().selectOption("United Kingdom");
    await page.getByPlaceholder("P4471902").fill("P4471902");
    await page.getByRole("button", { name: /not carrying any of these/ }).click();

    const go = page.getByRole("button", { name: /^Check in( for both flights)?$/ });

    // Out of date on the day of arrival: an airline will not board it, so
    // neither will this screen.
    await page.locator('input[type="date"]').first().fill("2026-01-01");
    await expect(
      page.locator(".bk-notice", { hasText: "Expires before you land" }),
    ).toBeVisible();
    await expect(go).toBeDisabled();

    // Valid on the day, but inside six months of it: a border problem in a
    // great many countries, and a warning rather than a wall.
    const soon = new Date(Date.parse(MORNING) + 90 * 86400_000)
      .toISOString()
      .slice(0, 10);
    await page.locator('input[type="date"]').first().fill(soon);
    await expect(page.locator(".bk-notice", { hasText: "six months" })).toBeVisible();
    await expect(go).toBeEnabled();

    // And a document with years left says nothing at all.
    await page.locator('input[type="date"]').first().fill("2031-08-30");
    await expect(page.locator(".bk-notice", { hasText: "six months" })).toHaveCount(0);
    await expect(go).toBeEnabled();
  });

  test("the clock change is read off the zones, not off a table", () => {
    const P = (c: string) => AIRPORTS[c];
    expect(clockShift(P("JFK"), P("LHR"), "2026-09-20T12:00:00Z")).toBe(5);
    expect(clockShift(P("JFK"), P("LAX"), "2026-09-20T12:00:00Z")).toBe(-3);
    // The last night of a month: the two zones are on different dates, and
    // subtracting their day numbers gave seven hundred hours.
    expect(clockShift(P("JFK"), P("HND"), "2026-09-30T23:00:00Z")).toBe(13);
    // Europe puts its clocks back a week before America does, so for that
    // week London is four hours ahead of New York rather than five.
    expect(clockShift(P("JFK"), P("LHR"), "2026-10-26T12:00:00Z")).toBe(4);
    expect(clockSaid(0)).toBeNull();
    expect(clockSaid(1)).toBe("one hour ahead");
    expect(clockSaid(-8)).toBe("eight hours behind");
  });

  test("what is served comes off the clock and the block time", () => {
    // Nothing invented: a short hop gets a snack, a flight that crosses a
    // mealtime serves that meal, and a long one that crosses two serves two.
    const noon = (h: number) =>
      new Date(Date.UTC(2026, 8, 20, h, 0)).toISOString();
    expect(serviceFor(noon(12), "LHR", "CDG", 80)).toBe("A drink and a snack");
    expect(serviceFor(noon(7), "LHR", "CDG", 80)).toBe("Breakfast, served cold");
    // Out of New York at noon local, seven hours to London: lunch on the way
    // up, and it lands at three in the morning London time — nothing before
    // landing that anybody wants.
    expect(serviceFor(noon(16), "JFK", "LHR", 420)).toBe("Lunch");
    // The overnight: dinner after take-off, breakfast into a London morning.
    const red = serviceFor(noon(23), "JFK", "LHR", 420);
    expect(red).toContain("Dinner");
    expect(red).toContain("breakfast");
  });

  test("check-in closes when the door does", () => {
    // The window opens a day before and shuts at departure. It used to have
    // no upper edge, so a trip whose flight left an hour ago still said
    // "Check-in is open" — and the trip screen still offered the button.
    const dep = new Date(Date.now() + 3 * 3600_000).toISOString();
    expect(checkInIsOpen(dep)).toBe(true);
    expect(checkInIsOpen(dep, Date.parse(dep) + 60_000)).toBe(false);
    expect(checkInIsOpen(dep, Date.parse(dep) - 25 * 3600_000)).toBe(false);
  });

  test("an aeroplane that has gone is not for sale", () => {
    const today = new Date().toISOString().slice(0, 10);
    const cutoff = Date.now() + SELL_CUTOFF_MIN * 60000;
    for (const [from, to] of [
      ["JFK", "LHR"],
      ["LHR", "CDG"],
      ["JFK", "LAX"],
    ]) {
      // Nothing in the past, and nothing leaving so soon that check-in has
      // closed. A list that offers this morning's departure at nine at night
      // is a list nobody has looked at after lunch.
      for (const f of searchFlights({ fromIata: from, toIata: to, date: today, returnDate: null, pax: 1 })) {
        expect(Date.parse(f.departureUtc)).toBeGreaterThanOrEqual(cutoff);
      }
      // And the day the form opens on always has something on it.
      const day = nextBookableDate(from, to);
      expect(
        searchItineraries({ fromIata: from, toIata: to, date: day, returnDate: null, pax: 1 }).length,
      ).toBeGreaterThan(0);
    }
  });

  test("a boarding pass survives being written down and read back", () => {
    const pass = {
      pnr: "V8TWBT",
      passenger: {
        family: "LARSSON",
        given: "MAJ",
        nationality: "United Kingdom",
        passportNo: "P4471902",
        passportExpiry: "2031-08-30",
      },
      flightNo: "STR 172",
      carrier: "STR",
      fromIata: "JFK",
      toIata: "LHR",
      departureUtc: "2026-09-19T11:45:00.000Z",
      seat: "22A",
      cabinClass: "economy" as const,
      gate: "A11",
      terminal: "2",
      boardingUtc: "2026-09-19T11:05:00.000Z",
      zone: 5,
      sequence: 130,
    };
    const raw = encodeBcbp(pass);
    // Sixty characters, fixed width, no separators. That is the format.
    expect(raw).toHaveLength(60);
    const back = decodeBcbp(raw);
    expect(back).toMatchObject({
      name: "LARSSON/MAJ",
      pnr: "V8TWBT",
      fromIata: "JFK",
      toIata: "LHR",
      carrier: "STR",
      flightNo: "STR 172",
      cabinClass: "economy",
      seat: "22A",
      sequence: 130,
    });
    // Day of the year, because the format has nowhere to put a time.
    expect(back?.julianDay).toBe(262);
  });
  /**
   * The card the route sits on is a reading, not a tint somebody liked.
   *
   * Its paper carries the light at the two ends of the route: one sky at the
   * near edge, the other at the far one, read off the solar hour. At 09:00
   * UTC it is still the small hours in New York and the middle of the morning
   * in London, so the two edges cannot be the same colour — and turning the
   * route around has to turn the card around with it. If either ever stops
   * being true the wash has become decoration, which is the one thing it is
   * not allowed to be.
   */
  test("the card under the route is the light at both ends of it", async ({
    page,
  }) => {
    // Nine UTC: the small hours in New York, mid-morning in London.
    await page.clock.setSystemTime(new Date("2026-09-20T09:00:00Z"));
    await openBench(page);

    const wash = () =>
      page
        .locator(".bk-masthead")
        .evaluate((el) => getComputedStyle(el).backgroundImage);

    // Night over New York (solar hour ~04), daylight over London (~09).
    const out = await wash();
    expect(out).toContain("rgba(30, 36, 47");
    expect(out).toContain("rgba(147, 190, 212");
    // Near edge first, far edge last: the order is the route.
    expect(out.indexOf("rgba(30, 36, 47")).toBeLessThan(
      out.indexOf("rgba(147, 190, 212"),
    );

    await page.getByRole("button", { name: "Swap route" }).click();
    const back = await wash();
    expect(back.indexOf("rgba(147, 190, 212")).toBeLessThan(
      back.indexOf("rgba(30, 36, 47"),
    );
  });

  /**
   * And on the pass it reads the two ends of the flight rather than two
   * places at one moment: the light when the door shuts, and the light when
   * it opens again. The morning to London leaves in daylight and lands after
   * dark, and the strip between the two codes is that sentence.
   */
  test("the band on the pass is the flight, not the hour it was opened", async ({
    page,
  }) => {
        await openBench(page);
    await toSeatMap(page);
    await toBoardingPass(page);

    const stops = page.locator(".bk-skyrule stop");
    await expect(stops).toHaveCount(2);
    const [left, right] = await stops.evaluateAll((els) =>
      els.map((e) => e.getAttribute("stop-color")),
    );
    // 08:30 out of New York is daylight; 20:15 into London is not. The two
    // ends differ, which is the whole of what the strip is for.
    expect(left).toBe("#f4f0e7");
    expect(right).toBe("#5b6786");
  });
  /**
   * The day you fly grows a fourth place, and it holds one instruction.
   *
   * Before there is anything to do today there are three tabs. From check-in
   * there are four, the new one says whichever single thing is true now
   * rather than the whole timetable, and the pass is one tap from it — which
   * is the entire reason anybody opens a phone in a terminal.
   */
  test("the day you fly grows a tab, one page per place the day is spent", async ({ page }) => {
    await openBench(page);
    await expect(page.getByRole("button", { name: "Travel" })).toHaveCount(0);

    await toSeatMap(page);
    const seat = await toBoardingPass(page);
    await page.getByRole("button", { name: "Back" }).click();

    const today = page.getByRole("button", { name: "Travel" });
    await expect(today).toHaveCount(1);
    await today.click();

    // Four places a day of flying is spent, in the order it is spent in, and
    // exactly one of them is the one the day is on.
    await expect(page.getByRole("tab")).toHaveCount(4);
    await expect(page.getByRole("tab").nth(0)).toHaveText("Before you go");
    await expect(page.getByRole("tab").nth(1)).toHaveText("At the airport");
    await expect(page.getByRole("tab").nth(2)).toHaveText("JFK – LHR");
    await expect(page.getByRole("tab").nth(3)).toHaveText("Arrival");
    await expect(page.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);

    // The sofa page has nothing on it that does not exist from a sofa: no
    // gate, no queue, no bag tracker. Go and look at it: the day has already
    // moved on to the terminal by the time this runs.
    await page.getByRole("tab", { name: "Before you go" }).click();
    const before = page.locator(".bk-page").nth(0);
    // Three deadlines, none of them the departure: that is printed at
    // thirty-two pixels in the clocks directly above.
    await expect(before.locator(".bk-facts dt")).toContainText([
      "Bag drop",
      "Boarding",
      "Doors close",
    ]);
    // The tab bar's black capsule is measured off the selected tab, and the
    // tabs used to change width depending on which one was selected — so it
    // could be left the width of the one before, covering two of them.
    const capsule = await page.evaluate(() => {
      const ind = document.querySelector(".bk-tab-ind") as HTMLElement;
      const on = document.querySelector('.bk-tab[data-on="true"]') as HTMLElement;
      return [
        Math.round(ind.getBoundingClientRect().width),
        Math.round(on.getBoundingClientRect().width),
      ];
    });
    expect(capsule[0]).toBe(capsule[1]);

    // One row of keys at the foot of the glass, outside the swipe track: four
    // keys, four different places, and each one carries its name. Moving
    // between the parts of the day is the control at the top, not a key.
    // Three keys, three different doors. There were four, and three of them
    // opened the trip.
    await expect(page.locator(".bk-tools button")).toHaveCount(3);
    await expect(page.locator(".bk-tools button")).toContainText([
      "Seat",
      "Trip",
      /Pass|Check in/,
    ]);
    await expect(before).not.toContainText("Security");
    // Sentences with a mark beside each, not a label column and a value one.
    await expect(before.locator(".bk-notes li")).toHaveCount(3);

    // The terminal page is the building: the desk, the queue, the gate.
    await page.getByRole("tab", { name: "At the airport" }).click();

    // One groove with one thumb in it, and the thumb is driven off how far
    // the deck has been dragged rather than off a render — so it lands on the
    // name it stopped at, to the pixel, and the name it lands on is the one
    // the control says is selected. Four capsules turning their own
    // backgrounds on and off is what it was, and the one turning on traded an
    // inset shadow for an outset one, which cannot be interpolated: a white
    // flash on every switch.
    await expect
      .poll(() =>
        page.evaluate(() => {
          const thumb = document.querySelector(".bk-segbar-ind") as HTMLElement;
          const near = document.querySelector(
            '.bk-segbar-b[data-near="true"]',
          ) as HTMLElement;
          const sel = document.querySelector(
            '[role="tab"][aria-selected="true"]',
          ) as HTMLElement;
          if (!thumb || !near || !sel) return "missing";
          const a = thumb.getBoundingClientRect();
          const b = near.getBoundingClientRect();
          return [
            Math.round(a.x - b.x),
            Math.round(a.width - b.width),
            near.textContent,
            sel.textContent,
          ].join("|");
        }),
      )
      .toBe("0|0|At the airport|At the airport");

    const airport = page.locator(".bk-page").nth(1);
    await expect(airport.locator(".bk-facts div")).toHaveCount(3);
    await expect(airport.locator(".bk-facts dd").first()).toHaveText(/^[A-E]\d+$/);
    // The four things that happen in an order, drawn as the order, with
    // exactly one of them lit: the one you are up to.
    await expect(airport.locator(".bk-queue li")).toHaveCount(4);
    await expect(airport.locator(".bk-queue li")).toContainText([
      "Bag drop",
      "Security",
      /Gate/,
      "Doors close",
    ]);
    await expect(airport.locator('.bk-queue li[data-now="true"]')).toHaveCount(1);
    // The aeroplane, which is the other half of "what is happening at B3".
    // No chips: the type is in the label line, the seat and the group are in
    // the tiles, and the meal is on the page about the flight.
    await expect(airport.locator(".bk-chips")).toHaveCount(0);
    // The bags say where they are, not what is printed on the paper tag.
    await expect(airport.locator(".bk-bagstate b")).toHaveText(
      /Not dropped yet|With the airline|Loaded|At the belt/,
    );

    // The aeroplane's own page carries both ends of the flight, in the type
    // an airport uses for them, and nothing about the building behind you.
    await page.getByRole("tab", { name: "JFK – LHR" }).click();
    const flight = page.locator(".bk-page").nth(2);
    await expect(flight.locator(".bk-clocks")).toContainText("JFK");
    await expect(flight.locator(".bk-clocks")).toContainText("LHR");
    await expect(flight).not.toContainText("Security");

    // The far end is its own page: the clock there, the terminal, the belt.
    await page.getByRole("tab", { name: "Arrival" }).click();
    const arrival = page.locator(".bk-page").last();
    // The header says you have landed; this card says where the bags are.
    await expect(arrival.locator(".bk-hap")).toHaveText(
      /Lands \d\d:\d\d|Carousel \d/,
    );
    // Two notes, not three: the belt is the first tile, so a line saying
    // "at carousel 1" under a tile saying "Carousel 1" was the same fact
    // twice. The bag line comes back only when there is nothing to collect,
    // which is the one thing a carousel tile cannot say.
    await expect(arrival.locator(".bk-notes li")).toHaveCount(2);
    await expect(arrival.locator(".bk-notes li")).toContainText([
      /New York/,
      /Passport control/,
    ]);

    // The pass, from every part of the day, without going through the trip:
    // the last key in the row, and the only dark one.
    // The Seat key is the seat map, checked in or not — and a seat moved
    // after check-in is a pass re-issued for it, barcode and all. The map
    // said 23C and the pass said 21A before this.
    await page.getByRole("button", { name: "Seat", exact: true }).click();
    await expect(page.locator(".bk-deck-row").first()).toBeVisible();
    const was = (await page.locator(".bk-seatcard-no").textContent())!.trim();
    const other = page
      .locator('.bk-seat:not([data-taken="true"]):not([data-mine="true"])')
      .first();
    await other.click();
    const moved = (await page.locator(".bk-seatcard-no").textContent())!.trim();
    expect(moved).not.toBe(was);
    await page.getByRole("button", { name: "Save seats" }).click();
    await page.getByRole("button", { name: "Travel" }).click();
    await page.locator('.bk-tools button[data-key="true"]').click();
    await expect(page.locator(".bk-plate svg")).toBeVisible();
    // The printed seat, and the one in the barcode: the cabin the link opens
    // is the cabin the barcode names, so it is the seat-back that says which.
    await expect(page.locator(".bk-pass-facts dd").first()).toHaveText(moved);
    const reissued = await page
      .getByRole("link", { name: `Open seat ${moved}` })
      .getAttribute("href");
    await page.goto(reissued!, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".bench-glass");
    await expect(page.locator(".ife-idle-seat")).toHaveText(moved);
    // Back is a reload, so the app opens on Book and the trip comes off the
    // phone: a seat moved after check-in has to have been kept.
    await page.goBack({ waitUntil: "domcontentloaded" });
    await page.waitForSelector(GLASS);

    // And Trips is the booking: a panel per flight, saying where each one has
    // got to, with the day's deadlines left to the tab that is about them.
    await page.getByRole("button", { name: "Trips" }).click();
    await expect(page.locator(".bk-panel")).toHaveCount(2);
    await expect(page.locator(".bk-panel").first()).toContainText(moved);
    await expect(page.locator(".bk-panel-state").first()).toHaveText(
      /Checked in/,
    );
  });
  test("premium economy is a cabin of its own, not a fare", async ({ page }) => {
    await openBench(page);
    await oneWay(page);
    await page.getByRole("button", { name: "Search flights" }).click();

    // Four cabins, front to back, and each is dearer than the one behind it.
    await expect(page.locator(".bk-seg-b")).toHaveCount(4);
    const cheapest = async (cabin: string) => {
      await page.getByRole("button", { name: cabin, exact: true }).click();
      const t = (await page.locator(".bk-farebar-p").first().textContent())!;
      return Number(t.replace(/[^\d]/g, ""));
    };
    const y = await cheapest("Economy");
    const w = await cheapest("Premium");
    const j = await cheapest("Business");
    const f = await cheapest("First");
    expect(w).toBeGreaterThan(y);
    expect(j).toBeGreaterThan(w);
    expect(f).toBeGreaterThan(j);

    // It is not sold without a hold bag. Light is an economy product, and a
    // premium seat with no bag is not one anybody offers.
    await page.getByRole("button", { name: "Premium", exact: true }).click();
    await bookable(page).first().click();
    await expect(
      page.locator('.bk-flight-item[data-open="true"] .bk-fare-brand'),
    ).toHaveText(["Standard", "Flex"]);
    // Two hold bags where the same fare down the back has one.
    await expect(
      page.locator('.bk-flight-item[data-open="true"] .bk-fare').first(),
    ).toContainText("2 checked bags, 28 kg");

    await page
      .locator('.bk-flight-item[data-open="true"] .bk-fare')
      .filter({ has: page.locator(".bk-fare-brand", { hasText: "Standard" }) })
      .getByRole("button", { name: "Select" })
      .click();

    // Its own rows, one seat narrower across than economy: 2-4-2 where the
    // back of this aeroplane is 3-3-3, which is where the width comes from.
    await expect(page.locator(".bk-cols")).toContainText("ACDEFGHK");
    await expect(page.locator(".bk-cols")).not.toContainText("ABC");
    // And nothing more to pay for where you sit inside it.
    await expect(page.locator(".bk-legend")).toContainText("Premium Economy");
    await expect(page.locator(".bk-legend")).toContainText("included");
    const seat = (await page.locator(".bk-seatcard-no").textContent())!.trim();
    expect(Number(seat.replace(/\D/g, ""))).toBeGreaterThan(9);
    expect(Number(seat.replace(/\D/g, ""))).toBeLessThan(20);

    await page.getByRole("button", { name: "Review and pay" }).click();
    await page.getByPlaceholder("LARSSON").fill("LARSSON");
    await page.getByPlaceholder("MAJ").fill("MAJ");
    await page.getByPlaceholder("4242 4242 4242 4242").fill("4242424242424242");
    await page.getByPlaceholder("MM/YY").fill("1230");
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^Pay / }).click();
    await page.getByRole("button", { name: /^Check in · / }).click();
    await page.locator(".bk-field select").selectOption("United Kingdom");
    await page.getByPlaceholder("P4471902").fill("P4471902");
    await page.locator('input[type="date"]').first().fill("2031-08-30");
    await page.getByRole("button", { name: /not carrying any of these/ }).click();
    await page.getByRole("button", { name: /^Check in( for both flights)?$/ }).click();
    await expect(page.locator(".bk-plate svg")).toBeVisible();

    // The pass says so in words, and the barcode says so in the letter a gate
    // reader looks for: W is premium economy, the way J is business.
    await expect(page.locator(".bk-pass-cabin")).toHaveText("Premium Economy");
    const href = (await page
      .getByRole("link", { name: /^Open seat/ })
      .getAttribute("href"))!;
    const bcbp = decodeBcbp(
      new URL(href, "http://x").searchParams.get("bp")!,
    )!;
    expect(bcbp.cabinClass).toBe("premium");
    expect(bcbp.seat).toBe(seat);
    // Boarded after first and business, and before everybody behind it.
    await expect(
      page.locator(".bk-pass-facts div", { hasText: "Group" }).locator("dd"),
    ).toHaveText("3");
  });

  test("the Club Card and the miles both change the booking they touch", async ({ page }) => {
    await openBench(page);
    await oneWay(page);
    // A card is issued with the first booking, so book one plainly first.
    await toSeatMap(page);
    await toBoardingPass(page);
    await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("button", { name: "Club" }).click();
    const earned = Number(
      (await page.locator(".bk-member-miles").textContent())!.replace(/\D/g, ""),
    );

    // The club is a hub with four rooms; the card is one of them, and
    // holding it puts the programme's own card on file.
    await page.getByRole("button", { name: /^Club Card/ }).click();
    await expect(page.locator(".bk-clubcard")).toHaveAttribute("data-held", "false");
    await page.getByRole("button", { name: /^Hold the card/ }).click();
    await expect(page.locator(".bk-clubcard")).toHaveAttribute("data-held", "true");
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.locator(".bk-wallet")).toHaveAttribute("data-held", "true");
    await expect(page.locator(".bk-wallet")).toContainText("Held");
    await expect(page.locator(".bk-row", { hasText: "Club ending" })).toHaveCount(1);

    // On the fare list the card shows: a Light fare now has a hold bag, and
    // every group is one earlier than it was.
    await page.getByRole("button", { name: "Book" }).click();
    await page.getByRole("button", { name: "Search flights" }).click();
    await bookable(page).first().click();
    const light = page
      .locator('.bk-flight-item[data-open="true"] .bk-fare')
      .filter({ has: page.locator(".bk-fare-brand", { hasText: "Light" }) });
    await expect(light).toContainText("1 checked bag");
    await expect(light).toContainText("Boards group 6");

    // Paid with it, the same fare earns twice.
    await light.getByRole("button", { name: "Select" }).click();
    await page.getByRole("button", { name: "Review and pay" }).click();
    // The card is on file; the code is asked every time.
    await page.getByPlaceholder("000", { exact: true }).fill("123");
    await page.getByRole("button", { name: /^Pay / }).click();
    await page.waitForSelector(".bk-tripmast");
    await page.getByRole("button", { name: "Club" }).click();
    await page.getByRole("button", { name: /^Activity/ }).click();
    const rows = page.locator(".bk-hist-row");
    await expect(rows).toHaveCount(2);
    const plain = Number((await rows.nth(1).locator(".bk-hist-miles").textContent())!.replace(/\D/g, ""));
    const doubled = Number((await rows.nth(0).locator(".bk-hist-miles").textContent())!.replace(/\D/g, ""));
    expect(plain).toBe(earned);
    // Light earns half of Standard; paid with the card that is doubled back.
    // Each leg is rounded on its own, so the two can sit a mile apart.
    expect(Math.abs(doubled - earned)).toBeLessThanOrEqual(1);

    // Miles buy a bag on the trip in hand, and the check-in charges nothing
    // for it.
    await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("button", { name: /^Use miles/ }).click();
    const balance = Number((await page.locator(".bk-miles-balance").textContent())!.replace(/\D/g, ""));
    expect(balance).toBe(earned + doubled);
    await page.getByRole("button", { name: /^A checked bag/ }).click();
    await expect(page.locator(".bk-miles-balance")).toContainText(
      (balance - 2500).toLocaleString("en-US"),
    );
    await page.getByRole("button", { name: "Back" }).click();
    // The statement shows what was spent, as a row with a sign.
    await page.getByRole("button", { name: /^Activity/ }).click();
    await expect(page.locator('.bk-hist-row[data-spent="true"]')).toHaveCount(1);
    await expect(page.locator('.bk-hist-row[data-spent="true"]')).toContainText("−2,500");
    await page.getByRole("button", { name: "Back" }).click();
    await page.getByRole("button", { name: "Trips" }).click();
    await page.locator(".bk-panel").first().click();
    await page.getByRole("button", { name: /^Check in · / }).click();
    await expect(page.locator('.bk-seg-b[data-on="true"]', { hasText: "+1 bag" })).toHaveCount(1);
    await expect(page.locator(".bk-note", { hasText: "on miles" })).toContainText("nothing charged");
  });

});
