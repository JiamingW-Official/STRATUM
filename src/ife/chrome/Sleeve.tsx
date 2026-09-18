import { splitTrack, type Station } from "../stations";

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
 */
export function Sleeve({ station }: { station: Station }) {
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
