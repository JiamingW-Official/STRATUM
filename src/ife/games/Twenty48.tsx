import { useRef, useState } from "react";
import { useT } from "../i18n";
import { GameFrame } from "../screens/Games";
import { canMove, deal, highest, slide, type Board, type Move } from "./g2048";

/**
 * 2048 on a seat back.
 *
 * The rules are in g2048.ts with their cases in a test; this file is the
 * glass. Two things about it are cabin decisions rather than web ones:
 *
 * A finger, not a keyboard. The board reads a swipe, and it reads it from
 * `offsetX/offsetY` — the element's own coordinates — rather than from
 * clientX/clientY. On the bench the two are the same; on a seat back, where
 * this layer will sit under a CSS 3D transform, a client-space delta is the
 * *projected* movement and a diagonal panel would turn every swipe. The arrow
 * keys work too, which is for the bench, not for the seat.
 *
 * Two things had to be true for that to work, and neither was obvious. The
 * tiles take no pointer events, because `offsetX` is measured from whatever
 * the event hit — with the cells in the way, a swipe was measured from one
 * cell's corner to another's and the delta was nonsense. And the board takes
 * pointer capture, so a swipe that runs off its edge still finishes on it.
 *
 * And the tiles are one colour. 2048 is usually a rainbow, which on this glass
 * would be the only rainbow; here the value is the amount of brass, so the
 * board gets warmer as it fills and the 2048 tile is the accent at full
 * strength.
 */
const SWIPE = 28;

export function Twenty48({ onBack }: { onBack: () => void }) {
  const { t } = useT();
  const [board, setBoard] = useState<Board>(() => deal());
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const from = useRef<{ x: number; y: number } | null>(null);

  const restart = () => {
    setBoard(deal());
    setScore(0);
  };

  const go = (move: Move) => {
    const next = slide(board, move);
    if (!next.moved) return;
    // The new tile arrives after the move, never before it: a tile that
    // appeared mid-slide would merge with something it never touched.
    const withSpawn = spawnInto(next.board);
    setBoard(withSpawn);
    setScore((s) => {
      const total = s + next.gained;
      setBest((b) => (total > b ? total : b));
      return total;
    });
  };

  const over = !canMove(board);
  const top = highest(board);

  return (
    <GameFrame
      title="2048"
      onBack={onBack}
      aside={
        <div className="ife-game-tools">
          <span className="ife-2048-score">
            <span className="ife-cap">{t("score")}</span>
            <span className="ife-mono">{score.toLocaleString("en-US")}</span>
          </span>
          <span className="ife-2048-score">
            <span className="ife-cap">{t("best")}</span>
            <span className="ife-mono">{best.toLocaleString("en-US")}</span>
          </span>
          <button className="ife-btn" onClick={restart}>
            {t("newGame")}
          </button>
        </div>
      }
    >
      <div className="ife-2048">
        <div
          className="ife-2048-board"
          role="grid"
          tabIndex={0}
          aria-label="2048"
          onPointerDown={(e) => {
            // Capture, so a swipe that runs off the edge of the board still
            // ends on the board: without it the pointerup lands on whatever
            // is underneath and the gesture is simply lost.
            e.currentTarget.setPointerCapture(e.nativeEvent.pointerId);
            from.current = {
              x: e.nativeEvent.offsetX,
              y: e.nativeEvent.offsetY,
            };
          }}
          onPointerUp={(e) => {
            const a = from.current;
            from.current = null;
            if (!a) return;
            const dx = e.nativeEvent.offsetX - a.x;
            const dy = e.nativeEvent.offsetY - a.y;
            if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE) return;
            if (Math.abs(dx) > Math.abs(dy)) go(dx > 0 ? "right" : "left");
            else go(dy > 0 ? "down" : "up");
          }}
          onKeyDown={(e) => {
            const m = (
              {
                ArrowUp: "up",
                ArrowDown: "down",
                ArrowLeft: "left",
                ArrowRight: "right",
              } as Record<string, Move>
            )[e.key];
            if (!m) return;
            e.preventDefault();
            go(m);
          }}
        >
          {board.map((v, i) => (
            <span key={i} className="ife-2048-cell" data-v={v || undefined}>
              {v || ""}
            </span>
          ))}

          {over && (
            <div className="ife-2048-end">
              <span className="ife-2048-end-title">{t("noMovesLeft")}</span>
              <button className="ife-btn ife-btn--go" onClick={restart}>
                {t("newGame")}
              </button>
            </div>
          )}
        </div>

        <p className="ife-2048-hint ife-cap">
          {t("swipeToMove")}
          {top >= 2048 ? ` · ${t("reached2048")}` : ""}
        </p>
      </div>
    </GameFrame>
  );
}

// Kept out of the component so the engine stays the only place that knows the
// odds of a 2 against a 4.
import { spawn } from "./g2048";
const spawnInto = (b: Board) => spawn(b);
