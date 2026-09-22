import type {
  AircraftType,
  CabinMap,
  CabinRow,
  SeatCell,
  SeatZone,
} from "./types";
import type { CabinClass } from "../flight-state/types";
import { hash } from "./hash";

// The cabin, drawn as the aeroplane is actually laid out. Three Airbuses, and
// they are three different rooms — an A350 is nine abreast in threes, an A330
// is eight abreast with a wide middle block, an A320 is a single aisle. A seat
// map that draws them all the same is a seat map that has not looked at an
// aeroplane, and a passenger who has flown the route will know at a glance.
//
// Business is 1-2-1 on both wide-bodies, which is the arrangement that gives
// every seat its own way to the aisle, and 2-2 on the A320 because there is
// only one aisle to reach.
//
// I and J come and go from the letters on purpose. Airbus skips I everywhere —
// it reads as a 1 in a dark cabin — and which of the remaining letters are
// used depends on how many seats are in the row, which is why these are
// written out per aircraft instead of sliced off one alphabet.

type Deck = {
  /** The nose, on the aeroplanes long enough to have one. Not every fleet
   *  sells a first cabin and not every aircraft carries one: the single
   *  aisle has nowhere to put it. */
  first: { rows: [number, number]; blocks: string[][] } | null;
  business: { rows: [number, number]; blocks: string[][] };
  /** A cabin of its own, ahead of economy and a seat wider than it. */
  premium: { rows: [number, number]; blocks: string[][] };
  economy: { rows: [number, number]; blocks: string[][] };
  /** Rows beside a door or over the wing: more room, and rules about who sits there. */
  exitRows: number[];
  /** The rows the wing is under. No view, and the quietest seats on board. */
  wing: [number, number];
  /** How many rows at the front of economy are sold as "forward". */
  forwardRows: number;
};

const DECKS: Record<AircraftType, Deck> = {
  // 3-3-3, the one this work is built around.
  A350: {
    // 1-1-1: three suites across, each on its own aisle. Two rows of it.
    first: { rows: [1, 2], blocks: [["A"], ["F"], ["K"]] },
    business: { rows: [4, 9], blocks: [["A"], ["D", "G"], ["K"]] },
    // 2-4-2 where economy is 3-3-3: one seat narrower across, which is where
    // the width comes from.
    premium: {
      rows: [12, 16],
      blocks: [
        ["A", "C"],
        ["D", "E", "F", "G"],
        ["H", "K"],
      ],
    },
    economy: {
      rows: [20, 44],
      blocks: [
        ["A", "B", "C"],
        ["D", "E", "F"],
        ["G", "H", "K"],
      ],
    },
    exitRows: [20, 33],
    wing: [30, 40],
    forwardRows: 4,
  },
  // 2-4-2: narrower than the A350 by a seat, and the difference is all in the
  // middle block.
  A330: {
    first: { rows: [1, 2], blocks: [["A"], ["F"], ["K"]] },
    business: { rows: [4, 7], blocks: [["A"], ["D", "G"], ["K"]] },
    // 2-3-2 against economy's 2-4-2, so again the middle block gives up a
    // seat and everybody either side of it gets it.
    premium: {
      rows: [11, 14],
      blocks: [
        ["A", "C"],
        ["D", "E", "G"],
        ["H", "K"],
      ],
    },
    economy: {
      rows: [18, 42],
      blocks: [
        ["A", "C"],
        ["D", "E", "F", "G"],
        ["H", "K"],
      ],
    },
    exitRows: [18, 30],
    wing: [27, 36],
    forwardRows: 4,
  },
  // One aisle, so business is 2-2 and there is nothing to be in the middle of.
  A320: {
    first: null,
    business: {
      rows: [1, 3],
      blocks: [
        ["A", "C"],
        ["D", "F"],
      ],
    },
    // One aisle leaves nowhere to take a seat out of, so short-haul premium is
    // what it is on every European airline: the same row, further apart.
    premium: {
      rows: [5, 7],
      blocks: [
        ["A", "B", "C"],
        ["D", "E", "F"],
      ],
    },
    economy: {
      rows: [9, 31],
      blocks: [
        ["A", "B", "C"],
        ["D", "E", "F"],
      ],
    },
    exitRows: [12, 13],
    wing: [11, 17],
    forwardRows: 3,
  },
};

