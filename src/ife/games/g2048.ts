/**
 * 2048, as an engine with no screen attached.
 *
 * It is here for the same reason the sudoku generator is: the rules are the
 * game, and rules belong somewhere they can be checked. The merge rule in
 * particular is the one everybody gets wrong — a tile that has just merged
 * cannot merge again in the same move, and the tile furthest along the
 * direction of travel merges first — so it is written once, in one place,
 * with the cases in the test.
 */

/** Sixteen cells, row-major, 0 for empty. */
export type Board = number[];
export type Move = "up" | "down" | "left" | "right";

export const SIZE = 4;
const CELLS = SIZE * SIZE;

export function empty(): Board {
  return new Array(CELLS).fill(0);
}

/**
 * One line of four, in the order they travel. Left and up read forwards,
 * right and down read backwards — which is what makes one merge routine
 * enough for all four directions.
 */
function lineIndices(move: Move, n: number): number[] {
  const ix: number[] = [];
  for (let i = 0; i < SIZE; i++) {
    ix.push(
      move === "left" || move === "right" ? n * SIZE + i : i * SIZE + n,
    );
  }
  return move === "right" || move === "down" ? ix.reverse() : ix;
}

/** Compact, then merge in travel order, then pad. Returns the score gained. */
function collapse(line: number[]): { line: number[]; gained: number } {
  const tiles = line.filter((v) => v !== 0);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === tiles[i + 1]) {
      const merged = tiles[i] * 2;
      out.push(merged);
      gained += merged;
      // Skip the tile that was absorbed, which is also what stops the new
      // tile merging a second time in this move.
      i++;
    } else {
      out.push(tiles[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { line: out, gained };
}

export function slide(
  board: Board,
  move: Move,
): { board: Board; gained: number; moved: boolean } {
  const next = board.slice();
  let gained = 0;
  let moved = false;
  for (let n = 0; n < SIZE; n++) {
    const ix = lineIndices(move, n);
    const before = ix.map((i) => board[i]);
    const { line, gained: g } = collapse(before);
    gained += g;
    for (let k = 0; k < SIZE; k++) {
      if (next[ix[k]] !== line[k]) moved = true;
      next[ix[k]] = line[k];
    }
  }
  return { board: next, gained, moved };
}

/** A 2 nine times out of ten, a 4 the tenth, in a cell chosen from the free ones. */
export function spawn(board: Board, rnd: () => number = Math.random): Board {
  const free: number[] = [];
  for (let i = 0; i < CELLS; i++) if (board[i] === 0) free.push(i);
  if (free.length === 0) return board;
  const next = board.slice();
  next[free[Math.floor(rnd() * free.length)]] = rnd() < 0.9 ? 2 : 4;
  return next;
}

export function deal(rnd: () => number = Math.random): Board {
  return spawn(spawn(empty(), rnd), rnd);
}

/** Is there anything left to do? Over means no direction changes anything. */
export function canMove(board: Board): boolean {
  return (["up", "down", "left", "right"] as Move[]).some(
    (m) => slide(board, m).moved,
  );
}

export function highest(board: Board): number {
  return board.reduce((a, v) => (v > a ? v : a), 0);
}
