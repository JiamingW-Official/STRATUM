import { hash } from "./hash";
import type { CabinClass } from "../flight-state/types";
import type { FareFamily } from "./schedule";

// The card, and what it is worth.
//
// This is not a sign-in and there is no password anywhere in it: a membership
// here is a number this browser gives itself the first time somebody books,
// which is the honest version of a loyalty account on a surface that has no
// server behind it. What is real is everything the number does — the tiers
// are the ordinary four, the thresholds are the ordinary thresholds, and each
// one buys the things airlines actually give away at that level.

export type Tier = "Blue" | "Silver" | "Gold" | "Platinum";

export type Member = {
  number: string;
  /** Miles flown in the qualifying year. Tier follows from it. */
  miles: number;
  /** ISO day the card was issued — the first booking. */
  since?: string;
  /** Holds the Club Card, the programme's own payment card. */
  cardHolder?: boolean;
  /** Miles spent. Status is earned on what was flown and does not fall when
   *  miles are used, so the balance is miles less this, not miles itself. */
  redeemed?: number;
};

/** What can be spent. */
export function balanceOf(m: Member | null): number {
  return m ? Math.max(0, m.miles - (m.redeemed ?? 0)) : 0;
}

/**
 * The Club Card.
 *
 * Every programme has one and it is where most status is actually earned:
 * United's Explorer card, Delta's Amex, American's Citi card. This one is
 * issued by nobody and charges nothing — it is a demonstration of the shape —
 * but everything it promises is wired to the booking it is used on: the
 * miles double, a Light fare gets its bag, and the group called at the door
 * is one earlier. A perk that does not change anything is a brochure.
 */
export const CLUB_CARD = {
  name: "STRATUM Club Card",
  /** Miles per dollar on STRATUM fares, paid with the card. */
  onStratum: 2,
  /** Everywhere else — printed, because every card prints it, and unwired,
   *  because there is no everywhere else here. */
  elsewhere: 1,
  perks: [
    "2× miles on STRATUM fares",
    "A checked bag on Light fares",
    "Boards one group earlier",
  ],
};

/** The card's number: the programme's own prefix and the member's digits. */
export function clubCardNumber(memberNumber: string): string {
  const d = memberNumber.replace(/\D/g, "").padStart(12, "0").slice(-12);
  return `5299${d}`;
}

/** Boards one group earlier for holding the card. */
export function cardBumpFor(m: Member | null): number {
  return m?.cardHolder ? 1 : 0;
}

/**
 * What miles buy.
 *
 * Not a catalogue of toasters: the two things on this app that otherwise
 * cost money, on the trip in hand. Prices are the ordinary shape — a bag is
 * about what a bag costs at the airline's own earn rate, a seat a little
 * more than the dearest seat fee.
 */
export const REDEMPTIONS: Array<{
  id: "bag" | "seats";
  name: string;
  miles: number;
  does: string;
}> = [
  { id: "bag", name: "A checked bag", miles: 2_500, does: "On this trip's check-in, no charge" },
  { id: "seats", name: "Seat choice included", miles: 4_000, does: "Any seat on this trip, no fee" },
];

/**
 * How long a card lasts.
 *
 * Status is earned in a calendar year and then kept for the whole of the next
 * one, plus the month it takes the airline to work out who earned what: the
 * United and American convention, "through 31 January". Miles themselves do
 * not expire — Delta and United dropped expiry years ago, and a balance that
 * evaporates is the one thing that makes a loyalty scheme feel like a trap.
 */
export function statusThrough(now = Date.now()): string {
  return `${new Date(now).getUTCFullYear() + 2}-01-31`;
}

/** The four cards in order, with what each costs on either count. */
export const LADDER: Array<{ tier: Tier; miles: number; flights: number }> = [
  { tier: "Blue", miles: 0, flights: 0 },
  { tier: "Silver", miles: 25_000, flights: 25 },
  { tier: "Gold", miles: 60_000, flights: 60 },
  { tier: "Platinum", miles: 120_000, flights: 100 },
];

/** How far up the ladder a card is: the tier's index, plus the fraction of
 *  the way to the next on whichever count is further along. */
export function ladderPosition(miles: number, segments: number): number {
  const tier = tierOfBoth(miles, segments);
  const i = LADDER.findIndex((l) => l.tier === tier);
  const next = LADDER[i + 1];
  if (!next) return i;
  const here = LADDER[i];
  const byMiles = (miles - here.miles) / (next.miles - here.miles);
  const bySegs = (segments - here.flights) / (next.flights - here.flights);
  return i + Math.max(0, Math.min(0.98, Math.max(byMiles, bySegs)));
}

/** The multiplier a flight earned at, as it is printed on a statement. */
export function earnRate(cabinClass: CabinClass, family: FareFamily): string {
  const cabin =
    cabinClass === "first"
      ? 3
      : cabinClass === "business"
        ? 2
        : cabinClass === "premium"
          ? 1.5
          : 1;
  const fare = family === "flex" ? 1.25 : family === "light" ? 0.5 : 1;
  const rate = cabin * fare;
  return `×${Number.isInteger(rate) ? rate : rate.toFixed(2).replace(/0+$/, "")}`;
}

