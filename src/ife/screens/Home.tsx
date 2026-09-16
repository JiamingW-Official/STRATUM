import { useFlight, useSelf } from "../../flight-state/store";
import type { ScreenName } from "../../flight-state/types";
import { fmtInt, localDay, localTime } from "../format";
import { pick, useT, type Key } from "../i18n";
import { useDestination } from "../destination";
import { conditionKey, useWeather } from "../weather";
import { STATIONS } from "../stations";
import {
  IconFilm,
  IconGames,
  IconGauge,
  IconMap,
  IconMusic,
} from "../chrome/icons";

/**
 * Home is the destination. There is no separate city page: clicking a
 * photograph to be shown the same photograph one screen deeper was a click
 * that bought nothing, and it split the two things a passenger wants at a
 * glance — where am I going, and what can I do — across two screens.
 *
 * So the screen is cut once, down the middle. Left is the place: its picture,
 * its name, what it is, and what the weather is doing there. Right is the
 * panel of things to do, two rows of squares that push sideways. Nothing on
 * the left is a control and nothing on the right is prose, which is what keeps
 * the two halves from arguing.
 */
export function Home() {
  const setScreen = useSelf((s) => s.setScreen);
  const { route, position, etaUtc } = useFlight();
  const { t, lang } = useT();
  const dest = useDestination(route.to);
  const wx = useWeather(route.to);

  const tiles: Array<{
    screen: ScreenName;
    key: Key;
    icon: React.ReactNode;
    note: string;
    soon?: boolean;
  }> = [
    {
      screen: "map",
      key: "flightMap",
      icon: <IconMap size={64} />,
      note: `${fmtInt(position.altFt)} ft`,
    },
    {
      screen: "flightInfo",
      key: "flightInformation",
      icon: <IconGauge size={64} />,
      note: `${fmtInt(position.gsKt)} kt`,
    },
    {
      screen: "music",
      key: "music",
      icon: <IconMusic size={64} />,
      note: `${STATIONS.length} ${lang === "zh" ? "个频道" : "stations"}`,
    },
    {
      screen: "movies",
      key: "movies",
      icon: <IconFilm size={64} />,
      note: t("later"),
      soon: true,
    },
    {
      screen: "games",
      key: "games",
      icon: <IconGames size={64} />,
      note: t("later"),
      soon: true,
    },
  ];

  return (
    <div className="ife-home">
      <div className="ife-home-place">
        {dest?.image && (
          <div
            className="ife-photo"
            style={{ backgroundImage: `url(${dest.image})` }}
          />
        )}
        <div className="ife-photo-scrim" />

        <div className="ife-home-place-body">
          <div className="ife-cap">{t("arriving")}</div>
          <div className="ife-home-city">{pick(route.to.city, lang)}</div>
          <div className="ife-home-airport">
            {pick(route.to.name, lang)} · {route.to.icao} · {route.to.iata}
          </div>
          {dest?.extract && (
            <p className="ife-home-extract">
              {firstSentences(dest.extract, 2)}
            </p>
          )}

          {/* The weather sits on the photograph's dark foot rather than in a
              box of its own: down here the gradient is already doing the work
              a panel would have to do. */}
          <div className="ife-home-wx">
            <div className="ife-home-wx-temp ife-mono">
              {wx ? `${Math.round(wx.tempC)}°` : "--°"}
            </div>
            <div className="ife-home-wx-facts">
              <div className="ife-home-wx-cond">
                {wx ? conditionKey(wx.code)[lang === "zh" ? 1 : 0] : "--"}
              </div>
              <div className="ife-home-wx-line">
                {t("feelsLike")}{" "}
                <span className="ife-mono">
                  {wx ? `${Math.round(wx.feelsC)}°` : "--"}
                </span>
                {"   ·   "}
                {t("wind")}{" "}
                <span className="ife-mono">
                  {wx ? `${Math.round(wx.windKph)} km/h` : "--"}
                </span>
              </div>
            </div>
            <div className="ife-home-wx-clock">
              <div className="ife-cap">{t("localTime")}</div>
              <div className="ife-home-wx-time ife-mono">
                {localTime(new Date().toISOString(), route.to)}
              </div>
              <div className="ife-cap">{localDay(etaUtc, route.to)}</div>
            </div>
          </div>
        </div>

        {dest?.credit && (
          <div className="ife-credit">Wikimedia Commons · {dest.credit}</div>
        )}
      </div>

      {/* Two rows, pushed sideways with a thumb. The column beyond the edge is
          left half-visible on purpose: a cut square says "more this way"
          without an arrow that has to be aimed at. */}
      <div className="ife-panel">
        <div className="ife-tiles" role="navigation">
          {tiles.map((tile) => (
            <button
              key={tile.screen}
              className="ife-tile"
              data-soon={!!tile.soon}
              onClick={() => setScreen(tile.screen)}
            >
              <span className="ife-tile-icon">{tile.icon}</span>
              <span className="ife-tile-name">{t(tile.key)}</span>
              <span className="ife-tile-note ife-mono">{tile.note}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

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
