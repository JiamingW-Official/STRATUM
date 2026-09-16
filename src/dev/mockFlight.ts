import type { Airport, FlightPhase, TrackPoint } from "../flight-state/types";
import { greatCircleKm, interpolate } from "../flight-state/geo";

// A flight that does not exist, advancing along a great circle so the map has
// something honest to draw. Everything here is invented; what is NOT invented
// is the shape of the data — the same fields, with the same `heard` flag, that
// packages/adsb will hand over once the IFE is wired to a real aircraft.

export const AIRPORTS: Record<string, Airport> = {
  JFK: {
    iata: "JFK",
    icao: "KJFK",
    city: { en: "New York", zh: "纽约" },
    name: { en: "John F. Kennedy Intl", zh: "肯尼迪国际机场" },
    lat: 40.6413,
    lon: -73.7781,
    tz: "America/New_York",
  },
  LHR: {
    iata: "LHR",
    icao: "EGLL",
    city: { en: "London", zh: "伦敦" },
    name: { en: "Heathrow", zh: "希思罗机场" },
    lat: 51.47,
    lon: -0.4543,
    tz: "Europe/London",
  },
  PVG: {
    iata: "PVG",
    icao: "ZSPD",
    city: { en: "Shanghai", zh: "上海" },
    name: { en: "Pudong Intl", zh: "浦东国际机场" },
    lat: 31.1443,
    lon: 121.8083,
    tz: "Asia/Shanghai",
  },
  HND: {
    iata: "HND",
    icao: "RJTT",
    city: { en: "Tokyo", zh: "东京" },
    name: { en: "Haneda", zh: "羽田机场" },
    lat: 35.5533,
    lon: 139.7811,
    tz: "Asia/Tokyo",
  },
  LAX: {
    iata: "LAX",
    icao: "KLAX",
    city: { en: "Los Angeles", zh: "洛杉矶" },
    name: { en: "Los Angeles Intl", zh: "洛杉矶国际机场" },
    lat: 33.9416,
    lon: -118.4085,
    tz: "America/Los_Angeles",
  },
  CDG: {
    iata: "CDG",
    icao: "LFPG",
    city: { en: "Paris", zh: "巴黎" },
    name: { en: "Charles de Gaulle", zh: "戴高乐机场" },
    lat: 49.0097,
    lon: 2.5479,
    tz: "Europe/Paris",
  },
  SIN: {
    iata: "SIN",
    icao: "WSSS",
    city: { en: "Singapore", zh: "新加坡" },
    name: { en: "Changi", zh: "樟宜机场" },
    lat: 1.3644,
    lon: 103.9915,
    tz: "Asia/Singapore",
  },
};

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
