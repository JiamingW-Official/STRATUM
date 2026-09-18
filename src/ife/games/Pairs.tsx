import { useMemo, useRef, useState } from "react";
import { FILMS, stillUrl } from "../films";
import { pick, useT } from "../i18n";
import { GameFrame } from "../screens/Games";

/**
 * Pairs, played with the shelf.
 *
 * The faces are frames from the films this aircraft is actually carrying, so
 * the game is made of the cabin's own contents rather than of a set of
 * symbols — and a passenger who plays it has looked at sixteen frames of
 * ephemeral film before they have chosen anything to watch. The title of each
 * matched pair is named when it is found, which is the whole trick: the game
 * is also a catalogue.
 */
const PAIRS = 8;

type Card = { id: number; film: number; up: boolean; done: boolean };

function shuffle<T>(xs: T[], rnd = Math.random): T[] {
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function layout(seed: number): Card[] {
  // Eight films of the eighteen, a different eight each new game.
  const chosen = shuffle(FILMS.map((_, i) => i)).slice(0, PAIRS);
  return shuffle([...chosen, ...chosen]).map((film, id) => ({
    id: id + seed * 100,
    film,
    up: false,
    done: false,
  }));
}

export function Pairs({ onBack }: { onBack: () => void }) {
  const { t, lang } = useT();
  const [seed, setSeed] = useState(0);
  const [cards, setCards] = useState<Card[]>(() => layout(0));
  const [moves, setMoves] = useState(0);
  const [found, setFound] = useState<number[]>([]);
  const busy = useRef(false);

  const restart = () => {
    setSeed((s) => s + 1);
    setCards(layout(seed + 1));
    setMoves(0);
    setFound([]);
    busy.current = false;
  };

  const open = cards.filter((c) => c.up && !c.done);
  const done = found.length === PAIRS;

  const flip = (id: number) => {
    if (busy.current || done) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.done || card.up) return;

    const next = cards.map((c) => (c.id === id ? { ...c, up: true } : c));
    setCards(next);
    const nowOpen = next.filter((c) => c.up && !c.done);
    if (nowOpen.length < 2) return;

    setMoves((m) => m + 1);
    const [a, b] = nowOpen;
    if (a.film === b.film) {
      setCards(
        next.map((c) => (c.film === a.film ? { ...c, done: true, up: false } : c)),
      );
      setFound((f) => [...f, a.film]);
      return;
    }
    // A wrong pair stays visible long enough to be read, then turns back. The
    // lock stops a third card going over while they are still showing.
    busy.current = true;
    window.setTimeout(() => {
      setCards((cs) => cs.map((c) => (c.done ? c : { ...c, up: false })));
      busy.current = false;
    }, 900);
  };

  const names = useMemo(
    () => found.map((i) => pick(FILMS[i].title, lang)),
    [found, lang],
  );

  return (
    <GameFrame
      title={t("pairs")}
      onBack={onBack}
      aside={
        <div className="ife-game-tools">
          <span className="ife-2048-score">
            <span className="ife-cap">{t("moves")}</span>
            <span className="ife-mono">{moves}</span>
          </span>
          <span className="ife-2048-score">
            <span className="ife-cap">{t("found")}</span>
            <span className="ife-mono">
              {found.length}/{PAIRS}
            </span>
          </span>
          <button className="ife-btn" onClick={restart}>
            {t("newGame")}
          </button>
        </div>
      }
    >
      <div className="ife-pairs">
        <div className="ife-pairs-grid">
          {cards.map((c) => (
            <button
              key={c.id}
              className="ife-pairs-card"
              data-up={c.up || c.done}
              data-done={c.done}
              aria-label={
                c.up || c.done ? pick(FILMS[c.film].title, lang) : t("pairs")
              }
              onClick={() => flip(c.id)}
            >
              <span
                className="ife-pairs-face"
                style={{ backgroundImage: `url(${stillUrl(FILMS[c.film])})` }}
              />
              <span className="ife-pairs-back" aria-hidden="true" />
            </button>
          ))}
        </div>

        <aside className="ife-pairs-found">
          <div className="ife-cap">{t("found")}</div>
          <ol>
            {names.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ol>
          {done && (
            <div className="ife-pairs-done">
              <span className="ife-2048-end-title">{t("allFound")}</span>
              <button className="ife-btn ife-btn--go" onClick={restart}>
                {t("newGame")}
              </button>
            </div>
          )}
          {!done && open.length === 0 && moves === 0 && (
            <p className="ife-pairs-note">{t("pairsNote")}</p>
          )}
        </aside>
      </div>
    </GameFrame>
  );
}
