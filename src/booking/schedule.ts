import { AIRPORTS } from "../flight-state/airports";
import { greatCircleKm } from "../flight-state/geo";
import type { AircraftType, FlightOption, Itinerary, TripQuery } from "./types";
import type { CabinClass } from "../flight-state/types";
import { hasCabin } from "./cabin";
import { hash } from "./hash";

// A timetable that does not exist, built the way a real one is read: a handful
// of departures a day on a route, the same ones every time you look, priced by
// how far the aeroplane has to go.
//
// Everything here is derived rather than stored, and derived from a hash of
// the route and the date rather than from Math.random. That is not tidiness:
// a fare that changes while the passenger is looking at it is the one bug in a
// booking flow that destroys the whole illusion, and a seat map that reshuffles
// on re-render is the same bug wearing a different coat.

export const CARRIER = "STR";


/** A stable stream of 0..1 from a seed, so each derived value gets its own. */
function stream(seed: string) {
  let n = hash(seed);
  return () => {
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    return n / 0x100000000;
  };
}

export function routeKm(fromIata: string, toIata: string): number {
  const a = AIRPORTS[fromIata];
  const b = AIRPORTS[toIata];
  if (!a || !b) return 0;
  return greatCircleKm(a, b);
}

/** What flies the route, by the only thing that decides it: how far it is. */
export function aircraftFor(km: number): AircraftType {
  if (km < 3200) return "A320";
  if (km < 5000) return "A330";
  return "A350";
}

/**
 * Gate to gate, and it is not the same both ways.
 *
 * Anyone who has flown the Atlantic knows the return is the long one: the jet
 * stream runs west to east at these latitudes, so eastbound rides it and
 * westbound fights it. The first version of this returned one number for a
 * route and printed the same 7h 07m for JFK–LHR and LHR–JFK, which is the kind
 * of thing a passenger spots before they spot anything else on the screen.
 *
 * Modelled as an average ground speed pushed either side of 840 km/h by how
 * much of the track runs east or west, weighted by how much of it sits in the
 * band where the jet stream actually lives. Checked against the real thing:
 * JFK–LHR lands near 6h 45m against a scheduled 7h 00m, and LHR–JFK near
 * 7h 50m against 8h 00m. Transcontinental routes come out ten minutes or so
 * fast — one constant cannot fit every wind on earth, and what matters here is
 * that the two directions are no longer the same number.
 */
export function blockMinutes(
  km: number,
  fromIata?: string,
  toIata?: string,
): number {
  return Math.round((km / groundSpeed(fromIata, toIata)) * 60 + 40);
}

function groundSpeed(fromIata?: string, toIata?: string): number {
  const a = fromIata ? AIRPORTS[fromIata] : undefined;
  const b = toIata ? AIRPORTS[toIata] : undefined;
  if (!a || !b) return 860;
  // Shortest way round, so a Pacific crossing is not read as a trip the long
  // way through Europe.
  let dLon = b.lon - a.lon;
  if (dLon > 180) dLon -= 360;
  if (dLon < -180) dLon += 360;
  const eastward = Math.max(-1, Math.min(1, dLon / 70));
  // The jet stream is a mid-latitude thing; a flight up the tropics gets none
  // of it either way.
  const lat = (Math.abs(a.lat) + Math.abs(b.lat)) / 2;
  const inBand = Math.max(0, Math.min(1, (lat - 18) / 22));
  return 840 * (1 + 0.085 * eastward * inBand);
}

/**
 * Tax and carrier charges, by the country the flight leaves from.
 *
 * A flat percentage was the wrong shape. These are set by governments, not by
 * airlines, they are charged per departure rather than per mile, and the
 * differences between them are large and famous — Air Passenger Duty makes a
 * long-haul seat out of London dearer than the same seat out of Paris by
 * something like a hundred dollars, and that is exactly the sort of fact this
 * screen should be able to show rather than smooth away.
 *
 * Figures are 2024-ish, in dollars, and rounded: what matters is that they are
 * per departure, per country, and roughly the right size.
 */
