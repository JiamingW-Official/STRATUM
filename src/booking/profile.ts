import type { SavedCard } from "./types";
import type { Member } from "./member";
import type { CabinClass } from "../flight-state/types";
import type { FareFamily } from "./schedule";
import type { TripQuery } from "./types";

// What this surface remembers between visits.
//
// The rule for the card is the whole of it: a card may be recognised, never
// used. What is kept is a brand, four digits and an expiry — enough to draw
// the row that says "Visa ending 4242" and not enough to charge anything. The
// number and the security code are never written down, which is also why the
// code is asked for again every time: a saved card that needs nothing typed is
// a saved card number, whatever the storage is called.
//
// The passport is kept in full, because that is what was asked for and because
// it is the difference between checking in in ten seconds and typing a
// document number on a phone at an airport. It is the most sensitive thing
// here, so it is said plainly rather than buried: it sits in this browser, on
// this machine, until it is cleared — and the screen that collects it says so
// and offers to forget it.

const KEY = "stratum.air.profile";

export type Profile = {
  family: string;
  given: string;
  nationality: string;
  passportNo: string;
  /** YYYY-MM-DD. */
  passportExpiry: string;
  card: SavedCard | null;
  /** Null until this browser has booked something. */
  member: Member | null;
  /**
   * The last few things looked for, newest first. Every travel app keeps
   * these, because the thing somebody is most likely to want next is the
   * thing they wanted a minute ago — and because the alternative on a home
   * screen is inventing something to fill the space with.
   */
  recent: TripQuery[];
  /**
   * What the card has earned, newest first. Every airline's membership screen
   * has this and it is the only part of a loyalty programme that can be
   * checked: a balance with nothing behind it is a number to be taken on
   * trust. These rows are written when a booking is paid for, from the same
   * distance the miles were calculated from.
   */
  activity: Earned[];
};

export type Earned = {
  /** The booking these miles came from, so a cancellation can take them back. */
  pnr: string;
  /** ISO day the booking was made. */
  at: string;
  /** ISO day the aeroplane leaves, which is what a flight history is sorted
   *  by and what decides whether a trip is behind you or ahead of you. */
  flownAt: string;
  from: string;
  to: string;
  /** Every flight number on the leg, so a connection reads as two. */
  flights: string[];
  /** Great-circle kilometres, which is what the miles were worked out from. */
  km: number;
  miles: number;
  /** Flights, not journeys: a connection is two, and a card counts both. */
  segments: number;
  /** What it was flown in, which is what the multiplier came from. Rows
   *  written before the statement carried this have neither. */
  cabinClass?: CabinClass;
  family?: FareFamily;
  /** Set on a row of miles spent rather than earned: what they bought. Such
   *  a row has negative miles, no flights and no distance. */
  what?: string;
};

const EMPTY: Profile = {
  family: "",
  given: "",
  nationality: "",
  passportNo: "",
  passportExpiry: "",
  card: null,
  member: null,
  recent: [],
  activity: [],
};

/** Storage throws in private windows and when site data is blocked. */
export function loadProfile(): Profile {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw) as Partial<Profile>;
    return {
      family: typeof p.family === "string" ? p.family : "",
      given: typeof p.given === "string" ? p.given : "",
      nationality: typeof p.nationality === "string" ? p.nationality : "",
      passportNo: typeof p.passportNo === "string" ? p.passportNo : "",
      passportExpiry:
        typeof p.passportExpiry === "string" ? p.passportExpiry : "",
      card: isCard(p.card) ? p.card : null,
      member:
        p.member && typeof p.member === "object" &&
        typeof (p.member as Member).number === "string"
          ? {
              number: (p.member as Member).number,
              miles: Number((p.member as Member).miles) || 0,
              ...(typeof (p.member as Member).since === "string"
                ? { since: (p.member as Member).since }
                : {}),
              ...((p.member as Member).cardHolder ? { cardHolder: true } : {}),
              ...(Number.isFinite((p.member as Member).redeemed)
                ? { redeemed: Number((p.member as Member).redeemed) }
                : {}),
            }
          : null,
      recent: Array.isArray(p.recent)
        ? (p.recent as TripQuery[]).filter(
            (q) => q && typeof q.fromIata === "string" && typeof q.date === "string",
          )
        : [],
      activity: Array.isArray(p.activity)
        ? (p.activity as Earned[])
            .filter((e) => e && typeof e.from === "string" && Number.isFinite(e.miles))
            // Rows written before the history knew about flights and dates.
            .map((e) => ({
              ...e,
              pnr: typeof e.pnr === "string" ? e.pnr : "",
              flownAt: typeof e.flownAt === "string" ? e.flownAt : e.at,
              flights: Array.isArray(e.flights) ? e.flights : [],
              km: Number.isFinite(e.km) ? e.km : 0,
              segments: Number.isFinite(e.segments) ? e.segments : 1,
            }))
        : [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveProfile(p: Profile): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // A passenger who has blocked storage simply types their name again.
  }
}

