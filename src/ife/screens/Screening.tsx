import { useCallback, useEffect, useRef, useState } from "react";
import { useFlight, useSelf } from "../../flight-state/store";
import { FILMS, streamUrl, type Film } from "../films";
import { pick, useT } from "../i18n";
import { usePlayer } from "../player";

/**
 * A film, on the whole glass, with controls this project owns.
 *
 * Two reasons not to use the browser's own <video controls>, and only one of
 * them is taste. The controls live in a closed shadow root, so when this
 * screen is hung on a seat in a 3D cabin — a DOM layer behind a transparent
 * WebGL canvas, clicks routed by a ray cast against the screen's plane —
 * nothing outside the browser can reach them, and they cannot be styled to
 * belong to the cabin either. Everything here is ordinary DOM with ordinary
 * handlers, which is what makes it mountable.
 *
 * Two rules follow from the same future:
 *
 *   - "Full screen" means the film fills this 1920x1080 surface, not that it
 *     calls requestFullscreen. In a cabin there is no browser window to fill;
 *     the glass IS the window, so the strip and the rail get out of the way
 *     and nothing else changes.
 *   - Positions come from the pointer's offset inside an element, never from
 *     getBoundingClientRect. Under the CSS 3D transform that puts this screen
 *     on a seat back, a bounding rect is the projected quad and the arithmetic
 *     against it is wrong; offsetX is in the element's own box and survives
 *     the transform.
 */
const IDLE_CONTROLS_MS = 3400;

