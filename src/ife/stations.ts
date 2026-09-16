// The stations, typed for the cabin. The data itself stays in
// src/data/stations.js, which the sky view's radio reads too — one list, so
// what plays upstairs and what plays in the seat cannot drift apart.
// @ts-expect-error — Vanilla JS module shared with the sky view, no types.
import { STATIONS as RAW } from "../data/stations.js";

export type Station = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  folder: string;
  tracks: string[];
};

export const STATIONS = RAW as Station[];

/** Files are named "Artist - Title"; the screen shows the two apart. */
export function splitTrack(track: string): { artist: string; title: string } {
  const i = track.indexOf(" - ");
  return i === -1
    ? { artist: "", title: track }
    : { artist: track.slice(0, i), title: track.slice(i + 3) };
}

export function trackSrc(station: Station, track: string) {
  return `/radio/${encodeURIComponent(station.folder)}/${encodeURIComponent(track)}.m4a`;
}