/**
 * A booking that moves cabin earns at the new cabin's rate.
 *
 * The statement rows are scaled rather than recomputed: miles are a multiple
 * of distance, and the distance has not changed — only the multiplier has.
 * Returns the rows that are left and what the balance owes on top.
 */
export function repriceEarned(
  pnr: string,
  factor: number,
): { activity: Earned[]; delta: number } {
  const p = loadProfile();
  let delta = 0;
  const activity = p.activity.map((e) => {
    // Miles spent on the trip are what they were; only the flights reprice.
    if (e.pnr !== pnr || e.miles < 0) return e;
    const miles = Math.round(e.miles * factor);
    delta += miles - e.miles;
    return { ...e, miles };
  });
  const member = p.member
    ? { ...p.member, miles: Math.max(0, p.member.miles + delta) }
    : null;
  saveProfile({ ...p, activity, member });
  return { activity, delta };
}

/** Newest first, and a year of it is more than anybody scrolls. */
export function rememberEarned(rows: Earned[]): Earned[] {
  const p = loadProfile();
  const activity = [...rows, ...p.activity].slice(0, 20);
  saveProfile({ ...p, activity });
  return activity;
}

/**
 * A cancelled booking takes its miles with it.
 *
 * An airline does not let you keep the miles for a flight you did not take,
 * and a statement listing a trip that was refunded is a statement that cannot
 * be reconciled. Returns what is left and what was taken back.
 */
export function forgetEarned(pnr: string): {
  activity: Earned[];
  miles: number;
  spent: number;
} {
  const p = loadProfile();
  const gone = p.activity.filter((e) => e.pnr === pnr);
  const activity = p.activity.filter((e) => e.pnr !== pnr);
  // The flights come off the balance; what was spent on the trip goes back
  // onto it. Both are rows on the same statement, told apart by their sign.
  const miles = gone.filter((e) => e.miles > 0).reduce((n, e) => n + e.miles, 0);
  const spent = gone.filter((e) => e.miles < 0).reduce((n, e) => n - e.miles, 0);
  const member = p.member
    ? {
        ...p.member,
        miles: Math.max(0, p.member.miles - miles),
        redeemed: Math.max(0, (p.member.redeemed ?? 0) - spent),
      }
    : null;
  saveProfile({ ...p, activity, member });
  return { activity, miles, spent };
}

/** Newest first, at most three, and never the same route twice. */
export function rememberSearch(q: TripQuery): TripQuery[] {
  const p = loadProfile();
  const key = (x: TripQuery) => `${x.fromIata}${x.toIata}`;
  const recent = [q, ...p.recent.filter((x) => key(x) !== key(q))].slice(0, 3);
  saveProfile({ ...p, recent });
  return recent;
}

export function forgetCard(): void {
  saveProfile({ ...loadProfile(), card: null });
}

/** Everything this browser knows about the traveller, gone. */
export function forgetPassport(): void {
  saveProfile({ ...loadProfile(), passportNo: "", passportExpiry: "" });
}

function isCard(c: unknown): c is SavedCard {
  if (!c || typeof c !== "object") return false;
  const v = c as Record<string, unknown>;
  return typeof v.brand === "string" && typeof v.last4 === "string" && typeof v.expiry === "string";
}

/** The network, from the digits every scheme agreed to start with. */
export function brandOf(digits: string): SavedCard["brand"] {
  // The programme's own card, before the network it rides on.
  if (/^5299/.test(digits)) return "Club";
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  return "Card";
}

/** Everything of a card that is safe to keep, and nothing else. */
export function maskCard(number: string, expiry: string): SavedCard {
  const digits = number.replace(/\D/g, "");
  return { brand: brandOf(digits), last4: digits.slice(-4), expiry };
}