/**
 * Where the galleys and the lavatories are.
 *
 * A seat map that draws only seats is a seat map of half an aeroplane. Which
 * row is two metres from a lavatory door, and which is beside the galley that
 * has the lights on and the trolleys going all night, is the thing people
 * actually ask about a seat once they have found the window — and it is the
 * reason 31A and 33A are not the same seat at the same price.
 *
 * `at` is the row the band sits above, or the end of the cabin. `parts` is one
 * entry per block of seats, so a band lines up with the aeroplane rather than
 * floating across it. The A320 gets no band at its overwing exits on purpose:
 * there is no cross-aisle there, those two rows are just rows with a door
 * beside them.
 */
export type Band = { at: number | "end"; parts: Array<"wc" | "galley" | null> };

const SERVICE: Record<AircraftType, Record<CabinClass, Band[]>> = {
  A350: {
    first: [{ at: "end", parts: ["galley", "wc", "galley"] }],
    business: [{ at: "end", parts: ["wc", "galley", "wc"] }],
    premium: [{ at: "end", parts: ["wc", "galley", "wc"] }],
    economy: [
      { at: 20, parts: ["galley", "galley", "wc"] },
      { at: 33, parts: ["wc", "galley", "wc"] },
      { at: "end", parts: ["wc", "galley", "wc"] },
    ],
  },
  A330: {
    first: [{ at: "end", parts: ["galley", "wc", "galley"] }],
    business: [{ at: "end", parts: ["wc", "galley", "wc"] }],
    premium: [{ at: "end", parts: ["wc", "galley", "wc"] }],
    economy: [
      { at: 18, parts: ["galley", "galley", "wc"] },
      { at: 30, parts: ["wc", "galley", "wc"] },
      { at: "end", parts: ["wc", "galley", "wc"] },
    ],
  },
  A320: {
    first: [],
    business: [{ at: "end", parts: ["galley", "wc"] }],
    premium: [{ at: "end", parts: ["galley", "wc"] }],
    economy: [
      { at: 9, parts: ["galley", "wc"] },
      { at: "end", parts: ["galley", "wc"] },
    ],
  },
};

export function servicesFor(
  aircraft: AircraftType,
  cabinClass: CabinClass,
): Band[] {
  return SERVICE[aircraft][cabinClass];
}

/**
 * Which side of a row the galley is on, if it is on one at all.
 *
 * The two are not the same seat and it is worth two sentences: a row with the
 * galley behind it gets the light and the trolleys all night, and a row with
 * the galley in front of it has nothing to put a bag under.
 */
export function serviceSide(
  aircraft: AircraftType,
  cabinClass: CabinClass,
  row: number,
  lastRow: number,
): "front" | "behind" | null {
  const bands = servicesFor(aircraft, cabinClass);
  const behind = bands.some((b) =>
    b.at === "end" ? row === lastRow : b.at === row + 1,
  );
  if (behind) return "behind";
  return bands.some((b) => b.at === row) ? "front" : null;
}

/**
 * How full the aeroplane is, by zone rather than by cabin.
 *
 * An extra-legroom row is the last thing to go, because it is the thing people
 * have to pay extra for — which is also why the first version of this screen
 * had a colour for it that could never be seen: every exit row came back
 * sold out, and the one seat on the map worth pointing at was invisible. The
 * numbers below are the commercial fact, and the visual follows from it rather
 * than being arranged on top of it.
 */
const FILL: Record<SeatZone, number> = {
  first: 0.3,
  suite: 0.34,
  premium: 0.38,
  legroom: 0.14,
  forward: 0.4,
  standard: 0.52,
};

/** Derived from the flight number, so the same flight is the same aeroplane. */
function isTaken(flightNo: string, seat: string, zone: SeatZone) {
  return hash(`${flightNo}|${seat}`) / 0x100000000 < FILL[zone];
}

/** What a seat in a zone costs on top of the fare. */
export function surchargeFor(zone: SeatZone): number {
  return SURCHARGE[zone];
}

const SURCHARGE: Record<SeatZone, number> = {
  first: 0,
  suite: 0,
  // Choosing where you sit inside the cabin you paid extra for is not a second
  // thing to pay for.
  premium: 0,
  legroom: 45,
  forward: 22,
  standard: 12,
};

