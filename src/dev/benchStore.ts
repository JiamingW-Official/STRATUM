import { create } from "zustand";
import type { CabinClass, FlightPhase } from "../flight-state/types";

/**
 * Everything the simulation panel can reach. Kept separate from flight-state
 * on purpose: none of this exists on a real flight, and nothing in src/ife may
 * import it. If a screen ever needs a value from here, that value belongs in
 * flight-state instead.
 */
export type BenchState = {
  seat: string;
  cabinClass: CabinClass;
  fromIata: string;
  toIata: string;
  flightNo: string;
  /** Minutes from now; negative means already airborne. */
  departureOffsetMin: number;

  /** Wall-clock multiplier for the simulated flight. */
  speed: 1 | 10 | 60;
  running: boolean;
  /** 0 at the gate, 1 at the stand. Scrubbed directly by the timeline. */
  progress: number;
  phaseOverride: FlightPhase | null;

  /** Is a receiver hearing the aircraft right now? */
  heard: boolean;
  /** Progress ranges nobody heard, accumulated as `heard` is switched off. */
  gaps: Array<[number, number]>;
  /** Whether the ground has sent up a departure board for the destination. */
  connections: boolean;

  paOverride: null | "safety" | "captain";

  set: (p: Partial<BenchState>) => void;
  /**
   * The only way progress moves. It records the gap here rather than at the
   * call sites so that scrubbing the timeline with the receiver switched off
   * leaves the same hole in the track that letting the clock run does.
   */
  advance: (to: number) => void;
};

export const useBench = create<BenchState>((set) => ({
  seat: "12K",
  cabinClass: "economy",
  fromIata: "JFK",
  toIata: "LHR",
  flightNo: "STR 001",
  departureOffsetMin: -120,

  speed: 60,
  running: true,
  progress: 0.32,
  phaseOverride: null,

  heard: true,
  gaps: [],
  connections: true,

  paOverride: null,

  set: (p) => set(p),
  advance: (to) =>
    set((s) => {
      const progress = Math.min(1, Math.max(0, to));
      if (s.heard) return { progress };
      const from = s.progress;
      const last = s.gaps[s.gaps.length - 1];
      // Grow the open gap if this continues it; otherwise open a new one.
      const gaps =
        last && Math.abs(from - last[1]) < 0.02
          ? [...s.gaps.slice(0, -1), [last[0], progress] as [number, number]]
          : [...s.gaps, [Math.min(from, progress), progress] as [number, number]];
      return { progress, gaps };
    }),
}));