const DEPARTURE_TAX: Record<string, { short: number; long: number }> = {
  // Air Passenger Duty plus the airport's own charges.
  GB: { short: 40, long: 135 },
  US: { short: 28, long: 92 },
  FR: { short: 32, long: 78 },
  JP: { short: 22, long: 62 },
  CN: { short: 20, long: 58 },
  SG: { short: 26, long: 70 },
  // The Luftverkehrsteuer is the second-heaviest in Europe after the UK's.
  DE: { short: 38, long: 88 },
  NL: { short: 34, long: 80 },
  ES: { short: 28, long: 70 },
  IT: { short: 30, long: 74 },
  CH: { short: 30, long: 72 },
  AT: { short: 26, long: 66 },
  DK: { short: 28, long: 68 },
  SE: { short: 30, long: 72 },
  IE: { short: 24, long: 62 },
  PT: { short: 26, long: 64 },
  GR: { short: 26, long: 62 },
  CA: { short: 30, long: 78 },
  AE: { short: 25, long: 65 },
  HK: { short: 22, long: 60 },
  KR: { short: 22, long: 60 },
};

export function taxesFor(
  fromIata: string,
  km: number,
  cabinClass: CabinClass,
): number {
  // The country comes off the airport, which is the one place it is written
  // down. It used to be a second table here, and two tables of the same fact
  // are one table and one thing to forget to update.
  const table = DEPARTURE_TAX[AIRPORTS[fromIata]?.cc ?? ""] ?? {
    short: 25,
    long: 70,
  };
  const base = km < 3200 ? table.short : table.long;
  // Every duty in the table charges the front of the aeroplane more, and most
  // of them put premium economy in the higher band with business rather than
  // with the back of the aeroplane — at a lower rate, because the rate follows
  // the fare.
  const band =
    cabinClass === "first"
      ? 2.6
      : cabinClass === "business"
        ? 2.1
        : cabinClass === "premium"
          ? 1.4
          : 1;
  return Math.round(base * band);
}

/**
 * What the fare does to itself as the day approaches.
 *
 * A seat bought three weeks out and a seat bought this morning are not the
 * same product and never cost the same, and pricing them alike was the last
 * thing on this screen that no traveller would believe. The curve is the
 * ordinary advance-purchase shape: flat a long way out, steepening inside a
 * fortnight, roughly double on the day.
 */
export function advanceFactor(departureUtc: string, now = Date.now()): number {
  const days = (Date.parse(departureUtc) - now) / 86400000;
  if (days >= 60) return 0.92;
  if (days >= 21) return 1;
  if (days >= 14) return 1.12;
  if (days >= 7) return 1.28;
  if (days >= 3) return 1.52;
  return 1.9;
}

/** The base fare before tax, before the cabin, before the day. */
function baseFare(km: number, jitter: number): number {
  return (40 + 0.79 * Math.pow(km, 0.72)) * (0.9 + jitter * 0.22);
}

/**
 * And what the front of the aeroplane costs, which is not a fixed multiple of
 * it. Short-haul business is a wider seat and a fast track; long-haul business
 * is a bed, and the gap widens with every hour it has to be a bed for.
 */
function businessMultiple(km: number): number {
  return Math.min(6.5, 2.6 + km / 4000);
}

/**
 * And premium economy, which is a seat rather than a bed.
 *
 * It widens with distance for the same reason business does — the thing being
 * sold is hours of room — but it tops out early, because past a point the
 * answer to "I want to sleep" is the cabin in front, not this one.
 */
function premiumMultiple(km: number): number {
  return Math.min(2.8, 1.5 + km / 7000);
}

/**
 * First, which is business with a door: a fixed step on top rather than its
 * own curve, because what it adds does not get bigger with the distance.
 */
function firstMultiple(km: number): number {
  return businessMultiple(km) * 1.75;
}

/**
 * The three fares every airline now sells under one cabin.
 *
 * This is the shape of a real booking page and the app had none of it: one
 * price, one set of rules, and a baggage line that was the same whatever you
 * paid. Light is the fare that has no hold bag — which is the single thing
 * passengers most often get wrong — and Flex is the one that can be moved.
 */
export type FareFamily = "light" | "standard" | "flex";

export const FARE_FAMILIES: Array<{
  id: FareFamily;
  name: string;
  multiple: number;
  checked: number;
  changes: string;
  refund: string;
  seatIncluded: boolean;
}> = [
  {
    id: "light",
    name: "Light",
    multiple: 0.82,
    checked: 0,
    changes: "No changes",
    refund: "Non-refundable",
    seatIncluded: false,
  },
  {
    id: "standard",
    name: "Standard",
    multiple: 1,
    checked: 1,
    changes: "Change for a fee",
    refund: "Non-refundable",
    seatIncluded: false,
  },
  {
    id: "flex",
    name: "Flex",
    multiple: 1.45,
    checked: 2,
    changes: "Free changes",
    refund: "Refundable",
    seatIncluded: true,
  },
];

