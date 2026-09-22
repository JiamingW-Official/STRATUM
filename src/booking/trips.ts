import type { LegBooking } from "./types";
import type { CabinClass } from "../flight-state/types";

// The trip, kept between visits.
//
// Everything else in this app was already durable — the name, the document,
// the recognised card — and the one thing that was not was the thing the whole
// flow exists to produce. A booking that disappears when the tab does is not a
// booking, it is a demo, and every airline app in the world opens on the trip
// you have coming rather than on an empty search form.
//
// One trip, not a list. This is a surface for the flight you are about to
// take; a booking history is a different screen with a different job.

const KEY = "stratum.air.trip";

export type Trip = {
  pnr: string;
  out: LegBooking | null;
  /** Null on a one-way. */
  back: LegBooking | null;
  cabinClass: CabinClass;
  extraBags: number;
};

export function loadTrip(): Trip | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const t = JSON.parse(raw) as Trip;
    if (!t?.pnr || !t.out?.segments?.[0]?.option?.departureUtc) return null;
    // A trip is over when its last aeroplane has landed. A stale pass on the
    // home screen is worse than none — and on a return booking the outbound
    // being in the past does not mean the trip is, which is the whole reason
    // this reads the last leg rather than the first.
    const home = t.back ?? t.out;
    const last = home.segments[home.segments.length - 1].option;
    if (Date.parse(last.arrivalUtc) < Date.now() - 6 * 60 * 60000) {
      forgetTrip();
      return null;
    }
    return t;
  } catch {
    return null;
  }
}

export function saveTrip(trip: Trip): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(trip));
  } catch {
    // Storage blocked. The booking still works; it just will not be here
    // tomorrow, and the home screen simply has nothing to show.
  }
}

export function forgetTrip(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing to do */
  }
}
