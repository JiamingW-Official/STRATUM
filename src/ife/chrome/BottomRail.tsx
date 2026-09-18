import { useEffect, useRef, useState } from "react";
import { useCabin, useSelf } from "../../flight-state/store";
import type { IFEBridge, ScreenName } from "../../flight-state/types";
import { useT } from "../i18n";
import { currentTrack, usePlayer } from "../player";
import { STATIONS } from "../stations";
import { Sleeve } from "./Sleeve";
import {
  IconCall,
  IconNext,
  IconPause,
  IconPlay,
  IconPrev,
  IconRepeat,
  IconShuffle,
  IconHome,
  IconLang,
  IconLight,
  IconPower,
  IconPlan,
  IconVolume,
} from "./icons";

/**
 * The rail a passenger reaches for without looking.
 *
 * It is placards now, not labelled buttons. Every seat-back system ends up
 * here and for the same two reasons: the row has to survive translation into
 * a language whose words are a different length, and a symbol at 30px is
 * legible across a dark cabin where 22px of text is not. The words have not
 * gone anywhere — they are the accessible name of each control, which is what
 * a screen reader reads and what a test clicks.
 *
 * Two of them open a panel instead of doing something immediately, because
 * they are settings rather than actions: language, and volume. A control that
 * cycles through four values on tap, which is what volume used to do, makes
 * you press it three times to go back one.
 */
/** m:ss, and a dash until something has said how long the track is. */
function clock(sec: number) {
  if (!sec || !isFinite(sec)) return "--:--";
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
}

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
  const { t } = useT();

  const { stationIdx, trackIdx, playing, progress, elapsed, duration } =
    usePlayer();
  const shuffle = usePlayer((s) => s.shuffle);
  const repeat = usePlayer((s) => s.repeat);
  const toggleShuffle = usePlayer((s) => s.toggleShuffle);
  const cycleRepeat = usePlayer((s) => s.cycleRepeat);
  const seek = usePlayer((s) => s.seek);
  const togglePlay = usePlayer((s) => s.toggle);
  const next = usePlayer((s) => s.next);
  const prev = usePlayer((s) => s.prev);
  // A track that has been chosen but paused still has a player: the handle
  // does not vanish because the music stopped. It does vanish while an
  // announcement holds the cabin — leaving a play key there would be offering
  // a way to listen past the announcement, and an announcement you can listen
  // past is not an announcement.
  const interrupted = usePlayer((s) => s.interrupted);
  const media = usePlayer((s) => s.progress > 0 || s.playing);
  const setPlayerVolume = usePlayer((s) => s.setVolume);
  const now = currentTrack(stationIdx, trackIdx);
  // The list already knows how long every track is, measured off the file, so
  // the bar can say so before the audio element has loaded enough to agree.
  const trackSeconds = STATIONS[stationIdx]?.lengths?.[trackIdx] ?? 0;

  const [pop, setPop] = useState<null | "volume">(null);

  // The volume in the rail used to be a number with nothing behind it.
  useEffect(() => setPlayerVolume(volume), [volume, setPlayerVolume]);

  const go = (s: ScreenName) => () => {
    setPop(null);
    setScreen(s);
  };
  const light = !!self?.readingLight;
  const calling = !!self?.callAttendant;

  return (
    <div className="ife-rail">
      {/* Three zones, the shape every player bar has settled on: what is
          playing on the left, the transport in the middle, the controls on
          the right. */}
      <div className="ife-rail-left">
      {/* The seat, printed on the glass the way it is printed on a real bezel.
          The cabin class used to sit beside it; it is on the boarding pass, on
          the home screen, and implied by the seat number itself. */}
      <div className="ife-seat-chip">
        <span className="ife-seat-chip-no">{seat}</span>
      </div>

      <RailButton
        label={t("home")}
        icon={<IconHome size={48} />}
        current={screen === "home"}
        onClick={go("home")}
      />
      <RailButton
        label={t("flightMap")}
        icon={<IconPlan size={48} />}
        current={screen === "map"}
        onClick={go("map")}
      />

      {/* What is playing, at this end, where it is on every player bar there
          has ever been — and the cover is a door: pressing it opens the record
          it belongs to, which is what pressing the art does in every music
          app. */}
      {(playing || media) && !interrupted && (
        <button
          className="ife-rail-now"
          onClick={go("music")}
          aria-label={now.station.name}
          style={{ ["--stationColor" as string]: now.station.color }}
        >
          <span className="ife-rail-now-art">
            <Sleeve station={now.station} />
          </span>
          <span className="ife-rail-now-text">
            <span className="ife-rail-now-title">{now.title}</span>
            <span className="ife-rail-now-sub">
              {now.artist || now.station.name}
            </span>
          </span>
        </button>
      )}
      </div>

      {/* The player lives here.
 
          It had a bar of its own above the rail on the music page, which meant
          the cabin had two rows of controls stacked on top of each other and
          the player only existed while you were looking at the music. A
          seat-back system puts it in the one row that is always there.
 
          No surface under it. Everything else in this rail is a key and takes
          a lens; this is not a key, it is the state of the sound, and a panel
          around it made it look like one more thing to press. It sits in the
          middle of the rail because that is the middle of the row, not the
          middle of whatever space the keys happened to leave.
 
          It is a div with buttons in it rather than one button that toggles:
          pressing the thing to find out what it does is not a control. */}
      {(playing || media) && !interrupted && (
        <div
          className="ife-mini"
          style={{ ["--stationColor" as string]: now.station.color }}
        >
          <span className="ife-mini-keys">
            <button
              className="ife-transport"
              aria-label={t("shuffle")}
              data-on={shuffle}
              onClick={toggleShuffle}
            >
              <IconShuffle size={32} />
            </button>
            <button
              className="ife-transport"
              aria-label={t("previous")}
              onClick={prev}
            >
              <IconPrev size={32} />
            </button>
            <button
              className="ife-transport ife-transport--play"
              aria-label={playing ? t("pause") : t("play")}
              onClick={togglePlay}
            >
              {playing ? <IconPause size={36} /> : <IconPlay size={36} />}
            </button>
            <button
              className="ife-transport"
              aria-label={t("next")}
              onClick={next}
            >
              <IconNext size={32} />
            </button>
            <button
              className="ife-transport"
              aria-label={t("repeat")}
              data-on={repeat !== "off"}
              onClick={cycleRepeat}
            >
              <IconRepeat size={32} one={repeat === "one"} />
            </button>
          </span>

          {/* The clock at both ends of a bar you can drag, which is the shape
              this has had since a tape deck had a counter on it. */}
          <span className="ife-mini-seekrow">
            <span className="ife-mini-clock ife-mono">{clock(elapsed)}</span>
            <button
              className="ife-mini-seek"
              aria-label={t("seek")}
              onClick={(e) =>
                seek(
                  e.nativeEvent.offsetX /
                    (e.currentTarget as HTMLElement).clientWidth,
                )
              }
            >
              <span
                className="ife-mini-seek-fill"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </button>
            <span className="ife-mini-clock ife-mono">
              {clock(duration || trackSeconds)}
            </span>
          </span>
        </div>
      )}

      <div className="ife-rail-right">
      {/* The language is a screen, not a popover hanging off a placard. It
          is the first question a seat-back system asks and the one a
          passenger comes back to when somebody else sits down; a two-row
          menu in the corner was treating it as a preference. */}
      <RailButton
        label={t("language")}
        icon={<IconLang size={48} />}
        current={screen === "language"}
        onClick={go("language")}
      />

      {/* Volume is a bar, and nothing else: no panel, no label, no number.
          It stands directly above its own button so the thing you press and
          the thing that answers are in one column — which is how a volume
          rocker on an armrest works, and it needs no explaining. */}
      <div className="ife-pop-anchor">
        <button
          className="ife-tool"
          onClick={() => setPop(pop === "volume" ? null : "volume")}
          aria-label={t("volume")}
          title={t("volume")}
          aria-expanded={pop === "volume"}
        >
          <IconVolume size={48} />
        </button>
        {pop === "volume" && (
          <VolumeColumn value={volume} onChange={setVolume} />
        )}
      </div>

      <RailButton
        label={t("readingLight")}
        icon={<IconLight size={48} />}
        on={light}
        pressed={light}
        onClick={() => bridge.setReadingLight(!light)}
      />
      {/* A call already placed says so and offers to take it back, because the
          light it turned on is above your head and everyone can see it. */}
      <RailButton
        label={calling ? t("cancelCall") : t("callAttendant")}
        icon={<IconCall size={48} />}
        alert={calling}
        pressed={calling}
        onClick={() => bridge.callAttendant(!calling)}
      />
      {/* Power at the end of the row, where the cabin this references puts it.
          Bluetooth and a gear sit there too and neither is here: this bench
          has no radio to pair with, and the settings are the drawer. A
          placard that does nothing is the one thing this cabin does not
          carry. */}
      <RailButton
        label={t("screenOff")}
        icon={<IconPower size={48} />}
        onClick={() => setScreen("off")}
      />

      </div>

      {pop && (
        <button
          className="ife-pop-away"
          aria-label={t("close")}
          onClick={() => setPop(null)}
        />
      )}
    </div>
  );
}