/**
 * What the family does to the cabin's base fare.
 *
 * Down the back the spread is wide — Light is a seat and nothing else, Flex
 * is nearly half as much again. Up front the base already buys the bag and
 * the seat, so Flex is the same fare that can be moved and given back, and
 * that is worth a fifth, not a half. This is the Lufthansa and Air France
 * shape: Business Saver and Business Flex, twenty per cent apart.
 */
export function familyMultiple(
  cabinClass: CabinClass,
  family: FareFamily,
): number {
  if (cabinClass === "business" || cabinClass === "first")
    return family === "flex" ? 1.2 : 1;
  return fareFamily(family).multiple;
}

/** What one passenger pays for a flight, in the fare they chose. */
export function priceOf(
  option: { fares: Record<CabinClass, { base: number; tax: number }> },
  cabinClass: CabinClass,
  family: FareFamily,
): { fare: number; tax: number; total: number } {
  const f = option.fares[cabinClass];
  const step = cabinClass === "economy" ? 5 : 10;
  const fare =
    Math.round((f.base * familyMultiple(cabinClass, family)) / step) * step;
  return { fare, tax: f.tax, total: fare + f.tax };
}

/**
 * Business is sold as one fare, and it is the flexible one. Premium economy is
 * sold as two: Light is the fare with no hold bag, and a premium seat with no
 * hold bag is not a product anybody sells — the bag is most of why it is
 * bought.
 */
export function familyFor(
  cabinClass: CabinClass,
  chosen: FareFamily,
): FareFamily {
  const sold = familiesFor(cabinClass);
  return sold.includes(chosen) ? chosen : sold[0];
}

/**
 * The fares a cabin actually sells, cheapest first.
 *
 * Light is an economy product — a seat with no bag — and stops at the
 * premium curtain. Business is sold two ways, Saver and Flex, the way every
 * European flag carrier now sells it. First is one fare: there is nothing
 * left to take out of it to make a cheaper one.
 */
export function familiesFor(cabinClass: CabinClass): FareFamily[] {
  if (cabinClass === "first") return ["flex"];
  if (cabinClass === "business") return ["standard", "flex"];
  if (cabinClass === "premium") return ["standard", "flex"];
  return ["light", "standard", "flex"];
}

/**
 * The cabin and the fare together, as one name. "First First" is what the
 * two halves say when they are simply put side by side, because First is one
 * product and its fare has no name of its own.
 */
export function fareLabel(cabinClass: CabinClass, family: FareFamily): string {
  if (cabinClass === "first") return "First";
  return `${cabinName(cabinClass)} ${familyName(cabinClass, family)}`;
}

/** What a fare is called in front of the cabin it is sold in. */
export function familyName(cabinClass: CabinClass, family: FareFamily): string {
  if (cabinClass === "first") return "First";
  if (cabinClass === "business") return family === "flex" ? "Flex" : "Saver";
  return fareFamily(family).name;
}

/**
 * Whether choosing a seat is part of the fare. Up front it always is — a
 * business fare that charges for a seat is charging for the cabin twice — and
 * down the back it is what Flex buys, or what status has earned.
 */
export function seatIncludedFor(
  cabinClass: CabinClass,
  family: FareFamily,
): boolean {
  if (cabinClass === "business" || cabinClass === "first") return true;
  return fareFamily(family).seatIncluded;
}

/**
 * The hold bags the fare comes with.
 *
 * Premium economy carries one more than the same fare down the back, and a
 * heavier one. That is not a detail — it is most of what the cabin is bought
 * for on a long flight, and the number has to be the same number at the fare
 * list, at check-in and at the bag drop.
 */
export function checkedBagsFor(
  cabinClass: CabinClass,
  family: FareFamily,
  /** Holding the Club Card puts a bag on the one fare that has none. */
  cardBag = false,
): number {
  if (cabinClass === "first") return 3;
  if (cabinClass === "business") return 2;
  return (
    fareFamily(family).checked +
    (cabinClass === "premium" ? 1 : 0) +
    (cardBag && family === "light" ? 1 : 0)
  );
}

/** What the cabin is called, wherever it is named. */
export function cabinName(cabinClass: CabinClass): string {
  return cabinClass === "first"
    ? "First"
    : cabinClass === "business"
      ? "Business"
      : cabinClass === "premium"
        ? "Premium Economy"
        : "Economy";
}

/** The heaviest hold bag the cabin allows, in kilograms. */
export function bagWeightFor(cabinClass: CabinClass): string {
  return cabinClass === "business" || cabinClass === "first"
    ? "32"
    : cabinClass === "premium"
      ? "28"
      : "23";
}

