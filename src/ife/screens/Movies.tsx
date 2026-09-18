import { useState } from "react";
import { useSelf } from "../../flight-state/store";
import { pick, useT } from "../i18n";
import { FILMS, runtime, stillUrl, synopsis, type Film } from "../films";

/**
 * A shelf, a page for one film, and a player. Nothing here is a mock-up: every
 * title is a real public-domain film and every Play button plays it.
 */
export function Movies() {
  const [open, setOpen] = useState<Film | null>(null);
  const setScreen = useSelf((s) => s.setScreen);
  const setMedia = useSelf((s) => s.setMedia);

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

function Shelf({ onOpen }: { onOpen: (f: Film) => void }) {
  const { t, lang } = useT();
  return (
    <div className="ife-films">
      <header className="ife-head">
        <h2 className="ife-head-title">{t("movies")}</h2>
        <span className="ife-head-meta ife-cap">
          {t("onThisAircraft")} · {FILMS.length} {t("films")} ·{" "}
          {t("publicDomain")}
        </span>
      </header>

      <div className="ife-films-grid">
        {FILMS.map((f) => (
          <button key={f.id} className="ife-film" onClick={() => onOpen(f)}>
            {/* The archive's own still, not a poster we invented. Some of
                these films never had a poster; a frame is what they have. */}
            <span
              className="ife-film-still"
              style={{ backgroundImage: `url(${stillUrl(f)})` }}
            />
            <span className="ife-film-title">{pick(f.title, lang)}</span>
            <span className="ife-film-meta ife-mono">
              {f.year} · {runtime(f, lang)}
            </span>
          </button>
        ))}
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
        <h2 className="ife-film-detail-title">{pick(film.title, lang)}</h2>
        <div className="ife-film-detail-meta ife-mono">
          {film.year} · {runtime(film, lang)} · {film.megabytes} MB
        </div>
        <div className="ife-film-detail-creator">{film.creator}</div>
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
          <span className="ife-cap">{t("publicDomain")}</span>
        </div>
      </div>
    </div>
  );
}
