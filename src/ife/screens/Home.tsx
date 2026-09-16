import { useCabin, useFlight, useSelf } from "../../flight-state/store";
import type { ScreenName } from "../../flight-state/types";
import { duration, localTime } from "../format";
import { pick, useT, type Key } from "../i18n";
import { useDestination } from "../destination";
import { conditionKey, useWeather } from "../weather";

const ENTRIES: Array<{ screen: ScreenName; key: Key; soon?: boolean }> = [
  { screen: "map", key: "flightMap" },
  { screen: "flightInfo", key: "flightInformation" },
  { screen: "music", key: "music" },
  { screen: "movies", key: "movies", soon: true },
  { screen: "games", key: "games", soon: true },
];

export function Home({ seat }: { seat: string }) {
  const setScreen = useSelf((s) => s.setScreen);
  const cabinClass = useCabin((s) => s.seats[seat]?.cabinClass ?? "economy");
  const { route, etaUtc, etaInferred, phase } = useFlight();
  const { t, lang } = useT();
  const dest = useDestination(route.to);
  const wx = useWeather(route.to);
  const remaining = Date.parse(etaUtc) - Date.now();

  return (
    <div className="ife-home">
      {/* The city, as a photograph, with the facts a passenger checks laid
          over its foot. This is where the colour in the cabin comes from —
          not from tinting the chrome, which would only make it louder. */}
      <button
        className="ife-home-hero"
        onClick={() => setScreen("destination")}
        aria-label={t("exploreDestination")}
      >
        {dest?.image && (
          <div
            className="ife-photo"
            style={{ backgroundImage: `url(${dest.image})` }}
          />
        )}
        <div className="ife-photo-scrim" />
        <div className="ife-home-hero-body">
          <div className="ife-cap">{t("arriving")}</div>
          <div className="ife-home-city" style={{ marginTop: 12 }}>
            {pick(route.to.city, lang)}
          </div>

          <div className="ife-home-facts">
            <div>
              <div className="ife-cap">
                {phase === "landed" ? t("arrived") : t("timeRemaining")}
              </div>
              <div
                className={`ife-home-fact-value ife-mono${
                  etaInferred && phase !== "landed" ? " ife-inferred" : ""
                }`}
              >
                {phase === "landed" ? "——" : duration(remaining, lang)}
              </div>
            </div>
            <div>
              <div className="ife-cap">{t("localTime")}</div>
              <div className="ife-home-fact-value ife-mono">
                {localTime(etaUtc, route.to)}
              </div>
            </div>
            {wx && (
              <div>
                <div className="ife-cap">{t("weather")}</div>
                <div className="ife-home-fact-value ife-mono">
                  {Math.round(wx.tempC)}°
                  <span className="ife-home-fact-unit">
                    {conditionKey(wx.code)[lang === "zh" ? 1 : 0]}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="ife-home-explore">
            {t("exploreDestination")}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </button>

      <div className="ife-home-menu">
        <div className="ife-home-ident">
          <div className="ife-cap">{t("seat")}</div>
          <div className="ife-home-seat ife-mono">{seat}</div>
          <div className="ife-home-class ife-cap">
            {t(cabinClass === "business" ? "businessClass" : "economyClass")}
          </div>
        </div>

        <nav className="ife-menu">
          {ENTRIES.map((e) => (
            <button
              key={e.screen}
              className="ife-menu-item"
              data-soon={!!e.soon}
              onClick={() => setScreen(e.screen)}
            >
              <span className="ife-menu-label">{t(e.key)}</span>
              {e.soon && <span className="ife-menu-note">{t("later")}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
