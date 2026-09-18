import { useFlight, useSelf } from "../../flight-state/store";
import type { ScreenName } from "../../flight-state/types";
import { duration, fmtInt, localTime } from "../format";
import { phrase, pick, useT, type Key } from "../i18n";
import { useDestination } from "../destination";
import { conditionKey, useWeather } from "../weather";
import { STATIONS } from "../stations";
import { FILMS, runtime, stillUrl } from "../films";
import { useNav } from "../nav";
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
  const {
    route,
    position,
    etaUtc,
    etaInferred,
    phase,
    flightNo,
    departureUtc,
  } = useFlight();
  const { t, lang } = useT();
  const dest = useDestination(route.to);
  const wx = useWeather(route.to);
  const seat = useSelf((s) => s.seat);
  const { stationIdx, trackIdx, playing } = usePlayer();
  const now = currentTrack(stationIdx, trackIdx);
  const openFilm = useNav((s) => s.openFilm);
  // The aviation film, which is the one this cabin would put on its home rail.
  const feature = FILMS[0];
  const remaining = Date.parse(etaUtc) - Date.now();

  /**
   * The rail fills the glass rather than floating a row of equal squares in
   * it, and the sizes are mixed on purpose: a grid of identical tiles is a
   * contact sheet, and it forces every card to carry the same amount, which
   * is never true. The flight map earns two rows, the weather earns two
   * columns, and the rest take one of each.
   *
   * Each card carries what it knows rather than a category name. "Movies"
   * over "8 films" is a label over a count; a film's own title and year is
   * the thing itself.
   */
  const cards: Array<{
    key: string;
    screen?: ScreenName;
    onPress?: () => void;
    title: string;
    icon?: React.ReactNode;
    lines: string[];
    tall?: boolean;
    wide?: boolean;
    media?: "film" | "station";
  }> = [
    {
      key: "map",
      screen: "map",
      title: t("flightMap"),
      icon: <IconMap size={96} />,
      lines: [
        `${fmtInt(position.altFt)} ft`,
        `${fmtInt(position.gsKt)} kt`,
        `${Math.round(position.headingDeg).toString().padStart(3, "0")}°`,
      ],
      tall: true,
    },
    {
      key: "info",
      screen: "flightInfo",
      title: t("flightInformation"),
      icon: <IconGauge size={96} />,
      lines: [
        `${route.from.iata} → ${route.to.iata}`,
        `${duration(Date.now() - Date.parse(departureUtc), lang)} ${t("elapsed")}`,
      ],
    },
    {
      key: "music",
      screen: "music",
      title: t("music"),
      icon: <IconMusic size={96} />,
      lines: [
        `${STATIONS.length} ${lang === "zh" ? "个频道" : "stations"}`,
        `${STATIONS.reduce((n, st) => n + st.tracks.length, 0)} ${
          lang === "zh" ? "首" : "tracks"
        }`,
      ],
    },
    {
      key: "weather",
      screen: "flightInfo",
      title: wx
        ? `${Math.round(wx.tempC)}° ${conditionKey(wx.code)[lang === "zh" ? 1 : 0]}`
        : "--°",
      lines: wx
        ? [
            `${t("feelsLike")} ${Math.round(wx.feelsC)}°`,
            `${t("wind")} ${Math.round(wx.windKph)} km/h`,
            `${pick(route.to.city, lang)} ${localTime(
              new Date().toISOString(),
              route.to,
            )}`,
          ]
        : [t("weather")],
      wide: true,
    },
    {
      key: "movies",
      screen: "movies",
      title: t("movies"),
      icon: <IconFilm size={96} />,
      lines: [
        `${FILMS.length} ${lang === "zh" ? "部" : "films"}`,
        lang === "zh" ? "公有领域" : "public domain",
      ],
    },
    {
      key: "games",
      screen: "games",
      title: t("games"),
      icon: <IconGames size={96} />,
      lines: [t("sudoku"), t("overhead")],
    },
    {
      key: "film",
      onPress: () => {
        openFilm(feature.id);
        setScreen("movies");
      },
      title: pick(feature.title, lang),
      lines: [feature.year, runtime(feature, lang)],
      tall: true,
      media: "film",
    },
    {
      key: "station",
      screen: "music",
      title: now.station.name,
      lines: playing
        ? [now.title, now.artist]
        : [`${now.station.tracks.length} ${lang === "zh" ? "首" : "tracks"}`],
      media: "station",
    },
    {
      key: "sky",
      title: t("theSky"),
      icon: <IconSky size={96} />,
      lines: [t("liveAdsb")],
      tall: true,
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
        {/* No label over the city. "NEXT STOP" was a caption introducing a
            word set at 118px — the largest thing on the screen does not need
            to be announced, and in Chinese the phrase read as a signpost on a
            coach route. */}
        <div className="ife-home-city">{pick(route.to.city, lang)}</div>
        <div className="ife-home-apt">
          {pick(route.to.name, lang)} · {route.to.iata}
        </div>

        {/* One fact, at the size of a fact you look up from a book to read.
            It had a brass bar down its left and a tinted box behind it, which
            is what a layout does when it does not trust its own type. The
            type is 86px against a 19px label; nothing else is needed. */}
        <div className="ife-home-eta">
          <div className="ife-cap">
            {phrase("timeToPlace", lang, pick(route.to.city, lang))}
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
        </div>
      </div>

      <div className="ife-rail-cards" role="navigation">
        {cards.map((c) => {
          const body = (
            <>
              {c.media === "film" && (
                <span
                  className="ife-card-still"
                  style={{ backgroundImage: `url(${stillUrl(feature)})` }}
                />
              )}
              {c.media === "station" && <span className="ife-card-swatch" />}
              {c.icon && <span className="ife-card-icon">{c.icon}</span>}
              {/* The map card carries the route itself. Losing it in a
                  refactor left the tallest card on the screen as an icon and
                  three numbers with a hole between them. */}
              {c.key === "map" && <RouteMini />}
              <span className="ife-card-name">{c.title}</span>
              <span className="ife-card-lines ife-mono">
                {c.lines.filter(Boolean).map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </span>
            </>
          );
          const shared = {
            "data-tall": !!c.tall,
            "data-wide": !!c.wide,
            style:
              c.media === "station"
                ? ({
                    ["--stationColor" as string]: now.station.color,
                  } as React.CSSProperties)
                : undefined,
          };
          const cls = `ife-card${c.media ? " ife-card--media" : ""}`;
          // The one card that leaves the cabin is a link, and says so.
          if (c.key === "sky") {
            return (
              <a key={c.key} href="/" className={`${cls} ife-card--out`} {...shared}>
                {body}
              </a>
            );
          }
          return (
            <button
              key={c.key}
              className={cls}
              {...shared}
              onClick={c.onPress ?? (() => c.screen && setScreen(c.screen))}
            >
              {body}
            </button>
          );
        })}
      </div>

    </div>
  );
}
