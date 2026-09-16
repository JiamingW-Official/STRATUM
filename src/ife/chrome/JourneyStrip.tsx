import { useFlight } from "../../flight-state/store";
import { progressAlong } from "../../flight-state/geo";
import { duration, localTime } from "../format";
import { pick, useT } from "../i18n";
import { IconBack } from "./icons";

/**
 * The strip a seat-back system keeps above everything else: where you left,
 * where you are, where you are going, and when you get there.
 *
 * It is also where the evidence rule is easiest to read, because the line is
 * literally the flight: the stretches a receiver heard are drawn solid, the
 * stretches nobody heard are drawn broken. Nothing explains this. A passenger
 * who watches a gap open behind the aircraft and then close again has been
 * told everything the piece has to say about who gets to be seen.
 */
export function JourneyStrip({ onBack }: { onBack?: () => void }) {
  const { route, position, track, etaUtc, etaInferred, phase } = useFlight();
  const { t, lang } = useT();
  const progress = progressAlong(route.from, route.to, position);

  // Collapse the track into runs of like evidence, so a long heard stretch is
  // one line rather than 140 coincident ones.
  const runs: Array<{ a: number; b: number; heard: boolean }> = [];
  for (const p of track) {
    const f = progressAlong(route.from, route.to, p);
    const last = runs[runs.length - 1];
    if (last && last.heard === p.heard) last.b = f;
    else runs.push({ a: last ? last.b : 0, b: f, heard: p.heard });
  }

  const remainingMs = Date.parse(etaUtc) - Date.now();
  const arrived = phase === "landed";

  const X0 = 0.5;
  const X1 = 99.5;
  const at = (f: number) => X0 + (X1 - X0) * Math.min(1, Math.max(0, f));

  return (
    <div className="ife-strip">
      <button
        className="ife-tool"
        onClick={onBack}
        aria-label={t("back")}
        style={{ marginLeft: -22 }}
      >
        <IconBack />
      </button>

      <div className="ife-strip-city">
        {pick(route.from.city, lang)}
        <span className="ife-strip-city-zh">{route.from.iata}</span>
      </div>

      <div className="ife-strip-line">
        <div className="ife-strip-remaining">
          {arrived ? (
            t("arrived")
          ) : (
            <>
              {t("landingIn")}{" "}
              <span className={etaInferred ? "ife-inferred" : undefined}>
                {duration(remainingMs, lang)}
              </span>
            </>
          )}
        </div>

        <svg
          width="100%"
          height="24"
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
          style={{ position: "absolute", bottom: 4, left: 0 }}
          aria-hidden="true"
        >
          {/* Route still to fly. */}
          <line
            x1={at(progress)}
            y1="12"
            x2={X1}
            y2="12"
            stroke="rgba(240,236,226,0.22)"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
          />
          {/* Route flown, one line per run of like evidence. */}
          {runs.map((r, i) => (
            <line
              key={i}
              x1={at(r.a)}
              y1="12"
              x2={at(r.b)}
              y2="12"
              stroke={r.heard ? "var(--fg)" : "var(--accent)"}
              strokeWidth="2"
              strokeDasharray={r.heard ? undefined : "4 4"}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* The two ends are DOM, not SVG: the line's viewBox is stretched to
            the strip's width, which turns any circle in it into an ellipse. */}
        <span className="ife-strip-end" style={{ left: `${X0}%` }} />
        <span className="ife-strip-end" data-open="true" style={{ left: `${X1}%` }} />

        {/* The aircraft. Filled when a receiver has it, hollow and amber when
            its position is our belief rather than its report. */}
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          style={{
            position: "absolute",
            bottom: 3,
            left: `${at(progress)}%`,
            transform: "translateX(-50%)",
          }}
          aria-hidden="true"
        >
          <path
            d="M12 2.5 13.6 10 22 13.4v1.9l-8.4-2.3-.5 4.9 3 2.2v1.4L12 20.3l-4.1 1.2v-1.4l3-2.2-.5-4.9L2 15.3v-1.9L10.4 10z"
            fill={position.heard ? "var(--fg)" : "none"}
            stroke={position.heard ? "none" : "var(--accent)"}
            strokeWidth="1.4"
            strokeDasharray={position.heard ? undefined : "3 2.5"}
            transform="rotate(90 12 12)"
          />
        </svg>
      </div>

      <div className="ife-strip-city">
        {pick(route.to.city, lang)}
        <span className="ife-strip-city-zh">{route.to.iata}</span>
      </div>

      <div className="ife-strip-arrival">
        <span className="ife-strip-arrival-time ife-mono">
          {localTime(etaUtc, route.to)}
        </span>
        <span className="ife-cap">{t("arrival")}</span>
      </div>
    </div>
  );
}