export function buildCabin(aircraft: AircraftType, flightNo: string): CabinMap {
  const deck = DECKS[aircraft];
  const columns = [
    ...(deck.first?.blocks ?? []),
    ...deck.business.blocks,
    ...deck.premium.blocks,
    ...deck.economy.blocks,
  ]
    .flat()
    .filter((c, i, a) => a.indexOf(c) === i);
  const rows: CabinRow[] = [];

  const push = (
    cabinClass: CabinClass,
    range: [number, number],
    blocks: string[][],
  ) => {
    for (let row = range[0]; row <= range[1]; row++) {
      const exitRow = cabinClass === "economy" && deck.exitRows.includes(row);
      const cells: Array<SeatCell | null> = [];
      blocks.forEach((block, bi) => {
        if (bi > 0) cells.push(null);
        block.forEach((column, ci) => {
          const seat = `${row}${column}`;
          const zone: SeatZone =
            cabinClass === "first"
              ? "first"
              : cabinClass === "business"
                ? "suite"
                : cabinClass === "premium"
                ? "premium"
                : exitRow
                ? "legroom"
                : row < range[0] + deck.forwardRows
                  ? "forward"
                  : "standard";
          const last = bi === blocks.length - 1;
          cells.push({
            seat,
            row,
            column,
            cabinClass,
            zone,
            taken: isTaken(flightNo, seat, zone),
            exitRow,
            window: bi === 0 ? ci === 0 : last && ci === block.length - 1,
            aisle:
              (bi === 0 && ci === block.length - 1) ||
              (last && ci === 0) ||
              (bi > 0 && !last && (ci === 0 || ci === block.length - 1)),
            surcharge: SURCHARGE[zone],
            overWing:
              cabinClass === "economy" &&
              row >= deck.wing[0] &&
              row <= deck.wing[1],
          });
        });
      });
      rows.push({
        row,
        cabinClass,
        exitRow,
        overWing:
          cabinClass === "economy" &&
          row >= deck.wing[0] &&
          row <= deck.wing[1],
        cells,
      });
    }
  };

  if (deck.first) push("first", deck.first.rows, deck.first.blocks);
  push("business", deck.business.rows, deck.business.blocks);
  push("premium", deck.premium.rows, deck.premium.blocks);
  push("economy", deck.economy.rows, deck.economy.blocks);

  return { aircraft, columns, rows };
}

/**
 * What you are actually buying, in centimetres.
 *
 * A seat map that prices a seat and will not say how big it is is asking for
 * money for a letter on a grid. Every booking engine worth using tells you the
 * pitch when you tap a seat, because pitch is the difference between a flight
 * you can sleep on and one you cannot. These are the real figures for these
 * aircraft: 79 cm on a wide-body, a little less on the single aisle, six
 * inches more in an exit row, and a bed at the front.
 */
export function seatDetail(
  aircraft: AircraftType,
  cell: SeatCell,
  lastRow = 0,
): { pitch: string; width: string; place: string; note: string } {
  const place = cell.window ? "Window" : cell.aisle ? "Aisle" : "Middle";
  // The galley is drawn on the map, so the seat beside it says what that
  // means. This is the one fact about a seat that people find out too late.
  const service = serviceSide(aircraft, cell.cabinClass, cell.row, lastRow);
  if (cell.cabinClass === "first") {
    return {
      pitch: "208 cm bed",
      width: "66 cm",
      place,
      note: "A suite with a door",
    };
  }
  if (cell.cabinClass === "business") {
    return aircraft === "A320"
      ? {
          pitch: "91 cm",
          width: "51 cm",
          place,
          note: "Recliner, empty middle seat",
        }
      : {
          pitch: "198 cm bed",
          width: "53 cm",
          place,
          note: "Lie-flat, direct aisle access",
        };
  }
  const base = aircraft === "A320" ? 76 : 79;
  // What the cabin is actually for. On a wide-body it is a seat three inches
  // wider in a row one seat narrower; on the single aisle there is nowhere to
  // take a seat out of, so all of it is pitch.
  if (cell.cabinClass === "premium") {
    return aircraft === "A320"
      ? {
          pitch: `${base + 13} cm`,
          width: "46 cm",
          place,
          note: "Empty middle seat, off before economy",
        }
      : {
          pitch: "96 cm",
          width: "49 cm",
          place,
          note:
            service === "behind"
              ? "Off before economy · galley behind"
              : "Off the aeroplane before economy",
        };
  }
  if (cell.zone === "legroom") {
    return {
      pitch: `${base + 15} cm`,
      width: "46 cm",
      place,
      note:
        service === "behind"
          ? "Crew will ask whether you can help at the door · galley behind"
          : "Crew will ask whether you can help at the door",
    };
  }
  return {
    pitch: `${base} cm`,
    width: "46 cm",
    place,
    // Never repeats the zone it is shown beside: "Forward cabin · Forward
    // cabin · off first" is the kind of line that gets written when two
    // labels are chosen in different places.
    note:
      service === "behind"
        ? "Galley and lavatories behind — light and traffic all night"
        : service === "front"
          ? "Galley in front, so nothing to put a bag under"
          : cell.overWing
            ? "Over the wing — no view, and the quietest part of the aeroplane"
            : cell.zone === "forward"
              ? "Off the aeroplane first"
              : "",
  };
}