/** What comes into the cabin with you. */
export function cabinBagFor(cabinClass: CabinClass): string {
  return cabinClass === "business" || cabinClass === "first"
    ? "2 cabin bags"
    : cabinClass === "premium"
      ? "1 cabin bag, 10 kg"
      : "1 cabin bag, 7 kg";
}

/**
 * What it costs to move a booking, and what comes back if it is dropped.
 *
 * The rules were printed on the fare list from the first version and could
 * never be acted on — Flex sold "free changes" with nothing to change and
 * "refundable" with nothing to refund, which is the one place this whole app
 * was making a promise it had no way to keep.
 *
 * The refund rule is the real one and it surprises people: a non-refundable
 * fare still gives the taxes back. They are a government's money collected on
 * a departure that will not now happen, so the airline cannot keep them.
 */
export const CHANGE_FEE: Record<FareFamily, number | null> = {
  light: null,
  standard: 120,
  flex: 0,
};

/** What it costs to move this fare, in this cabin. */
export function changeFeeFor(
  cabinClass: CabinClass,
  family: FareFamily,
): number | null {
  if (cabinClass === "first") return 0;
  return CHANGE_FEE[familyFor(cabinClass, family)];
}

export function refundOn(
  family: FareFamily,
  fares: number,
  taxes: number,
): { fare: number; tax: number; total: number } {
  const fare = fareFamily(family).refund.startsWith("Refundable") ? fares : 0;
  return { fare, tax: taxes, total: fare + taxes };
}

export function fareFamily(id: FareFamily) {
  return FARE_FAMILIES.find((f) => f.id === id) ?? FARE_FAMILIES[1];
}

/**
 * The group called at the door.
 *
 * An aeroplane does not board by seat row, it boards by what you bought and
 * what you are — which is why the group is knowable at the moment a fare is
 * chosen and can be printed next to its price. This used to be computed from
 * the seat row at check-in, which meant the number on the pass answered a
 * different question from the one a passenger was asking on the fare screen.
 * Status moves you up the queue; nobody in economy is ever called first.
 */
export function boardingGroup(
  cabinClass: CabinClass,
  family: FareFamily,
  tierBump = 0,
): number {
  if (cabinClass === "first") return 1;
  if (cabinClass === "business") return 2;
  if (cabinClass === "premium") return 3;
  const base = family === "flex" ? 4 : family === "standard" ? 5 : 7;
  return Math.max(4, base - tierBump);
}

/** What the fare comes with, in the words a passenger reads at a bag drop. */
export function baggageFor(
  cabinClass: CabinClass,
  family: FareFamily = "standard",
  cardBag = false,
): string {
  const checked = checkedBagsFor(cabinClass, family, cardBag);
  const cabin = cabinBagFor(cabinClass);
  if (checked === 0) return `${cabin} · no checked bag`;
  const each = `${bagWeightFor(cabinClass)} kg`;
  return `${cabin} · ${checked} checked bag${checked > 1 ? "s" : ""}, ${each}${checked > 1 ? " each" : ""}`;
}

/** A bag beyond what the fare includes, bought at check-in rather than at the
 *  airport, which is where it is cheapest and where every airline puts it. */
export const EXTRA_BAG = 100;

/**
 * Carbon, per passenger, for the flight.
 *
 * Every European airline prints this next to the fare now and this one did
 * not. It is not a gesture: about 90 grams per passenger-kilometre in economy
 * on a modern wide-body, a little more on the single aisle because a short
 * flight spends more of itself climbing, and roughly three times as much in
 * business because the seat takes three times the floor.
 */
export function carbonKg(
  km: number,
  aircraft: AircraftType,
  cabinClass: CabinClass,
): number {
  const perKm = aircraft === "A320" ? 0.105 : 0.088;
  const floor =
    cabinClass === "first"
      ? 4
      : cabinClass === "business"
        ? 2.9
        : cabinClass === "premium"
          ? 1.6
          : 1;
  return Math.round(km * perKm * floor);
}

/**
 * How often this flight has arrived on time. Derived from the flight number,
 * so the figure a passenger sees while choosing is the same one every time
 * they look — which is the only thing that makes it worth printing.
 */
export function onTimeRate(flightNo: string): number {
  return 68 + ((hash(flightNo) >>> 7) % 29);
}

