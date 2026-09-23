import { useFlight } from "../../flight-state/store";
import type { Airport } from "../../flight-state/types";
import { localTime } from "../format";
import { pick, useT } from "../i18n";
import { compass, conditionKey, useWeather } from "../weather";
import { IconWeather } from "../chrome/icons";

/**
 * The weather at both ends, which is the only weather a flight has.
 *
 * Not the destination alone. Half of what anybody checks on a plane is what
 * they are walking out into, and the other half is what they left — one of
 * those is a coat and the other is whether the person meeting them got
 * rained on. Both airports are in the route, `useWeather` takes an airport,
 * and the reading costs one request each.
 *
 * ── Why the arrival is the larger of the two ───────────────────────────────
 * Because it is the one you can still act on. Equal weight would make this a
 * comparison, and it is not a comparison — you are going to one of these
 * places. So arrival takes the big figure and departure sits under it at the
 * size of a caption, which is also the order they happen in.
 *
 * ── What is not here ───────────────────────────────────────────────────────
 * A forecast. The Worker route behind `useWeather` returns current
 * conditions and nothing else — temperature, what it feels like, wind, and a
 * WMO code — so a five-day strip would be five days this cabin has not been
 * told about. When a reading is missing the block says so in a sentence
 * rather than drawing an empty dial, which is the same rule the departure
 * board follows.
 */
export function Weather() {
  const { route } = useFlight();

  return (
    <div className="ife-pad ife-wx">
      <header className="ife-head">
        <h2 className="ife-head-title">
          <Title />
        </h2>
        <span className="ife-head-meta ife-cap">
          {route.from.iata} → {route.to.iata}
        </span>
      </header>

      <div className="ife-wx-pair">
        <Place airport={route.to} kind="arriving" lead />
        <Place airport={route.from} kind="departed" />
      </div>
    </div>
  );
}

function Title() {
  const { t } = useT();
  return <>{t("weather")}</>;
}

function Place({
  airport,
  kind,
  lead = false,
}: {
  airport: Airport;
  kind: "arriving" | "departed";
  lead?: boolean;
}) {
  const { t, lang } = useT();
  const wx = useWeather(airport);

  return (
    <section className="ife-wx-place" data-lead={lead}>
      <div className="ife-wx-where">
        <span className="ife-wx-kind ife-cap">{t(kind)}</span>
        <span className="ife-wx-city">{pick(airport.city, lang)}</span>
        <span className="ife-wx-apt ife-cap">
          {airport.iata} · {localTime(new Date().toISOString(), airport)}
        </span>
      </div>

      {wx ? (
        <div className="ife-wx-read">
          <IconWeather code={wx.code} size={lead ? 148 : 92} />
          <div className="ife-wx-now">
            <span className="ife-wx-temp ife-mono">{Math.round(wx.tempC)}°</span>
            <span className="ife-wx-cond">{pick(conditionKey(wx.code), lang)}</span>
          </div>
          <dl className="ife-wx-rows">
            <div>
              <dt className="ife-cap">{t("feelsLike")}</dt>
              <dd className="ife-mono">{Math.round(wx.feelsC)}°</dd>
            </div>
            <div>
              <dt className="ife-cap">{t("wind")}</dt>
              <dd className="ife-mono">
                {Math.round(wx.windKph)} km/h {pick(compass(wx.windDeg), lang)}
              </dd>
            </div>
          </dl>
        </div>
      ) : (
        /* Said plainly, the way the departure board says it when the cabin
           has been given no board. An empty dial is a reading that claims to
           be zero. */
        <p className="ife-wx-none">{t("weatherUnavailable")}</p>
      )}
    </section>
  );
}