function RailButton({
  label,
  icon,
  onClick,
  current,
  on,
  alert,
  pressed,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  current?: boolean;
  on?: boolean;
  alert?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      className="ife-tool"
      onClick={onClick}
      aria-label={label}
      title={label}
      data-current={current ?? false}
      data-on={on ?? false}
      data-alert={alert ?? false}
      {...(pressed === undefined ? {} : { "aria-pressed": pressed })}
    >
      {icon}
    </button>
  );
}


/**
 * A bare vertical bar, directly above its button.
 *
 * It had been a panel with a title and a readout, which is three pieces of
 * furniture around one quantity. The bar is the readout: its height is the
 * value, so a number beside it says the same thing twice.
 *
 * It reads the pointer's offset inside its own track, never a bounding rect —
 * the rule the film's scrub bar follows and for the same reason: under the CSS
 * 3D transform that puts this screen on a seat back, a bounding rect is the
 * projected quad and arithmetic against it comes out wrong.
 */
function VolumeColumn({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const dragging = useRef(false);
  const set = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = e.currentTarget;
    // Up is louder, so the offset is measured from the bottom.
    const frac = Math.min(
      1,
      Math.max(0, 1 - e.nativeEvent.offsetY / track.clientHeight),
    );
    onChange(Math.round(frac * 20) / 20);
  };
  return (
    <div
      className="ife-vol"
      role="slider"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      onPointerDown={(e) => {
        dragging.current = true;
        set(e);
      }}
      onPointerMove={(e) => {
        if (dragging.current && e.buttons === 1) set(e);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      <span className="ife-vol-fill" style={{ height: `${value * 100}%` }} />
    </div>
  );
}