/** What is on board. A short single-aisle hop does not serve a meal. */
export function amenities(aircraft: AircraftType): string[] {
  return aircraft === "A320"
    ? ["Wi-Fi", "Power", "Snack"]
    : ["Wi-Fi", "Power", "Meal", "Seat-back screen"];
}

export type Disruption =
  | { status: "onTime" }
  | { status: "delayed"; minutes: number; reason: string }
  | { status: "cancelled"; reason: string };

const REASONS = [
  "late inbound aircraft",
  "air traffic flow control",
  "weather at the departure airport",
  "a crew connection",
  "a technical check",
];

/**
 * Whether the aeroplane is going to be late, and why.
 *
 * The rule that makes this honest rather than decorative is the window: a
 * flight next Tuesday is on time, because nobody knows yet. Disruption only
 * exists inside the last few hours, which is exactly when a passenger starts
 * looking at their phone every ten minutes — and it is the reason a Live
 * Activity exists at all. An app whose island only ever counts down is an
 * island that has never had anything to say.
 */
export function disruptionFor(
  flightNo: string,
  departureUtc: string,
  now = Date.now(),
): Disruption {
  const ahead = (Date.parse(departureUtc) - now) / 3600000;
  if (ahead > 6) return { status: "onTime" };
  const h = hash(`${flightNo}|${departureUtc.slice(0, 13)}`) >>> 0;
  const roll = (h % 1000) / 1000;
  const reason = REASONS[(h >>> 11) % REASONS.length];
  if (roll < 0.04) return { status: "cancelled", reason };
  if (roll < 0.3) {
    // Fifteen minutes to three hours, in five-minute steps, because that is
    // how a departure board counts.
    const minutes = 15 + ((h >>> 5) % 34) * 5;
    return { status: "delayed", minutes, reason };
  }
  return { status: "onTime" };
}

/** The gate an airline moves you to, once it has one to move you to. */
export function gateChangeFor(
  flightNo: string,
  departureUtc: string,
  gate: string,
  now = Date.now(),
): string | null {
  const ahead = (Date.parse(departureUtc) - now) / 3600000;
  if (ahead > 3) return null;
  const h = hash(`gate|${flightNo}|${departureUtc.slice(0, 13)}`) >>> 0;
  if (h % 100 >= 18) return null;
  const next = `${"ABCDE"[(h >>> 3) % 5]}${((h >>> 9) % 30) + 1}`;
  return next === gate ? null : next;
}

/** Check-in opens a day before the aeroplane leaves, and closes at the gate. */
export function checkInOpensUtc(departureUtc: string): string {
  return new Date(
    new Date(departureUtc).getTime() - 24 * 60 * 60000,
  ).toISOString();
}

export function checkInIsOpen(departureUtc: string, now = Date.now()): boolean {
  return (
    now >= new Date(checkInOpensUtc(departureUtc)).getTime() &&
    // And closed again once the aeroplane has gone. Without this the window
    // is open forever: "Check-in is open" sat on a trip whose flight left an
    // hour ago, because the only test was that the day had begun.
    now < Date.parse(departureUtc)
  );
}

/**
 * What is served, worked out the way a cabin crew's own plan is: from the
 * clock at the airport you leave from and how long the aeroplane is up.
 *
 * Nothing is invented here. A ninety-minute hop gets a drink and something in
 * a wrapper; a flight that crosses a mealtime serves that meal; a flight long
 * enough to cross two serves two, and an overnight serves dinner after take-off
 * and breakfast before landing, which is why the red-eye is the one everybody
 * recognises.
 */
export function serviceFor(
  departureUtc: string,
  fromIata: string,
  toIata: string,
  minutes: number,
): string {
  const at = (iso: string, iata: string) =>
    Number(
      new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        hour12: false,
        timeZone: AIRPORTS[iata]?.tz ?? "UTC",
      }).format(new Date(iso)),
    );
  const meal = (h: number): string | null =>
    h >= 5 && h < 10
      ? "breakfast"
      : h >= 11 && h < 15
        ? "lunch"
        : h >= 18 && h < 22
          ? "dinner"
          : null;

  const out = at(departureUtc, fromIata);
  if (minutes < 150) {
    return meal(out) === "breakfast" ? "Breakfast, served cold" : "A drink and a snack";
  }

  // Two services on anything long: one once the aeroplane is up, read off the
  // clock you left by, and one before it lands, read off the clock you are
  // landing into. That second clock is the whole of why the overnight to
  // Europe serves dinner and then breakfast six hours later.
  const landUtc = new Date(Date.parse(departureUtc) + minutes * 60000).toISOString();
  const first = meal(out + 1) ?? "a light meal";
  const last = minutes >= 240 ? (meal(at(landUtc, toIata) - 1) ?? null) : null;

  const said = last && last !== first ? [first, last] : [first];
  const head = said[0][0].toUpperCase() + said[0].slice(1);
  return said.length === 1 ? head : `${head} and ${said[1]}`;
}

