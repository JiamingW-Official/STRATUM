/**
 * What a cabin can be read in.
 *
 * Here rather than in the dictionary because the language is part of a
 * seat's own state — the dictionary is one of the things that reads it,
 * not the thing that owns it, and putting it there made every file that
 * touches SeatPrivate import the whole of i18n to name a two-letter code.
 */
export type Lang = "en" | "zh" | "zh-Hant" | "ja" | "es" | "fr" | "ru";

/**
 * A name with its own translations: a city, an airport, a country, a dish.
 *
 * English is the only one required, and whatever else is there is used when
 * the seat is set to it. These are content rather than interface — a city
 * nobody has written in Russian is better read in English than guessed at,
 * and the fallback says so by simply being English.
 */
export type Named = { en: string } & Partial<Record<Lang, string>>;

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
  city: Named;
  name: Named;
  /** The country a passenger would say it is in, for a list of cities. */
  country: Named;
  /** ISO 3166-1 alpha-2, which is what a departure tax is charged by. */
  cc: string;
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
  /**
   * What is leaving the airport this flight is landing at. Empty until the
   * cabin has been given one — the screen has no way of knowing this and
   * never guesses it.
   */
  connections: Connection[];
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

/**
 * Three cabins, front to back.
 *
 * Premium economy is a cabin, not a fare: its own rows, its own seat, its own
 * bag allowance and its own compartment code on the pass. An airline that
 * sells one and an app that models it as "economy with extra legroom" will
 * disagree about what is on the boarding pass.
 */
export type CabinClass = "first" | "business" | "premium" | "economy";

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
  | "weather"
  | "movies"
  | "music"
  | "games"
  | "chat"
  | "dining"
  | "shop"
  /** The three screens a seat shows before it shows anything else. */
  | "language"
  | "start"
  | "overview"
  | "connections"
  /** A film is on the glass. It takes the whole surface, chrome included. */
  | "film";

/**
 * A message from one seat to another.
 *
 * Read where this type is used before deciding it is in the wrong place. It is
 * not in SeatPrivate, and that is the whole point: on a real seat-back system
 * a seat-to-seat message goes to a server in the ceiling and sits there, so
 * the thing that feels like a note passed between two people is in fact held
 * by the aircraft. This one is held by the cabin store, which is the same
 * arrangement, and the screen says so instead of implying otherwise.
 *
 * `seenUtc` is the evidence rule again, in a second place: null means the
 * message exists in the aircraft and nowhere else — nobody has had it in front
 * of them — and the thread draws it the way the map draws a stretch nobody
 * heard.
 */
export type CabinMessage = {
  id: string;
  /** Seat, never a name. Nobody in this cabin has a name. */
  from: string;
  to: string;
  text: string;
  /** ISO 8601, UTC. */
  sentUtc: string;
  /** When the other seat actually had the thread open, or null. */
  seenUtc: string | null;
};

/**
 * What a passenger said they were going to do with the flight.
 *
 * A real cabin asks this once, on the first touch, and it is not a
 * personality quiz: each answer is a destination and, for one of them, an
 * action in the cabin. Nothing else in the interface changes because of it —
 * a mode that quietly reorders everything is a system that has decided who
 * you are.
 */
/** "drink" is business only: it is the one answer that is not true in both
 *  cabins, because a glass before the doors close only happens in one. */
export type SeatMode = "watch" | "listen" | "look" | "drink" | "rest";

/**
 * A flight leaving the airport this one is landing at.
 *
 * `confirmed` is the evidence rule in its third place. A schedule is a
 * statement about the future and nothing has happened yet: until the ground
 * tells the aircraft otherwise, every row here is what was planned rather
 * than what is known, and the board draws the difference.
 */
export type Connection = {
  flightNo: string;
  carrier: string;
  to: { city: Named; iata: string };
  /** ISO 8601, UTC. */
  departsUtc: string;
  gate: string | null;
  terminal: string | null;
  status: "onTime" | "delayed" | "cancelled";
  confirmed: boolean;
};

/**
 * The booking this seat is occupied under.
 *
 * It belongs in SeatPrivate and nowhere else: a record locator is a handle on
 * one person's contract with the airline, and how many bags are in the hold
 * under their name is the kind of thing a seat-back screen may show its
 * occupant and must never show the cabin. It arrives with the boarding pass
 * that was scanned at the seat and it carries no name, which is the rule the
 * rest of this cabin already runs on.
 */
export type SeatBooking = {
  pnr: string;
  cabinClass: CabinClass;
  /** Checked bags, including the one the fare already came with. */
  bags: number;
  /** The card this passenger is flying on, if they carry one. */
  tier?: string;
  /**
   * The flight they are changing onto, when this aeroplane is the first half
   * of a journey. It is the one row on the departure board that is theirs, and
   * the cabin can say so without telling anybody else which one it is.
   */
  onward?: { flightNo: string; toIata: string; departsUtc: string };
};

/** This seat, as only its occupant sees it. */
export type SeatPrivate = {
  screen: ScreenName;
  /** False until this seat has been through language and the first question. */
  started: boolean;
  mode: SeatMode | null;
  /** Nobody else's business what you read the cabin in. */
  lang: Lang;
  /**
   * What is loaded and where it had got to. The position is state, not a
   * detail of the player: an announcement has to give the screen back exactly
   * as it was, and "exactly" includes the frame it was on.
   */
  media?: { id: string; positionSec: number };
  /** 0–1. */
  volume: number;
  /** Set when a boarding pass was scanned at this seat. */
  booking?: SeatBooking;
};

/**
 * Everything the IFE can ask the world outside the screen to do. The bench
 * writes to the mock store; the cabin will light a 3D lamp and tell the other
 * passengers. The screen never learns which one it is talking to.
 */
export type IFEBridge = {
  setReadingLight(on: boolean): void;
  callAttendant(on: boolean): void;
  /** Hand a message to the aircraft, addressed to another seat. */
  sendMessage(to: string, text: string): void;
  /**
   * Say that this seat has the thread with `withSeat` in front of it, which is
   * what turns their unseen messages into seen ones. The screen cannot write
   * that itself: whether a message has been read is a fact about the cabin.
   */
  readThread(withSeat: string): void;
};
