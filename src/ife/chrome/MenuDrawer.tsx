import { useEffect, useRef } from "react";
import { useCabin, useFlight, useSelf } from "../../flight-state/store";
import type { IFEBridge, ScreenName } from "../../flight-state/types";
import { pick, useT, type Key } from "../i18n";
import { FILMS } from "../films";
import { STATIONS } from "../stations";
import { currentTrack, usePlayer } from "../player";
import { useNav } from "../nav";
import {
  IconCall,
  IconFilm,
  IconGames,
  IconGauge,
  IconHome,
  IconLang,
  IconLight,
  IconMap,
  IconMusic,
  IconPower,
  IconSky,
} from "./icons";

/**
 * Everything on board, in a panel that comes in from the left edge.
 *
 * It is not a screen. A seat-back menu never takes the glass — it slides over
 * whatever you were doing and goes away again, because half the things on it
 * are switches rather than destinations and throwing away the film you were
 * watching to reach the reading light would be absurd. The hamburger that
 * opens it lives in the top-left corner of the strip, where every system from
 * United's to Panasonic's puts it.
 *
 * It also earns its place against the home rail, which scrolls sideways: a
 * passenger who has pushed that rail three columns along has no way of
 * knowing what is off the end of it. Home is a shelf that shows you things.
 * This is the index that tells you what exists.
 */
export function MenuDrawer({
  seat,
  bridge,
}: {
  seat: string;
  bridge: IFEBridge;
}) {
  const open = useNav((s) => s.menuOpen);
  const setOpen = useNav((s) => s.setMenuOpen);
  const screen = useSelf((s) => s.screen);
  const setScreen = useSelf((s) => s.setScreen);
  const setLang = useSelf((s) => s.setLang);
  const { t, lang } = useT();
  const { route, flightNo } = useFlight();
  const self = useCabin((s) => s.seats[seat]);
  const { stationIdx, trackIdx, playing } = usePlayer();
  const now = currentTrack(stationIdx, trackIdx);
  const panel = useRef<HTMLDivElement | null>(null);

  // Escape closes it, and so does the hardware key a bench has and a seat
  // does not. Cheap, and it keeps the drawer from being a trap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const light = !!self?.readingLight;
  const calling = !!self?.callAttendant;

  const go = (s: ScreenName) => () => {
    setScreen(s);
    setOpen(false);
  };

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
      current?: boolean;
    }>;
  }> = [
    {
      key: "groupFlight",
      items: [
        {
          key: "home",
          icon: <IconHome size={34} />,
          label: t("home"),
          note: pick(route.to.city, lang),
          onPress: go("home"),
          current: screen === "home",
        },
        {
          key: "map",
          icon: <IconMap size={34} />,
          label: t("flightMap"),
          note: `${route.from.iata} → ${route.to.iata}`,
          onPress: go("map"),
          current: screen === "map",
        },
        {
          key: "info",
          icon: <IconGauge size={34} />,
          label: t("flightInformation"),
          note: flightNo,
          onPress: go("flightInfo"),
          current: screen === "flightInfo",
        },
        {
          key: "sky",
          icon: <IconSky size={34} />,
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
          icon: <IconFilm size={34} />,
          label: t("movies"),
          note: `${FILMS.length} ${lang === "zh" ? "部 · 公有领域" : "films · public domain"}`,
          onPress: go("movies"),
          current: screen === "movies",
        },
        {
          key: "music",
          icon: <IconMusic size={34} />,
          label: t("music"),
          note: playing
            ? `${now.station.name} · ${now.title}`
            : `${STATIONS.length} ${lang === "zh" ? "个频道" : "stations"}`,
          onPress: go("music"),
          current: screen === "music",
        },
        {
          key: "games",
          icon: <IconGames size={34} />,
          label: t("games"),
          note: `${t("sudoku")} · ${t("overhead")}`,
          onPress: go("games"),
          current: screen === "games",
        },
      ],
    },
    {
      key: "groupCabin",
      items: [
        {
          key: "light",
          icon: <IconLight size={34} />,
          label: t("readingLight"),
          note: light ? t("on") : t("off"),
          on: light,
          onPress: () => bridge.setReadingLight(!light),
        },
        {
          key: "call",
          icon: <IconCall size={34} />,
          label: calling ? t("cancelCall") : t("callAttendant"),
          note: calling ? t("called") : undefined,
          on: calling,
          onPress: () => bridge.callAttendant(!calling),
        },
        {
          key: "lang",
          icon: <IconLang size={34} />,
          label: t("language"),
          note: lang === "zh" ? "中文 · English" : "English · 中文",
          onPress: () => setLang(lang === "zh" ? "en" : "zh"),
        },
        {
          // What the corner arrow used to do, done properly: a screen you can
          // put out, and one touch anywhere brings it back.
          key: "off",
          icon: <IconPower size={34} />,
          label: t("screenOff"),
          onPress: go("off"),
        },
      ],
    },
  ];

  return (
    <div className="ife-drawer-layer" data-open={open} aria-hidden={!open}>
      {/* The rest of the screen, dimmed and pressable: on a touch panel,
          tapping the thing you can still see is how a drawer is closed. */}
      <button
        className="ife-drawer-scrim"
        aria-label={t("close")}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />
      <div
        className="ife-drawer"
        ref={panel}
        role="navigation"
        aria-label={t("menu")}
      >
        {/* No title bar. It said "Menu · 12K · STR 001" — the seat is on the
            rail, the flight is in the strip above, and the word Menu was a
            caption on a panel that had just slid out from under a hamburger.
            Deleting it is also what makes all eleven rows fit on the glass
            without a scroll, which matters more than the label did. */}
        <div className="ife-drawer-body">
          {groups.map((g) => (
            <section key={g.key} className="ife-drawer-group">
              <div className="ife-drawer-group-name ife-cap">{t(g.key)}</div>
              {g.items.map((it) =>
                it.href ? (
                  <a
                    key={it.key}
                    className="ife-drawer-row"
                    href={it.href}
                    tabIndex={open ? 0 : -1}
                  >
                    <Row icon={it.icon} label={it.label} note={it.note} />
                  </a>
                ) : (
                  <button
                    key={it.key}
                    className="ife-drawer-row"
                    data-on={!!it.on}
                    data-current={!!it.current}
                    tabIndex={open ? 0 : -1}
                    onClick={it.onPress}
                  >
                    <Row icon={it.icon} label={it.label} note={it.note} />
                  </button>
                ),
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  note,
}: {
  icon: React.ReactNode;
  label: string;
  note?: string;
}) {
  return (
    <>
      <span className="ife-drawer-row-icon">{icon}</span>
      <span className="ife-drawer-row-label">{label}</span>
      {note && <span className="ife-drawer-row-note">{note}</span>}
    </>
  );
}
