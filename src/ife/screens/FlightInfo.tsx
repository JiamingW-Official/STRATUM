import { useFlight, useSelf } from "../../flight-state/store";
import { duration, fmtInt, localTime } from "../format";
import { pick, useT, type Key } from "../i18n";
import { Profile } from "../chrome/Profile";
import { useDestination } from "../../flight-state/destination";

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
  const booking = useSelf((s) => s.booking);
  const dest = useDestination(route.to);
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
      {/* The destination photograph's credit lives here rather than across the
          picture itself. Most of Wikimedia Commons is licensed on the
          condition that it is attributed, so the line cannot simply go — but
          a watermark over the one image on the screen was the wrong place for
          it, and this is a page of facts about the flight, which is what a
          credit is. */}
      {/* What the seat knows about its own occupant, which is only ever what
          the pass they scanned carried. One line, because it is a fact about
          a contract rather than a figure about the flight — and it is here
          rather than on the home screen because this is the page you come to
          when you want to check something. */}
      {booking && (
        <div className="ife-fi-booking ife-cap">
          {t("booking")} · <span className="ife-mono">{booking.pnr}</span> ·{" "}
          {t(
            booking.cabinClass === "first"
              ? "firstClass"
              : booking.cabinClass === "business"
              ? "businessClass"
              : booking.cabinClass === "premium"
                ? "premiumClass"
                : "economyClass",
          )}{" "}
          · {t("checkedBags")} <span className="ife-mono">{booking.bags}</span>
          {booking.tier && (
            <>
              {" "}
              · {t("card")} <span className="ife-mono">{booking.tier}</span>
            </>
          )}
          {booking.onward && (
            <>
              {" "}
              · {t("changingTo")}{" "}
              <span className="ife-mono">{booking.onward.flightNo}</span> →{" "}
              <span className="ife-mono">{booking.onward.toIata}</span>
            </>
          )}
        </div>
      )}

      {dest?.credit && (
        <div className="ife-fi-credit ife-cap">
          {t("photograph")} ·{" "}
          {dest.creditHref ? (
            <a href={dest.creditHref} target="_blank" rel="noreferrer">
              {dest.credit}
            </a>
          ) : (
            dest.credit
          )}{" "}
          · Wikimedia Commons
        </div>
      )}
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
