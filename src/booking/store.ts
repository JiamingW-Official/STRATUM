import { create } from "zustand";
import type { CabinClass } from "../flight-state/types";
import { encodeBcbp } from "./bcbp";
import { buildCabin, findTogether, firstFree } from "./cabin";
import {
  forgetPassport,
  loadProfile,
  maskCard,
  rememberSearch,
  forgetEarned,
  rememberEarned,
  repriceEarned,
  saveProfile,
  type Earned,
} from "./profile";
import {
  boardingGroup,
  boardsUtc,
  familyFor,
  nextBookableDate,
  routeKm,
  searchItineraries,
  type FareFamily,
} from "./schedule";
import { hash } from "./hash";
import {
  milesFor,
  numberFor,
  seatsIncludedFor,
  tierOf,
  zoneBumpFor,
  type Member,
} from "./member";
import { forgetTrip, loadTrip, saveTrip, type Trip } from "./trips";
import type {
  BoardingPass,
  Itinerary,
  Leg,
  LegBooking,
  Passenger,
  SegmentBooking,
  SavedCard,
  Step,
  TripQuery,
} from "./types";

// One store, unlike the cabin's three, and for the same reason the cabin has
// three: here there is exactly one reader — the person booking — and every
// screen is a view of the single thing they are part-way through.
//
// Two legs, not one. Everything a passenger chooses is now chosen twice, and
// the pair is what the word "trip" means in this file: a flight out, a flight
// back, a seat on each, and a boarding pass for each that is issued on its own
// clock because check-in opens a day before each departure, not a day before
// the holiday.

/** No I, O, 0 or 1: a record locator is read aloud at a desk. */
const PNR_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function pnrFor(seed: string): string {
  let n = hash(seed);
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += PNR_ALPHABET[n % PNR_ALPHABET.length];
    n = Math.floor(n / PNR_ALPHABET.length) + hash(out);
  }
  return out;
}

/**
 * What the aeroplane offers a party before anybody has touched the map:
 * seats beside each other if there are any, and separate ones if there are
 * not. Offering three strangers' worth of scattered seats to three people
 * travelling together is doing the arithmetic and not the job.
 */
function bookItinerary(
  it: Itinerary,
  cabinClass: CabinClass,
  count: number,
): LegBooking {
  return {
    segments: it.segments.map((option): SegmentBooking => ({
      option,
      seats: offerSeats(
        buildCabin(option.aircraft, option.flightNo),
        cabinClass,
        count,
      ),
      passes: [],
    })),
    layoverMin: it.layoverMin,
  };
}

function offerSeats(
  map: ReturnType<typeof buildCabin>,
  cabinClass: CabinClass,
  count: number,
): Array<string | null> {
  const together = findTogether(map, cabinClass, count);
  if (together) return together;
  const taken = new Set<string>();
  return Array.from({ length: count }, () => {
    const s = firstFree(map, cabinClass, taken);
    if (s) taken.add(s);
    return s;
  });
}

function blankPassenger(): Passenger {
  return {
    family: "",
    given: "",
    nationality: "",
    passportNo: "",
    passportExpiry: "",
  };
}

export function todayIso(offsetDays = 0): string {
  return new Date(Date.now() + offsetDays * 86400000)
    .toISOString()
    .slice(0, 10);
}

/**
 * The part of a passenger this browser keeps, alongside whatever else it is
 * already keeping. Reading the rest back rather than passing it through every
 * call site is what stops one save quietly wiping the searches.
 */
function toProfile(p: Passenger) {
  const kept = loadProfile();
  return {
    family: p.family,
    given: p.given,
    nationality: p.nationality,
    passportNo: p.passportNo,
    passportExpiry: p.passportExpiry,
    recent: kept.recent,
    activity: kept.activity,
  };
}

const profile = typeof window === "undefined" ? null : loadProfile();
const trip = typeof window === "undefined" ? null : loadTrip();

type Legs = Record<Leg, LegBooking | null>;

