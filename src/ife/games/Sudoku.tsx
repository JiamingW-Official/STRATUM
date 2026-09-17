import { useMemo, useState } from "react";
import { useT } from "../i18n";
import { GameFrame } from "../screens/Games";
import { generate, isLegal, type Difficulty, type Grid } from "./sudokuEngine";

/**
 * The classic every cabin carries, generated on the seat rather than shipped
 * as a book of puzzles. Every board it deals has exactly one solution, checked
 * at generation time — "no guessing needed" is a promise, not a slogan.
 */
export function Sudoku({ onBack }: { onBack: () => void }) {
  const { t } = useT();
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [seed, setSeed] = useState(0);
  const deal = useMemo(() => generate(difficulty), [difficulty, seed]);
  const [grid, setGrid] = useState<Grid>(() => deal.puzzle.slice());
  const [sel, setSel] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);

  // A new deal resets the board it belongs to.
  const reset = (d: Difficulty = difficulty) => {
    setDifficulty(d);
    setSeed((s) => s + 1);
    setChecked(false);
    setSel(null);
  };
  const board = deal.puzzle === grid ? grid : grid;
  const solved = board.every((v, i) => v === deal.solution[i]);
  const wrong = checked
    ? board.filter((v, i) => v !== 0 && v !== deal.solution[i]).length
    : 0;

  // Keep the board in step with a fresh deal without an effect: when the deal
  // changes identity, the given cells will not match and the board is rebuilt.
  const stale = deal.given.some((g, i) => g && board[i] !== deal.puzzle[i]);
  if (stale) setGrid(deal.puzzle.slice());

  const place = (v: number) => {
    if (sel === null || deal.given[sel]) return;
    const next = board.slice();
    next[sel] = next[sel] === v ? 0 : v;
    setGrid(next);
  };

  return (
    <GameFrame
      title={t("sudoku")}
      onBack={onBack}
      aside={
        <div className="ife-game-tools">
          {(["easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              className="ife-chip"
              data-on={difficulty === d}
              onClick={() => reset(d)}
            >
              {t(d)}
            </button>
          ))}
          <button className="ife-btn" onClick={() => reset()}>
            {t("newGame")}
          </button>
          <button className="ife-btn" onClick={() => setChecked(true)}>
            {t("check")}
          </button>
        </div>
      }
    >
      <div className="ife-sudoku">
        <div className="ife-sudoku-board" role="grid">
          {board.map((v, i) => {
            const given = deal.given[i];
            const bad = checked && v !== 0 && v !== deal.solution[i];
            const peerOfSel =
              sel !== null &&
              v !== 0 &&
              board[sel] !== 0 &&
              v === board[sel];
            return (
              <button
                key={i}
                className="ife-cell"
                data-given={given}
                data-sel={sel === i}
                data-bad={bad}
                data-match={peerOfSel}
                data-edge-r={i % 3 === 2 && i % 9 !== 8}
                data-edge-b={Math.floor(i / 9) % 3 === 2 && i < 72}
                onClick={() => setSel(i)}
              >
                {v === 0 ? "" : v}
              </button>
            );
          })}
        </div>

        <div className="ife-sudoku-side">
          <div className="ife-pad-keys">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => (
              <button
                key={v}
                className="ife-key"
                onClick={() => place(v)}
                disabled={sel === null || deal.given[sel]}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="ife-sudoku-state">
            {solved ? (
              <span className="ife-sudoku-solved">{t("solved")}</span>
            ) : checked ? (
              <span className="ife-mono">
                {t("mistakes")} · {wrong}
              </span>
            ) : (
              <span className="ife-cap">{t("sudokuSub")}</span>
            )}
          </div>
        </div>
      </div>
    </GameFrame>
  );
}

/** Kept honest: the legality check the board uses is the generator's own. */
export const _legal = isLegal;
