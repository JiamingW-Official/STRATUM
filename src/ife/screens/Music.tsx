import { useEffect, useMemo, useRef, useState } from "react";
import { useSelf } from "../../flight-state/store";
import { useT } from "../i18n";
import { STATIONS as LIST, splitTrack, trackSrc } from "../stations";

/**
 * Real music, not a mock-up: these are the four stations and the actual files
 * the sky view plays, read from the one list both now share. Nothing here is
 * a placeholder, which is why it is the screen that can carry colour — each
 * station already has one, and it is used for exactly two things, the tuning
 * bar and the progress, so it reads as "this one" rather than as decoration.
 *
 * Track titles are "Artist - Title", the shape the files are named in.
 */
export function Music() {
  const { t } = useT();
  const volume = useSelf((s) => s.volume);
  const media = useSelf((s) => s.media);
  const setMedia = useSelf((s) => s.setMedia);

  const initial = useMemo(() => {
    const id = media?.id?.split("/")[0];
    return Math.max(0, LIST.findIndex((s) => s.id === id));
  }, []);
  const [stationIdx, setStationIdx] = useState(initial);
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const station = LIST[stationIdx];
  const track = station.tracks[trackIdx % station.tracks.length];
  const { artist, title } = splitTrack(track);
  const src = trackSrc(station, track);

  // One element for the life of the screen; changing station changes its src
  // rather than building a new player.
  useEffect(() => {
    const a = new Audio();
    a.preload = "none";
    audioRef.current = a;
    const onTime = () =>
      setProgress(a.duration ? a.currentTime / a.duration : 0);
    const onEnd = () => setTrackIdx((i) => i + 1);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = src;
    setProgress(0);
    setMedia({ id: `${station.id}/${track}`, positionSec: 0 });
    if (playing) a.play().catch(() => setPlaying(false));
  }, [src]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
  }, [volume]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    }
  };

  return (
    <div className="ife-music" style={{ ["--stationColor" as string]: station.color }}>
      <div className="ife-music-stations">
        {LIST.map((s, i) => (
          <button
            key={s.id}
            className="ife-station"
            data-on={i === stationIdx}
            style={{ ["--stationColor" as string]: s.color }}
            onClick={() => {
              setStationIdx(i);
              setTrackIdx(0);
            }}
          >
            <span className="ife-station-bar" />
            <span className="ife-station-name">{s.name}</span>
            <span className="ife-station-count ife-mono">
              {s.tracks.length}
            </span>
          </button>
        ))}
      </div>

      <div className="ife-music-now">
        <div className="ife-music-meta">
          <div className="ife-cap">{t("nowPlaying")}</div>
          <div className="ife-music-track" style={{ marginTop: 12 }}>
            {title}
          </div>
          <div className="ife-music-artist">{artist || station.name}</div>

          <div className="ife-music-controls">
            <button className="ife-btn" onClick={toggle}>
              {playing ? t("pause") : t("play")}
            </button>
            <button
              className="ife-btn"
              onClick={() => setTrackIdx((i) => i + 1)}
            >
              {t("next")}
            </button>
            <div className="ife-music-progress">
              <span style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* What is on the station. A seat-back screen shows the list, not a
            square of colour pretending to be a sleeve — these tracks have no
            artwork, and inventing some would be the only untrue thing in the
            cabin. The playing row is the one place the station colour goes. */}
        <ol className="ife-tracklist">
          {station.tracks.map((tr, i) => {
            const s = splitTrack(tr);
            const on = i === trackIdx % station.tracks.length;
            return (
              <li key={tr}>
                <button
                  className="ife-track"
                  data-on={on}
                  onClick={() => setTrackIdx(i)}
                >
                  <span className="ife-track-n ife-mono">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="ife-track-title">{s.title}</span>
                  <span className="ife-track-artist">{s.artist}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
