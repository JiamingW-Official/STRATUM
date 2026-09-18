import { useMemo, useState } from "react";
import { pickQ, QUESTIONS } from "../games/questions";
import { generate } from "../games/sudokuEngine";
import { deal } from "../games/g2048";
import { FILMS, stillUrl } from "../films";
import { useT } from "../i18n";
import { Sudoku } from "../games/Sudoku";
import { Overhead } from "../games/Overhead";
import { Twenty48 } from "../games/Twenty48";
import { Pairs } from "../games/Pairs";

type GameName = "sudoku" | "overhead" | "g2048" | "pairs";

/**
 * Four games, all real. A seat-back system's games are the part passengers
 * reach for when the film is over and the sleep will not come, so they have to
 * work offline, need no account, and end when you stop.
 *
 * Two are the classics every cabin carries. One is this work's own subject,
 * because the brief asks for a cabin where people learn something together and
 * what this work knows is what is overhead. And one is made of the shelf: its
 * faces are frames from the films actually on board, so playing it is also
 * looking through the catalogue.
 */
export function Games() {
  const [open, setOpen] = useState<null | GameName>(null);

  if (open === "sudoku") return <Sudoku onBack={() => setOpen(null)} />;
  if (open === "overhead") return <Overhead onBack={() => setOpen(null)} />;
  if (open === "g2048") return <Twenty48 onBack={() => setOpen(null)} />;
  if (open === "pairs") return <Pairs onBack={() => setOpen(null)} />;

  return <Menu onOpen={setOpen} />;
}

function Menu({ onOpen }: { onOpen: (g: GameName) => void }) {
  const { t, lang } = useT();
  // A real board, dealt once, shown at a glance. The card advertises the game
  // with the game rather than with an icon standing in for it.
  const preview = useMemo(() => generate("easy").puzzle, []);
  // A real deal, and a few moves' worth of tiles, so the card shows the game
  // rather than an icon standing in for it.
  const tiles = useMemo(() => {
    const b = deal();
    b[5] = 4;
    b[6] = 8;
    b[9] = 2;
    b[10] = 16;
    return b;
  }, []);
  const faces = useMemo(
    () => FILMS.slice(0, 4).map((f) => stillUrl(f)),
    [],
  );

  return (
    <div className="ife-games">
      <header className="ife-head">
        <h2 className="ife-head-title">{t("games")}</h2>
        <span className="ife-head-meta ife-cap">{t("onThisAircraft")}</span>
      </header>

      <div className="ife-gamegrid">
        <button className="ife-gamecard" onClick={() => onOpen("sudoku")}>
          <div className="ife-gamecard-art">
            <div className="ife-mini-sudoku" aria-hidden="true">
              {preview.map((v, i) => (
                <span
                  key={i}
                  data-edge-r={i % 3 === 2 && i % 9 !== 8}
                  data-edge-b={Math.floor(i / 9) % 3 === 2 && i < 72}
                >
                  {v === 0 ? "" : v}
                </span>
              ))}
            </div>
          </div>
          <span className="ife-gamecard-text">
          <span className="ife-gamecard-name">{t("sudoku")}</span>
          <span className="ife-gamecard-sub">{t("sudokuSub")}</span>
          <span className="ife-gamecard-note ife-cap">
            {t("easy")} · {t("medium")} · {t("hard")}
          </span>
          </span>
        </button>

        <button className="ife-gamecard" onClick={() => onOpen("overhead")}>
          <div className="ife-gamecard-art">
            {/* The first question, as the card's own face. Nothing advertises
                a quiz better than one of its questions. */}
            <p className="ife-gamecard-quote">
              {pickQ(QUESTIONS[0].q, lang)}
            </p>
            <div className="ife-gamecard-cite ife-cap">
              {t("source")} · {QUESTIONS[0].source}
            </div>
          </div>
          <span className="ife-gamecard-text">
          <span className="ife-gamecard-name">{t("overhead")}</span>
          <span className="ife-gamecard-sub">{t("overheadSub")}</span>
          <span className="ife-gamecard-note ife-cap">
            {QUESTIONS.length} {lang === "zh" ? "题 · 每题标出处" : "questions · each one cited"}
          </span>
          </span>
        </button>

        <button className="ife-gamecard" onClick={() => onOpen("g2048")}>
          <div className="ife-gamecard-art">
            <div className="ife-mini-2048" aria-hidden="true">
              {tiles.map((v, i) => (
                <span key={i} data-v={v || undefined}>
                  {v || ""}
                </span>
              ))}
            </div>
          </div>
          <span className="ife-gamecard-text">
          <span className="ife-gamecard-name">2048</span>
          <span className="ife-gamecard-sub">{t("g2048Sub")}</span>
          <span className="ife-gamecard-note ife-cap">
            {t("swipeToMove")}
          </span>
          </span>
        </button>

        <button className="ife-gamecard" onClick={() => onOpen("pairs")}>
          <div className="ife-gamecard-art">
            <div className="ife-mini-pairs" aria-hidden="true">
              {faces.map((u) => (
                <span key={u} style={{ backgroundImage: `url(${u})` }} />
              ))}
            </div>
          </div>
          <span className="ife-gamecard-text">
          <span className="ife-gamecard-name">{t("pairs")}</span>
          <span className="ife-gamecard-sub">{t("pairsSub")}</span>
          <span className="ife-gamecard-note ife-cap">
            {FILMS.length} {lang === "zh" ? "部影片的画格" : "films on board"}
          </span>
          </span>
        </button>
      </div>
    </div>
  );
}

/** Shared chrome so a game's own header is not reinvented twice. */
export function GameFrame({
  title,
  onBack,
  aside,
  children,
}: {
  title: string;
  onBack: () => void;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { t } = useT();
  return (
    <div className="ife-game">
      <header className="ife-head">
        <button className="ife-btn ife-btn--quiet" onClick={onBack}>
          ← {t("games")}
        </button>
        <h2 className="ife-head-title">{title}</h2>
        <div className="ife-head-meta">{aside}</div>
      </header>
      {children}
    </div>
  );
}
