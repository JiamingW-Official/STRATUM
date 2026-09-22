import { useId } from "react";
import type { Airport } from "../flight-state/types";

/**
 * The shape of the flight, drawn from the two coordinates.
 *
 * Not an ornament: a great circle sampled between the two airports and laid
 * on a flat lat/lon grid, which is the projection every airline route map has
 * ever used and the reason the New York–London line bends up over Greenland
 * instead of running straight across the page. JFK to LAX comes out nearly
 * level, Paris to Tokyo climbs over Siberia. Somebody who has flown the route
 * recognises it, and somebody who has not has still been told the truth.
 *
 * The maths is the whole of it: two unit vectors, spherical interpolation
 * between them, back to degrees, and scaled into the box. Sixteen samples is
 * enough that the curve reads as a curve at any size this is drawn at.
 */
const N = 16;

function toVec(lat: number, lon: number): [number, number, number] {
  const a = (lat * Math.PI) / 180;
  const b = (lon * Math.PI) / 180;
  return [Math.cos(a) * Math.cos(b), Math.cos(a) * Math.sin(b), Math.sin(a)];
}

function toDeg(v: [number, number, number]): [number, number] {
  const [x, y, z] = v;
  return [
    (Math.asin(z) * 180) / Math.PI,
    (Math.atan2(y, x) * 180) / Math.PI,
  ];
}

export function arcPoints(from: Airport, to: Airport): Array<[number, number]> {
  const a = toVec(from.lat, from.lon);
  const b = toVec(to.lat, to.lon);
  const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
  const w = Math.acos(dot);
  const out: Array<[number, number]> = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    // Spherical interpolation. At w ≈ 0 the two ends are the same place and
    // the sines vanish, so fall back to the straight mix.
    const s = Math.sin(w);
    const k1 = s < 1e-6 ? 1 - t : Math.sin((1 - t) * w) / s;
    const k2 = s < 1e-6 ? t : Math.sin(t * w) / s;
    out.push(
      toDeg([
        a[0] * k1 + b[0] * k2,
        a[1] * k1 + b[1] * k2,
        a[2] * k1 + b[2] * k2,
      ]),
    );
  }
  return out;
}

/**
 * Where the sun is, along the track.
 *
 * The solar hour at a place is the clock plus four minutes a degree, which is
 * the whole of what a time zone approximates. Walking it along the flight
 * gives the one thing a route line can say that a route line usually does
 * not: whether you are flying into the dark, and whether you come out of it.
 * The overnight to Europe draws itself down into night somewhere over the
 * Atlantic and comes back gold on the far side, because that is what it does.
 */
export type Sky = "night" | "twilight" | "day";

export function skyAt(lon: number, atMs: number): Sky {
  const utcHours = (atMs / 3600000) % 24;
  const solar = (((utcHours + lon / 15) % 24) + 24) % 24;
  if (solar < 5 || solar >= 19) return "night";
  if (solar < 7 || solar >= 17) return "twilight";
  return "day";
}

/** Night, the edges of the day, and daylight — on the one dark surface this
 *  is drawn on. */
const SKY: Record<Sky, string> = {
  night: "#5b6786",
  twilight: "#c9a45c",
  day: "#f4f0e7",
};

export function Arc({
  from,
  to,
  width = 300,
  height = 90,
  className,
  animate = false,
  departUtc,
  minutes = 0,
}: {
  from: Airport;
  to: Airport;
  width?: number;
  height?: number;
  className?: string;
  animate?: boolean;
  /** With a departure and a block time the line is coloured by daylight. */
  departUtc?: string;
  minutes?: number;
}) {
  const pts = arcPoints(from, to);
  // Longitudes are unwrapped so a track over the date line does not jump the
  // width of the world halfway along.
  let last = pts[0][1];
  const lons = pts.map(([, lon]) => {
    let l = lon;
    while (l - last > 180) l -= 360;
    while (last - l > 180) l += 360;
    last = l;
    return l;
  });
  const lats = pts.map(([lat]) => lat);
  const pad = 10;
  const y0 = Math.min(...lats);
  const y1 = Math.max(...lats);
  /**
   * Across, by how far along the flight is. Down, by latitude.
   *
   * Longitude was the x axis at first, which is truer to a map and wrong for
   * this drawing: Amsterdam is east of London, so an AMS–LHR watermark ran
   * right to left under a card that reads left to right, and the eye took it
   * for the aeroplane going backwards. Progress along the track keeps the
   * ends where the card puts them; the bend — the thing worth drawing — is
   * carried by the latitudes, which is where it lives anyway.
   *
   * The floor on the vertical range stops a short hop being inflated into a
   * mountain: six degrees of latitude is the least this box will represent,
   * so Amsterdam to London draws as the almost-flat line it is.
   */
  const span = Math.max(y1 - y0, 6);
  const px = (i: number) => pad + (i / N) * (width - pad * 2);
  const py = (lat: number) =>
    height - pad - (lat - y0) * ((height - pad * 2) / span);
  const d = lats
    .map((lat, i) => `${i === 0 ? "M" : "L"}${px(i).toFixed(1)} ${py(lat).toFixed(1)}`)
    .join(" ");

  // One stop per sample, placed at its own x, so the colour changes where the
  // aeroplane actually crosses into the dark rather than at a tidy fraction.
  // The id is per instance: the same route can be drawn twice on one screen.
  const id = useId().replace(/:/g, "");
  const lit = departUtc
    ? lons.map((lon, i) => ({
        at: i / N,
        sky: skyAt(lon, Date.parse(departUtc) + (i / N) * minutes * 60000),
      }))
    : null;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      data-animate={animate}
    >
      {lit && (
        <defs>
          <linearGradient
            id={id}
            gradientUnits="userSpaceOnUse"
            x1={px(0)}
            x2={px(N)}
          >
            {lit.map((p, i) => (
              <stop
                key={i}
                offset={Math.max(0, Math.min(1, p.at))}
                stopColor={SKY[p.sky]}
              />
            ))}
          </linearGradient>
        </defs>
      )}
      <path
        className="bk-arc-line"
        d={d}
        fill="none"
        strokeLinecap="round"
        pathLength={1}
        {...(lit
          ? // Inline, because the stylesheet paints this line in currentColor
            // and a presentation attribute loses to a rule every time.
            { style: { stroke: `url(#${id})` } }
          : {})}
      />
      <circle className="bk-arc-end" cx={px(0)} cy={py(lats[0])} r="3" />
      <circle
        className="bk-arc-end"
        cx={px(N)}
        cy={py(lats[lats.length - 1])}
        r="3"
      />
    </svg>
  );
}