const THRESHOLDS: Array<[Tier, number]> = [
  ["Platinum", 120_000],
  ["Gold", 60_000],
  ["Silver", 25_000],
  ["Blue", 0],
];

/**
 * The other way to a card: flights, not distance.
 *
 * Every real programme has two doors — United counts Premier Qualifying Points
 * and Premier Qualifying Flights, American counts Loyalty Points and segments,
 * Delta counts dollars and segments — because a person who flies London to
 * Paris forty times a year is worth more than the distance says, and a card
 * that only counts miles tells them they are worth nothing. The thresholds are
 * the ordinary ones: roughly a flight a fortnight for the first card.
 */
const SEGMENTS: Array<[Tier, number]> = [
  ["Platinum", 100],
  ["Gold", 60],
  ["Silver", 25],
  ["Blue", 0],
];

export function segmentsFor(tier: Tier): number {
  return SEGMENTS.find(([t]) => t === tier)![1];
}

/** The card, on whichever of the two counts got there first. */
export function tierOfBoth(miles: number, segments: number): Tier {
  const byMiles = THRESHOLDS.find(([, at]) => miles >= at)![0];
  const bySegs = SEGMENTS.find(([, at]) => segments >= at)![0];
  return THRESHOLDS.findIndex(([t]) => t === byMiles) <
    SEGMENTS.findIndex(([t]) => t === bySegs)
    ? byMiles
    : bySegs;
}

/** Where a tier starts, for a screen that draws the scale rather than a bar. */
export function tierStarts(tier: Tier): number {
  return THRESHOLDS.find(([t]) => t === tier)![1];
}

export function tierOf(miles: number): Tier {
  return THRESHOLDS.find(([, at]) => miles >= at)![0];
}

/** What the next card costs, and null at the top. */
export function toNextTier(miles: number): { tier: Tier; miles: number } | null {
  const above = [...THRESHOLDS].reverse().find(([, at]) => at > miles);
  return above ? { tier: above[0], miles: above[1] - miles } : null;
}

/** Everything a card gets you, in the order it gets noticed. */
/**
 * What each card gives, as a table rather than four hand-written lists.
 *
 * Written down the rows it is a benefit and across the columns it is a card,
 * which is the only shape that answers the question anybody actually has:
 * what do I get if I climb one more rung. `true` is a plain yes; a string is
 * a yes with a figure on it. Earning miles is left out on purpose — every
 * card does it, so in a comparison it says nothing.
 */
export const PERKS: Array<{ name: string; of: Record<Tier, string | boolean> }> =
  [
    {
      name: "Seat choice",
      of: { Blue: false, Silver: true, Gold: true, Platinum: true },
    },
    {
      name: "Extra bags",
      of: { Blue: false, Silver: "+1", Gold: "+2", Platinum: "+3" },
    },
    {
      name: "Boards earlier",
      of: { Blue: false, Silver: "1 group", Gold: "2 groups", Platinum: "3 groups" },
    },
    {
      name: "Lounge",
      of: { Blue: false, Silver: false, Gold: true, Platinum: true },
    },
  ];

/** Gold and above stop paying for a seat, which is the benefit people notice. */
export function seatsIncludedFor(tier: Tier): boolean {
  return tier === "Gold" || tier === "Platinum";
}

/** And they board before the aeroplane fills from the back. */
export function zoneBumpFor(tier: Tier): number {
  return tier === "Platinum" ? 3 : tier === "Gold" ? 2 : tier === "Silver" ? 1 : 0;
}

/**
 * Miles earned. Distance is the base, the cabin multiplies it, and the fare
 * family multiplies it again — a Light seat earns less than a Flex seat on the
 * same aeroplane, which is the whole mechanism by which an airline sells the
 * dearer fare.
 */
/** What a cabin multiplies the distance by. One table, read by the formula
 *  and printed on the Earn page, so the page cannot drift from the maths. */
export const CABIN_EARN: Record<CabinClass, number> = {
  economy: 1,
  premium: 1.5,
  business: 2,
  first: 3,
};

/** What the fare multiplies it by again. */
export const FARE_EARN: Record<FareFamily, number> = {
  light: 0.5,
  standard: 1,
  flex: 1.25,
};

/** The partners a programme lists beside flying. Named for the shape of the
 *  thing; none of them is linked to anything here, and the page says so. */
export const PARTNERS: Array<{ name: string; rate: string; does: string }> = [
  { name: "Stays", rate: "2 mi / $", does: "Hotels booked through the club" },
  { name: "Cars", rate: "1 mi / $", does: "Hire cars booked through the club" },
  { name: "Shopping", rate: "1–3 mi / $", does: "Shops reached through the club" },
  { name: "Dining", rate: "1 mi / $", does: "Restaurants, with a card linked" },
];

export function milesFor(
  km: number,
  cabinClass: CabinClass,
  family: FareFamily,
): number {
  return Math.round(km * 0.62 * CABIN_EARN[cabinClass] * FARE_EARN[family]);
}

/** A card number: two letters of the airline and seven digits of the name. */
export function numberFor(family: string, given: string): string {
  const n = hash(`${family}|${given}`) % 10_000_000;
  return `ST${String(n).padStart(7, "0")}`;
}
