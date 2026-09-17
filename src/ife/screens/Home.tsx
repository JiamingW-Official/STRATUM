import { useFlight, useSelf } from "../../flight-state/store";
import type { ScreenName } from "../../flight-state/types";
import { duration, fmtInt, localTime } from "../format";
import { pick, useT, type Key } from "../i18n";
import { useDestination } from "../destination";
import { conditionKey, useWeather } from "../weather";
import { STATIONS } from "../stations";
import { FILMS } from "../films";
import { currentTrack, usePlayer } from "../player";
import { RouteMini } from "../chrome/RouteMini";
import {
  IconFilm,
  IconGames,
  IconGauge,
  IconMap,
  IconMusic,
  IconSky,
} from "../chrome/icons";

/**
 * Home is the destination. There is no separate city page: clicking a
 * photograph to be shown the same photograph one screen deeper was a click
 * that bought nothing.
 *
 * The shape is the one a seat-back system actually uses, and for the reason it
 * uses it: one still column on the left saying where you are going, and one
 * rail on the right that the hand pushes sideways. The rail floats directly on
 * the photograph rather than sitting in a panel, so the city is one picture
 * with things on it instead of two rectangles sharing a screen — and the last
 * column is cut by the edge on purpose, which is the only "scroll for more"
 * a thumb has ever needed.
 *
 * The left column says less than it used to. A paragraph of encyclopaedia and
 * a four-row weather table were two blocks of small type competing with a
 * photograph, and the photograph is the argument.
 */
export function Home() {
  const setScreen = useSelf((s) => s.setScreen);
  const { route, position, etaUtc, etaInferred, phase, flightNo } = useFlight();
  const { t, lang } = useT();
  const dest = useDestination(route.to);
  const wx = useWeather(route.to);
  const seat = useSelf((s) => s.seat);
  const { stationIdx, trackIdx, playing } = usePlayer();
  const now = currentTrack(stationIdx, trackIdx);
  const remaining = Date.parse(etaUtc) - Date.now();

  const cards: Array<{
    screen: ScreenName;
    key: Key;
    icon: React.ReactNode;
    note: string;
    soon?: boolean;
  }> = [
    {
      screen: "map",
      key: "flightMap",
      icon: <IconMap size={96} />,
      note: `${fmtInt(position.altFt)} ft · ${fmtInt(position.gsKt)} kt`,
    },
    {
      screen: "flightInfo",
      key: "flightInformation",
      icon: <IconGauge size={96} />,
      note: `${pick(route.from.city, lang)} → ${pick(route.to.city, lang)}`,
    },
    {
      screen: "music",
      key: "music",
      icon: <IconMusic size={96} />,
      note: playing
        ? now.title
        : `${STATIONS.length} ${lang === "zh" ? "个频道" : "stations"}`,
    },
    {
      screen: "movies",
      key: "movies",
      icon: <IconFilm size={96} />,
      note: `${FILMS.length} ${lang === "zh" ? "部" : "films"}`,
    },
    {
      screen: "games",
      key: "games",
      icon: <IconGames size={96} />,
      note: lang === "zh" ? "2 个游戏" : "2 games",
    },
  ];

  return (
    <div className="ife-home">
      {dest?.image && (
        <div
          className="ife-photo"
          style={{ backgroundImage: `url(${dest.image})` }}
        />
      )}
      <div className="ife-photo-scrim" />

      <div className="ife-home-place">
        <div className="ife-home-ident ife-mono">
          {seat} · {flightNo}
        </div>
        <div className="ife-home-next ife-cap">{t("nextStop")}</div>
        <div className="ife-home-city">{pick(route.to.city, lang)}</div>

        {/* One fact, at the size of a fact you look up from a book to read.
            It had a brass bar down its left and a tinted box behind it, which
            is what a layout does when it does not trust its own type. The
            type is 86px against a 19px label; nothing else is needed. */}
        <div className="ife-home-eta">
          <div className="ife-cap">
            {t("timeTo")} {pick(route.to.city, lang)}
          </div>
          <div
            className={`ife-home-eta-value ife-mono${
              etaInferred && phase !== "landed" ? " ife-inferred" : ""
            }`}
          >
            {phase === "landed" ? "——" : duration(remaining, lang)}
          </div>
          <div className="ife-home-eta-label ife-mono">
            {localTime(etaUtc, route.to)} · {route.to.iata}
          </div>
        </div>

        <div className="ife-home-wx">
          <span className="ife-home-wx-temp ife-mono">
            {wx ? `${Math.round(wx.tempC)}°` : "--°"}
          </span>
          <span className="ife-home-wx-cond">
            {wx ? conditionKey(wx.code)[lang === "zh" ? 1 : 0] : "--"}
          </span>
          <span className="ife-home-wx-apt">{pick(route.to.name, lang)}</span>
        </div>
      </div>

      <div className="ife-rail-cards" role="navigation">
        {cards.map((c) => (
          <button
            key={c.screen}
            className="ife-card"
            data-tall={c.screen === "map"}
            data-soon={!!c.soon}
            onClick={() => setScreen(c.screen)}
          >
            <span className="ife-card-icon">{c.icon}</span>
            {c.screen === "map" && <RouteMini />}
            <span className="ife-card-name">{t(c.key)}</span>
            <span className="ife-card-note ife-mono">{c.note}</span>
          </button>
        ))}

        {/* The last card leaves the cabin. From a seat you can open the sky
            the rest of this work is about — the one the aircraft you are
            sitting in is being heard from. It is a link, and it says so. */}
        <a className="ife-card ife-card--out" data-tall="true" href="/">
          <span className="ife-card-icon">
            <IconSky size={96} />
          </span>
          <span className="ife-card-name">{t("theSky")}</span>
          <span className="ife-card-note ife-mono">{t("liveAdsb")}</span>
        </a>
      </div>

      {dest?.credit && (
        <div className="ife-credit">Wikimedia Commons · {dest.credit}</div>
      )}
    </div>
  );
}