/**
 * When the two doors shut.
 *
 * A bag has to be with the airline an hour before a long-haul departure and
 * the gate closes twenty minutes before it — the two deadlines that actually
 * catch people out, and neither was anywhere on this surface.
 */
export function bagDropClosesUtc(departureUtc: string, long: boolean): string {
  return new Date(Date.parse(departureUtc) - (long ? 60 : 45) * 60000).toISOString();
}

export function gateClosesUtc(departureUtc: string): string {
  return new Date(Date.parse(departureUtc) - 20 * 60000).toISOString();
}

/**
 * The airport, as this airline's world has decided it is.
 *
 * Gate, terminal and carousel are already hashed off the flight and the day,
 * and these three are the same kind of fact: how far the gate is, how long
 * the queue at security is, and which bank of desks the airline is checking
 * in at. They are what somebody standing in a concourse actually wants, they
 * are stable for a given flight, and they are invented in exactly the way the
 * gate number is — this is a fictional airline, and the alternative is a
 * screen that says nothing about the building you are standing in.
 *
 * The security queue moves with the hour: the two peaks a real terminal has
 * are the first bank of departures and the early evening.
 */
export function airportFacts(
  flightNo: string,
  departureUtc: string,
  fromIata: string,
): { walkMin: number; securityMin: number; desks: string; terminal: number } {
  const h = hash(`${flightNo}|${departureUtc}|${fromIata}`);
  const local = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      hour12: false,
      timeZone: AIRPORTS[fromIata]?.tz ?? "UTC",
    }).format(new Date(departureUtc)),
  );
  const peak = (local >= 6 && local < 10) || (local >= 17 && local < 20);
  const first = (h >>> 11) % 40;
  return {
    walkMin: 6 + ((h >>> 13) % 16),
    securityMin: (peak ? 14 : 5) + ((h >>> 17) % 9),
    desks: `${"ABCDE"[(h >>> 19) % 5]} · ${first + 20}–${first + 34}`,
    terminal: ((h >>> 5) % 4) + 1,
  };
}

/**
 * Which group is at the door.
 *
 * An aeroplane boards in order and about four minutes apart, which is why
 * "Boarding now" on its own is the one thing a gate screen never says — what
 * anybody standing there wants to know is whether it is their turn yet.
 */
export function callingGroup(boardsAt: number, now: number): number {
  return Math.max(1, Math.min(9, 1 + Math.floor((now - boardsAt) / (4 * 60000))));
}

/**
 * And when it opens.
 *
 * Forty minutes, which is where the boarding time on the pass has always come
 * from — it was written into the pass as it was issued and nowhere else, so
 * the trip screen had no way to say when boarding was without knowing how a
 * pass is built. It is a fact about a departure, so it lives here.
 */
export function boardsUtc(departureUtc: string): string {
  return new Date(Date.parse(departureUtc) - 40 * 60000).toISOString();
}

/** Local midnight at an airport, as a UTC instant. */
function localMidnightUtc(date: string, tz: string): number {
  const [y, m, d] = date.split("-").map(Number);
  // Guess noon UTC on the day, read what o'clock that is at the airport, and
  // step back by the difference. Two passes is enough for every real zone,
  // including the half-hour and three-quarter-hour ones.
  let guess = Date.UTC(y, m - 1, d, 12, 0, 0);
  for (let i = 0; i < 2; i++) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).formatToParts(new Date(guess));
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const asUtc = Date.UTC(
      get("year"),
      get("month") - 1,
      get("day"),
      get("hour") % 24,
      get("minute"),
    );
    guess -= asUtc - Date.UTC(y, m - 1, d, 0, 0);
  }
  return guess;
}

/**
 * The two airports STRATUM is built around. Everything it flies touches one of
 * them, which is what makes it an airline with a network rather than a table
 * of every pair of cities in the file.
 */
export const HUBS = ["JFK", "LHR"];

export function isNonstop(fromIata: string, toIata: string): boolean {
  return HUBS.includes(fromIata) || HUBS.includes(toIata);
}

