import { useEffect, useState } from "react";
import { useFlight, useSelf } from "../../flight-state/store";
import type { ScreenName } from "../../flight-state/types";
import { durationParts, localTime, utcTime } from "../format";
import { phrase, pick, useT } from "../i18n";
import { useDestination } from "../../flight-state/destination";
import { compass, conditionKey, useWeather } from "../weather";
import { usePlayer } from "../player";
import { FILMS, stillUrl } from "../films";
import { STATIONS } from "../stations";
import { Sleeve } from "../chrome/Sleeve";
import { useNav } from "../nav";
import { CityPhoto } from "../chrome/CityPhoto";
import { Mark } from "../chrome/Mark";
import {
  IconFilm,
  IconWeather,
  IconGauge,
  IconBag,
  IconGames,
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
    connections,
    etaUtc,
    etaInferred,
    phase,
    flightNo,
  } = useFlight();
  const { t, lang } = useT();
  const dest = useDestination(route.to);
  const wx = useWeather(route.to);
  const seat = useSelf((s) => s.seat);
  const openFilm = useNav((s) => s.openFilm);
  const openStation = useNav((s) => s.openStation);
  const { stationIdx, playing } = usePlayer();
  // Whatever leads the shelf leads the rail: one film is featured and it is
  // the first one, so the order in films.ts is the decision rather than a
  // second list here. It used to be an airline selling its first jets;
  // it is a road trip assembled from nine thousand home movies, which is a
  // better thing to put in front of somebody who is on a journey.
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
   * A door carries its name and nothing else.
   *
   * These cards used to recite what was behind them — 28 films, 35 tracks,
   * 2h 0min elapsed, live ADS-B overhead, and a caption over each one saying
   * what kind of thing it was. Read as a row that is eight numbers and eight
   * captions in front of somebody looking for a word, and not one of the
   * numbers changes which door they open. The counts are on the shelves they
   * count, a touch away and accurate there.
   *
   * Two exceptions, and both are the same exception: they are not doors.
   * The film is the film, so it says it is showing and gives its title; the
   * weather is a reading, so it gives the reading. Neither is a category
   * with a room behind it.
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
    media?: "film" | "sleeve";
    /** Which record's sleeve, for the media cards that carry one. */
    station?: number;
    /** Brass for the flight, cool for the world outside it. Nothing else. */
    tint?: "brass" | "cool";
  }> = [
    ...(nearLanding
      ? [
          {
            key: "connections",
            screen: "connections" as ScreenName,
            title: t("connections"),
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
      cap: t("nowShowing"),
      title: pick(feature.title, lang),
      tall: true,
      media: "film",
    },
    {
      // One row, and a picture rather than a table.
      //
      // It was two rows carrying altitude, ground speed and heading and a
      // small drawing of the route — a card doing the job of the screen
      // behind it. The numbers are on Flight information and on the map
      // itself, both one touch away, and reading them here meant the door
      // to the map was the only card on the rail you did not open.
      //
      // The route drawing went with them. It was the real track, and that
      // is exactly why it could not stay next to a globe with a painted
      // dashed line on it: two lines, one true, at the same size. The globe
      // is a sign now, the size of the film reel and the music note, and
      // nothing on this card pretends to be a reading.
      key: "map",
      screen: "map",
      title: t("flightMap"),
      icon: <Mark id="map" drawn={<IconMap size={210} />} />,
      tint: "brass",
    },
    {
      key: "movies",
      screen: "movies",
      title: t("movies"),
      icon: <Mark id="movies" drawn={<IconFilm size={210} />} />,
    },
    {
      key: "weather",
      screen: "flightInfo",
      cap: pick(route.to.city, lang),
      // The sky, drawn, switched by the same code that picks the words — so
      // the picture and "Overcast" can never disagree.
      icon: wx ? <IconWeather code={wx.code} size={132} /> : undefined,
      title: wx
        ? `${Math.round(wx.tempC)}° ${pick(conditionKey(wx.code), lang)}`
        : "--°",
      // Two columns, not three. The third was the destination clock, which
      // the left of this same screen sets at 92px; replacing it with the
      // bearing gave "FEELS LIKE" and "WIND" 207px each to sit in and they
      // ran into each other. The bearing belongs to the wind anyway — a
      // direction is not a second reading, it is half of the one above it.
      stats: wx
        ? [
            [t("feelsLike"), `${Math.round(wx.feelsC)}°`],
            [
              t("wind"),
              `${pick(compass(wx.windDeg), lang)} ${Math.round(wx.windKph)} km/h`,
            ],
          ]
        : undefined,
      // Two rows, because this is the one card with a table on it. At one row
      // the two readings ran 92px past the bottom of the card — measured —
      // and "WIND SW 19 km/h" simply was not there. A card that carries a
      // table is the card that gets the room; the doors around it do not
      // need it.
      tall: true,
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
      title: t("music"),
      icon: <Mark id="music" drawn={<IconMusic size={210} />} />,
    },
    /**
     * The records themselves, not only the door to them.
     *
     * Four sleeves are the only pictures this cabin owns outright — drawn for
     * these four records, in their own colours — and they were behind a word.
     * A rail of doors with one photograph on it is a list; a rail with the
     * things themselves on it is a shelf, which is what a passenger is
     * looking at.
     */
    ...STATIONS.map((st, i) => ({
      key: `station-${st.id}`,
      onPress: () => {
        openStation(i);
        setScreen("music");
      },
      // No genre. "ELECTRONIC" over a sleeve that is already electronic
      // is a label on a picture, and four of them across the rail read as
      // a taxonomy nobody asked for. The cap only says something when
      // there is something to say: this one is playing.
      cap: playing && stationIdx === i ? t("nowPlaying") : undefined,
      title: st.name,
      media: "sleeve" as const,
      station: i,
    })),
    {
      key: "shop",
      screen: "shop",
      title: t("dutyFree"),
      icon: <Mark id="shop" drawn={<IconBag size={210} />} />,
    },
    {
      key: "games",
      screen: "games",
      title: t("games"),
      icon: <Mark id="games" drawn={<IconGames size={210} />} />,
    },
    {
      key: "sky",
      title: t("theSky"),
      icon: <Mark id="sky" drawn={<IconSky size={210} />} />,
      tall: true,
      tint: "cool",
    },
    {
      key: "info",
      screen: "flightInfo",
      title: t("flightInformation"),
      icon: <Mark id="info" drawn={<IconGauge size={210} />} />,
      tint: "brass",
    },
  ];

  /**
   * The rows under the hero, and none of them is anything already on screen.
   *
   * The arrival clock was here, in the hero on the ground, and in the top
   * strip on every screen — the same 20:49 three times over. A screen that
   * prints a number in three places is not emphasising it, it is failing to
   * decide where it lives. It lives in the strip, which is the one band that
   * never leaves.
   *
   * What the strip does not carry is the clock where you are going, so that
   * is the hero once there is no journey left to count — and then it is not
   * a row as well. The weather was a row here too, one card away from the
   * card that gives the same reading three ways round.
   */
  /**
   * One clock at a time, turning over.
   *
   * There are three worth having and only room for one: the time where you
   * are going, the time where you left, and the time the flight deck works
   * in. A cabin that shows all three has a table of clocks; a cabin that
   * shows only the destination's has thrown away the one a passenger
   * actually asks for first, which is what time it is at home. So the row
   * turns over every fifteen seconds, the way a departure board does.
   */
  const CLOCKS: Array<[string, () => string]> = [
    // Named by the place, not by "local time" three times over — the label is
    // the only thing that distinguishes them, and "LOCAL TIME · LHR" is two
    // lines of a 260px column where "LONDON" is one.
    [pick(route.to.city, lang), () => localTime(new Date().toISOString(), route.to)],
    [pick(route.from.city, lang), () => localTime(new Date().toISOString(), route.from)],
    [t("utc"), () => utcTime(new Date().toISOString())],
  ];
  const [clock, setClock] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setClock((n) => (n + 1) % CLOCKS.length),
      15_000,
    );
    return () => window.clearInterval(id);
  }, [CLOCKS.length]);

  const facts: Array<[string, string]> = landed
    ? []
    : [[CLOCKS[clock][0], CLOCKS[clock][1]()]];

  /**
   * The shape of the rail, decided by the flight it is on.
   *
   * A fixed grid of identical tiles is a contact sheet, and a fixed grid of
   * *mixed* tiles is still fixed: the same card is tall on every flight
   * because of the order somebody typed the list in. So the sizes and the
   * order of the doors come out of the flight number — the same aircraft on
   * the same rotation always looks the same, and two different flights do
   * not. It is not random per load: a door that moves while you are reaching
   * for it is a door you have to find twice, and a screen that reshuffles
   * itself cannot be checked against a picture either.
   *
   * The two cards that are not doors keep their places. The film leads
   * because it is the thing you could start now, and the record sleeves stay
   * together because four covers in a row is a shelf and four covers spread
   * through a rail is clutter.
   */
  const seed = [...flightNo].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 7);
  const rand = (n: number) => {
    // xorshift, so the same flight number always deals the same rail.
    let x = seed + n * 2654435761;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) % 1000) / 1000;
  };
  // Two cards are not in the deal.
  //
  // The connecting board, because it only appears while the aircraft is
  // coming down and at that point it is the one card anybody is looking
  // for. And the flight map, for the same reason all the way through: it is
  // the door people open on a flight, over and over, and it is the only one
  // here they cannot get to any other way in a hurry.
  //
  // Leaving it in the deal was not a small cosmetic thing. On STR 001 the
  // shuffle put it at the end of thirteen cards, behind four radio
  // stations — the most-wanted screen on the rail, last, and reachable only
  // by pushing the whole rail across. A card that is first for a reason
  // does not get shuffled with the ones that are in any order at all.
  //
  // It comes out of the size deal with the order, which is the other thing
  // that was wrong with it: the map card is one panel high on purpose, and
  // the deal had been making it two.
  const doors = cards.filter(
    (c) =>
      !c.media &&
      c.key !== "weather" &&
      c.key !== "connections" &&
      c.key !== "map",
  );
  doors.forEach((c, i) => {
    const r = rand(i);
    // One in four is two rows, one in six is two columns, and never both:
    // a card four times the size of its neighbours is a poster, not a door.
    if (r < 0.25) c.tall = true;
    else if (r < 0.42) c.wide = true;
  });
  // Order the doors among themselves, leaving everything else where it is.
  const shuffled = [...doors].sort((a, b) => rand(doors.indexOf(a) + 40) - rand(doors.indexOf(b) + 40));
  let d = 0;
  const laid = cards.map((c) => (doors.includes(c) ? shuffled[d++] : c));

  return (
    <div className="ife-home">
      <CityPhoto dest={dest} />
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
            list reads as a column.

            In the air the big figure is how long is left. On the ground it
            is the clock where you have landed — the arrival time it used to
            show was the same number as the strip's right-hand end, and it
            was in the future by a minute or two while claiming to be past. */}
        <div className="ife-home-count">
          <div className="ife-cap">
            {landed
              ? t("localTime")
              : phrase("timeToPlace", lang, pick(route.to.city, lang))}
          </div>
          <div
            className={`ife-home-count-value ife-mono${
              etaInferred && !landed ? " ife-inferred" : ""
            }`}
          >
            {landed
              ? localTime(new Date().toISOString(), route.to)
              : /* Figures at full size, units at half. Set as one string the
                 Chinese ran 606px wide in a 500px column and broke 分 onto a
                 line by itself. */
                durationParts(remaining, lang).map((p) => (
                  <span key={p.u} className="ife-home-count-part">
                    {p.n}
                    <span className="ife-home-count-unit">{p.u}</span>
                  </span>
                ))}
          </div>
        </div>

        <dl className="ife-home-facts" hidden={facts.length === 0}>
          {facts.map(([label, value]) => (
            <div key={label} className="ife-home-fact">
              <dt className="ife-cap">{label}</dt>
              <dd className="ife-mono">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="ife-rail-cards" role="navigation">
        {laid.map((c) => {
          const body = (
            <>
              {c.media === "film" && (
                <span
                  className="ife-card-still"
                  style={{ backgroundImage: `url(${stillUrl(feature)})` }}
                />
              )}
              {c.media === "sleeve" && c.station !== undefined && (
                <span className="ife-card-sleeve">
                  <Sleeve station={STATIONS[c.station]} />
                </span>
              )}
              {c.icon && <span className="ife-card-icon">{c.icon}</span>}
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
          const cls = `ife-card${c.media === "film" ? " ife-card--media" : ""}${c.media === "sleeve" ? " ife-card--sleeve" : ""}`;
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