type BookingStore = {
  step: Step;
  query: TripQuery;
  /** Which leg the list and the seat map are working on. */
  leg: Leg;
  options: Itinerary[];
  legs: Legs;
  cabinClass: CabinClass;
  /** Light, Standard or Flex. Economy only; business is sold as one fare. */
  fareFamily: FareFamily;
  /** One per seat sold. Its length follows the passenger count. */
  passengers: Passenger[];
  /** Who the seat map is choosing for. */
  paxIndex: number;
  /** Which aeroplane of the leg the seat map is on. */
  segIndex: number;
  /** Whose pass is on the glass, and for which aeroplane. */
  passIndex: number;
  passSeg: number;

  savedCard: SavedCard | null;
  /** The card this browser carries, and what was just added to it. */
  member: Member | null;
  earned: number;
  /** What the card has earned, newest first. */
  activity: Earned[];
  /** The last few searches, newest first. */
  recent: TripQuery[];
  /** True when the day asked for had nothing left and the next one was shown. */
  movedDay: boolean;
  useSaved: boolean;
  card: { number: string; expiry: string; cvv: string };
  remember: boolean;
  extraBags: number;

  pnr: string | null;
  /** The leg whose pass is on screen. */
  passLeg: Leg;
  trip: Trip | null;

  setQuery: (p: Partial<TripQuery>) => void;
  swapRoute: () => void;
  setReturn: (on: boolean) => void;
  search: () => void;
  setCabinClass: (c: CabinClass) => void;
  setFareFamily: (f: FareFamily) => void;
  choose: (it: Itinerary) => void;
  setLeg: (leg: Leg) => void;
  setSeat: (seat: string) => void;
  setPassenger: (i: number, p: Partial<Passenger>) => void;
  setPaxIndex: (i: number) => void;
  setSegIndex: (i: number) => void;
  /** Put the whole party back in one row, if the aeroplane has one. */
  sitTogether: () => void;
  setPassIndex: (i: number) => void;
  setPassSeg: (i: number) => void;
  setCard: (p: Partial<BookingStore["card"]>) => void;
  setUseSaved: (v: boolean) => void;
  setRemember: (v: boolean) => void;
  setExtraBags: (n: number) => void;
  forgetSavedCard: () => void;
  forgetPassport: () => void;
  pay: () => void;
  checkIn: (leg: Leg) => void;
  /** The leg being moved, while it is being moved. */
  changing: Leg | null;
  pendingChange: { leg: Leg; it: Itinerary } | null;
  /** What came back from a cancellation, shown once on the way out. */
  cancelled: { fare: number; tax: number; total: number } | null;
  /** Move the whole booking to the front of the aeroplane. */
  upgradeCabin: () => void;
  startChange: (leg: Leg) => void;
  proposeChange: (it: Itinerary) => void;
  confirmChange: () => void;
  abandonChange: () => void;
  cancelBooking: (refund: { fare: number; tax: number; total: number }) => void;
  clearCancelled: () => void;
  openTrip: (leg?: Leg) => void;
  cancelTrip: () => void;
  go: (step: Step) => void;
};

const EMPTY_LEGS: Legs = { out: null, back: null };