/**
 * How far out of the way a connection may take you.
 *
 * Without this the network cheerfully sold Shanghai to Los Angeles through New
 * York: twenty-two hours and half again the distance, for a journey that is
 * ten thousand kilometres in a straight line. No airline sells that, and the
 * honest answer for a pair its hubs cannot reach is that it does not fly
 * there — which is also what makes the empty state on the flight list mean
 * something.
 */
const MAX_DETOUR = 1.45;

/** The hub a city pair would change at, or none if every hub is a detour. */
export function hubFor(fromIata: string, toIata: string): string | null {
  const direct = routeKm(fromIata, toIata);
  const viable = HUBS.filter((h) => h !== fromIata && h !== toIata).filter(
    (h) => routeKm(fromIata, h) + routeKm(h, toIata) <= direct * MAX_DETOUR,
  );
  if (!viable.length) return null;
  return viable.sort(
    (a, b) =>
      routeKm(fromIata, a) +
      routeKm(a, toIata) -
      (routeKm(fromIata, b) + routeKm(b, toIata)),
  )[0];
}

/**
 * Check-in closes about this long before a departure, so an aeroplane leaving
 * sooner than this is not for sale any more.
 */
export const SELL_CUTOFF_MIN = 45;

/** An hour is the least an airline will sell as a connection across a border. */
const MIN_CONNECT_MIN = 60;
const MAX_CONNECT_MIN = 330;

/**
 * Every way of making the journey on the day: the nonstops if there are any,
 * and otherwise the pairs of flights that meet at a hub with enough time
 * between them to walk it and not so much that nobody would buy it.
 */
/**
 * The first day from `from` on which this route has anything left to sell.
 * A booking form that opens on a day whose flights have all gone opens on an
 * empty list, which is the app apologising for its own default.
 */
export function nextBookableDate(
  fromIata: string,
  toIata: string,
  from = new Date(),
): string {
  for (let i = 0; i < 4; i++) {
    const date = new Date(from.getTime() + i * 86400000)
      .toISOString()
      .slice(0, 10);
    if (
      searchItineraries({ fromIata, toIata, date, returnDate: null, pax: 1 })
        .length
    )
      return date;
  }
  return from.toISOString().slice(0, 10);
}

export function searchItineraries(q: TripQuery): Itinerary[] {
  const direct = searchFlights(q).map((f): Itinerary => ({
    segments: [f],
    layoverMin: [],
    totalMin: f.blockMin,
  }));
  if (direct.length) return direct;

  const hub = hubFor(q.fromIata, q.toIata);
  if (!hub) return [];
  const first = searchFlights({ ...q, toIata: hub });
  // The second half can leave the next day, which is what a late arrival into
  // a hub means and what an overnight connection is.
  const second = [
    ...searchFlights({ ...q, fromIata: hub }),
    ...searchFlights({
      ...q,
      fromIata: hub,
      date: new Date(new Date(`${q.date}T12:00:00Z`).getTime() + 86400000)
        .toISOString()
        .slice(0, 10),
    }),
  ];

  const out: Itinerary[] = [];
  for (const a of first) {
    for (const b of second) {
      const wait = Math.round(
        (Date.parse(b.departureUtc) - Date.parse(a.arrivalUtc)) / 60000,
      );
      if (wait < MIN_CONNECT_MIN || wait > MAX_CONNECT_MIN) continue;
      out.push({
        segments: [a, b],
        layoverMin: [wait],
        totalMin: a.blockMin + wait + b.blockMin,
      });
    }
  }
  // The quickest three. A list of every legal pairing is a timetable, not a
  // choice.
  return out.sort((x, y) => x.totalMin - y.totalMin).slice(0, 3);
}

/**
 * What an itinerary costs one passenger.
 *
 * Two flights sold as one journey are cheaper than two flights sold
 * separately — an airline would rather fill the second aeroplane than lose the
 * first — and the taxes are not simply added either: the country you start in
 * charges in full and the one you change in charges a transfer rate, which is
 * the whole reason connecting through somewhere can be cheaper than flying
 * from it.
 */
export function priceItinerary(
  it: Itinerary,
  cabinClass: CabinClass,
  family: FareFamily,
): { fare: number; tax: number; total: number } {
  if (it.segments.length === 1)
    return priceOf(it.segments[0], cabinClass, family);
  const fare =
    Math.round(
      (it.segments.reduce(
        (n, seg) => n + priceOf(seg, cabinClass, family).fare,
        0,
      ) *
        0.82) /
        5,
    ) * 5;
  const [a, b] = it.segments;
  const tax =
    taxesFor(a.from.iata, routeKm(a.from.iata, b.to.iata), cabinClass) +
    Math.round(
      taxesFor(b.from.iata, routeKm(b.from.iata, b.to.iata), cabinClass) * 0.35,
    );
  return { fare, tax, total: fare + tax };
}

