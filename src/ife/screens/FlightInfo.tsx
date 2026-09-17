import { useFlight } from "../../flight-state/store";
import { duration, fmtInt, localTime } from "../format";
import { pick, useT, type Key } from "../i18n";
import { Profile } from "../chrome/Profile";

function Figure({
  label,
  value,
  unit,
  inferred,
}: {
  label: string;
  value: string;
  unit?: string;
  inferred?: boolean;
}) {
  return (
    <div>
      <div className="ife-cap">{label}</div>
      <div className={`ife-figure-value ife-mono${inferred ? " ife-inferred" : ""}`}>
        {value}
      </div>
      {unit && <span className="ife-figure-unit">{unit}</span>}
    </div>
  );
}

export function FlightInfo() {
  const { route, position, departureUtc, etaUtc, etaInferred, phase } =
    useFlight();
  const { t, lang } = useT();
  const now = Date.now();
  const elapsed = now - Date.parse(departureUtc);
  const remaining = Date.parse(etaUtc) - now;

  return (
    <div className="ife-pad">
      <header className="ife-head">
        <h2 className="ife-head-title">{t("flightInformation")}</h2>
        <div className="ife-head-meta ife-cap">{t("profile")}</div>
      </header>

      <Profile />

      <div className="ife-figures">
        {/* Altitude and ground speed come off the aircraft's own broadcast, so
            they carry no mark — but when nothing was heard they are our
            estimate, and they say so. */}
        <Figure
          label={t("groundSpeed")}
          value={fmtInt(position.gsKt)}
          unit="kt"
          inferred={!position.heard}
        />
        <Figure
          label={t("heading")}
          value={`${Math.round(position.headingDeg).toString().padStart(3, "0")}°`}
          inferred={!position.heard}
        />
        <Figure label={t("phase")} value={t(PHASE_KEY[phase])} />

        <Figure label={t("timeElapsed")} value={duration(elapsed, lang)} />
        <Figure
          label={t("timeRemaining")}
          value={phase === "landed" ? "——" : duration(remaining, lang)}
          inferred={etaInferred && phase !== "landed"}
        />
        <Figure
          label={`${pick(route.from.city, lang)} · ${t("departed")}`}
          value={localTime(departureUtc, route.from)}
        />
      </div>
    </div>
  );
}

const PHASE_KEY: Record<string, Key> = {
  boarding: "phaseBoarding",
  taxi: "phaseTaxi",
  takeoff: "phaseTakeoff",
  cruise: "phaseCruise",
  descent: "phaseDescent",
  landed: "phaseLanded",
};
