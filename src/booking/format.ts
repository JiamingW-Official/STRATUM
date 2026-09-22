import type { Airport } from "../flight-state/types";

/** Clock at an airport, 24 hour, because a boarding pass is not a conversation. */
export function atAirport(iso: string, ap: Airport): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: ap.tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/** "Thu 24 Sep" — the day as a person says it, at the airport it happens at. */
export function dayAt(iso: string, ap: Airport): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: ap.tz,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

/** Whether arrival is on a later calendar day than departure, and by how much. */
export function dayOffset(fromIso: string, from: Airport, toIso: string, to: Airport): number {
  const key = (iso: string, ap: Airport) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: ap.tz }).format(new Date(iso));
  const a = new Date(`${key(fromIso, from)}T00:00:00Z`).getTime();
  const b = new Date(`${key(toIso, to)}T00:00:00Z`).getTime();
  return Math.round((b - a) / 86400000);
}

export function hhmm(minutes: number): string {
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}

export function money(n: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * How far the clock moves between two airports, on the day in question.
 *
 * Computed from the zones rather than from a table of offsets, so it is right
 * across a daylight-saving boundary — which is the only time anybody checks.
 * It is the first thing a traveller works out and the last thing a booking
 * screen ever tells them.
 */
export function clockShift(from: Airport, to: Airport, atIso: string): number {
  const at = new Date(atIso);
  // The zone's own offset at that instant, which is the only thing that
  // answers this across a daylight-saving change. Reading an hour and a day
  // number out of each zone and subtracting them looks equivalent and is not:
  // on the last night of a month the day numbers are 31 and 1, and the
  // difference is seven hundred hours.
  const offset = (tz: string) => {
    const name = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      timeZoneName: "longOffset",
    })
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName")?.value;
    const m = /GMT([+-])(\d{2}):(\d{2})/.exec(name ?? "");
    if (!m) return 0;
    return (Number(m[2]) + Number(m[3]) / 60) * (m[1] === "-" ? -1 : 1);
  };
  return Math.round(offset(to.tz) - offset(from.tz));
}

/** "five hours ahead", the way it is said out loud. */
export function clockSaid(hours: number): string | null {
  if (hours === 0) return null;
  const n = Math.abs(hours);
  const word =
    ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
     "nine", "ten", "eleven", "twelve"][n] ?? String(n);
  return `${word} hour${n === 1 ? "" : "s"} ${hours > 0 ? "ahead" : "behind"}`;
}
