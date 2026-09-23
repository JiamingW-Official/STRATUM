import type { Airport, CabinClass } from "../flight-state/types";

// What the booking surface knows, in the order a passenger tells it.
//
// The split that matters here is the same one flight-state makes, one step
// earlier: a fare is a fact about the flight and everyone sees the same one;
// a passport number is a fact about one person and must never end up in a
// store the cabin can read. Nothing in this file is allowed to travel to the
// aircraft except through a boarding pass, which carries a name and a seat
// and deliberately carries nothing else.

export type TripQuery = {
  fromIata: string;
  toIata: string;
  /** Calendar date of departure at the origin, YYYY-MM-DD. */
  date: string;
  /**
   * Calendar date of the return at the destination, or null for a one-way.
   * Return is the default because it is what almost everybody buys: a
   * booking engine that opens on a one-way is a booking engine that has never
   * watched anybody use one.
   */
  returnDate: string | null;
  pax: number;
};

/** Out and back. Everything downstream is indexed by this. */
export type Leg = "out" | "back";

/**
 * A seat that can be sold, priced per cabin. The fare and the tax are kept
 * apart because they are set by different people: the airline picks the first
 * and a government picks the second, and only the first moves with the fare
 * family or with how close the day is.
 */
export type FareOffer = {
  /** Standard-family base fare for one passenger, before tax. */
  base: number;
  /** Tax and carrier charges for one passenger, set by the departure country. */
  tax: number;
  /** base + tax, which is the figure a fare list quotes. */
  price: number;
  currency: string;
  seatsLeft: number;
};

/**
 * One sellable flight. `blockMin` is gate to gate, which is what a passenger
 * is buying; the flying time is shorter and nobody sells that.
 */
export type FlightOption = {
  flightNo: string;
  carrier: string;
  from: Airport;
  to: Airport;
  /** ISO 8601, UTC. */
  departureUtc: string;
  /** ISO 8601, UTC. */
  arrivalUtc: string;
  blockMin: number;
  aircraft: AircraftType;
  fares: Record<CabinClass, FareOffer>;
};

export type AircraftType = "A320" | "A330" | "A350";

/**
 * Why a seat costs what it costs. The zone is the whole of it — there is no
 * per-seat price list, because a cabin priced seat by seat is a cabin nobody
 * can read at a glance.
 */
export type SeatZone =
  | "standard"
  | "forward"
  | "legroom"
  | "premium"
  | "suite"
  | "first";

export type SeatCell = {
  seat: string;
  row: number;
  column: string;
  cabinClass: CabinClass;
  zone: SeatZone;
  taken: boolean;
  /** A seat beside an emergency exit: extra room, and rules about who sits there. */
  exitRow: boolean;
  window: boolean;
  aisle: boolean;
  /** Under the wing: no view, and the quietest part of the aeroplane. */
  overWing: boolean;
  surcharge: number;
};

/** One row of the cabin, with the aisles written in rather than inferred. */
export type CabinRow = {
  row: number;
  cabinClass: CabinClass;
  exitRow: boolean;
  /** Over the wing: no view out, and the quietest part of the aeroplane. */
  overWing: boolean;
  /** Seats and aisles in the order they are walked past. `null` is an aisle. */
  cells: Array<SeatCell | null>;
};

export type CabinMap = {
  aircraft: AircraftType;
  columns: string[];
  rows: CabinRow[];
};

/**
 * Only what an airline is actually entitled to ask for a border crossing.
 * Kept out of every shared store on purpose: this is the one object in the
 * work that is nobody else's business.
 */
export type Passenger = {
  family: string;
  given: string;
  nationality: string;
  passportNo: string;
  /** YYYY-MM-DD. */
  passportExpiry: string;
};

/**
 * All that may be kept of a card between visits: enough to recognise it,
 * never enough to use it. There is deliberately no field here for the number
 * or the security code — see profile.ts.
 */
export type SavedCard = {
  brand: "Visa" | "Mastercard" | "Amex" | "Club" | "Card";
  last4: string;
  /** MM/YY, as it is printed on the card. */
  expiry: string;
};

export type BoardingPass = {
  pnr: string;
  leg: Leg;
  /** Which aeroplane of the leg. A change means two passes, not one. */
  segmentIndex: number;
  /** Which traveller on the booking this one belongs to. */
  passengerIndex: number;
  passenger: Passenger;
  flightNo: string;
  carrier: string;
  fromIata: string;
  toIata: string;
  /** ISO 8601, UTC. */
  departureUtc: string;
  seat: string;
  cabinClass: CabinClass;
  gate: string;
  terminal: string;
  /** ISO 8601, UTC. */
  boardingUtc: string;
  zone: number;
  sequence: number;
  /** The IATA BCBP string this pass encodes — what the scanner reads. */
  bcbp: string;
};

/**
 * Seven screens, not eight. Name and payment used to be two, which is two
 * forms to fill for what a passenger thinks of as one act — buying the seat.
 * Passport details moved to check-in, where an airline actually needs them and
 * where they no longer stand between somebody and the thing they came to do.
 */
export type Step =
  | "search"
  | "account"
  | "results"
  | "seats"
  | "review"
  | "booked"
  | "today"
  | "trip"
  | "checkin"
  | "boarding"
  /* The club, and the four rooms off it. */
  | "club-status"
  | "club-card"
  | "club-miles"
  | "club-earn"
  | "club-activity";

/**
 * A way of getting there: one flight, or two with a change in the middle.
 *
 * A single carrier does not fly every city to every other city, and pretending
 * otherwise was the last structural lie on this surface. STRATUM flies out of
 * two hubs; anything that touches one is nonstop and anything that does not
 * goes through one, which is what a real network looks like and why the word
 * "connection" exists.
 */
export type Itinerary = {
  segments: FlightOption[];
  /** Minutes on the ground between each pair of segments. */
  layoverMin: number[];
  /** Door to door, including the time spent in the terminal. */
  totalMin: number;
};

/** One aeroplane, for everybody on the booking. */
export type SegmentBooking = {
  option: FlightOption;
  /** One per passenger, in the order they were entered. */
  seats: Array<string | null>;
  /** One per passenger, empty until this segment is checked in. */
  passes: BoardingPass[];
};

/**
 * One leg's worth of what was chosen, for everybody on the booking.
 *
 * Seats and passes are arrays in passenger order because a seat belongs to a
 * person, not to a booking: a party of three is three seats on each aeroplane
 * and three passes at each gate, and the version of this that held one seat
 * per leg quietly told the other two they would be "assigned at check-in",
 * which is what an airline says when it has run out of seats, not what a
 * booking engine says when it has run out of screens.
 */
export type LegBooking = {
  /** One or two. A leg with two is a leg with a change in the middle. */
  segments: SegmentBooking[];
  layoverMin: number[];
};
