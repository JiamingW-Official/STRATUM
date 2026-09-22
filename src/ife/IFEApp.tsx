import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useCabin, useFlight, useSelf } from "../flight-state/store";
import type { IFEBridge } from "../flight-state/types";
/**
 * The map arrives after the cabin does.
 *
 * MapLibre is 272KB gzipped and the city list is another 90, and a static
 * import puts both in front of the first paint — the idle screen was waiting
 * on a globe nobody had asked for yet. So the module is split off and
 * fetched on the first idle frame instead: the cabin paints, and a moment
 * later the map is in memory, built, and holding its tiles for whenever
 * Flight map is pressed. Same "no buffering", one screen later in the queue.
 */
const MapScreen = lazy(() =>
  import("./screens/MapScreen").then((m) => ({ default: m.MapScreen })),
);

const warmMap = () => import("./screens/MapScreen");

import { JourneyStrip } from "./chrome/JourneyStrip";
import { BottomRail } from "./chrome/BottomRail";
import { MenuDrawer } from "./chrome/MenuDrawer";
import { Dining } from "./screens/Dining";
import { Shop } from "./screens/Shop";
import { Idle } from "./screens/Idle";
import { Home } from "./screens/Home";
import { FlightInfo } from "./screens/FlightInfo";
import { Music } from "./screens/Music";
import { Movies } from "./screens/Movies";
import { Games } from "./screens/Games";
import { Chat } from "./screens/Chat";
import { Language } from "./screens/Language";
import { Start } from "./screens/Start";
import { Overview } from "./screens/Overview";
import { Connections } from "./screens/Connections";
import { Screening } from "./screens/Screening";
import { PAOverlay } from "./screens/PAOverlay";
import { usePlayer } from "./player";
import { useNav } from "./nav";
import { useCabinSound } from "./ambience";
import "./ife.css";

/** Idle after this long without a touch, like every seat-back screen. */
const IDLE_AFTER_MS = 90_000;

/**
 * One seat's screen. It reads the flight from the shared store and asks for
 * anything outside the glass through `bridge` — which is how the same
 * component can run on a bench today and inside a 3D cabin later without
 * knowing the difference.
 */
