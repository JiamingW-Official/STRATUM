import { useEffect, useState } from "react";
import { useSelf } from "../../flight-state/store";
import { pick, useT, type Key } from "../i18n";
import {
  FILMS,
  runtime,
  stillUrl,
  synopsis,
  type Film,
} from "../films";
import { Poster } from "../chrome/Poster";
import { useNav } from "../nav";

/**
 * A shelf, a page for one film, and a player. Nothing here is a mock-up: every
 * title is a real public-domain film and every Play button plays it.
 */
export function Movies() {
  const [open, setOpen] = useState<Film | null>(null);
  const setScreen = useSelf((s) => s.setScreen);
  const setMedia = useSelf((s) => s.setMedia);
  const wanted = useNav((s) => s.filmId);
  const clearWanted = useNav((s) => s.clear);

  // A card on the home rail can ask for one film by name; it lands on that
  // film's page rather than on the shelf with the film somewhere in it.
  useEffect(() => {
    if (!wanted) return;
    const f = FILMS.find((x) => x.id === wanted);
    clearWanted();
    if (f) setOpen(f);
  }, [wanted, clearWanted]);

  // Playing is a change of screen, not a third state of this one: the film
  // takes the whole glass, and only IFEApp can stand the strip and the rail
  // down.
  const play = (f: Film) => {
    setMedia({ id: f.id, positionSec: 0 });
    setScreen("film");
  };

  if (open) {
    return (
      <Detail film={open} onBack={() => setOpen(null)} onPlay={() => play(open)} />
    );
  }
  return <Shelf onOpen={setOpen} />;
}

/**
 * How the shelf is divided, and it is divided the way the reference cabin
 * divides its own: a column of collections down the left, the posters filling
 * the rest, the row at the bottom cut by the edge so a thumb knows to push.
 *
 * Four of the six collections are what the films are about; the fifth is
 * everything, and the sixth is a duration, which is the one thing a passenger
 * with fifty minutes left actually wants to filter by. That is exactly the
 * shape of "A-Z / New Releases / Under 2 Hrs" on the screen this is drawn
 * from — a subject, a subject, a subject, and a clock.
 */
type Collection = { key: Key; match: (f: Film) => boolean };

const COLLECTIONS: Collection[] = [
  { key: "catAll", match: () => true },
  { key: "catTravel", match: (f) => f.subject === "travel" },
  { key: "catCity", match: (f) => f.subject === "city" },
  { key: "catAviation", match: (f) => f.subject === "aviation" },
  { key: "catRadio", match: (f) => f.subject === "radio" },
  { key: "catAtomic", match: (f) => f.subject === "atomic" },
  { key: "catTomorrow", match: (f) => f.subject === "tomorrow" },
  { key: "catAmateur", match: (f) => f.subject === "amateur" },
  { key: "catShort", match: (f) => f.seconds <= 900 },
];

function Shelf({ onOpen }: { onOpen: (f: Film) => void }) {
  const { t, lang } = useT();
  const [collection, setCollection] = useState<Key>("catAll");
  const shown = FILMS.filter(
    COLLECTIONS.find((c) => c.key === collection)!.match,
  );

  return (
    <div className="ife-films">
      <div className="ife-catalog">
        <nav className="ife-catalog-cats" aria-label={t("movies")}>
          {COLLECTIONS.map((c) => (
            <button
              key={c.key}
              className="ife-catalog-cat"
              data-on={collection === c.key}
              onClick={() => setCollection(c.key)}
            >
              {t(c.key)}
            </button>
          ))}
        </nav>

        {/* The same header the music shelf has, in the same place: at the top
            of the column the shelf is in, not inside the list of ways to
            filter it. It was the nav's heading and it read as one — a title
            with no count beside it while every other screen in the cabin
            carries one, and a list of collections underneath it that looked
            like what the word "Movies" was introducing. */}
        <div className="ife-catalog-main">
          <header className="ife-head">
            <h2 className="ife-head-title">{t("movies")}</h2>
            <span className="ife-head-meta ife-cap">
              {FILMS.length} {t("filmsOnBoard")}
            </span>
          </header>

          <div className="ife-catalog-grid">
            {shown.map((f) => (
              <button key={f.id} className="ife-film" onClick={() => onOpen(f)}>
                <Poster film={f} />
                <span className="ife-film-title">{pick(f.title, lang)}</span>
                <span className="ife-film-meta ife-mono">
                  {f.year} · {runtime(f, lang)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({
  film,
  onBack,
  onPlay,
}: {
  film: Film;
  onBack: () => void;
  onPlay: () => void;
}) {
  const { t, lang } = useT();
  return (
    <div className="ife-film-detail">
      <div
        className="ife-photo"
        style={{ backgroundImage: `url(${stillUrl(film)})` }}
      />
      <div className="ife-photo-scrim" />

      <div className="ife-film-detail-body">
        <button className="ife-btn ife-btn--quiet" onClick={onBack}>
          ← {t("movies")}
        </button>

        {/* The cover, beside the text rather than blown up behind it. The
            archive's frame is 180px wide: at a poster's size it is soft, and
            at the size of a whole screen it was a grey smear. */}
        <div className="ife-film-detail-cols">
          <div className="ife-film-detail-poster">
            <Poster film={film} />
          </div>
          <div className="ife-film-detail-text">
        <h2 className="ife-film-detail-title">{pick(film.title, lang)}</h2>
        <div className="ife-film-detail-meta ife-mono">
          {film.year} · {runtime(film, lang)} · {film.megabytes} MB
        </div>
        <div className="ife-film-detail-creator">
          {film.creator}
          {/* Named because the licence asks to be. */}
          {film.licence && (
            <span className="ife-film-licence ife-mono">
              {film.licence.label}
            </span>
          )}
        </div>
        {synopsis(film, lang) ? (
          <p className="ife-film-detail-synopsis">{synopsis(film, lang)}</p>
        ) : (
          <p className="ife-film-detail-synopsis ife-film-detail-nodesc">
            {t("noSynopsis")}
          </p>
        )}

        <div className="ife-film-detail-actions">
          <button className="ife-btn ife-btn--go" onClick={onPlay}>
            {t("playFilm")}
          </button>
          {/* Only where it is true. This line said "Public domain · Prelinger
              Archives" under every film on the shelf, including the four that
              carry a Creative Commons licence — so this screen printed "CC
              BY-NC-SA 3.0" beside the creator and "public domain" under the
              Play key, about the same film, at the same time. A licensed work
              is not in the public domain; where there is a licence it is
              named above and nothing more needs saying. */}
          {!film.licence && <span className="ife-cap">{t("publicDomain")}</span>}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
