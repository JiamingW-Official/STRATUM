import type { Itinerary, LegBooking, SegmentBooking } from "./types";

// A leg is one or two aeroplanes, and almost every screen wants to talk about
// it as one journey: where it starts, where it ends, when it leaves, whether
// it has been checked in. Writing `segments[segments.length - 1].option.to`
// in nine files is how a data model stops being readable, so the sentences
// live here once.

export const firstSeg = (l: LegBooking): SegmentBooking => l.segments[0];
export const lastSeg = (l: LegBooking): SegmentBooking =>
  l.segments[l.segments.length - 1];

export const legFrom = (l: LegBooking) => firstSeg(l).option.from;
export const legTo = (l: LegBooking) => lastSeg(l).option.to;
export const legDepartureUtc = (l: LegBooking) => firstSeg(l).option.departureUtc;
export const legArrivalUtc = (l: LegBooking) => lastSeg(l).option.arrivalUtc;

/** Door to door, the time in the terminal included. */
export const legTotalMin = (l: LegBooking) =>
  l.segments.reduce((n, s) => n + s.option.blockMin, 0) +
  l.layoverMin.reduce((n, m) => n + m, 0);

export const legSeats = (l: LegBooking) => l.segments.flatMap((s) => s.seats);
export const legPasses = (l: LegBooking) => l.segments.flatMap((s) => s.passes);

/** A journey is checked in when every aeroplane on it has been. */
export const legCheckedIn = (l: LegBooking) =>
  l.segments.every((s) => s.passes.length > 0);

/** The airports changed at, in order. Empty on a nonstop. */
export const legStops = (l: LegBooking) =>
  l.segments.slice(0, -1).map((s) => s.option.to.iata);

// And the same sentences for a journey that has not been bought yet.

export const itFrom = (it: Itinerary) => it.segments[0].from;
export const itTo = (it: Itinerary) => it.segments[it.segments.length - 1].to;
export const itDepartureUtc = (it: Itinerary) => it.segments[0].departureUtc;
export const itArrivalUtc = (it: Itinerary) =>
  it.segments[it.segments.length - 1].arrivalUtc;
export const itStops = (it: Itinerary) =>
  it.segments.slice(0, -1).map((s) => s.to.iata);
export const itKey = (it: Itinerary) =>
  it.segments.map((s) => s.flightNo).join("+");
