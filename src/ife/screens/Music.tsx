import { useState } from "react";
import { useT } from "../i18n";
import { STATIONS, splitTrack } from "../stations";
import { Sleeve } from "../chrome/Sleeve";
import { currentTrack, usePlayer } from "../player";
import {
  IconNext,
  IconPause,
  IconPlay,
  IconPrev,
} from "../chrome/icons";

/**
 * Real music, not a mock-up: these are the four stations and the actual files
 * the sky view plays, read from the one list both share.
 *
 * The shape is the one every audio app has settled on and every seat-back
 * system has copied from it — a library down the left, the thing you picked
 * filling the right. It opens on the shelf rather than on a track list,
 * because the first question is which station, not which song.
 */
/** m:ss, and a dash while the file has not said how long it is. */
function clock(sec: number) {
  if (!sec || !isFinite(sec)) return "--:--";
  const m = Math.floor(sec / 60);
  const r = Math.floor(sec % 60);
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function Music() {
  const { t, lang } = useT();
  const { stationIdx, trackIdx, playing, progress, elapsed, duration } =
    usePlayer();
  const select = usePlayer((s) => s.select);
  const toggle = usePlayer((s) => s.toggle);
  const next = usePlayer((s) => s.next);
  const prev = usePlayer((s) => s.prev);
  const seek = usePlayer((s) => s.seek);
  // Which station the right pane is showing. Null is the shelf.
  const [open, setOpen] = useState<number | null>(null);
  const now = currentTrack(stationIdx, trackIdx);

  return (
    <div className="ife-music">
      <aside className="ife-library">
        <div className="ife-library-head ife-cap">{t("station")}</div>
        {STATIONS.map((s, i) => (
          <button
            key={s.id}
            className="ife-library-row"
            data-on={open === i}
            data-playing={playing && stationIdx === i}
            style={{ ["--stationColor" as string]: s.color }}
            onClick={() => setOpen(i)}
          >
            <span className="ife-library-swatch" />
            <span className="ife-library-text">
              <span className="ife-library-name">{s.name}</span>
              <span className="ife-library-sub">
                {s.tracks.length} {lang === "zh" ? "首" : "tracks"}
                {playing && stationIdx === i
                  ? ` · ${lang === "zh" ? "播放中" : "playing"}`
                  : ""}
              </span>
            </span>
          </button>
        ))}
      </aside>

      {open === null ? (
        <section className="ife-shelf">
          <header className="ife-head">
            <h2 className="ife-head-title">{t("music")}</h2>
            <span className="ife-head-meta ife-cap">
              {STATIONS.reduce((n, s) => n + s.tracks.length, 0)}{" "}
              {lang === "zh" ? "首 · 机上曲库" : "tracks on board"}
            </span>
          </header>

          {/* The shelf. No cover art exists for these files and none is
              invented: the sleeve is a label — the station's name in the
              cabin's own face, its colour, and one groove per track — which is
              what a record with no artwork has always had. A generated
              picture would be the one untrue thing in here. */}
          <div className="ife-shelf-grid">
            {STATIONS.map((s, i) => {
              const artists = [
                ...new Set(s.tracks.map((tr) => splitTrack(tr).artist)),
              ].filter(Boolean);
              return (
                <button
                  key={s.id}
                  className="ife-album"
                  style={{ ["--stationColor" as string]: s.color }}
                  onClick={() => setOpen(i)}
                >
                  {/* The sleeve carries the name, so the label under it does
                      not repeat it — it says who is on the record. */}
                  <Sleeve station={s} />
                  <span className="ife-album-artists">
                    {artists.slice(0, 3).join(" · ")}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="ife-station-view">
          <header
            className="ife-head"
            style={{ ["--stationColor" as string]: STATIONS[open].color }}
          >
            <button
              className="ife-btn ife-btn--quiet"
              onClick={() => setOpen(null)}
            >
              ← {t("music")}
            </button>
            <h2 className="ife-head-title ife-station-title">
              {STATIONS[open].name}
            </h2>
            <div className="ife-head-meta ife-cap">
              {STATIONS[open].tracks.length} {lang === "zh" ? "首" : "tracks"}
            </div>
          </header>

          {/* The sleeve stays beside the tracklist, which is how every player
              and every seat-back system shows a record you have opened: the
              cover is how you know which one you are inside. */}
          <div className="ife-station-cover">
            <Sleeve station={STATIONS[open]} />
          </div>

          <ol
            className="ife-tracklist"
            style={{ ["--stationColor" as string]: STATIONS[open].color }}
          >
            {STATIONS[open].tracks.map((tr, i) => {
              const s = splitTrack(tr);
              const on = open === stationIdx && i === trackIdx;
              return (
                <li key={tr}>
                  <button
                    className="ife-track"
                    data-on={on}
                    onClick={() => select(open, i)}
                  >
                    <span className="ife-track-n ife-mono">
                      {on && playing ? "▮▮" : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="ife-track-title">{s.title}</span>
                    <span className="ife-track-artist">{s.artist}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Now playing, always, whichever pane is open — the sound belongs to the
          seat and not to the page you happen to be on.

          The shape is the one every player has converged on and it is worth
          copying rather than inventing: what is playing on the left, the
          transport in the middle where both thumbs can reach it, and the
          clock at the ends of the bar. The bar is scrubbable, and it reads
          the tap from the element's own coordinates like everything else in
          this cabin that will one day hang on a seat back. */}
      <footer
        className="ife-now"
        style={{ ["--stationColor" as string]: now.station.color }}
      >
        <div className="ife-now-what">
          <span className="ife-now-art">
            <Sleeve station={now.station} />
          </span>
          <span className="ife-now-text">
            <span className="ife-now-title">{now.title}</span>
            <span className="ife-now-artist">
              {now.artist || now.station.name}
            </span>
          </span>
        </div>

        <div className="ife-now-mid">
          <div className="ife-now-transport">
            <button
              className="ife-transport"
              onClick={prev}
              aria-label={t("previous")}
            >
              <IconPrev size={34} />
            </button>
            <button
              className="ife-transport ife-transport--play"
              onClick={toggle}
              aria-label={playing ? t("pause") : t("play")}
            >
              {playing ? <IconPause size={38} /> : <IconPlay size={38} />}
            </button>
            <button
              className="ife-transport"
              onClick={next}
              aria-label={t("next")}
            >
              <IconNext size={34} />
            </button>
          </div>

          <div className="ife-now-seekrow">
            <span className="ife-now-clock ife-mono">{clock(elapsed)}</span>
            <button
              className="ife-now-seek"
              aria-label={t("seek")}
              onClick={(e) =>
                seek(
                  e.nativeEvent.offsetX / (e.currentTarget as HTMLElement).clientWidth,
                )
              }
            >
              <span
                className="ife-now-seek-fill"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </button>
            <span className="ife-now-clock ife-mono">{clock(duration)}</span>
          </div>
        </div>

        <div className="ife-now-station ife-cap">{now.station.name}</div>
      </footer>
    </div>
  );
}