export function Screening() {
  const { t, lang } = useT();
  const media = useSelf((s) => s.media);
  const setMedia = useSelf((s) => s.setMedia);
  const setScreen = useSelf((s) => s.setScreen);
  const volume = useSelf((s) => s.volume);
  const paOverride = useFlight((s) => s.paOverride);
  const pauseAudio = usePlayer((s) => s.pause);

  const film: Film | undefined =
    FILMS.find((f) => f.id === media?.id) ?? undefined;

  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState(media?.positionSec ?? 0);
  const [duration, setDuration] = useState(film?.seconds ?? 0);
  const [buffered, setBuffered] = useState(0);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [chromeOn, setChromeOn] = useState(true);
  const hideAt = useRef<number>(0);

  // One pair of ears per seat: starting a film stops the station.
  useEffect(() => {
    pauseAudio();
  }, [pauseAudio]);

  useEffect(() => {
    const v = ref.current;
    if (v) v.volume = volume;
  }, [volume, ready]);

  // Resume where the seat left off, including after an announcement.
  useEffect(() => {
    const v = ref.current;
    if (!v || !ready) return;
    const want = media?.positionSec ?? 0;
    if (want > 0 && Math.abs(v.currentTime - want) > 1.5) v.currentTime = want;
  }, [ready]);

  /**
   * An announcement takes the sound as well as the screen, and gives back the
   * frame it took. The element is not unmounted while the PA is up, so the
   * position survives on its own; it is written to the store as well because
   * that is where "exactly as it was" is defined.
   */
  const wasPlaying = useRef(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (paOverride) {
      wasPlaying.current = !v.paused;
      v.pause();
    } else if (wasPlaying.current) {
      wasPlaying.current = false;
      v.play().catch(() => setPlaying(false));
    }
  }, [paOverride]);

  const show = useCallback(() => {
    setChromeOn(true);
    hideAt.current = Date.now() + IDLE_CONTROLS_MS;
  }, []);

  // The controls get out of the way on their own, and come back on any touch.
  useEffect(() => {
    show();
    const id = window.setInterval(() => {
      if (hideAt.current && Date.now() > hideAt.current) setChromeOn(false);
    }, 300);
    return () => window.clearInterval(id);
  }, [show]);

  const toggle = useCallback(() => {
    const v = ref.current;
    if (!v || paOverride) return;
    show();
    if (v.paused) v.play().catch(() => setPlaying(false));
    else v.pause();
  }, [paOverride, show]);

  const nudge = (by: number) => {
    const v = ref.current;
    if (!v || paOverride) return;
    show();
    v.currentTime = Math.min(
      Math.max(0, v.currentTime + by),
      v.duration || duration || 0,
    );
  };

  const exit = () => {
    const v = ref.current;
    if (v && film) setMedia({ id: film.id, positionSec: v.currentTime });
    setScreen("movies");
  };

  // Seeking, in the element's own coordinates. See the note at the top: a
  // bounding rect is the wrong tool once this screen is on a seat back.
  const seekFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = ref.current;
    const total = v?.duration || duration;
    if (!v || !total || paOverride) return;
    const track = e.currentTarget;
    const frac = Math.min(1, Math.max(0, e.nativeEvent.offsetX / track.clientWidth));
    v.currentTime = frac * total;
    show();
  };

  if (!film) {
    return (
      <div className="ife-screening">
        <div className="ife-screening-fail">
          <div className="ife-title">{t("unavailable")}</div>
          <p className="ife-quiz-why-text">{t("unavailableBody")}</p>
          <button
            className="ife-btn ife-btn--go"
            onClick={() => setScreen("movies")}
            style={{ marginTop: 30 }}
          >
            ← {t("movies")}
          </button>
        </div>
      </div>
    );
  }

  const total = duration || film.seconds;
  const frac = total ? Math.min(1, now / total) : 0;

  return (
    <div
      className="ife-screening"
      data-chrome={chromeOn}
      onPointerMove={show}
      onPointerDown={show}
    >
      <video
        ref={ref}
        className="ife-screening-video"
        src={streamUrl(film)}
        autoPlay
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || film.seconds);
          setReady(true);
        }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setNow(v.currentTime);
          const b = v.buffered;
          setBuffered(b.length ? b.end(b.length - 1) : 0);
        }}
        onEnded={exit}
        onError={() => setFailed(true)}
      />

      {/* Tapping the picture is the oldest control there is. */}
      <button
        className="ife-screening-surface"
        onClick={toggle}
        aria-label={t("playPause")}
      />

      {!playing && !failed && (
        <div className="ife-screening-center" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="120" height="120">
            <path d="M9 6.2 19 12 9 17.8z" fill="currentColor" />
          </svg>
        </div>
      )}

      <div className="ife-screening-top">
        <button className="ife-btn ife-btn--quiet" onClick={exit}>
          ← {t("stop")}
        </button>
        <div>
          <div className="ife-screening-title">{pick(film.title, lang)}</div>
          <div className="ife-cap">
            {film.year} · {film.creator}
          </div>
        </div>
      </div>

      <div className="ife-screening-controls">
        <div
          className="ife-seek"
          role="slider"
          aria-label={t("seek")}
          aria-valuemin={0}
          aria-valuemax={Math.round(total)}
          aria-valuenow={Math.round(now)}
          onPointerDown={seekFromEvent}
          onPointerMove={(e) => {
            if (e.buttons === 1) seekFromEvent(e);
          }}
        >
          <span
            className="ife-seek-buffered"
            style={{ width: `${total ? (buffered / total) * 100 : 0}%` }}
          />
          <span className="ife-seek-played" style={{ width: `${frac * 100}%` }} />
          <span className="ife-seek-head" style={{ left: `${frac * 100}%` }} />
        </div>

        <div className="ife-screening-row">
          <button className="ife-vbtn" onClick={toggle} aria-label={t("playPause")}>
            {playing ? (
              <svg viewBox="0 0 24 24" width="34" height="34">
                <path d="M8 5h3.2v14H8zM12.8 5H16v14h-3.2z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="34" height="34">
                <path d="M8 5.5 18 12 8 18.5z" fill="currentColor" />
              </svg>
            )}
          </button>
          <button className="ife-vbtn" onClick={() => nudge(-10)} aria-label={t("back10")}>
            <span className="ife-vbtn-num ife-mono">−10</span>
          </button>
          <button className="ife-vbtn" onClick={() => nudge(30)} aria-label={t("fwd30")}>
            <span className="ife-vbtn-num ife-mono">+30</span>
          </button>

          <span className="ife-screening-time ife-mono">
            {clock(now)} <span className="ife-screening-dim">/ {clock(total)}</span>
          </span>
          <span className="ife-rail-spacer" />
          <span className="ife-cap">
            {clock(Math.max(0, total - now))} {t("remaining")}
          </span>
        </div>
      </div>

      {failed && (
        <div className="ife-screening-fail">
          <div className="ife-title">{t("unavailable")}</div>
          <p className="ife-quiz-why-text">{t("unavailableBody")}</p>
          <button
            className="ife-btn ife-btn--go"
            onClick={() => setScreen("movies")}
            style={{ marginTop: 30 }}
          >
            ← {t("movies")}
          </button>
        </div>
      )}
    </div>
  );
}

function clock(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}
