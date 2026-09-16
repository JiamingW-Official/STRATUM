import { useFlight } from "../../flight-state/store";
import { localDay, localTime } from "../format";
import { pick, useT } from "../i18n";
import { useDestination } from "../destination";
import { conditionKey, useWeather } from "../weather";

/**
 * The city, full bleed. Every seat-back system has this screen and it is the
 * one place the cabin is allowed to be in colour — a photograph of somewhere
 * real, with the things you would actually want to know before landing there
 * set along its foot.
 *
 * The prose is Wikipedia's own opening sentence rather than airline copy. A
 * destination page written by the carrier is an advertisement; this one is
 * just the entry, and it can say a city is a port or a capital without
 * selling it.
 */
/**
 * Two sentences, cut at a full stop that is actually a full stop. Splitting on
 * ". " alone breaks "9.14 million" in half, which is how a destination screen
 * ends up telling a passenger the population is nine.
 */
function firstSentences(text: string, n: number) {
  const parts = text.split(/(?<![0-9])\.\s+/);
  const out = parts.slice(0, n).join(". ").trim();
  return out.endsWith(".") ? out : out + ".";
}

export function Destination() {
  const { route, etaUtc } = useFlight();
  const { t, lang } = useT();
  const dest = useDestination(route.to);
  const wx = useWeather(route.to);
  const ap = route.to;

  return (
    <div className="ife-dest">
      {dest?.image ? (
        <div
          className="ife-photo"
          style={{ backgroundImage: `url(${dest.image})` }}
        />
      ) : null}
      <div className="ife-photo-scrim" />

      <div className="ife-dest-body">
        <div>
          <div className="ife-cap">{t("destination")}</div>
          <div className="ife-dest-city" style={{ marginTop: 14 }}>
            {pick(ap.city, lang)}
          </div>
          <div className="ife-cap" style={{ marginTop: 16 }}>
            {pick(ap.name, lang)} · {ap.icao} · {ap.iata}
          </div>
          {dest?.extract ? (
            <p className="ife-dest-extract">{firstSentences(dest.extract, 2)}</p>
          ) : (
            <p className="ife-dest-extract">{t("noPhoto")}</p>
          )}
        </div>

        <div className="ife-dest-side">
          <div className="ife-cap">
            {pick(ap.city, lang)} · {t("localTime")}
          </div>
          <div className="ife-dest-temp ife-mono">
            {wx ? `${Math.round(wx.tempC)}°` : "--°"}
          </div>
          <div className="ife-dest-cond">
            {wx ? conditionKey(wx.code)[lang === "zh" ? 1 : 0] : "--"}
          </div>

          <div className="ife-dest-row">
            <span>{t("feelsLike")}</span>
            <span className="ife-mono">
              {wx ? `${Math.round(wx.feelsC)}°` : "--"}
            </span>
          </div>
          <div className="ife-dest-row">
            <span>{t("wind")}</span>
            <span className="ife-mono">
              {wx
                ? `${Math.round(wx.windKph)} km/h · ${Math.round(wx.windDeg)
                    .toString()
                    .padStart(3, "0")}°`
                : "--"}
            </span>
          </div>
          <div className="ife-dest-row" style={{ borderTop: "1px solid var(--line)", paddingTop: 22 }}>
            <span>{t("arrival")}</span>
            <span className="ife-mono">{localTime(etaUtc, ap)}</span>
          </div>
          <div className="ife-dest-row">
            <span />
            <span className="ife-mono">{localDay(etaUtc, ap)}</span>
          </div>
        </div>
      </div>

      {dest?.credit && (
        <div className="ife-credit">Wikimedia Commons · {dest.credit}</div>
      )}
    </div>
  );
}
