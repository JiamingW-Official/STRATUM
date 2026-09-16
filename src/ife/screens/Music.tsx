import { useState } from "react";
import { useT } from "../i18n";
import { STATIONS, splitTrack } from "../stations";
import { currentTrack, usePlayer } from "../player";
import { IconMusic } from "../chrome/icons";

/**
 * Real music, not a mock-up: these are the four stations and the actual files
 * the sky view plays, read from the one list both share.
 *
 * The shape is the one every audio app has settled on and every seat-back
 * system has copied from it — a library down the left, the thing you picked
 * filling the right. It opens on the shelf rather than on a track list,
 * because the first question is which station, not which song.
 */
export function Music() {
  const { t, lang } = useT();
  const { stationIdx, trackIdx, playing, progress } = usePlayer();
  const select = usePlayer((s) => s.select);
  const toggle = usePlayer((s) => s.toggle);
  const next = usePlayer((s) => s.next);
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
          <div className="ife-shelf-head">
            <h2 className="ife-title">{t("music")}</h2>
            <span className="ife-cap">
              {STATIONS.reduce((n, s) => n + s.tracks.length, 0)}{" "}
              {lang === "zh" ? "首 · 机上曲库" : "tracks on board"}
            </span>
          </div>

          {/* The shelf. No cover art exists for these files, so each station
              shows the only thing it honestly has: its own colour, its name,
              and who is on it. A square of invented artwork would be the one
              untrue thing in the cabin. */}
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
                  <span className="ife-album-face">
                    <IconMusic size={40} />
                    <span className="ife-album-count ife-mono">
                      {String(s.tracks.length).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="ife-album-name">{s.name}</span>
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
            className="ife-station-head"
            style={{ ["--stationColor" as string]: STATIONS[open].color }}
          >
            <button className="ife-btn ife-btn--quiet" onClick={() => setOpen(null)}>
              ← {t("music")}
            </button>
            <h2 className="ife-station-title">{STATIONS[open].name}</h2>
            <div className="ife-cap">
              {STATIONS[open].tracks.length} {lang === "zh" ? "首" : "tracks"}
            </div>
          </header>

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
          seat and not to the page you happen to be on. */}
      <footer
        className="ife-now"
        style={{ ["--stationColor" as string]: now.station.color }}
      >
        <span className="ife-now-swatch" />
        <span className="ife-now-text">
          <span className="ife-cap">{t("nowPlaying")}</span>
          <span className="ife-now-title">{now.title}</span>
          <span className="ife-now-artist">
            {now.artist || now.station.name}
          </span>
        </span>
        <button className="ife-btn" onClick={toggle}>
          {playing ? t("pause") : t("play")}
        </button>
        <button className="ife-btn" onClick={next}>
          {t("next")}
        </button>
        <span className="ife-now-progress">
          <span style={{ width: `${Math.round(progress * 100)}%` }} />
        </span>
      </footer>
    </div>
  );
}
