import { useCabin, useFlight, useSelf } from "../../flight-state/store";
import type { IFEBridge, ScreenName } from "../../flight-state/types";
import { pick, useT, type Key } from "../i18n";
import { FILMS } from "../films";
import { STATIONS } from "../stations";
import { currentTrack, usePlayer } from "../player";
import {
  IconCall,
  IconLang,
  IconFilm,
  IconGames,
  IconGauge,
  IconLight,
  IconMap,
  IconMusic,
  IconSky,
} from "../chrome/icons";

/**
 * Everything on one page.
 *
 * Every seat-back system has this, behind a hamburger in the corner, and it is
 * not a duplicate of the home screen: home is a shelf that shows you things,
 * and this is an index that tells you what exists. The difference matters on a
 * screen where the shelf scrolls — a passenger who has pushed the rail three
 * columns along has no idea what is off the end of it.
 *
 * It carries the cabin controls too, which the rail has as symbols only. A
 * placard is fine when you already know what it means; this is where you find
 * out.
 */
export function Menu({
  seat,
  bridge,
}: {
  seat: string;
  bridge: IFEBridge;
}) {
  const setScreen = useSelf((s) => s.setScreen);
  const { t, lang } = useT();
  const setLang = useSelf((s) => s.setLang);
  const { route, flightNo } = useFlight();
  const self = useCabin((s) => s.seats[seat]);
  const { stationIdx, trackIdx, playing } = usePlayer();
  const now = currentTrack(stationIdx, trackIdx);

  const light = !!self?.readingLight;
  const calling = !!self?.callAttendant;

  const go = (s: ScreenName) => () => setScreen(s);

  const groups: Array<{
    key: Key;
    items: Array<{
      key: string;
      icon: React.ReactNode;
      label: string;
      note?: string;
      onPress?: () => void;
      href?: string;
      on?: boolean;
    }>;
  }> = [
    {
      key: "groupFlight",
      items: [
        {
          key: "map",
          icon: <IconMap size={52} />,
          label: t("flightMap"),
          note: `${route.from.iata} → ${route.to.iata}`,
          onPress: go("map"),
        },
        {
          key: "info",
          icon: <IconGauge size={52} />,
          label: t("flightInformation"),
          note: flightNo,
          onPress: go("flightInfo"),
        },
        {
          key: "sky",
          icon: <IconSky size={52} />,
          label: t("theSky"),
          note: t("liveAdsb"),
          href: "/",
        },
      ],
    },
    {
      key: "groupEntertainment",
      items: [
        {
          key: "movies",
          icon: <IconFilm size={52} />,
          label: t("movies"),
          note: `${FILMS.length} ${lang === "zh" ? "部 · 公有领域" : "films · public domain"}`,
          onPress: go("movies"),
        },
        {
          key: "music",
          icon: <IconMusic size={52} />,
          label: t("music"),
          note: playing
            ? `${now.station.name} · ${now.title}`
            : `${STATIONS.length} ${lang === "zh" ? "个频道" : "stations"}`,
          onPress: go("music"),
        },
        {
          key: "games",
          icon: <IconGames size={52} />,
          label: t("games"),
          note: `${t("sudoku")} · ${t("overhead")}`,
          onPress: go("games"),
        },
      ],
    },
    {
      key: "groupCabin",
      items: [
        {
          key: "light",
          icon: <IconLight size={52} />,
          label: t("readingLight"),
          note: light ? t("on") : t("off"),
          on: light,
          onPress: () => bridge.setReadingLight(!light),
        },
        {
          key: "lang",
          icon: <IconLang size={52} />,
          label: t("language"),
          note: lang === "zh" ? "中文 · English" : "English · 中文",
          onPress: () => setLang(lang === "zh" ? "en" : "zh"),
        },
        {
          key: "call",
          icon: <IconCall size={52} />,
          label: calling ? t("cancelCall") : t("callAttendant"),
          note: calling ? t("called") : undefined,
          on: calling,
          onPress: () => bridge.callAttendant(!calling),
        },
      ],
    },
  ];

  return (
    <div className="ife-menu-screen">
      <header className="ife-head">
        <h2 className="ife-head-title">{t("menu")}</h2>
        <span className="ife-head-meta ife-cap">
          {seat} · {flightNo} · {pick(route.to.city, lang)}
        </span>
      </header>

      <div className="ife-menu-cols">
        {groups.map((g) => (
          <section key={g.key} className="ife-menu-group">
            <div className="ife-menu-group-name ife-cap">{t(g.key)}</div>
            {g.items.map((it) =>
              it.href ? (
                <a key={it.key} className="ife-menu-row" href={it.href}>
                  <span className="ife-menu-row-icon">{it.icon}</span>
                  <span className="ife-menu-row-text">
                    <span className="ife-menu-row-label">{it.label}</span>
                    {it.note && (
                      <span className="ife-menu-row-note">{it.note}</span>
                    )}
                  </span>
                </a>
              ) : (
                <button
                  key={it.key}
                  className="ife-menu-row"
                  data-on={!!it.on}
                  onClick={it.onPress}
                >
                  <span className="ife-menu-row-icon">{it.icon}</span>
                  <span className="ife-menu-row-text">
                    <span className="ife-menu-row-label">{it.label}</span>
                    {it.note && (
                      <span className="ife-menu-row-note">{it.note}</span>
                    )}
                  </span>
                </button>
              ),
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
