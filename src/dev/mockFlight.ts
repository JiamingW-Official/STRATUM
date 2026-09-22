import type {
  Airport,
  Connection,
  FlightPhase,
  TrackPoint,
} from "../flight-state/types";
import { greatCircleKm, interpolate } from "../flight-state/geo";

// A flight that does not exist, advancing along a great circle so the map has
// something honest to draw. Everything here is invented; what is NOT invented
// is the shape of the data — the same fields, with the same `heard` flag, that
// packages/adsb will hand over once the IFE is wired to a real aircraft.

export { AIRPORTS } from "../flight-state/airports";

// Fractions of the flight each phase occupies. Rough, but ordered and
// monotonic, which is all the screens need.
const PHASE_BOUNDS: Array<[FlightPhase, number]> = [
  ["taxi", 0.02],
  ["takeoff", 0.07],
  ["cruise", 0.85],
  ["descent", 0.99],
  ["landed", 1.01],
];

export function phaseAt(progress: number): FlightPhase {
  if (progress <= 0) return "boarding";
  for (const [phase, upper] of PHASE_BOUNDS) if (progress < upper) return phase;
  return "landed";
}

/** The midpoint of a phase, used when the panel forces one. */
export function progressForPhase(phase: FlightPhase): number {
  if (phase === "boarding") return 0;
  let lower = 0;
  for (const [p, upper] of PHASE_BOUNDS) {
    if (p === phase) return (lower + Math.min(upper, 1)) / 2;
    lower = upper;
  }
  return 1;
}

/** Cruise altitude is a step function of phase, smoothed at the ends. */
export function altitudeFt(progress: number, cruiseFt = 37000): number {
  const p = phaseAt(progress);
  if (p === "boarding" || p === "taxi") return 0;
  if (p === "landed") return 0;
  if (p === "takeoff") return cruiseFt * ((progress - 0.02) / 0.05) ** 0.7;
  if (p === "descent") return cruiseFt * (1 - (progress - 0.85) / 0.14) ** 0.9;
  return cruiseFt;
}

export function groundSpeedKt(progress: number, cruiseKt = 480): number {
  const p = phaseAt(progress);
  if (p === "boarding") return 0;
  if (p === "taxi") return 15;
  if (p === "takeoff") return 160 + (cruiseKt - 160) * ((progress - 0.02) / 0.05);
  if (p === "descent") return 260 + (cruiseKt - 260) * (1 - (progress - 0.85) / 0.14);
  if (p === "landed") return 0;
  return cruiseKt;
}

/**
 * Builds the flown track up to `progress`, marking each sample heard or not
 * according to the receiver windows given. A window is a [from, to] pair in
 * progress units during which no receiver was listening.
 */
export function buildTrack(
  from: Airport,
  to: Airport,
  progress: number,
  departureUtc: string,
  blockMinutes: number,
  gaps: Array<[number, number]>,
  samples = 160,
): TrackPoint[] {
  const out: TrackPoint[] = [];
  const t0 = Date.parse(departureUtc);
  const n = Math.max(1, Math.round(samples * Math.min(1, Math.max(0, progress))));
  for (let i = 0; i <= n; i++) {
    const f = (i / samples) * 1;
    if (f > progress) break;
    const { lat, lon } = interpolate(from, to, f);
    out.push({
      lat,
      lon,
      t: new Date(t0 + f * blockMinutes * 60_000).toISOString(),
      heard: !gaps.some(([a, b]) => f >= a && f <= b),
    });
  }
  return out;
}

/** Block time from distance, with taxi and climb padding folded in. */
export function blockMinutes(from: Airport, to: Airport, cruiseKt = 480) {
  const km = greatCircleKm(from, to);
  const nm = km / 1.852;
  return Math.round((nm / cruiseKt) * 60 + 25);
}

/**
 * A departure board for the airport this flight is landing at.
 *
 * This is the bench's, like the flight itself: nobody has told this aircraft
 * anything, and in a real cabin the board would arrive from the airline's
 * operations feed on the ground link. What matters is the shape — three of
 * these rows are the schedule and nothing more, and two have been confirmed
 * since, which is the distinction the screen is there to draw.
 */
export function mockConnections(etaUtc: string): Connection[] {
  const eta = Date.parse(etaUtc);
  const at = (minutes: number) => new Date(eta + minutes * 60_000).toISOString();
  return [
    {
      flightNo: "STR 214",
      carrier: "STRATUM",
      to: { city: { en: "Stockholm", zh: "斯德哥尔摩" }, iata: "ARN" },
      departsUtc: at(75),
      gate: "C18",
      terminal: "3",
      status: "onTime",
      confirmed: true,
    },
    {
      flightNo: "STR 118",
      carrier: "STRATUM",
      to: { city: { en: "Malmö", zh: "马尔默" }, iata: "MMX" },
      departsUtc: at(110),
      gate: "F26",
      terminal: "1",
      status: "onTime",
      confirmed: true,
    },
    {
      flightNo: "STR 402",
      carrier: "STRATUM",
      to: { city: { en: "Oslo", zh: "奥斯陆" }, iata: "OSL" },
      departsUtc: at(145),
      gate: null,
      terminal: "2",
      status: "delayed",
      confirmed: false,
    },
    {
      flightNo: "STR 907",
      carrier: "STRATUM",
      to: { city: { en: "Copenhagen", zh: "哥本哈根" }, iata: "CPH" },
      departsUtc: at(190),
      gate: null,
      terminal: null,
      status: "cancelled",
      confirmed: false,
    },
    {
      flightNo: "STR 365",
      carrier: "STRATUM",
      to: { city: { en: "Chicago", zh: "芝加哥" }, iata: "ORD" },
      departsUtc: at(230),
      gate: "B16",
      terminal: "2",
      status: "onTime",
      confirmed: false,
    },
  ];
}
