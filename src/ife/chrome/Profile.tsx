import { useFlight } from "../../flight-state/store";
import { progressAlong } from "../../flight-state/geo";
import { pick, useT } from "../i18n";
import { fmtInt } from "../format";

/**
 * The flight seen from the side: distance along the bottom, altitude up.
 *
 * Every seat-back system shows altitude as a number and leaves the shape of
 * the flight to the imagination. The shape is the part a passenger can feel —
 * the climb, the long flat middle, the descent that starts before anyone
 * announces it — and drawing it costs one polyline.
 *
 * The baseline underneath is the evidence: it is solid where a receiver heard
 * the aircraft and broken where nobody did, so the gaps sit directly under the
 * part of the flight they belong to.
 */
const CRUISE_FT = 37000;

export function Profile() {
  const { route, position, track } = useFlight();
  const { t, lang } = useT();

  const W = 100;
  const H = 30;
  const top = 3;
  const base = H - 6;
  const done = progressAlong(route.from, route.to, position);

  // The altitude model the mock flies; the same curve a real climb makes.
  const alt = (p: number) => {
    if (p <= 0.02) return 0;
    if (p < 0.07) return CRUISE_FT * ((p - 0.02) / 0.05) ** 0.7;
    if (p < 0.85) return CRUISE_FT;
    if (p < 0.99) return CRUISE_FT * (1 - (p - 0.85) / 0.14) ** 0.9;
    return 0;
  };
  const y = (ft: number) => base - (ft / CRUISE_FT) * (base - top);
  const pts: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const p = i / 100;
    pts.push(`${p * W},${y(alt(p))}`);
  }
  const flownPts = pts.slice(0, Math.max(2, Math.round(done * 100) + 1));

  const runs: Array<{ a: number; b: number; heard: boolean }> = [];
  for (const p of track) {
    const f = progressAlong(route.from, route.to, p);
    const last = runs[runs.length - 1];
    if (last && last.heard === p.heard) last.b = f;
    else runs.push({ a: last ? last.b : 0, b: f, heard: p.heard });
  }

  return (
    <figure className="ife-profile">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        {/* Cruise level, so the flat middle has something to be flat against. */}
        <line
          x1="0"
          y1={y(CRUISE_FT)}
          x2={W}
          y2={y(CRUISE_FT)}
          stroke="var(--line-strong)"
          strokeWidth="1"
          strokeDasharray="3 4"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke="var(--dim)"
          strokeWidth="1"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
        />
        <polygon
          points={`0,${base} ${flownPts.join(" ")} ${done * W},${base}`}
          fill="rgba(201,164,92,0.14)"
        />
        <polyline
          points={flownPts.join(" ")}
          fill="none"
          stroke="var(--accent-bright)"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
        {runs.map((r, i) => (
          <line
            key={i}
            x1={r.a * W}
            y1={base + 2.5}
            x2={r.b * W}
            y2={base + 2.5}
            stroke={r.heard ? "var(--fg)" : "var(--accent)"}
            strokeWidth="2"
            strokeDasharray={r.heard ? undefined : "3 3"}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <line
          x1={done * W}
          y1={base + 2.5}
          x2={W}
          y2={base + 2.5}
          stroke="var(--line-strong)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <figcaption className="ife-profile-foot">
        <span>
          <span className="ife-cap">{pick(route.from.city, lang)}</span>
          <span className="ife-profile-code ife-mono">{route.from.iata}</span>
        </span>
        <span className="ife-profile-mid ife-mono">
          {fmtInt(position.altFt)} ft · {Math.round(done * 100)}%
        </span>
        <span style={{ textAlign: "right" }}>
          <span className="ife-cap">{pick(route.to.city, lang)}</span>
          <span className="ife-profile-code ife-mono">{route.to.iata}</span>
        </span>
      </figcaption>
      <div className="ife-cap ife-profile-note">{t("heardBaseline")}</div>
    </figure>
  );
}
