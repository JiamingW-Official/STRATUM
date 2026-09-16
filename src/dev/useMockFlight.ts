import { useEffect } from "react";
import { useBench } from "./benchStore";
import { useCabin, useFlight } from "../flight-state/store";
import { blankSeat } from "../flight-state/store";
import { bearing, interpolate } from "../flight-state/geo";
import {
  AIRPORTS,
  altitudeFt,
  blockMinutes,
  buildTrack,
  groundSpeedKt,
  phaseAt,
  progressForPhase,
} from "./mockFlight";

const TICK_MS = 500;

/**
 * Drives the shared flight store from the bench's knobs. This is the only
 * place the simulation touches flight-state; every screen downstream reads the
 * same fields it will read from a real aircraft.
 */
export function useMockFlight() {
  const b = useBench();
  const patch = useFlight((s) => s.patch);

  // Advance the clock.
  useEffect(() => {
    if (!b.running) return;
    const from = AIRPORTS[b.fromIata];
    const to = AIRPORTS[b.toIata];
    const block = blockMinutes(from, to);
    const id = window.setInterval(() => {
      const s = useBench.getState();
      if (!s.running) return;
      const step = (TICK_MS / 1000) * s.speed;
      s.advance(s.progress + step / (block * 60));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [b.running, b.speed, b.fromIata, b.toIata]);

  // Project the knobs into flight state.
  useEffect(() => {
    const from = AIRPORTS[b.fromIata];
    const to = AIRPORTS[b.toIata];
    if (!from || !to) return;
    const block = blockMinutes(from, to);
    const progress = b.phaseOverride
      ? progressForPhase(b.phaseOverride)
      : b.progress;

    const departureUtc = new Date(
      Date.now() + b.departureOffsetMin * 60_000,
    ).toISOString();
    // ETA is departure plus block time, held steady rather than recomputed from
    // the current position — and it is marked inferred whenever the aircraft is
    // not being heard, because then it rests on dead reckoning.
    const etaUtc = new Date(
      Date.parse(departureUtc) + block * 60_000,
    ).toISOString();

    const here = interpolate(from, to, progress);
    const ahead = interpolate(from, to, Math.min(1, progress + 0.002));

    patch({
      flightNo: b.flightNo,
      route: { from, to },
      departureUtc,
      phase: b.phaseOverride ?? phaseAt(progress),
      position: {
        ...here,
        altFt: altitudeFt(progress),
        gsKt: groundSpeedKt(progress),
        headingDeg: bearing(here, ahead),
        heard: b.heard,
      },
      track: buildTrack(from, to, progress, departureUtc, block, b.gaps),
      etaUtc,
      etaInferred: !b.heard,
      paOverride: b.paOverride,
    });
  }, [
    b.fromIata,
    b.toIata,
    b.flightNo,
    b.departureOffsetMin,
    b.progress,
    b.phaseOverride,
    b.heard,
    b.gaps,
    b.paOverride,
    patch,
  ]);

  // A plausible cabin around this seat, so the lights the panel toggles have
  // somewhere to live.
  useEffect(() => {
    const seats: Record<string, ReturnType<typeof blankSeat>> = {};
    for (const row of [1, 2, 3]) {
      for (const letter of ["A", "C", "D", "F"]) {
        seats[`0${row}${letter}`] = blankSeat(`0${row}${letter}`, "business");
      }
    }
    for (const row of [11, 12, 13, 14]) {
      for (const letter of ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"]) {
        seats[`${row}${letter}`] = blankSeat(`${row}${letter}`, "economy");
      }
    }
    seats[b.seat] = blankSeat(b.seat, b.cabinClass);
    useCabin.getState().reset(seats);
  }, [b.seat, b.cabinClass]);
}
