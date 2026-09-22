import { useFlight, useSelf } from "../../flight-state/store";
import { progressAlong } from "../../flight-state/geo";
import { useDestination } from "../../flight-state/destination";
import { duration, localTime } from "../format";
import { pick, useT } from "../i18n";
import { Timetable } from "../chrome/Timetable";
import { CityPhoto } from "../chrome/CityPhoto";

/**
 * The flight, end to end, on one strip.
 *
 * The cards are the milestones the flight actually knows: it left at a real
 * time, it is somewhere real now, and it arrives at a time that is either
 * reported or computed. The descent card is the interesting one — it is a
 * guess, thirty minutes back from the arrival, and it is drawn the way every
 * other guess in this work is drawn rather than being quietly left out.
 *
 * Under them is the rest of the plan. This screen used to stop at the cards,
 * on the argument that nobody had told the aircraft when the trays come out
 * and a card saying they were half an hour away would be the only invented
 * sentence in the cabin. That argument was half right: leaving it out is one
 * honest option, and putting it in and marking it is the other — which is
 * exactly what the descent card beside it has always done. The timetable
 * takes the second option, and every row of it is brass and broken.
 */
const DESCENT_BEFORE_MS = 30 * 60_000;

export function Overview() {
  const { t, lang } = useT();
  const { route, position, departureUtc, etaUtc, etaInferred, phase } =
    useFlight();
  const setScreen = useSelf((s) => s.setScreen);
  // The same hook for both ends: it takes an airport, and a photograph of
  // where you left is as real as one of where you are going.
  const from = useDestination(route.from);
  const to = useDestination(route.to);

  const now = Date.now();
  const dep = Date.parse(departureUtc);
  const eta = Date.parse(etaUtc);
  const descent = eta - DESCENT_BEFORE_MS;
  const progress = progressAlong(route.from, route.to, position);
  const landed = phase === "landed";

  return (
    <div className="ife-overview">
      <header className="ife-head">
        <h2 className="ife-head-title">
          {landed
            ? t("arrived")
            : `${duration(eta - now, lang)} ${t("toPlace")} ${pick(
                route.to.city,
                lang,
              )}`}
        </h2>
        <button
          className="ife-btn ife-btn--quiet ife-head-meta"
          onClick={() => setScreen("home")}
        >
          ✕
        </button>
      </header>

      <div className="ife-ov-strip">
        {/* Where it left from. A real photograph of a real place, credited on
            the flight-information page like every other one in here. */}
        <div className="ife-ov-card ife-ov-card--photo">
          <CityPhoto dest={from} className="ife-ov-photo" />
          <span className="ife-ov-card-body">
            <span className="ife-ov-name">
              {t("depart")} {route.from.iata}
            </span>
            <span className="ife-ov-when ife-mono">
              {localTime(departureUtc, route.from)}
            </span>
          </span>
        </div>

        <div className="ife-ov-card" data-on={!landed}>
          <span className="ife-ov-card-body">
            <span className="ife-ov-name">{t("inTheAir")}</span>
            <span className="ife-ov-when ife-mono">
              {duration(now - dep, lang)} {t("elapsedSoFar")}
            </span>
            <span className="ife-ov-note">
              {Math.round(progress * 100)}% ·{" "}
              {position.heard ? t("heard") : t("notHeard")}
            </span>
          </span>
        </div>

        {/* Nobody said when the descent starts. This is half an hour back from
            an arrival time that is itself often a computation, and it is
            marked twice over rather than pretending. */}
        <div className="ife-ov-card" data-inferred="true">
          <span className="ife-ov-card-body">
            <span className="ife-ov-name">{t("descentBegins")}</span>
            <span className="ife-ov-when ife-mono ife-inferred">
              {descent > now
                ? `${t("within")} ${duration(descent - now, lang)}`
                : "——"}
            </span>
            <span className="ife-ov-note">{t("estimated")}</span>
          </span>
        </div>

        <div className="ife-ov-card ife-ov-card--photo">
          <CityPhoto dest={to} className="ife-ov-photo" />
          <span className="ife-ov-card-body">
            <span className="ife-ov-name">
              {t("arrive")} {route.to.iata}
            </span>
            <span
              className={`ife-ov-when ife-mono${etaInferred ? " ife-inferred" : ""}`}
            >
              {localTime(etaUtc, route.to)}
            </span>
          </span>
        </div>
      </div>

      {/* The same line as the journey strip, at the size this screen can give
          it: the aircraft where it is, and the descent mark where it is only
          thought to be. */}
      <div className="ife-ov-line">
        <span className="ife-ov-track" />
        <span
          className="ife-ov-flown"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
        <span
          className="ife-ov-mark ife-ov-mark--descent"
          style={{
            left: `${Math.min(100, Math.max(0, ((descent - dep) / (eta - dep)) * 100))}%`,
          }}
          title={t("descentBegins")}
        />
        <span
          className="ife-ov-plane"
          data-heard={position.heard}
          style={{ left: `${Math.min(100, progress * 100)}%` }}
        />
        <span className="ife-ov-end ife-mono" data-side="from">
          {route.from.iata}
        </span>
        <span className="ife-ov-end ife-mono" data-side="to">
          {route.to.iata}
        </span>
      </div>

      {/* Compact here. The whole plan with its courses and its paragraph
          lives on the dining screen; this screen already has four cards and
          a rule saying the shape of the flight, and a second full list under
          them is the same screen twice. */}
      <Timetable compact />
    </div>
  );
}
