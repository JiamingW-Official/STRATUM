import { create } from "zustand";
import type {
  CabinMessage,
  FlightState,
  SeatPrivate,
  SeatPublic,
  ScreenName,
  CabinClass,
  SeatBooking,
  Lang,
} from "./types";

// Three stores rather than three slices of one: a screen that only draws the
// reading light should not re-render when the aircraft moves, and the split is
// the cheapest way to say so. It also mirrors how these will arrive over the
// wire later — flight state broadcast, seat state per-seat.

type FlightStore = FlightState & {
  patch: (p: Partial<FlightState>) => void;
};

export const useFlight = create<FlightStore>((set) => ({
  // Placeholder until the bench (or, later, the flight room) seeds it.
  flightNo: "——",
  route: {
    from: EMPTY_AIRPORT(),
    to: EMPTY_AIRPORT(),
  },
  departureUtc: new Date().toISOString(),
  phase: "boarding",
  position: { lat: 0, lon: 0, altFt: 0, gsKt: 0, headingDeg: 0, heard: false },
  track: [],
  connections: [],
  etaUtc: new Date().toISOString(),
  etaInferred: true,
  paOverride: null,
  patch: (p) => set(p),
}));

function EMPTY_AIRPORT() {
  return {
    iata: "———",
    icao: "————",
    city: { en: "", zh: "" },
    name: { en: "", zh: "" },
    country: { en: "", zh: "" },
    cc: "",
    lat: 0,
    lon: 0,
    tz: "UTC",
  };
}

type CabinStore = {
  /** Keyed by seat number. The bench fills a plausible cabin; the real one
   *  will be filled by whoever is actually on board. */
  seats: Record<string, SeatPublic>;
  setSeat: (seat: string, p: Partial<SeatPublic>) => void;
  reset: (seats: Record<string, SeatPublic>) => void;
  /**
   * Every seat-to-seat message on the aircraft, in one list, in the layer the
   * whole cabin can read. That is deliberate, it is what a real system does,
   * and CabinMessage says why.
   */
  messages: CabinMessage[];
  post: (m: Omit<CabinMessage, "id" | "sentUtc" | "seenUtc">) => void;
  markSeen: (reader: string, withSeat: string) => void;
};

export const useCabin = create<CabinStore>((set) => ({
  seats: {},
  setSeat: (seat, p) =>
    set((s) => ({
      seats: {
        ...s.seats,
        [seat]: {
          ...(s.seats[seat] ?? blankSeat(seat)),
          ...p,
        },
      },
    })),
  reset: (seats) => set({ seats, messages: [] }),
  messages: [],
  post: (m) =>
    set((s) => ({
      messages: [
        ...s.messages,
        {
          ...m,
          id:
            globalThis.crypto?.randomUUID?.() ??
            `${Date.now()}-${s.messages.length}`,
          sentUtc: new Date().toISOString(),
          seenUtc: null,
        },
      ],
    })),
  // Only what was addressed to the reader, and only what has not been seen
  // already: a seen time is the first time, not the latest.
  markSeen: (reader, withSeat) =>
    set((s) => {
      const now = new Date().toISOString();
      let touched = false;
      const messages = s.messages.map((m) => {
        if (m.to === reader && m.from === withSeat && m.seenUtc === null) {
          touched = true;
          return { ...m, seenUtc: now };
        }
        return m;
      });
      return touched ? { messages } : {};
    }),
}));

export function blankSeat(
  seat: string,
  cabinClass: CabinClass = "economy",
): SeatPublic {
  return {
    seat,
    cabinClass,
    occupied: true,
    readingLight: false,
    callAttendant: false,
  };
}

type SelfStore = SeatPrivate & {
  setStarted: (v: boolean) => void;
  setMode: (m: SeatPrivate["mode"]) => void;
  /** Which seat this screen belongs to. */
  seat: string;
  setSeat: (seat: string) => void;
  setScreen: (screen: ScreenName) => void;
  setLang: (lang: Lang) => void;
  setVolume: (v: number) => void;
  setMedia: (m: SeatPrivate["media"]) => void;
  setBooking: (b: SeatBooking | undefined) => void;
};

export const useSelf = create<SelfStore>((set) => ({
  started: false,
  mode: null,
  setStarted: (started) => set({ started }),
  setMode: (mode) => set({ mode }),
  seat: "01A",
  screen: "idle",
  lang: "en",
  volume: 0.6,
  media: undefined,
  setSeat: (seat) => set({ seat }),
  setScreen: (screen) => set({ screen }),
  setLang: (lang) => set({ lang }),
  setVolume: (volume) => set({ volume }),
  setMedia: (media) => set({ media }),
  booking: undefined,
  setBooking: (booking) => set({ booking }),
}));
