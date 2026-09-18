import { useEffect, useRef } from "react";
import { useCabin, useSelf } from "../../flight-state/store";
import type { IFEBridge, ScreenName } from "../../flight-state/types";
import { useT, type Key } from "../i18n";
import { useNav } from "../nav";
import {
  IconCall,
  IconChat,
  IconFilm,
  IconGames,
  IconGauge,
  IconHome,
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
  const { t } = useT();
  const self = useCabin((s) => s.seats[seat]);
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
      onPress?: () => void;
      href?: string;
      on?: boolean;
      current?: boolean;
    }>;
  }> = [
    {
      key: "groupFlight",
      items: [
        // No Home row. The rail carries a home placard permanently, two
        // inches below this panel, and the panel opens *over* whatever screen
        // you are on rather than instead of it — so Home was the one row here
        // that could never tell anybody anything. Dropping it is also what
        // buys the other ten rows the air they were missing.
        {
          key: "map",
          icon: <IconMap size={38} />,
          label: t("flightMap"),
          onPress: go("map"),
          current: screen === "map",
        },
        {
          key: "info",
          icon: <IconGauge size={38} />,
          label: t("flightInformation"),
          onPress: go("flightInfo"),
          current: screen === "flightInfo",
        },
        {
          key: "sky",
          icon: <IconSky size={38} />,
          label: t("theSky"),
          href: "/",
        },
      ],
    },
    {
      key: "groupEntertainment",
      items: [
        {
          key: "movies",
          icon: <IconFilm size={38} />,
          label: t("movies"),
          onPress: go("movies"),
          current: screen === "movies",
        },
        {
          key: "music",
          icon: <IconMusic size={38} />,
          label: t("music"),
          onPress: go("music"),
          current: screen === "music",
        },
        {
          key: "games",
          icon: <IconGames size={38} />,
          label: t("games"),
          onPress: go("games"),
          current: screen === "games",
        },
      ],
    },
    {
      key: "groupCabin",
      items: [
        {
          key: "chat",
          icon: <IconChat size={38} />,
          label: t("chat"),
          onPress: go("chat"),
          current: screen === "chat",
        },
        {
          key: "light",
          icon: <IconLight size={38} />,
          label: t("readingLight"),
          on: light,
          onPress: () => bridge.setReadingLight(!light),
        },
        {
          key: "call",
          icon: <IconCall size={38} />,
          label: calling ? t("cancelCall") : t("callAttendant"),
          on: calling,
          onPress: () => bridge.callAttendant(!calling),
        },
        // No language row either, and for the same reason Home went: the rail
        // carries a globe placard whose popover lists both languages by name,
        // which is more than a row here could say. Eleven rows no longer fit
        // the glass at the size the type was asked to be, and a row that is
        // already two inches below is the one to lose.
        {
          // What the corner arrow used to do, done properly: a screen you can
          // put out, and one touch anywhere brings it back.
          key: "off",
          icon: <IconPower size={38} />,
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
                /* The music row is a door and nothing else. It briefly
                   carried the transport, which put a second set of keys in the
                   cabin — and the rail already has the player on every screen,
                   which is where a seat-back system keeps it. */
                it.href ? (
                  <a
                    key={it.key}
                    className="ife-drawer-row"
                    href={it.href}
                    tabIndex={open ? 0 : -1}
                  >
                    <Row icon={it.icon} label={it.label} />
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
                    <Row icon={it.icon} label={it.label} />
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

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <>
      <span className="ife-drawer-row-icon">{icon}</span>
      <span className="ife-drawer-row-label">{label}</span>
    </>
  );
}