/**
 * The nonstops STRATUM operates on the day. Everything it flies touches a hub;
 * asking for a pair that does not is asking for a route it has never flown,
 * and the honest answer is none rather than an invented aeroplane.
 * `searchItineraries` is the function that then goes and finds the way round.
 */
export function searchFlights(q: TripQuery): FlightOption[] {
  const from = AIRPORTS[q.fromIata];
  const to = AIRPORTS[q.toIata];
  if (!from || !to || from.iata === to.iata) return [];
  if (!isNonstop(from.iata, to.iata)) return [];

  const km = routeKm(q.fromIata, q.toIata);
  const block = blockMinutes(km, q.fromIata, q.toIata);
  const aircraft = aircraftFor(km);
  const rnd = stream(`${q.fromIata}${q.toIata}${q.date}`);

  // Short routes get a shuttle; long ones get two or three departures, which is
  // what a single carrier actually flies.
  const count = km < 3200 ? 5 : km < 9000 ? 3 : 2;
  const midnight = localMidnightUtc(q.date, from.tz);

  // Nothing that has already gone, and nothing leaving so soon that check-in
  // has closed. A list that offers this morning's departure at nine at night
  // is a list that has never been looked at after lunch — and it is where
  // "Boarding now" on a flight that left fourteen hours ago comes from.
  const sellableAfter = Date.now() + SELL_CUTOFF_MIN * 60000;

  const out: FlightOption[] = [];
  for (let i = 0; i < count; i++) {
    const slot = rnd();
    // Spread the day between 06:30 and 22:00 local, in five-minute steps.
    const minuteOfDay =
      Math.round((390 + ((930 * i) / count + slot * 120)) / 5) * 5;
    const departureUtc = new Date(midnight + minuteOfDay * 60000);
    const arrivalUtc = new Date(departureUtc.getTime() + block * 60000);
    const seq = 100 + Math.floor(rnd() * 800);
    // The random stream is consumed either way, so a flight dropping off the
    // front of the day does not reshuffle the ones behind it.
    const sellable = departureUtc.getTime() >= sellableAfter;

    const advance = advanceFactor(departureUtc.toISOString());
    const raw = baseFare(km, rnd()) * advance;
    const yBase = Math.round(raw / 5) * 5;
    const wBase = Math.round((raw * premiumMultiple(km)) / 10) * 10;
    const jBase = Math.round((raw * businessMultiple(km)) / 10) * 10;
    const fBase = Math.round((raw * firstMultiple(km)) / 10) * 10;
    const yTax = taxesFor(q.fromIata, km, "economy");
    const wTax = taxesFor(q.fromIata, km, "premium");
    const jTax = taxesFor(q.fromIata, km, "business");
    const fTax = taxesFor(q.fromIata, km, "first");
    // Not every aircraft has a nose to sell. A first fare with no seats is
    // how the list says so, rather than by hiding the flight.
    const nose = hasCabin(aircraft, "first");

    if (!sellable) {
      // One draw per cabin, so a flight dropping off the front of the day does
      // not reshuffle the seat counts of the ones behind it.
      rnd();
      rnd();
      rnd();
      rnd();
      continue;
    }
    out.push({
      flightNo: `${CARRIER} ${String(seq).padStart(3, "0")}`,
      carrier: CARRIER,
      from,
      to,
      departureUtc: departureUtc.toISOString(),
      arrivalUtc: arrivalUtc.toISOString(),
      blockMin: block,
      aircraft,
      fares: {
        economy: {
          base: yBase,
          tax: yTax,
          price: yBase + yTax,
          currency: "USD",
          seatsLeft: 3 + Math.floor(rnd() * 40),
        },
        premium: {
          base: wBase,
          tax: wTax,
          price: wBase + wTax,
          currency: "USD",
          seatsLeft: 2 + Math.floor(rnd() * 16),
        },
        business: {
          base: jBase,
          tax: jTax,
          price: jBase + jTax,
          currency: "USD",
          seatsLeft: 1 + Math.floor(rnd() * 8),
        },
        first: {
          base: fBase,
          tax: fTax,
          price: fBase + fTax,
          currency: "USD",
          seatsLeft: nose ? 1 + Math.floor(rnd() * 4) : (rnd(), 0),
        },
      },
    });
  }
  return out.sort((a, b) => a.departureUtc.localeCompare(b.departureUtc));
}
