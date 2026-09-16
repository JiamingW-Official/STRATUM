import { useCabin } from "../flight-state/store";
import type { IFEBridge } from "../flight-state/types";

/**
 * The bench's bridge: every action lands in the mock cabin store and nowhere
 * else. In the 3D cabin the same calls will light a lamp above the seat and
 * reach the other passengers; the IFE never finds out which one it is holding.
 */
export function createMockBridge(seat: string): IFEBridge {
  return {
    setReadingLight(on) {
      useCabin.getState().setSeat(seat, { readingLight: on });
    },
    callAttendant(on) {
      useCabin.getState().setSeat(seat, { callAttendant: on });
    },
  };
}
