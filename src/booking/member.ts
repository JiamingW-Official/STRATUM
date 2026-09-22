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
};

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
export function benefits(tier: Tier): string[] {
  switch (tier) {
    case "Platinum":
      return ["Seats included", "3 checked bags", "Boards first", "Lounge"];
    case "Gold":
      return ["Seats included", "2 checked bags", "Boards early", "Lounge"];
    case "Silver":
      return ["Seats included", "1 extra checked bag", "Boards early"];
    default:
      return ["Earns miles on every flight"];
  }
}

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
export function milesFor(
  km: number,
  cabinClass: CabinClass,
  family: FareFamily,
): number {
  const cabin =
    cabinClass === "first"
      ? 3
      : cabinClass === "business"
        ? 2
        : cabinClass === "premium"
          ? 1.5
          : 1;
  const fare = family === "flex" ? 1.25 : family === "light" ? 0.5 : 1;
  return Math.round(km * 0.62 * cabin * fare);
}

/** A card number: two letters of the airline and seven digits of the name. */
export function numberFor(family: string, given: string): string {
  const n = hash(`${family}|${given}`) % 10_000_000;
  return `ST${String(n).padStart(7, "0")}`;
}
