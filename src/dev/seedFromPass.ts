import { decodeBcbp } from "../booking/bcbp";
import { AIRPORTS } from "../flight-state/airports";
import type { BenchState } from "./benchStore";
import type { SeatBooking } from "../flight-state/types";

/**
 * Turn a scanned boarding pass into the bench's knobs.
 *
 * This is the join between the two surfaces and it deliberately goes through
 * the document rather than through a store: booking writes a pass, the pass is
 * a sixty character string anyone can read, and the cabin is seeded by
 * whatever walks up to it holding one. Nothing in src/booking imports the
 * bench and nothing in src/ife imports either — the only thing that crosses is
 * the pass, which is exactly what crosses at a real gate.
 *
 * The departure instant rides alongside the pass because Resolution 792 has
 * nowhere to put it: a boarding pass carries a day of the year and no time.
 */
export type Scanned = {
  bench: Partial<BenchState>;
  /** What the seat itself learns from the pass, and nobody else does. */
  booking: SeatBooking;
};

export function seedFromPass(search: string): Scanned | null {
  const params = new URLSearchParams(search);
  const raw = params.get("bp");
  if (!raw) return null;

  const pass = decodeBcbp(raw);
  if (!pass) return null;
  if (!AIRPORTS[pass.fromIata] || !AIRPORTS[pass.toIata]) return null;

  const dep = params.get("dep");
  const departureOffsetMin = dep
    ? Math.round((new Date(dep).getTime() - Date.now()) / 60000)
    : 0;

  return {
    bench: {
      seat: pass.seat,
      cabinClass: pass.cabinClass,
      fromIata: pass.fromIata,
      toIata: pass.toIata,
      flightNo: pass.flightNo,
      departureOffsetMin,
      // A scanned pass puts you at the gate, not half way across the Atlantic.
      progress: 0,
      gaps: [],
      phaseOverride: null,
    },
    booking: {
      pnr: pass.pnr,
      cabinClass: pass.cabinClass,
      bags: Math.max(0, Number(params.get("bags") ?? 1)) || 1,
      tier: params.get("tier") ?? undefined,
      onward:
        params.get("on") && params.get("onTo") && params.get("onAt")
          ? {
              flightNo: params.get("on")!,
              toIata: params.get("onTo")!,
              departsUtc: params.get("onAt")!,
            }
          : undefined,
    },
  };
}
