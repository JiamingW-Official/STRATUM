import { useCabin, useSelf } from "../../flight-state/store";
import type { IFEBridge, ScreenName } from "../../flight-state/types";
import { IconCall, IconHome, IconLight, IconMap, IconVolume } from "./icons";

/**
 * The rail a passenger reaches for without looking. Home and the map on the
 * left because they are navigation; the two cabin controls on the right
 * because they are not — pressing them changes something outside this screen,
 * where other people can see it.
 */
export function BottomRail({
  seat,
  bridge,
}: {
  seat: string;
  bridge: IFEBridge;
}) {
  const screen = useSelf((s) => s.screen);
  const setScreen = useSelf((s) => s.setScreen);
  const volume = useSelf((s) => s.volume);
  const setVolume = useSelf((s) => s.setVolume);
  const self = useCabin((s) => s.seats[seat]);

  const go = (s: ScreenName) => () => setScreen(s);
  const light = !!self?.readingLight;
  const calling = !!self?.callAttendant;

  // Four steps rather than a slider: a slider needs a fine target and there is
  // nothing playing yet to judge it against. It can grow a track when media
  // arrives.
  const cycleVolume = () => {
    const steps = [0, 0.3, 0.6, 1];
    const i = steps.findIndex((s) => s >= volume - 0.01);
    setVolume(steps[(i + 1) % steps.length]);
  };

  return (
    <div className="ife-rail">
      <button
        className="ife-tool"
        onClick={go("home")}
        data-current={screen === "home"}
      >
        <IconHome />
        Home
      </button>
      <button
        className="ife-tool"
        onClick={go("map")}
        data-current={screen === "map"}
      >
        <IconMap />
        Map
      </button>

      <div className="ife-rail-spacer" />

      <button className="ife-tool" onClick={cycleVolume}>
        <IconVolume />
        <span className="ife-mono">{Math.round(volume * 100)}</span>
      </button>
      <button
        className="ife-tool"
        data-on={light}
        aria-pressed={light}
        onClick={() => bridge.setReadingLight(!light)}
      >
        <IconLight />
        Reading light
      </button>
      {/* A call already placed says so and offers to take it back, because the
          light it turned on is above your head and everyone can see it. */}
      <button
        className="ife-tool"
        data-on={calling}
        aria-pressed={calling}
        onClick={() => bridge.callAttendant(!calling)}
      >
        <IconCall />
        {calling ? "Cancel call" : "Call attendant"}
      </button>
    </div>
  );
}
