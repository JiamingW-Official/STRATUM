import { useEffect, useState } from "react";
import { useCabin, useFlight, useSelf } from "../../flight-state/store";
import { localDay, localTime } from "../format";
import { pick, useT } from "../i18n";
import { useDestination } from "../destination";

/**
 * What the screen shows to an empty seat. The seat number is the protagonist:
 * it is the one fact a passenger standing in the aisle with a boarding pass is
 * looking for, and it is also the first thing the piece says — this screen
 * belongs to a place, and the place was assigned to you.
 *
 * Behind it, the city you are going to, dimmed almost to a ground. The
 * photograph is the only colour the idle screen has and it never competes:
 * everything readable sits on the dark side of the scrim.
 */
export function Idle({ seat }: { seat: string }) {
  const { route, flightNo } = useFlight();
  const setScreen = useSelf((s) => s.setScreen);
  const cabinClass = useCabin((s) => s.seats[seat]?.cabinClass ?? "economy");
  const { t, lang } = useT();
  const dest = useDestination(route.to);
  const [now, setNow] = useState(() => new Date().toISOString());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date().toISOString()), 15_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="ife-idle"
      onClick={() => setScreen("home")}
      role="button"
      tabIndex={0}
      aria-label={t("touchToBegin")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setScreen("home");
      }}
    >
      {dest?.image && (
        <div
          className="ife-photo"
          style={{ backgroundImage: `url(${dest.image})` }}
        />
      )}
      <div className="ife-photo-scrim" />

      <div className="ife-idle-grid">
        <div className="ife-idle-top">
          <div>
            <div className="ife-cap">{t("seat")}</div>
            <div className="ife-idle-seat ife-mono">{seat}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="ife-cap">{t("flight")}</div>
            <div
              className="ife-mono"
              style={{ fontSize: 40, marginTop: 10, fontWeight: 500 }}
            >
              {flightNo}
            </div>
            <div className="ife-cap" style={{ marginTop: 18 }}>
              {t(cabinClass === "business" ? "business" : "economy")}
            </div>
          </div>
        </div>

        <div className="ife-idle-mid">
          <div className="ife-cap">{t("arriving")}</div>
          <div className="ife-idle-city">{pick(route.to.city, lang)}</div>
          <div className="ife-idle-city-sub">
            {pick(route.to.name, lang)} · {route.to.iata}
          </div>
        </div>

        <div className="ife-idle-bottom">
          {/* "Welcome aboard. Your screen is ready whenever you are." is the
              voice of a brand, not of this work, and it told a passenger
              nothing the blinking hint below does not. */}
          <div className="ife-idle-hint ife-cap">{t("touchToBegin")}</div>
          <div className="ife-idle-clock">
            <div className="ife-cap">
              {pick(route.to.city, lang)} · {t("localTime")}
            </div>
            <div className="ife-idle-clock-time ife-mono">
              {localTime(now, route.to)}
            </div>
            <div className="ife-cap" style={{ marginTop: 8 }}>
              {localDay(now, route.to)}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
