import type { CabinClass } from "../flight-state/types";
import type { BoardingPass } from "./types";

// IATA Resolution 792, the bar-coded boarding pass. This is the real layout of
// the mandatory items — fixed width, no separators, sixty characters — because
// the interesting thing about a boarding pass is that it is a format, not a
// picture: the reason a gate reader in Osaka can read a pass printed in Lisbon
// is that every airline agreed on which column the seat number starts in.
//
// One thing the format genuinely does not carry: a year, or a time of day. It
// has a three-digit day of the year and nothing else, which is why the link
// this pass opens has to hand the departure instant over separately rather
// than pretend to recover it. That is a property of boarding passes, not a
// shortcut taken here.

const LEN = 60;

function pad(s: string, n: number): string {
  return s.slice(0, n).padEnd(n, " ");
}

/** Day of the year, 1–366, in UTC. */
export function julianDay(iso: string): number {
  const d = new Date(iso);
  const start = Date.UTC(d.getUTCFullYear(), 0, 1);
  return Math.floor((d.getTime() - start) / 86400000) + 1;
}

export function compartmentFor(
  cabinClass: CabinClass,
): "F" | "J" | "W" | "Y" {
  return cabinClass === "first"
    ? "F"
    : cabinClass === "business"
      ? "J"
      : cabinClass === "premium"
        ? "W"
        : "Y";
}

/** "12K" as the format wants it: three digits of row, then the column. */
export function seatField(seat: string): string {
  const m = /^(\d+)([A-Z])$/.exec(seat.toUpperCase());
  if (!m) return pad(seat.toUpperCase(), 4);
  return m[1].padStart(3, "0") + m[2];
}

export function encodeBcbp(p: Omit<BoardingPass, "bcbp">): string {
  const name = `${p.passenger.family}/${p.passenger.given}`.toUpperCase();
  const flightDigits = (p.flightNo.match(/\d+/)?.[0] ?? "0").padStart(4, "0");
  const s =
    "M1" +
    pad(name, 20) +
    "E" +
    pad(p.pnr, 7) +
    pad(p.fromIata, 3) +
    pad(p.toIata, 3) +
    pad(p.carrier, 3) +
    pad(flightDigits, 5) +
    String(julianDay(p.departureUtc)).padStart(3, "0") +
    compartmentFor(p.cabinClass) +
    seatField(p.seat) +
    pad(String(p.sequence).padStart(4, "0"), 5) +
    "3" +
    "00";
  return pad(s, LEN);
}

export type DecodedBcbp = {
  name: string;
  pnr: string;
  fromIata: string;
  toIata: string;
  carrier: string;
  flightNo: string;
  julianDay: number;
  cabinClass: CabinClass;
  seat: string;
  sequence: number;
};

export function decodeBcbp(raw: string): DecodedBcbp | null {
  const s = raw.padEnd(LEN, " ");
  if (s[0] !== "M" || s[1] !== "1") return null;
  const at = (from: number, len: number) => s.slice(from - 1, from - 1 + len).trim();
  const digits = at(40, 5).replace(/\D/g, "");
  const seatRaw = at(49, 4);
  const seatMatch = /^(\d+)([A-Z])$/.exec(seatRaw);
  const carrier = at(37, 3);
  if (!carrier || !digits) return null;
  return {
    name: at(3, 20),
    pnr: at(24, 7),
    fromIata: at(31, 3),
    toIata: at(34, 3),
    carrier,
    flightNo: `${carrier} ${String(Number(digits)).padStart(3, "0")}`,
    julianDay: Number(at(45, 3)),
    cabinClass:
      s[47] === "F"
        ? "first"
        : s[47] === "J"
          ? "business"
          : s[47] === "W"
            ? "premium"
            : "economy",
    seat: seatMatch ? `${Number(seatMatch[1])}${seatMatch[2]}` : seatRaw,
    sequence: Number(at(53, 5)) || 0,
  };
}

/**
 * Where scanning this pass takes you: the seat-back screen belonging to the
 * seat it was issued for. The pass carries everything the cabin needs except
 * the departure instant, which rides alongside it for the reason given above.
 */
export function ifeUrlFor(
  pass: BoardingPass,
  origin = "",
  extraBags = 0,
  extra: {
    tier?: string;
    onward?: { flightNo: string; toIata: string; departsUtc: string };
  } = {},
): string {
  const q = new URLSearchParams({
    bp: pass.bcbp,
    dep: pass.departureUtc,
    // Two things ride alongside the pass rather than inside it, and for the
    // same reason: the mandatory items of Resolution 792 have nowhere to put
    // them. A boarding pass carries a day of the year with no time on it, and
    // it carries no bag count at all — bags live in the conditional items an
    // airline fills in for its own systems, which is a format of its own.
    bags: String(1 + extraBags),
  });
  if (extra.tier) q.set("tier", extra.tier);
  // The onward flight rides here for the same reason the bags do: a boarding
  // pass is about one aeroplane, and what a passenger is changing onto is a
  // fact about their journey rather than about this departure.
  if (extra.onward) {
    q.set("on", extra.onward.flightNo);
    q.set("onTo", extra.onward.toIata);
    q.set("onAt", extra.onward.departsUtc);
  }
  return `${origin}/dev/ife/?${q.toString()}`;
}
