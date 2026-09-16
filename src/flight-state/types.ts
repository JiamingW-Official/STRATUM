// The three layers every surface in the cabin reads from. What decides which
// layer a new field belongs to is who can see it:
//
//   FlightState  — one per flight, identical on every screen in the cabin
//   SeatPublic   — one per seat, visible to the whole cabin (a lit reading
//                  light is visible from three rows back)
//   SeatPrivate  — one per seat, visible only to whoever is sitting there
//
// Getting this wrong is not a styling bug: it decides what other passengers
// can learn about you.

export type FlightPhase =
  | "boarding"
  | "taxi"
  | "takeoff"
  | "cruise"
  | "descent"
  | "landed";

export type Airport = {
  iata: string;
  icao: string;
  /** City name, not airport name — this is what a passenger reads. */
  city: { en: string; zh: string };
  name: { en: string; zh: string };
  lat: number;
  lon: number;
  /** IANA zone, so local time survives DST without a table of offsets. */
  tz: string;
  /**
   * Wikipedia article to take the destination photograph from, when the city's
   * own article does not lead with a picture of the city. Asking for
   * "Singapore" returns the national flag.
   */
  photoTitle?: string;
};

/**
 * One sample of where the aircraft is. `heard` is the whole evidence rule in
 * one boolean: true means a receiver actually decoded this position, false
 * means it was interpolated or dead-reckoned between contacts. It is carried
 * in the data, never decided at render time.
 */
export type TrackPoint = {
  lat: number;
  lon: number;
  /** ISO 8601, UTC. */
  t: string;
  heard: boolean;
};

export type FlightPosition = {
  lat: number;
  lon: number;
  altFt: number;
  gsKt: number;
  headingDeg: number;
  heard: boolean;
};

/** Shared by the whole cabin. Nobody's screen can change it. */
export type FlightState = {
  flightNo: string;
  route: { from: Airport; to: Airport };
  /** ISO 8601, UTC. */
  departureUtc: string;
  phase: FlightPhase;
  position: FlightPosition;
  track: TrackPoint[];
  /** ISO 8601, UTC. */
  etaUtc: string;
  /** True when the arrival time is computed rather than reported. */
  etaInferred: boolean;
  /**
   * When set, every screen in the cabin is taken over. This is the point of
   * the piece, not a feature: the passenger cannot dismiss it.
   */
  paOverride: null | "safety" | "captain";
};

export type CabinClass = "business" | "economy";

/** This seat, as the rest of the cabin sees it. */
export type SeatPublic = {
  seat: string;
  cabinClass: CabinClass;
  occupied: boolean;
  readingLight: boolean;
  callAttendant: boolean;
};

export type ScreenName =
  | "off"
  | "idle"
  | "home"
  | "map"
  | "flightInfo"
  | "destination"
  | "movies"
  | "music"
  | "games";

/** This seat, as only its occupant sees it. */
export type SeatPrivate = {
  screen: ScreenName;
  /** Nobody else's business what you read the cabin in. */
  lang: "en" | "zh";
  media?: { id: string; positionSec: number };
  /** 0–1. */
  volume: number;
};

/**
 * Everything the IFE can ask the world outside the screen to do. The bench
 * writes to the mock store; the cabin will light a 3D lamp and tell the other
 * passengers. The screen never learns which one it is talking to.
 */
export type IFEBridge = {
  setReadingLight(on: boolean): void;
  callAttendant(on: boolean): void;
};
