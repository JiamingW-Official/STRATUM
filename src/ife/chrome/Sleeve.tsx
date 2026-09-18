import { useState } from "react";
import { splitTrack, type Station } from "../stations";

/**
 * The sleeve art, if any has been made.
 *
 * Found rather than declared: whatever .jpg is sitting in src/covers named
 * after a station's id is that station's cover, and a station with no file is
 * simply absent from this map. That is the whole reason it is a glob and not
 * a path in the data — a path to a file that does not exist is a 404 on every
 * screen that draws a sleeve, and this way an empty folder costs nothing and
 * dropping a file in is the entire installation step.
 */
const COVERS = import.meta.glob("../../covers/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function coverFor(id: string): string | undefined {
  const key = Object.keys(COVERS).find((k) => k.endsWith(`/${id}.jpg`));
  return key ? COVERS[key] : undefined;
}

/**
 * A station's sleeve.
 *
 * There is no cover art for these files and there is no honest way to get
 * any: a generated picture of a city at night would be a photograph of
 * nowhere, attached to music it has nothing to do with, and this cabin does
 * not carry anything invented. So the sleeve is a sleeve rather than a
 * picture — a label, set in the cabin's own faces, in the station's own
 * colour, which is exactly what a record with no artwork has always had.
 *
 * The grooves are the one ornament and they are not ornament: there is one arc
 * per track, struck from a centre below the sleeve, so a station with twelve
 * tracks is visibly denser than one with five. The artwork is the contents.
 *
 * All of that is what a record with no cover has. When there IS one — a file
 * sitting at the station's `cover` path — the art takes the whole sleeve and
 * nothing is printed over it. Four abstract sleeves were drawn for these four
 * records and setting a title across them would spoil them, and it would also
 * be redundant: every place a sleeve appears in this cabin prints the record's
 * name beside it.
 *
 * The fallback is not a placeholder. If the file is missing, or has not been
 * made yet, or fails to load on a flight with no ground link, the drawn sleeve
 * is what is there — and it is a sleeve rather than a broken image.
 */
export function Sleeve({ station }: { station: Station }) {
  const [artFailed, setArtFailed] = useState(false);
  const cover = coverFor(station.id);

  if (cover && !artFailed) {
    return (
      <span
        className="ife-sleeve ife-sleeve--art"
        style={{ ["--stationColor" as string]: station.color }}
      >
        <img
          className="ife-sleeve-art"
          src={cover}
          alt={station.name}
          onError={() => setArtFailed(true)}
        />
      </span>
    );
  }
  return <Drawn station={station} />;
}

function Drawn({ station }: { station: Station }) {
  const n = station.tracks.length;
  const artists = [
    ...new Set(station.tracks.map((t) => splitTrack(t).artist)),
  ].filter(Boolean);
  // From the outer edge inward, one per track. 34 is where the type begins.
  const grooves = Array.from({ length: n }, (_, i) => 96 - (i * 62) / n);

  return (
    <span
      className="ife-sleeve"
      style={{ ["--stationColor" as string]: station.color }}
    >
      <svg
        className="ife-sleeve-grooves"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {grooves.map((r) => (
          <circle key={r} cx="50" cy="150" r={r} />
        ))}
      </svg>
      <span className="ife-sleeve-name">{station.name}</span>
      <span className="ife-sleeve-foot ife-mono">
        <span>{String(n).padStart(2, "0")}</span>
        <span className="ife-sleeve-artists">
          {artists.slice(0, 2).join(" · ")}
        </span>
      </span>
    </span>
  );
}
