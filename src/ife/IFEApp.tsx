import { useEffect, useRef } from "react";
import { useCabin, useFlight, useSelf } from "../flight-state/store";
import type { IFEBridge } from "../flight-state/types";
import { JourneyStrip } from "./chrome/JourneyStrip";
import { BottomRail } from "./chrome/BottomRail";
import { MenuDrawer } from "./chrome/MenuDrawer";
import { Idle } from "./screens/Idle";
import { Home } from "./screens/Home";
import { MapScreen } from "./screens/MapScreen";
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
        data-screen="off"
        onPointerDown={() => setScreen("idle")}
      />
    );
  }

  if (screen === "idle") {
    return (
      <div className="ife-root" data-screen="idle">
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
      <div className="ife-root" data-screen={screen}>
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
      <div className="ife-root" data-screen="film">
        <Screening />
        <PAOverlay />
      </div>
    );
  }

  return (
    <div className="ife-root" data-screen={screen}>
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
        <div className="ife-stage-map" data-show={screen === "map"}>
          <MapScreen />
        </div>
        {screen === "flightInfo" && <FlightInfo />}
        {screen === "music" && <Music />}
        {screen === "movies" && <Movies />}
        {screen === "games" && <Games />}
        {screen === "chat" && <Chat seat={seat} bridge={bridge} />}
        {screen === "overview" && <Overview />}
        {screen === "connections" && <Connections />}
      </div>
      <BottomRail seat={seat} bridge={bridge} />
      <MenuDrawer seat={seat} bridge={bridge} />
      <PAOverlay />
    </div>
  );
}