export const useBooking = create<BookingStore>((set, get) => ({
  step: "search",
  query: {
    fromIata: "JFK",
    toIata: "LHR",
    // Today, unless today's departures have all gone, in which case the next
    // day that has one.
    date:
      typeof window === "undefined"
        ? todayIso()
        : nextBookableDate("JFK", "LHR"),
    // A week away, which is the length of an ordinary trip and the reason the
    // return date box is never empty on a real booking form.
    returnDate: todayIso(7),
    pax: 1,
  },
  leg: "out",
  options: [],
  legs: trip ? { out: trip.out, back: trip.back } : EMPTY_LEGS,
  cabinClass: trip?.cabinClass ?? "economy",
  fareFamily: "standard",
  // The first traveller is the one this browser remembers; the rest start
  // empty, because it only ever knew about the person holding the phone.
  passengers: [
    {
      family: profile?.family ?? "",
      given: profile?.given ?? "",
      nationality: profile?.nationality ?? "",
      passportNo: profile?.passportNo ?? "",
      passportExpiry: profile?.passportExpiry ?? "",
    },
  ],
  paxIndex: 0,
  segIndex: 0,
  passIndex: 0,

  savedCard: profile?.card ?? null,
  member: profile?.member ?? null,
  earned: 0,
  activity: profile?.activity ?? [],
  recent: profile?.recent ?? [],
  movedDay: false,
  useSaved: Boolean(profile?.card),
  card: { number: "", expiry: "", cvv: "" },
  remember: true,
  extraBags: trip?.extraBags ?? 0,

  pnr: trip?.pnr ?? null,
  passLeg: "out",
  passSeg: 0,
  trip,
  changing: null,
  pendingChange: null,
  cancelled: null,

  setQuery: (p) =>
    set((s) => {
      const query = { ...s.query, ...p };
      if (query.pax === s.passengers.length) return { query };
      // The list of travellers follows the count, keeping whoever is already
      // typed in rather than starting the form again.
      const passengers = Array.from(
        { length: query.pax },
        (_, i) => s.passengers[i] ?? blankPassenger(),
      );
      return { query, passengers, paxIndex: 0 };
    }),
  swapRoute: () =>
    set((s) => ({
      query: { ...s.query, fromIata: s.query.toIata, toIata: s.query.fromIata },
    })),
  setReturn: (on) =>
    set((s) => ({
      query: {
        ...s.query,
        returnDate: on ? (s.query.returnDate ?? todayIso(7)) : null,
      },
    })),

  search: () => {
    let { query } = get();
    // Nothing left today is not an empty screen: it is a day to move to. Every
    // airline does this and says so, because "no flights" on a route that
    // flies daily is the app telling you about its own clock rather than
    // about the aeroplanes.
    if (
      !searchItineraries(query).length &&
      searchItineraries({
        ...query,
        date: nextBookableDate(query.fromIata, query.toIata),
      }).length
    ) {
      query = {
        ...query,
        date: nextBookableDate(query.fromIata, query.toIata),
      };
      set({ query, movedDay: true });
    } else {
      set({ movedDay: false });
    }
    // A new search is a new booking in progress, so the reference from the one
    // already saved lets go here. Leaving it set made the seat map think every
    // seat being chosen belonged to the trip on the home screen, and offer to
    // save it instead of to pay for it.
    set({
      recent: rememberSearch(query),
      options: searchItineraries(query),
      step: "results",
      leg: "out",
      legs: EMPTY_LEGS,
      pnr: null,
    });
  },

  setCabinClass: (cabinClass) =>
    set((s) => ({
      cabinClass,
      legs: {
        out: s.legs.out ? { ...s.legs.out, seat: null } : null,
        back: s.legs.back ? { ...s.legs.back, seat: null } : null,
      },
    })),
  setFareFamily: (fareFamily) => set({ fareFamily }),

  /**
   * Take the flight that was tapped, and then either turn round for the
   * return or go to the seats. The turn is the whole of what makes this a
   * return booking rather than two bookings.
   */
  choose: (it) => {
    const { leg, query, cabinClass, passengers, changing } = get();
    if (changing) return get().proposeChange(it);
    const legs = {
      ...get().legs,
      [leg]: bookItinerary(it, cabinClass, passengers.length),
    };

    if (leg === "out" && query.returnDate) {
      const home = { ...query, fromIata: query.toIata, toIata: query.fromIata };
      // The way back cannot leave before the way out lands, and it cannot be a
      // day whose departures have all gone either.
      const floor = new Date(
        Math.max(
          Date.parse(it.segments[it.segments.length - 1].arrivalUtc),
          Date.now(),
        ),
      );
      let date = query.returnDate;
      if (date < floor.toISOString().slice(0, 10))
        date = floor.toISOString().slice(0, 10);
      let options = searchItineraries({ ...home, date });
      if (!options.length) {
        date = nextBookableDate(home.fromIata, home.toIata, floor);
        options = searchItineraries({ ...home, date });
      }
      set({
        legs,
        leg: "back",
        query: { ...query, returnDate: date },
        options,
      });
      return;
    }
    set({ legs, leg: "out", step: "seats", paxIndex: 0, segIndex: 0 });
  },

  setLeg: (leg) => set({ leg }),

  /**
   * Give the seat to whoever is being chosen for, take it off anybody else on
   * this aeroplane who had it, and move on to the next traveller. The second
   * half is the part that matters: two people cannot have 21A.
   */
  setSeat: (seat) =>
    set((s) => {
      const cur = s.legs[s.leg];
      const seg = cur?.segments[s.segIndex];
      if (!cur || !seg) return {};
      const seats = seg.seats.map((x, i) =>
        i === s.paxIndex ? seat : x === seat ? null : x,
      );
      const nextUnseated = seats.findIndex((x, i) => i > s.paxIndex && !x);
      // A pass that has been issued is issued for a seat. Move the seat and
      // the pass is re-issued for the new one — the barcode included, since
      // the seat is in it and a gate reads the barcode, not the screen.
      // Without this the map said 23C and the pass said 21A.
      const passes = seg.passes.map((p, i) => {
        const to = seats[i];
        if (!to || to === p.seat) return p;
        const { bcbp: _, ...rest } = p;
        const next = { ...rest, seat: to };
        return { ...next, bcbp: encodeBcbp(next) };
      });
      const legs = {
        ...s.legs,
        [s.leg]: {
          ...cur,
          segments: cur.segments.map((x, i) =>
            i === s.segIndex ? { ...seg, seats, passes } : x,
          ),
        },
      };
      // Chosen on a trip that exists, the seat is part of the trip: it was
      // kept only in memory, so closing the app put everybody back where
      // they had been.
      if (s.pnr) {
        saveTrip({
          pnr: s.pnr,
          out: legs.out,
          back: legs.back,
          cabinClass: s.cabinClass,
          extraBags: s.extraBags,
        });
      }
      return {
        legs,
        paxIndex: nextUnseated === -1 ? s.paxIndex : nextUnseated,
      };
    }),

  setPassenger: (i, p) =>
    set((s) => ({
      passengers: s.passengers.map((x, n) => (n === i ? { ...x, ...p } : x)),
    })),
  setPaxIndex: (paxIndex) => set({ paxIndex }),
  setSegIndex: (segIndex) => set({ segIndex, paxIndex: 0 }),

  sitTogether: () =>
    set((s) => {
      const cur = s.legs[s.leg];
      const seg = cur?.segments[s.segIndex];
      if (!cur || !seg) return {};
      const seats = findTogether(
        buildCabin(seg.option.aircraft, seg.option.flightNo),
        s.cabinClass,
        s.passengers.length,
      );
      if (!seats) return {};
      return {
        legs: {
          ...s.legs,
          [s.leg]: {
            ...cur,
            segments: cur.segments.map((x, i) =>
              i === s.segIndex ? { ...seg, seats } : x,
            ),
          },
        },
        paxIndex: 0,
      };
    }),
  setPassIndex: (passIndex) => set({ passIndex }),
  setPassSeg: (passSeg) => set({ passSeg, passIndex: 0 }),
  setCard: (p) => set((s) => ({ card: { ...s.card, ...p } })),
  setUseSaved: (useSaved) => set({ useSaved }),
  setRemember: (remember) => set({ remember }),
  setExtraBags: (extraBags) => set({ extraBags }),

  forgetSavedCard: () => {
    saveProfile({
      ...toProfile(get().passengers[0]),
      card: null,
      member: get().member,
    });
    set({ savedCard: null, useSaved: false });
  },

  forgetPassport: () => {
    forgetPassport();
    set((s) => ({
      passengers: s.passengers.map((p, i) =>
        i === 0 ? { ...p, passportNo: "", passportExpiry: "" } : p,
      ),
    }));
  },

  pay: () => {
    const {
      legs,
      passengers,
      card,
      useSaved,
      remember,
      savedCard,
      cabinClass,
      extraBags,
    } = get();
    if (!legs.out) return;
    const lead = passengers[0];

    // The name is kept either way — it is printed on the ticket. The card is
    // kept only if asked for, and only ever as four digits and an expiry.
    const keep = useSaved
      ? savedCard
      : remember
        ? maskCard(card.number, card.expiry)
        : null;
    // The card is issued the first time somebody books, and every leg of the
    // trip adds to it. This is a loyalty number a browser gives itself, not a
    // sign-in: there is no password anywhere in it and there is nowhere for
    // one to go.
    const flown = [legs.out, legs.back]
      .filter(Boolean)
      .flatMap((l) => l!.segments)
      .reduce(
        (n, sg) => n + routeKm(sg.option.from.iata, sg.option.to.iata),
        0,
      );
    const earned =
      milesFor(flown, cabinClass, get().fareFamily) * passengers.length;
    // One row per leg, from the same distance the miles came from, so the
    // balance on the card can be checked against what put it there.
    const today = new Date().toISOString().slice(0, 10);
    // Before the rows that carry it: they are keyed by the reference so that
    // a cancellation can find them again.
    const first = legs.out.segments[0];
    const pnr = pnrFor(
      `${first.option.flightNo}${first.seats[0]}${lead.family}`,
    );
    const rows = ([legs.out, legs.back].filter(Boolean) as LegBooking[]).map(
      (l) => ({
        pnr,
        at: today,
        flownAt: l.segments[0].option.departureUtc.slice(0, 10),
        from: l.segments[0].option.from.iata,
        to: l.segments[l.segments.length - 1].option.to.iata,
        flights: l.segments.map((sg) => sg.option.flightNo),
        segments: l.segments.length * passengers.length,
        // Whole kilometres: a great-circle distance carries decimals it has
        // no business showing on a statement.
        km: Math.round(
          l.segments.reduce(
            (n, sg) => n + routeKm(sg.option.from.iata, sg.option.to.iata),
            0,
          ),
        ),
        miles:
          milesFor(
            l.segments.reduce(
              (n, sg) => n + routeKm(sg.option.from.iata, sg.option.to.iata),
              0,
            ),
            cabinClass,
            get().fareFamily,
          ) * passengers.length,
      }),
    );
    const member: Member = {
      number: get().member?.number ?? numberFor(lead.family, lead.given),
      miles: (get().member?.miles ?? 0) + earned,
    };
    saveProfile({ ...toProfile(lead), card: keep, member });
    const activity = rememberEarned(rows);

    const booked: Trip = {
      pnr,
      out: legs.out,
      back: legs.back,
      cabinClass,
      extraBags,
    };
    saveTrip(booked);

    set({
      savedCard: keep,
      useSaved: Boolean(keep),
      member,
      earned,
      activity,
      pnr,
      trip: booked,
      step: "trip",
      card: { number: "", expiry: "", cvv: "" },
    });
  },

  /**
   * One pass per traveller per aeroplane, all issued together.
   *
   * An airline checks you in for the journey, not for the flight: a leg with a
   * change in the middle hands you two passes at the desk, and the second one
   * is what you are holding while you walk across the hub.
   */
  checkIn: (leg) => {
    const { legs, passengers, pnr, cabinClass, extraBags } = get();
    const target = legs[leg];
    if (!target || !pnr) return;
    if (target.segments.some((sg) => sg.seats.some((x) => !x))) return;

    // The document was just typed in, and keeping it is the whole reason
    // check-in is one tap on every visit after the first.
    saveProfile({
      ...toProfile(passengers[0]),
      card: get().savedCard,
      member: get().member,
    });

    const segments = target.segments.map((sg, segmentIndex): SegmentBooking => {
      const { option } = sg;
      // Unsigned throughout: a signed shift on a 32-bit hash produces negative
      // gates and negative sequence numbers, which is exactly what the first
      // pass printed on the pass.
      const h = hash(option.flightNo) >>> 0;
      const gate = `${"ABCDE"[h % 5]}${((h >>> 3) % 30) + 1}`;
      const terminal = String(((h >>> 8) % 4) + 1);
      const passes = passengers.map((passenger, i) => {
        const seat = sg.seats[i]!;
        const pass: Omit<BoardingPass, "bcbp"> = {
          pnr,
          leg,
          segmentIndex,
          passengerIndex: i,
          passenger,
          flightNo: option.flightNo,
          carrier: option.carrier,
          fromIata: option.from.iata,
          toIata: option.to.iata,
          departureUtc: option.departureUtc,
          seat,
          cabinClass,
          gate,
          terminal,
          // Boarding closes at the gate long before the aeroplane moves.
          boardingUtc: boardsUtc(option.departureUtc),
          // The same rule the fare screen quoted when this fare was chosen:
          // the group is what you bought and what you are, not where you sit.
          zone: boardingGroup(
            cabinClass,
            familyFor(cabinClass, get().fareFamily),
            zoneBumpFor(tierOf(get().member?.miles ?? 0)),
          ),
          // Everyone on one booking is checked in at the same desk, one after
          // the other, which is what a sequence number counts.
          sequence: ((h >>> 5) % 180) + 1 + i,
        };
        return { ...pass, bcbp: encodeBcbp(pass) };
      });
      return { ...sg, passes };
    });

    const next = { ...legs, [leg]: { ...target, segments } };
    const saved: Trip = {
      pnr,
      out: next.out,
      back: next.back,
      cabinClass,
      extraBags,
    };
    saveTrip(saved);
    set({
      legs: next,
      passLeg: leg,
      passSeg: 0,
      passIndex: 0,
      trip: saved,
      step: "boarding",
    });
  },

  /**
   * Move one leg of a booking that already exists. The list it opens is the
   * ordinary list of flights; what makes it a change rather than a purchase is
   * that the seat, the party and the reference all stay where they are, and
   * only the difference is charged.
   */
  upgradeCabin: () => {
    const { legs, pnr, cabinClass, fareFamily } = get();
    if (!pnr || !legs.out || cabinClass === "business") return;
    // Every seat goes back: the business cabin is a different room with
    // different seat numbers, and carrying 21A across to a cabin whose rows
    // stop at nine would be nonsense. The trip is saved in its new shape and
    // the seat map opens on the first aeroplane.
    const strip = (l: LegBooking | null) =>
      l
        ? {
            ...l,
            segments: l.segments.map((sg) => ({
              ...sg,
              seats: sg.seats.map(() => null),
              passes: [],
            })),
          }
        : null;
    const next: Legs = { out: strip(legs.out), back: strip(legs.back) };
    // Business carries two bags in the hold, so anything bought on top of an
    // economy allowance is money for something the new cabin already
    // includes.
    const saved: Trip = {
      pnr,
      out: next.out,
      back: next.back,
      cabinClass: "business",
      extraBags: 0,
    };
    saveTrip(saved);

    // The card earns at the cabin you fly in. Miles are a multiple of a
    // distance that has not changed, so the rows are scaled rather than
    // worked out again — and the balance moves with them.
    const was = milesFor(1000, cabinClass, familyFor(cabinClass, fareFamily));
    const now = milesFor(1000, "business", "flex");
    const { activity, delta } = repriceEarned(pnr, now / was);
    const member = get().member;

    set({
      cabinClass: "business",
      legs: next,
      trip: saved,
      leg: "out",
      segIndex: 0,
      paxIndex: 0,
      step: "seats",
      extraBags: 0,
      activity,
      ...(member ? { member: { ...member, miles: member.miles + delta } } : {}),
    });
  },

  startChange: (leg) => {
    const { query, legs } = get();
    const current = legs[leg];
    if (!current) return;
    const from = current.segments[0].option.from.iata;
    const to = current.segments[current.segments.length - 1].option.to.iata;
    // A change is always forward. Offering the day the original was booked on
    // is offering aeroplanes that have already gone.
    let date = current.segments[0].option.departureUtc.slice(0, 10);
    let options = searchItineraries({
      ...query,
      fromIata: from,
      toIata: to,
      date,
    });
    // A list whose only entry is the flight already booked is a list with
    // nothing on it: late in the evening the day being changed has one
    // departure left and it is the one in the booking. Move to the next day
    // that has something else, the way the search does.
    const booked = current.segments[0].option.flightNo;
    const useful = (found: typeof options) =>
      found.some((it) => it.segments[0].flightNo !== booked);
    if (!useful(options)) {
      // The day after the one being changed, which is the first day that can
      // hold a different aeroplane. `nextBookableDate` is no help here: it
      // answers "when can something be sold", and something can — the seat
      // already in this booking.
      const after = new Date(`${date}T12:00:00Z`).getTime() + 86400000;
      const nextDate = new Date(after).toISOString().slice(0, 10);
      const next = searchItineraries({
        ...query,
        fromIata: from,
        toIata: to,
        date: nextDate,
      });
      if (next.length) {
        date = nextDate;
        options = next;
      }
    }
    set({
      changing: leg,
      leg,
      options,
      step: "results",
      query: { ...query, fromIata: from, toIata: to, date },
      movedDay: false,
    });
  },

  proposeChange: (it) => {
    const leg = get().changing;
    if (leg) set({ pendingChange: { leg, it } });
  },

  confirmChange: () => {
    const { pendingChange, legs, cabinClass, passengers, pnr, extraBags } =
      get();
    if (!pendingChange || !pnr) return;
    const { leg, it } = pendingChange;
    // A different aeroplane is a different cabin, so the seats are offered
    // again rather than carried across a seat map they may not exist on.
    const next = {
      ...legs,
      [leg]: bookItinerary(it, cabinClass, passengers.length),
    };
    const saved: Trip = {
      pnr,
      out: next.out,
      back: next.back,
      cabinClass,
      extraBags,
    };
    saveTrip(saved);
    set({
      legs: next,
      trip: saved,
      changing: null,
      pendingChange: null,
      leg: "out",
      step: "trip",
    });
  },

  abandonChange: () =>
    set({ changing: null, pendingChange: null, step: "trip" }),

  cancelBooking: (refund) => {
    forgetTrip();
    // The miles go back with the money: a statement that lists a flight the
    // airline refunded is a statement nobody can reconcile.
    const pnr = get().pnr;
    const undone = pnr ? forgetEarned(pnr) : null;
    const member = get().member;
    set({
      ...(undone && member
        ? {
            activity: undone.activity,
            member: { ...member, miles: Math.max(0, member.miles - undone.miles) },
            earned: 0,
          }
        : {}),
      trip: null,
      legs: EMPTY_LEGS,
      pnr: null,
      extraBags: 0,
      changing: null,
      pendingChange: null,
      cancelled: refund,
      step: "search",
    });
  },

  clearCancelled: () => set({ cancelled: null }),

  /** Pick the booking back up where it was left. */
  openTrip: (leg = "out") => {
    const t = get().trip;
    if (!t) return;
    set({
      legs: { out: t.out, back: t.back },
      cabinClass: t.cabinClass,
      extraBags: t.extraBags,
      pnr: t.pnr,
      passLeg: leg,
      passSeg: 0,
      passIndex: 0,
      leg,
      segIndex: 0,
      // Always the list. Opening a tab straight onto a boarding pass is the
      // app deciding what you came for; the pass is two taps away and the
      // trip is what the tab is called.
      step: "booked",
    });
  },

  cancelTrip: () => {
    forgetTrip();
    set({
      trip: null,
      legs: EMPTY_LEGS,
      pnr: null,
      extraBags: 0,
      step: "search",
    });
  },

  go: (step) => set({ step }),
}));
