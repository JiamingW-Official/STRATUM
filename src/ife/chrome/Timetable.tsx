import { useFlight } from "../../flight-state/store";
import { localTime } from "../format";
import { useT } from "../i18n";
import { plan, pickPair } from "../schedule";

/**
 * What is supposed to happen, and when, against the flight's own clock.
 *
 * Every row here is brass and broken, and none of them changes when its time
 * goes by. That is the whole argument of the thing: a schedule is the most
 * confident-looking object an interface can draw — a column of times reads as
 * fact whether or not anybody checked — and nothing on board has told this
 * seat when the trays come out. So the marks stay a plan after the moment has
 * passed, because the moment passing is not evidence that anything happened.
 * What dims instead is the *type*, because a plan for ten minutes ago is of
 * less use to you than a plan for an hour's time.
 *
 * The one solid thing on the rule is the aircraft, at the fraction of the
 * flight it has actually covered.
 */
export function Timetable({ compact }: { compact?: boolean }) {
  const { t, lang } = useT();
  const { route, departureUtc, etaUtc } = useFlight();
  const rows = plan(departureUtc, etaUtc);
  if (!rows.length) return null;
  const dep = Date.parse(departureUtc);
  const eta = Date.parse(etaUtc);
  const now = Date.now();
  const at = (ms: number) =>
    Math.min(100, Math.max(0, ((ms - dep) / (eta - dep)) * 100));

  return (
    <section className="ife-tt" data-compact={!!compact}>
      <div className="ife-tt-head">
        <span className="ife-cap">{t("timetable")}</span>
        <span className="ife-cap ife-tt-flag ife-inferred">{t("planned")}</span>
      </div>

      {/* The rule the marks hang off, and the aircraft on it. */}
      <div className="ife-tt-rule">
        <span className="ife-tt-track" />
        <span className="ife-tt-flown" style={{ width: `${at(now)}%` }} />
        {rows.map((r) => (
          <span
            key={r.key}
            className="ife-tt-tick"
            data-cabin={!!r.cabin}
            style={{ left: `${at(r.at)}%` }}
          />
        ))}
        <span className="ife-tt-now" style={{ left: `${at(now)}%` }} />
      </div>

      <ol className="ife-tt-list">
        {rows.map((r) => (
          <li key={r.key} className="ife-tt-row" data-past={r.past}>
            <span className="ife-tt-when ife-mono ife-inferred">
              {localTime(
                new Date(r.at).toISOString(),
                r.anchor === "departure" ? route.from : route.to,
              )}
            </span>
            <span className="ife-tt-what">{pickPair(r.title, lang)}</span>
            {r.courses && !compact && (
              <span className="ife-tt-courses">
                {r.courses.map((c) => pickPair(c.name, lang)).join(" · ")}
              </span>
            )}
          </li>
        ))}
      </ol>

      {!compact && <p className="ife-tt-note">{t("plannedNote")}</p>}
    </section>
  );
}
