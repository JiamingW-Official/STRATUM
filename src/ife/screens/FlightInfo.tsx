import { useFlight } from "../../flight-state/store";
import { duration, fmtInt, localTime } from "../format";

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
  const now = Date.now();
  const elapsed = now - Date.parse(departureUtc);
  const remaining = Date.parse(etaUtc) - now;

  return (
    <div className="ife-pad">
      <div className="ife-title">Flight information</div>

      <div className="ife-figures">
        {/* Altitude and ground speed come off the aircraft's own broadcast, so
            they carry no mark — but when nothing was heard they are our
            estimate, and they say so. */}
        <Figure
          label="Altitude"
          value={fmtInt(position.altFt)}
          unit="ft"
          inferred={!position.heard}
        />
        <Figure
          label="Ground speed"
          value={fmtInt(position.gsKt)}
          unit="kt"
          inferred={!position.heard}
        />
        <Figure
          label="Heading"
          value={`${Math.round(position.headingDeg).toString().padStart(3, "0")}°`}
          inferred={!position.heard}
        />

        <Figure label="Time elapsed" value={duration(elapsed)} />
        <Figure
          label="Time remaining"
          value={phase === "landed" ? "——" : duration(remaining)}
          inferred={etaInferred && phase !== "landed"}
        />
        <Figure label="Phase" value={PHASE_LABEL[phase]} />

        <Figure
          label={`${route.from.city.en} · departed`}
          value={localTime(departureUtc, route.from)}
        />
        <Figure
          label={`${route.to.city.en} · arriving`}
          value={localTime(etaUtc, route.to)}
          inferred={etaInferred && phase !== "landed"}
        />
        <Figure
          label="Position"
          value={`${position.lat.toFixed(2)}, ${position.lon.toFixed(2)}`}
          inferred={!position.heard}
        />
      </div>
    </div>
  );
}

const PHASE_LABEL: Record<string, string> = {
  boarding: "Boarding",
  taxi: "Taxi",
  takeoff: "Climb",
  cruise: "Cruise",
  descent: "Descent",
  landed: "Landed",
};