export function IFEApp({ seat, bridge }: { seat: string; bridge: IFEBridge }) {
  const screen = useSelf((s) => s.screen);
  const setScreen = useSelf((s) => s.setScreen);
  const setSeat = useSelf((s) => s.setSeat);
  const paOverride = useFlight((s) => s.paOverride);
  const ensureSeat = useCabin((s) => s.setSeat);
  const setMenuOpen = useNav((s) => s.setMenuOpen);
  const menuOpen = useNav((s) => s.menuOpen);
  const started = useSelf((s) => s.started);
  const setStarted = useSelf((s) => s.setStarted);

  // The aeroplane, as a sound. Mounted here and nowhere else: it outlives
  // every screen below, including the one that is switched off — a passenger
  // who puts their panel out to sleep has turned off a light, not an engine.
  useCabinSound();

  // Whether the map has drawn a complete frame yet. Until it has, it is
  // kept painted-but-invisible rather than hidden: a canvas nobody can see
  // is a canvas the browser does not draw, and the first draw is shader
  // compilation and texture upload — 3.4 seconds of frozen main thread,
  // measured, starting 43ms after Flight map was pressed. Paying it while
  // somebody is still reading the idle screen is free; paying it under
  // their finger is not.
  // The language the cabin is in, on every root, so the stylesheet can tune
  // what Latin tracking does to Chinese. The display face has no CJK glyphs,
  // so those words are set in whatever the panel has — and the negative
  // letter-spacing drawn for Bricolage squeezes them.
  const lang = useSelf((st) => st.lang);

  const [mapDrawn, setMapDrawn] = useState(false);

  // Fetch the map's module once the cabin has painted, not before it. On the
  // first idle frame, so it is never in front of anything a finger is
  // waiting on — and once it is in, the map mounts, builds and starts its
  // tiles while the passenger is still reading the home screen.
  useEffect(() => {
    const ric =
      (window as any).requestIdleCallback ??
      ((fn: () => void) => window.setTimeout(fn, 400));
    const id = ric(() => void warmMap());
    return () => {
      const cancel = (window as any).cancelIdleCallback ?? window.clearTimeout;
      cancel(id);
    };
  }, []);

  // The screen follows whichever seat it is mounted for.
  useEffect(() => {
    setSeat(seat);
    ensureSeat(seat, { occupied: true });
  }, [seat, setSeat, ensureSeat]);

  // Where the passenger was before the announcement took the screen, so it can
  // be given back exactly as it was.
  const before = useRef<typeof screen | null>(null);
  const setInterrupted = usePlayer((s) => s.setInterrupted);
  useEffect(() => {
    if (paOverride) {
      if (before.current === null) before.current = screen;
    } else if (before.current !== null) {
      setScreen(before.current);
      before.current = null;
    }
  }, [paOverride, screen, setScreen]);

  // And it takes the sound. An announcement you can listen past is not an
  // announcement, and the media has to come back exactly as it was — the same
  // promise the screen makes.
  useEffect(() => {
    setInterrupted(!!paOverride);
  }, [paOverride, setInterrupted]);

  // Idle timeout. Suspended during an announcement, because the screen is not
  // the passenger's to leave — and suspended during a film, because watching
  // one is precisely twenty minutes of not touching anything. Left armed, the
  // idle screen interrupted the thing it exists to wait for.
  useEffect(() => {
    if (
      screen === "idle" ||
      screen === "off" ||
      screen === "film" ||
      screen === "language" ||
      screen === "start" ||
      paOverride
    )
      return;
    let id: number;
    const arm = () => {
      window.clearTimeout(id);
      id = window.setTimeout(() => setScreen("idle"), IDLE_AFTER_MS);
    };
    arm();
    const events = ["pointerdown", "keydown", "wheel"] as const;
    for (const e of events) window.addEventListener(e, arm);
    return () => {
      window.clearTimeout(id);
      for (const e of events) window.removeEventListener(e, arm);
    };
  }, [screen, paOverride, setScreen]);

  // A screen the passenger put out with the drawer's own switch, which one
  // touch brings back: a dark panel with no way out of it would be a trap,
  // and waking on touch is what the real thing does.
  if (screen === "off") {
    return (
      <div
        className="ife-root ife-off"
        lang={lang}
        data-screen="off"
        onPointerDown={() => setScreen("idle")}
      />
    );
  }

  if (screen === "idle") {
    return (
      <div className="ife-root" lang={lang} data-screen="idle">
        <Idle seat={seat} />
        <PAOverlay />
      </div>
    );
  }

  // The two screens before the cabin has a passenger yet. They take the whole
  // glass — no strip, no rail — because a seat that has not been told which
  // language it is in has no business drawing placards at somebody.
  if (screen === "language" || screen === "start") {
    return (
      <div className="ife-root" lang={lang} data-screen={screen}>
        {screen === "language" ? (
          <Language
            onDone={() => setScreen(started ? "home" : "start")}
          />
        ) : (
          <Start
            onDone={(mode) => {
              setStarted(true);
              if (mode === "rest") {
                bridge.setReadingLight(false);
                setScreen("off");
                return;
              }
              setScreen(
                mode === "watch"
                  ? "movies"
                  : mode === "listen"
                    ? "music"
                    : mode === "look"
                      ? "map"
                      : mode === "drink"
                        ? "dining"
                        : "home",
              );
            }}
          />
        )}
        <PAOverlay />
      </div>
    );
  }

  // A film gets the whole surface. On a seat-back screen "full screen" is not
  // a browser mode to request — the glass is the window — so it is simply the
  // one screen the journey strip and the rail stand down for.
  if (screen === "film") {
    return (
      <div className="ife-root" lang={lang} data-screen="film">
        <Screening />
        <PAOverlay />
      </div>
    );
  }

  return (
    <div className="ife-root" lang={lang} data-screen={screen}>
      <JourneyStrip
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen(!menuOpen)}
        onOpenOverview={() => setScreen("overview")}
      />
      <div className="ife-stage">
        {screen === "home" && <Home />}
        {/* The map is built once, on boot, and never taken down.
 
            It used to mount when you pressed Flight map and unmount when you
            left, which meant every visit destroyed the WebGL context and
            re-fetched every tile — the few seconds of grey before the earth
            appeared were not the network being slow, they were the map being
            built again from nothing. Kept alive it loads once, while you are
            still reading the home screen, and every visit after that is
            instant. Hidden it costs one idle context: MapLibre does not draw
            when nothing has changed. */}
        <div
          className="ife-stage-map"
          data-show={screen === "map"}
          data-warming={!mapDrawn}
        >
          <Suspense fallback={null}>
            <MapScreen onFirstRender={() => setMapDrawn(true)} />
          </Suspense>
        </div>
        {screen === "flightInfo" && <FlightInfo />}
        {screen === "music" && <Music />}
        {screen === "movies" && <Movies />}
        {screen === "games" && <Games />}
        {screen === "chat" && <Chat seat={seat} bridge={bridge} />}
        {screen === "dining" && <Dining />}
        {screen === "shop" && <Shop />}
        {screen === "overview" && <Overview />}
        {screen === "connections" && <Connections />}
      </div>
      <BottomRail seat={seat} bridge={bridge} />
      <MenuDrawer />
      <PAOverlay />
    </div>
  );
}
