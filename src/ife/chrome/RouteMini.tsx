import { useFlight } from "../../flight-state/store";
import { arc, progressAlong } from "../../flight-state/geo";

/**
 * The route, small enough to live inside a card. Not a decoration standing in
 * for a map: it is the same track the moving map draws, under the same rule —
 * solid where a receiver heard the aircraft, broken and brass where nobody
 * did, and the part still to fly dashed because it has not happened.
 */
export function RouteMini() {
  const { route, position, track } = useFlight();
  const line = arc(route.from, route.to, 72);

  // Fit the whole great circle into the box, in plain lon/lat. Over a single
  // route this is close enough to the moving map's projection that the two
  // read as the same shape, which is the only thing a thumbnail owes.
  const lons = line.map(([x]) => x);
  const lats = line.map(([, y]) => y);
  const minX = Math.min(...lons),
    maxX = Math.max(...lons);
  const minY = Math.min(...lats),
    maxY = Math.max(...lats);
  const spanX = Math.max(1e-6, maxX - minX);
  const spanY = Math.max(1e-6, maxY - minY);
  const pad = 8;
  const W = 100,
    H = 62;
  const px = (lon: number) => pad + ((lon - minX) / spanX) * (W - pad * 2);
  const py = (lat: number) => H - pad - ((lat - minY) / spanY) * (H - pad * 2);
  const at = (p: { lat: number; lon: number }) => `${px(p.lon)},${py(p.lat)}`;

  const done = progressAlong(route.from, route.to, position);
  const flown = line.filter(
    (_, i) => i / (line.length - 1) <= done + 1 / line.length,
  );
  const ahead = line.filter((_, i) => i / (line.length - 1) >= done);

  // Break the flown part into runs of like evidence.
  const runs: Array<{ heard: boolean; pts: string[] }> = [];
  for (const p of track) {
    const last = runs[runs.length - 1];
    if (last && last.heard === p.heard) last.pts.push(at(p));
    else {
      if (last) last.pts.push(at(p));
      runs.push({ heard: p.heard, pts: [at(p)] });
    }
  }

  return (
    <svg
      className="ife-route-mini"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <polyline
        points={ahead.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}
        fill="none"
        stroke="var(--dim)"
        strokeWidth="0.8"
        strokeDasharray="2 2.4"
        vectorEffect="non-scaling-stroke"
      />
      {runs.length === 0 && (
        <polyline
          points={flown.map(([x, y]) => `${px(x)},${py(y)}`).join(" ")}
          fill="none"
          stroke="var(--fg)"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {runs.map((r, i) => (
        <polyline
          key={i}
          points={r.pts.join(" ")}
          fill="none"
          stroke={r.heard ? "var(--fg)" : "var(--accent)"}
          strokeWidth="1.4"
          strokeDasharray={r.heard ? undefined : "1.6 1.6"}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <circle cx={px(route.from.lon)} cy={py(route.from.lat)} r="1.5" fill="var(--fg)" />
      <circle
        cx={px(route.to.lon)}
        cy={py(route.to.lat)}
        r="1.5"
        fill="none"
        stroke="var(--dim)"
        strokeWidth="0.9"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={px(position.lon)}
        cy={py(position.lat)}
        r="2.4"
        fill={position.heard ? "var(--fg)" : "none"}
        stroke={position.heard ? "none" : "var(--accent)"}
        strokeWidth="1.1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
