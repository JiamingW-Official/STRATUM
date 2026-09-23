import { useEffect, useRef } from "react";
import { useSelf } from "../../flight-state/store";
import type { ScreenName } from "../../flight-state/types";
import { useT, type Key } from "../i18n";
import { useNav } from "../nav";

/**
 * Everything on board, in a panel that comes in from the left edge.
 *
 * It is a list of doors, and only doors. It used to carry the reading light,
 * the attendant call and the screen switch as well, and all three are
 * placards on the rail two inches below — lit, pressed and answered there,
 * on every screen, without opening anything. A panel that mixes doors with
 * switches makes you read each row to find out which kind it is.
 *
 * It is not a screen either. It slides over whatever you were doing and goes
 * away again, and the hamburger that opens it lives in the top-left corner
 * of the strip, where every system from United's to Panasonic's puts it.
 *
 * It also earns its place against the home rail, which scrolls sideways: a
 * passenger who has pushed that rail three columns along has no way of
 * knowing what is off the end of it. Home is a shelf that shows you things.
 * This is the index that tells you what exists.
 */
export function MenuDrawer() {
  const open = useNav((s) => s.menuOpen);
  const setOpen = useNav((s) => s.setMenuOpen);
  const screen = useSelf((s) => s.screen);
  const setScreen = useSelf((s) => s.setScreen);
  const { t } = useT();
  const panel = useRef<HTMLDivElement | null>(null);

  // Escape closes it, and so does the hardware key a bench has and a seat
  // does not. Cheap, and it keeps the drawer from being a trap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const go = (s: ScreenName) => () => {
    setScreen(s);
    setOpen(false);
  };

  const groups: Array<{
    key: Key;
    items: Array<{
      key: string;
      label: string;
      onPress?: () => void;
      href?: string;
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
          label: t("flightMap"),
          onPress: go("map"),
          current: screen === "map",
        },
        {
          key: "info",
          label: t("flightInformation"),
          onPress: go("flightInfo"),
          current: screen === "flightInfo",
        },
        {
          key: "weather",
          label: t("weather"),
          onPress: go("weather"),
          current: screen === "weather",
        },
        {
          key: "sky",
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
          label: t("movies"),
          onPress: go("movies"),
          current: screen === "movies",
        },
        {
          key: "music",
          label: t("music"),
          onPress: go("music"),
          current: screen === "music",
        },
        {
          key: "games",
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
          key: "dining",
          label: t("dining"),
          onPress: go("dining"),
          current: screen === "dining",
        },
        {
          key: "shop",
          label: t("dutyFree"),
          onPress: go("shop"),
          current: screen === "shop",
        },
        {
          key: "chat",
          label: t("chat"),
          onPress: go("chat"),
          current: screen === "chat",
        },
        // And that is the end of it. The reading light, the attendant call
        // and the screen switch were the last three rows here, and all three
        // are placards on the rail two inches below — lit, pressed and
        // answered there, on every screen, without opening anything. A
        // drawer that mixes seven doors with three switches makes you read
        // each row to find out which kind it is. This one is doors.
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
        {/* Words, not pictures.
 
            Every row carried a 60px mark, and four of them were photographed
            objects while the other four were drawn glyphs — a list where half
            the entries are one kind of thing and half are another is a list
            you have to read anyway. Reading is what a menu is for; the marks
            stayed on the cards, where a card has room to be a picture of
            something. */}
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
                    {it.label}
                  </a>
                ) : (
                  <button
                    key={it.key}
                    className="ife-drawer-row"
                    data-current={!!it.current}
                    tabIndex={open ? 0 : -1}
                    onClick={it.onPress}
                  >
                    {it.label}
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

