import { useFlight, useSelf } from "../../flight-state/store";
import type { ScreenName } from "../../flight-state/types";
import { duration, fmtInt, localTime } from "../format";
import { phrase, pick, useT } from "../i18n";
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
 */
export function Home() {
  const setScreen = useSelf((s) => s.setScreen);
  const {
    route,
    position,
    connections,
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
  const landed = phase === "landed";
  /**
   * Near the end, the most useful thing on this screen stops being the film.
   * The board is only on the rail when the aircraft is actually coming down —
   * and it is first, because at that point it is the only card anybody is
   * looking for.
   */
  const nearLanding =
    connections.length > 0 &&
    !landed &&
    (phase === "descent" || remaining < 60 * 60_000);
  // The shelf's own span, which is a fact about it rather than a label on it.
  const years = [
    FILMS.reduce((a, f) => (f.year < a ? f.year : a), FILMS[0].year),
    FILMS.reduce((a, f) => (f.year > a ? f.year : a), FILMS[0].year),
  ];

  /**
   * The rail fills the glass rather than floating a row of equal squares in
   * it, and the sizes are mixed on purpose: a grid of identical tiles is a
   * contact sheet, and it forces every card to carry the same amount, which
   * is never true.
   *
   * Order is by what a hand actually reaches for, not by category: the film
   * you could start now, the map, the shelf that film came from. A real cabin
   * leads with something to watch, because that is what the screen is for;
   * "flight information" leading a home screen is a filing cabinet's idea of
   * a first row.
   *
   * Every card carries what it knows rather than a category name, and the
   * two-row ones carry a small table of it — an icon with three words under it
   * in a 300×460 box is mostly empty box.
   */
  const cards: Array<{
    key: string;
    screen?: ScreenName;
    onPress?: () => void;
    /** Small type above the title: what kind of thing this card is. */
    cap?: string;
    title: string;
    icon?: React.ReactNode;
    lines?: string[];
    /** Label → value rows, aligned, for the cards with room for them. */
    stats?: Array<[string, string]>;
    tall?: boolean;
    wide?: boolean;
    media?: "film";
    /** Brass for the flight, cool for the world outside it. Nothing else. */
    tint?: "brass" | "cool";
  }> = [
    ...(nearLanding
      ? [
          {
            key: "connections",
            screen: "connections" as ScreenName,
            cap: `${route.to.iata} · ${t("colDeparture")}`,
            title: t("connections"),
            lines: [
              `${connections.length} ${lang === "zh" ? "班" : "flights"}`,
              `${connections.filter((c) => c.confirmed).length} ${t("confirmed")}`,
            ],
            tint: "brass" as const,
          },
        ]
      : []),
    {
      key: "film",
      onPress: () => {
        openFilm(feature.id);
        setScreen("movies");
      },
      cap: lang === "zh" ? "正在放映" : "Now showing",
      title: pick(feature.title, lang),
      lines: [feature.year, feature.creator, runtime(feature, lang)],
      tall: true,
      media: "film",
    },
    {
      key: "map",
      screen: "map",
      cap: `${route.from.iata} → ${route.to.iata}`,
      title: t("flightMap"),
      stats: [
        [t("altitude"), `${fmtInt(position.altFt)} ft`],
        [t("groundSpeed"), `${fmtInt(position.gsKt)} kt`],
        [
          t("heading"),
          `${Math.round(position.headingDeg).toString().padStart(3, "0")}°`,
        ],
      ],
      tall: true,
      tint: "brass",
    },
    {
      key: "movies",
      screen: "movies",
      title: t("movies"),
      icon: <IconFilm size={118} />,
      lines: [
        `${FILMS.length} ${lang === "zh" ? "部" : "films"}`,
        lang === "zh" ? "公有领域" : "public domain",
        `${years[0]}–${years[1]}`,
      ],
    },
    {
      key: "weather",
      screen: "flightInfo",
      cap: pick(route.to.city, lang),
      title: wx
        ? `${Math.round(wx.tempC)}° ${conditionKey(wx.code)[lang === "zh" ? 1 : 0]}`
        : "--°",
      stats: wx
        ? [
            [t("feelsLike"), `${Math.round(wx.feelsC)}°`],
            [t("wind"), `${Math.round(wx.windKph)} km/h`],
            [t("localTime"), localTime(new Date().toISOString(), route.to)],
          ]
        : undefined,
      wide: true,
      tint: "cool",
    },
    {
      // One card for the music, not two. There were two — this one with the
      // sleeve behind it and an icon card further along the rail — and once
      // the sleeve came off they were the same card twice: same word, same
      // screen, same colour.
      //
      // And the sleeve is off. A record's cover is that record's; putting it
      // behind the word "Music" said "Night Shift" in one breath and "Music"
      // in the next, and the sleeve's own title sat directly above the card's
      // title in the same face. The card carries the cabin's own mark until
      // there is a picture made for this card.
      key: "music",
      screen: "music",
      cap: playing ? t("nowPlaying") : lang === "zh" ? "电台" : "Radio",
      title: t("music"),
      icon: <IconMusic size={118} />,
      // What it knows: the track if there is one, the shelf if there is not.
      lines: playing
        ? [now.title, now.artist]
        : [
            `${STATIONS.length} ${lang === "zh" ? "个频道" : "stations"}`,
            `${STATIONS.reduce((n, st) => n + st.tracks.length, 0)} ${
              lang === "zh" ? "首" : "tracks"
            }`,
          ],
    },
    {
      key: "games",
      screen: "games",
      title: t("games"),
      icon: <IconGames size={118} />,
      lines: [t("sudoku"), t("overhead")],
    },
    {
      key: "sky",
      cap: lang === "zh" ? "机外" : "Outside",
      title: t("theSky"),
      icon: <IconSky size={118} />,
      lines: [
        t("liveAdsb"),
        lang === "zh" ? "谁被听见，谁没有" : "who is heard, and who is not",
      ],
      tall: true,
      tint: "cool",
    },
    {
      key: "info",
      screen: "flightInfo",
      cap: flightNo,
      title: t("flightInformation"),
      lines: [
        `${duration(Date.now() - Date.parse(departureUtc), lang)} ${t("elapsed")}`,
        landed
          ? t("arrived")
          : `${duration(remaining, lang)} ${lang === "zh" ? "剩余" : "to go"}`,
      ],
      tint: "brass",
    },
  ];

  /** Under the countdown: aligned rows, because a list is not a paragraph. */
  const facts: Array<[string, string]> = [
    [t("arrival"), `${localTime(etaUtc, route.to)} ${route.to.iata}`],
    [t("localTime"), localTime(new Date().toISOString(), route.to)],
  ];
  if (wx) {
    facts.push([
      t("weather"),
      `${Math.round(wx.tempC)}° ${conditionKey(wx.code)[lang === "zh" ? 1 : 0]}`,
    ]);
  }

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
            word set at 104px — the largest thing on the screen does not need
            to be announced, and in Chinese the phrase read as a signpost on a
            coach route. */}
        <div className="ife-home-city">{pick(route.to.city, lang)}</div>
        <div className="ife-home-apt">
          {pick(route.to.name, lang)} · {route.to.iata}
        </div>

        {/* One fact at the size of a fact, then the rest of them as a table.
            Three blocks each with their own type sizes and their own left
            edge read as three unrelated notices; one hero and one aligned
            list reads as a column. */}
        <div className="ife-home-count">
          <div className="ife-cap">
            {landed
              ? t("arrived")
              : phrase("timeToPlace", lang, pick(route.to.city, lang))}
          </div>
          <div
            className={`ife-home-count-value ife-mono${
              etaInferred && !landed ? " ife-inferred" : ""
            }`}
          >
            {landed ? localTime(etaUtc, route.to) : duration(remaining, lang)}
          </div>
        </div>

        <dl className="ife-home-facts">
          {facts.map(([label, value]) => (
            <div key={label} className="ife-home-fact">
              <dt className="ife-cap">{label}</dt>
              <dd className="ife-mono">{value}</dd>
            </div>
          ))}
        </dl>
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
              {c.icon && <span className="ife-card-icon">{c.icon}</span>}
              {/* The map card carries the route itself. Losing it in a
                  refactor left the tallest card on the screen as an icon and
                  three numbers with a hole between them. */}
              {c.key === "map" && <RouteMini />}
              {c.cap && <span className="ife-card-cap ife-cap">{c.cap}</span>}
              <span className="ife-card-name">{c.title}</span>
              {c.lines && (
                <span className="ife-card-lines ife-mono">
                  {c.lines.filter(Boolean).map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                </span>
              )}
              {c.stats && (
                <span className="ife-card-stats">
                  {c.stats.map(([label, value]) => (
                    <span key={label} className="ife-card-stat">
                      <span className="ife-cap">{label}</span>
                      <span className="ife-mono">{value}</span>
                    </span>
                  ))}
                </span>
              )}
            </>
          );
          const shared = {
            /* Which card this is, for a test that should not have to find the
               weather by asking which card happens to be two columns wide. */
            "data-key": c.key,
            "data-tall": !!c.tall,
            "data-wide": !!c.wide,
            "data-tint": c.tint,
          };
          const cls = `ife-card${c.media ? " ife-card--media" : ""}`;
          // The one card that leaves the cabin is a link, and says so.
          if (c.key === "sky") {
            return (
              <a
                key={c.key}
                href="/"
                className={`${cls} ife-card--out`}
                {...shared}
              >
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
