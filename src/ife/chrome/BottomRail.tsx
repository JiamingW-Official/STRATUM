import { useEffect, useRef, useState } from "react";
import { useCabin, useSelf } from "../../flight-state/store";
import type { IFEBridge, ScreenName } from "../../flight-state/types";
import { useT } from "../i18n";
import { currentTrack, usePlayer } from "../player";
import {
  IconCall,
  IconHome,
  IconMenu,
  IconLang,
  IconLight,
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
  const lang = useSelf((s) => s.lang);
  const setLang = useSelf((s) => s.setLang);
  const self = useCabin((s) => s.seats[seat]);
  const { t } = useT();

  const { stationIdx, trackIdx, playing } = usePlayer();
  const togglePlay = usePlayer((s) => s.toggle);
  const setPlayerVolume = usePlayer((s) => s.setVolume);
  const now = currentTrack(stationIdx, trackIdx);

  const [pop, setPop] = useState<null | "lang" | "volume">(null);

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
      {/* The seat, printed on the glass the way it is printed on a real bezel.
          The cabin class used to sit beside it; it is on the boarding pass, on
          the home screen, and implied by the seat number itself. */}
      <div className="ife-seat-chip">
        <span className="ife-seat-chip-no">{seat}</span>
      </div>

      {/* The index of everything, which a shelf that scrolls cannot be. */}
      <RailButton
        label={t("menu")}
        icon={<IconMenu size={46} />}
        current={screen === "menu"}
        onClick={go("menu")}
      />
      <RailButton
        label={t("home")}
        icon={<IconHome size={46} />}
        current={screen === "home"}
        onClick={go("home")}
      />
      <RailButton
        label={t("flightMap")}
        icon={<IconPlan size={46} />}
        current={screen === "map"}
        onClick={go("map")}
      />

      <div className="ife-rail-spacer" />

      {/* Mini player, the way every seat-back system carries one: the music
          does not belong to the music page, so its handle never leaves. */}
      {playing && (
        <button
          className="ife-mini"
          style={{ ["--stationColor" as string]: now.station.color }}
          onClick={togglePlay}
          aria-label={t("pause")}
        >
          <span className="ife-mini-swatch" />
          <span className="ife-mini-text">
            <span className="ife-mini-title">{now.title}</span>
            <span className="ife-mini-station">{now.station.name}</span>
          </span>
          <span className="ife-mini-bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      )}

      <Popover
        open={pop === "lang"}
        onToggle={() => setPop(pop === "lang" ? null : "lang")}
        label={t("language")}
        icon={<IconLang size={46} />}
      >
        <div className="ife-pop-title ife-cap">{t("language")}</div>
        {(
          [
            ["en", "English"],
            ["zh", "中文"],
          ] as const
        ).map(([code, name]) => (
          <button
            key={code}
            className="ife-pop-row"
            data-on={lang === code}
            onClick={() => {
              setLang(code);
              setPop(null);
            }}
          >
            <span>{name}</span>
            {lang === code && <Tick />}
          </button>
        ))}
      </Popover>

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
          <IconVolume size={46} />
        </button>
        {pop === "volume" && (
          <VolumeColumn value={volume} onChange={setVolume} />
        )}
      </div>

      <RailButton
        label={t("readingLight")}
        icon={<IconLight size={46} />}
        on={light}
        pressed={light}
        onClick={() => bridge.setReadingLight(!light)}
      />
      {/* A call already placed says so and offers to take it back, because the
          light it turned on is above your head and everyone can see it. */}
      <RailButton
        label={calling ? t("cancelCall") : t("callAttendant")}
        icon={<IconCall size={46} />}
        alert={calling}
        pressed={calling}
        onClick={() => bridge.callAttendant(!calling)}
      />

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

function Popover({
  open,
  onToggle,
  label,
  icon,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="ife-pop-anchor">
      <button
        className="ife-tool"
        onClick={onToggle}
        aria-label={label}
        title={label}
        aria-expanded={open}
        data-current={open}
      >
        {icon}
      </button>
      {open && <div className="ife-pop">{children}</div>}
    </div>
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

const Tick = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="m5 12.6 4.6 4.6L19 7.8"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
