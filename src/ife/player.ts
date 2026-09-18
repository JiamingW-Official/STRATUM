import { create } from "zustand";
import { STATIONS, splitTrack, trackSrc } from "./stations";

/**
 * One player for the whole cabin screen, not one per page.
 *
 * On a real seat-back system the music does not stop because you opened the
 * map — the audio belongs to the seat, and the screen is only a way of looking
 * at it. Keeping the element in a store rather than inside <Music/> is what
 * makes that true here, and it is also what lets the rail show a mini player
 * and an announcement take the sound away and give it back.
 */
type PlayerState = {
  stationIdx: number;
  trackIdx: number;
  playing: boolean;
  /** 0–1 through the current track. */
  progress: number;
  /** Seconds. 0 until the file has enough of itself to say. */
  elapsed: number;
  duration: number;
  /** Set while an announcement holds the cabin, so playback can be restored. */
  interrupted: boolean;

  play: () => void;
  pause: () => void;
  toggle: () => void;
  /** Out of order, and repeat: the two switches every player has. */
  shuffle: boolean;
  repeat: "off" | "all" | "one";
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  next: () => void;
  /** Back to the top of this track, or to the one before if you are at it. */
  prev: () => void;
  /** 0–1 through the current track. */
  seek: (f: number) => void;
  select: (stationIdx: number, trackIdx: number) => void;
  setVolume: (v: number) => void;
  /** Called when a PA override starts and ends. */
  setInterrupted: (on: boolean) => void;
};

let el: HTMLAudioElement | null = null;

function audio(): HTMLAudioElement {
  if (el) return el;
  el = new Audio();
  el.preload = "none";
  el.addEventListener("timeupdate", () => {
    const a = el!;
    usePlayer.setState({
      progress: a.duration ? a.currentTime / a.duration : 0,
      elapsed: a.currentTime || 0,
      duration: a.duration || 0,
    });
  });
  el.addEventListener("ended", () => {
    // What happens at the end of a track is the repeat switch's business, and
    // nothing else's: "one" plays it again, and everything else moves on.
    const p = usePlayer.getState();
    if (p.repeat === "one") {
      el!.currentTime = 0;
      void el!.play();
      return;
    }
    p.next();
  });
  return el;
}

function load(stationIdx: number, trackIdx: number) {
  const station = STATIONS[stationIdx];
  const track = station.tracks[trackIdx % station.tracks.length];
  const a = audio();
  a.src = trackSrc(station, track);
  usePlayer.setState({ progress: 0 });
}

export const usePlayer = create<PlayerState>((set, get) => ({
  stationIdx: 0,
  trackIdx: 0,
  playing: false,
  elapsed: 0,
  duration: 0,
  shuffle: false,
  repeat: "off",
  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
  cycleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === "off" ? "all" : s.repeat === "all" ? "one" : "off",
    })),
  progress: 0,
  interrupted: false,

  play: () => {
    const a = audio();
    if (!a.src) load(get().stationIdx, get().trackIdx);
    a.play().then(
      () => set({ playing: true }),
      // Autoplay policy, a missing file, a codec the browser will not take —
      // all of them mean the same thing to the screen: it is not playing.
      () => set({ playing: false }),
    );
  },
  pause: () => {
    audio().pause();
    set({ playing: false });
  },
  toggle: () => (get().playing ? get().pause() : get().play()),
  /**
   * The rule every player has settled on, for a reason: three seconds in,
   * "back" means the start of this one, because that is what a person who
   * presses it in the middle of a song wants.
   */
  prev: () => {
    const a = audio();
    if (a.currentTime > 3) {
      a.currentTime = 0;
      return;
    }
    const { stationIdx, trackIdx, playing } = get();
    const n = STATIONS[stationIdx].tracks.length;
    set({ trackIdx: (trackIdx - 1 + n) % n, progress: 0, elapsed: 0 });
    if (playing) get().play();
  },
  seek: (f) => {
    const a = audio();
    if (!a.duration) return;
    a.currentTime = Math.max(0, Math.min(1, f)) * a.duration;
  },
  next: () => {
    const { stationIdx, trackIdx, playing, shuffle } = get();
    const count = STATIONS[stationIdx].tracks.length;
    // Shuffled, "next" is any other track — never the one already playing,
    // because a shuffle that can hand you the same song twice in a row is the
    // thing everybody complains about.
    const n = shuffle
      ? count < 2
        ? trackIdx
        : (trackIdx + 1 + Math.floor(Math.random() * (count - 1))) % count
      : (trackIdx + 1) % count;
    set({ trackIdx: n });
    load(stationIdx, n);
    if (playing) get().play();
  },
  select: (stationIdx, trackIdx) => {
    set({ stationIdx, trackIdx });
    load(stationIdx, trackIdx);
    get().play();
  },
  setVolume: (v) => {
    audio().volume = Math.min(1, Math.max(0, v));
  },
  setInterrupted: (on) => {
    const { playing, interrupted } = get();
    if (on && !interrupted) {
      // Remember whether it was playing, then take the sound away.
      set({ interrupted: playing });
      if (playing) get().pause();
    } else if (!on && interrupted) {
      set({ interrupted: false });
      get().play();
    }
  },
}));

/** What the rail and the music screen both need to label the current track. */
export function currentTrack(stationIdx: number, trackIdx: number) {
  const station = STATIONS[stationIdx];
  const raw = station.tracks[trackIdx % station.tracks.length];
  return { station, raw, ...splitTrack(raw) };
}
