/**
 * Sudoku, generated on the seat.
 *
 * A seat-back game cannot ship a book of puzzles and cannot ask the network
 * for one, so it makes them: build a solved grid, shuffle it in the ways that
 * keep it solved, then carve holes out of it while checking after every cut
 * that exactly one solution survives. The last part is the part that matters —
 * a puzzle with two answers is not a puzzle, and "no guessing needed" has to
 * be true or the game is a slot machine.
 */
export type Grid = number[]; // 81 cells, 0 = empty

const ROWS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function peers(i: number): number[] {
  const r = Math.floor(i / 9);
  const c = i % 9;
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  const out = new Set<number>();
  for (const k of ROWS) {
    out.add(r * 9 + k);
    out.add(k * 9 + c);
  }
  for (let dr = 0; dr < 3; dr++)
    for (let dc = 0; dc < 3; dc++) out.add((br + dr) * 9 + bc + dc);
  out.delete(i);
  return [...out];
}

const PEERS = Array.from({ length: 81 }, (_, i) => peers(i));

export function isLegal(g: Grid, i: number, v: number): boolean {
  return !PEERS[i].some((p) => g[p] === v);
}

/** Counts solutions, stopping at `cap` — two is all we ever need to know. */
function countSolutions(g: Grid, cap = 2): number {
  const i = g.indexOf(0);
  if (i === -1) return 1;
  let n = 0;
  for (let v = 1; v <= 9; v++) {
    if (!isLegal(g, i, v)) continue;
    g[i] = v;
    n += countSolutions(g, cap - n);
    g[i] = 0;
    if (n >= cap) break;
  }
  return n;
}

function shuffled<T>(a: T[]): T[] {
  const out = a.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function fill(g: Grid): boolean {
  const i = g.indexOf(0);
  if (i === -1) return true;
  for (const v of shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
    if (!isLegal(g, i, v)) continue;
    g[i] = v;
    if (fill(g)) return true;
    g[i] = 0;
  }
  return false;
}

export type Difficulty = "easy" | "medium" | "hard";
const HOLES: Record<Difficulty, number> = { easy: 38, medium: 46, hard: 52 };

export type Puzzle = { puzzle: Grid; solution: Grid; given: boolean[] };

export function generate(difficulty: Difficulty = "easy"): Puzzle {
  const solution: Grid = new Array(81).fill(0);
  fill(solution);

  const puzzle = solution.slice();
  // Cut in pairs about the centre. It is how printed puzzles look, and the
  // symmetry is the only decoration a sudoku gets.
  const order = shuffled(ROWS.flatMap((r) => ROWS.map((c) => r * 9 + c)));
  let holes = 0;
  for (const i of order) {
    if (holes >= HOLES[difficulty]) break;
    const j = 80 - i;
    if (puzzle[i] === 0) continue;
    const a = puzzle[i];
    const b = puzzle[j];
    puzzle[i] = 0;
    puzzle[j] = 0;
    if (countSolutions(puzzle.slice()) !== 1) {
      puzzle[i] = a;
      puzzle[j] = b;
      continue;
    }
    holes += i === j ? 1 : 2;
  }

  return { puzzle, solution, given: puzzle.map((v) => v !== 0) };
}
