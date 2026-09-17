import { useEffect, useRef, useState } from "react";
import { useSelf } from "../../flight-state/store";
import { pick, useT } from "../i18n";
import {
  FILMS,
  runtime,
  stillUrl,
  streamUrl,
  synopsis,
  type Film,
} from "../films";
import { usePlayer } from "../player";

/**
 * A shelf, a page for one film, and a player. Nothing here is a mock-up: every
 * title is a real public-domain film and every Play button plays it.
 */
export function Movies() {
  const [open, setOpen] = useState<Film | null>(null);
  const [playing, setPlaying] = useState<Film | null>(null);

  if (playing) {
    return <Screening film={playing} onExit={() => setPlaying(null)} />;
  }
  if (open) {
    return (
      <Detail
        film={open}
        onBack={() => setOpen(null)}
        onPlay={() => setPlaying(open)}
      />
    );
  }
  return <Shelf onOpen={setOpen} />;
}

function Shelf({ onOpen }: { onOpen: (f: Film) => void }) {
  const { t, lang } = useT();
  return (
    <div className="ife-films">
      <div className="ife-films-head">
        <h2 className="ife-title">{t("movies")}</h2>
        <span className="ife-cap">
          {t("onThisAircraft")} · {FILMS.length} {t("films")} ·{" "}
          {t("publicDomain")}
        </span>
      </div>

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

/**
 * The film, full bleed. Two things happen when it starts that would happen on
 * an aircraft: the music stops, because one seat has one pair of ears; and the
 * chrome gets out of the way.
 */
function Screening({ film, onExit }: { film: Film; onExit: () => void }) {
  const { t, lang } = useT();
  const ref = useRef<HTMLVideoElement | null>(null);
  const [failed, setFailed] = useState(false);
  const volume = useSelf((s) => s.volume);
  const pauseAudio = usePlayer((s) => s.pause);

  useEffect(() => {
    pauseAudio();
  }, [pauseAudio]);

  useEffect(() => {
    const v = ref.current;
    if (v) v.volume = volume;
  }, [volume]);

  return (
    <div className="ife-screening">
      <video
        ref={ref}
        className="ife-screening-video"
        src={streamUrl(film)}
        controls
        autoPlay
        playsInline
        onError={() => setFailed(true)}
      />
      <div className="ife-screening-bar">
        <button className="ife-btn ife-btn--quiet" onClick={onExit}>
          ← {t("stop")}
        </button>
        <span className="ife-screening-title">{pick(film.title, lang)}</span>
        <span className="ife-cap">
          {film.year} · {film.creator}
        </span>
        <span className="ife-rail-spacer" />
        <span className="ife-cap">{t("streamingNote")}</span>
      </div>
      {failed && (
        <div className="ife-screening-fail">
          <div className="ife-title">{pick(film.title, lang)}</div>
          <p className="ife-soon-text">{t("streamingNote")}</p>
        </div>
      )}
    </div>
  );
}
