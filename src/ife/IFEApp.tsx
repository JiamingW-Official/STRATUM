import { useEffect, useRef } from "react";
import { useCabin, useFlight, useSelf } from "../flight-state/store";
import type { IFEBridge } from "../flight-state/types";
import { JourneyStrip } from "./chrome/JourneyStrip";
import { BottomRail } from "./chrome/BottomRail";
import { Idle } from "./screens/Idle";
import { Home } from "./screens/Home";
import { MapScreen } from "./screens/MapScreen";
import { FlightInfo } from "./screens/FlightInfo";
import { Music } from "./screens/Music";
import { Placeholder } from "./screens/Placeholder";
import { PAOverlay } from "./screens/PAOverlay";
import { usePlayer } from "./player";
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

  // Idle timeout. Suspended during an announcement: the screen is not the
  // passenger's to leave.
  useEffect(() => {
    if (screen === "idle" || screen === "off" || paOverride) return;
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

  if (screen === "off") {
    return <div className="ife-root" data-screen="off" />;
  }

  if (screen === "idle") {
    return (
      <div className="ife-root" data-screen="idle">
        <Idle seat={seat} />
        <PAOverlay />
      </div>
    );
  }

  return (
    <div className="ife-root" data-screen={screen}>
      <JourneyStrip
        onBack={() => setScreen(screen === "home" ? "idle" : "home")}
      />
      <div className="ife-stage">
        {screen === "home" && <Home />}
        {screen === "map" && <MapScreen />}
        {screen === "flightInfo" && <FlightInfo />}
        {screen === "music" && <Music />}
        {screen === "movies" && <Placeholder titleKey="movies" />}
        {screen === "games" && <Placeholder titleKey="games" />}
      </div>
      <BottomRail seat={seat} bridge={bridge} />
      <PAOverlay />
    </div>
  );
}