export function findSeat(map: CabinMap, seat: string): SeatCell | null {
  for (const row of map.rows) {
    for (const cell of row.cells) if (cell && cell.seat === seat) return cell;
  }
  return null;
}

/**
 * Seats next to each other, for a party travelling together.
 *
 * A booking engine that seats three people in three different rows has done
 * the arithmetic and not the job. "Next to each other" means in one row and
 * in one block: 21A-B-C are together, 21C and 21D are not, because there is an
 * aisle between them and that is the whole point of asking.
 */
export function findTogether(
  map: CabinMap,
  cabinClass: CabinClass,
  count: number,
): string[] | null {
  if (count <= 1) {
    const one = firstFree(map, cabinClass);
    return one ? [one] : null;
  }
  let best: string[] | null = null;
  for (const row of map.rows) {
    if (row.cabinClass !== cabinClass) continue;
    let run: SeatCell[] = [];
    // A null is an aisle, and an aisle ends a run. The trailing null closes
    // the last block of the row.
    for (const cell of [...row.cells, null]) {
      if (!cell || cell.taken) {
        run = [];
        continue;
      }
      run.push(cell);
      if (run.length >= count) {
        const take = run.slice(-count);
        // Prefer a row nobody pays extra for: sitting together should not
        // quietly cost a party three legroom surcharges.
        if (take.every((c) => c.zone !== "legroom"))
          return take.map((c) => c.seat);
        best ??= take.map((c) => c.seat);
      }
    }
  }
  return best;
}

/** Whether these seats are in one row with nothing between them. */
export function areTogether(
  map: CabinMap,
  seats: Array<string | null>,
): boolean {
  const filled = seats.filter((x): x is string => Boolean(x));
  if (filled.length !== seats.length) return false;
  if (filled.length <= 1) return true;
  for (const row of map.rows) {
    const cols = row.cells.map((c) => c?.seat ?? null);
    const at = filled.map((x) => cols.indexOf(x));
    if (at.some((i) => i === -1)) continue;
    const sorted = [...at].sort((a, b) => a - b);
    const gapless = sorted.every((v, i) => i === 0 || v === sorted[i - 1] + 1);
    const noAisle = sorted.every((v) => row.cells[v] !== null);
    return gapless && noAisle;
  }
  return false;
}

/**
 * The seat offered to a passenger who has not chosen one.
 *
 * Never an exit row. Extra legroom is the expensive seat, and an airline that
 * quietly drops you into one and then charges you for it is running a trick —
 * it also made the map unreadable, because the offered seat and the legroom
 * seats were both brass and sat in the same row.
 */
export function firstFree(
  map: CabinMap,
  cabinClass: CabinClass,
  /** Seats already handed to somebody else on this booking. */
  skip: ReadonlySet<string> = new Set(),
): string | null {
  let fallback: string | null = null;
  for (const row of map.rows) {
    if (row.cabinClass !== cabinClass) continue;
    for (const cell of row.cells) {
      if (!cell || cell.taken || skip.has(cell.seat)) continue;
      if (cell.zone !== "legroom") return cell.seat;
      fallback ??= cell.seat;
    }
  }
  // Only if the whole cabin is exit rows, which no aeroplane is.
  return fallback;
}

/**
 * What is at the seat, by the aeroplane it is on.
 *
 * A seat map that will take money for a seat and says nothing about what is
 * fitted to it is asking to be paid for a letter on a grid — the same argument
 * as the pitch, one step further. These are the ordinary fits: a modern
 * wide-body has a screen at every seat, a socket and a satellite connection;
 * a single-aisle on a short hop has the socket and nothing else, because
 * fitting screens to an aeroplane that flies ninety-minute sectors is money
 * nobody spends.
 */
export function amenities(
  aircraft: AircraftType,
  cabinClass: CabinClass,
): { screen: string | null; power: boolean; wifi: boolean } {
  if (aircraft === "A320") {
    return { screen: null, power: true, wifi: false };
  }
  return {
    screen: cabinClass === "business" ? "18-inch screen" : "13-inch screen",
    power: true,
    wifi: true,
  };
}

/** Whether this aircraft carries the cabin at all. */
export function hasCabin(aircraft: AircraftType, cabinClass: CabinClass): boolean {
  return cabinClass !== "first" || DECKS[aircraft].first !== null;
}
