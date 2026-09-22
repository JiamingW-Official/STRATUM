import { create } from "zustand";
import { useEffect } from "react";
import { useFlight, useSelf } from "../flight-state/store";
import type { FlightPhase } from "../flight-state/types";
import {
  buildAmbience,
  type Ambience,
  type AmbienceEvent,
  type Cabin,
} from "./ambienceGraph";

// ── What the aeroplane is doing, as far as the sound is concerned ────────────
//
// The store carries six phases, and six is not enough to make a sound out of:
// "takeoff" covers both the roll and thirty minutes of climb, and those are
// the two least similar noises on the whole flight. So nothing here switches
// on the phase alone. It reads three more things:
//
//   altitude       which is what the air is like
//   ground speed   which is what the air is doing
//   phase age      how long this phase has been going on
//
// The first two are continuous, already in the store, and will arrive from a
// real receiver in the same fields. The third is not in the store and cannot
// be — "landed" is one label whether the wheels touched a second ago or a
// minute ago, and almost everything a cabin does after a landing is a
// function of which. So it is measured here, against the audio clock, and
// handed in. It is what lets the tail start up two dozen seconds after the
// rollout instead of during it.
//
// The pay-off is that the bed is continuous. There is no moment where a label
// changes and the room changes with it.

export type Snapshot = { phase: FlightPhase; altFt: number; gsKt: number };

const ORDER: FlightPhase[] = [
  "boarding",
  "taxi",
  "takeoff",
  "cruise",
  "descent",
  "landed",
];

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** 0 below `a`, 1 above `b`, straight line between. */
const ramp = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));

/**
 * How much air is hitting the skin, normalised so cruise sits near 0.9.
 *
 * This is the one piece of physics worth doing properly, because doing it
 * badly gets the flight the wrong way round. Boundary-layer noise goes with
 * the density of the air times the square of the speed through it, and at
 * thirty-seven thousand feet the density is a quarter of what it is on the
 * runway. So five hundred knots up there is not four times louder than a
 * hundred and sixty on the roll — it is about the same, and the loudest part
 * of the whole flight is the climb through ten thousand, where the aircraft is
 * already fast and the air is still thick.
 *
 * Every passenger knows that and nobody can say it. A model that made cruise
 * the loudest thing would be wrong in a way people feel without being able to
 * name, which is the worst kind of wrong for a room tone.
 */
export function dynamicPressure(altFt: number, gsKt: number) {
  const density = Math.exp(-Math.max(0, altFt) / 27800);
  return (density * (gsKt / 480) ** 2) / 0.3;
}

/**
 * @param ageSec seconds since this phase began. Infinity means settled —
 * whatever this phase eventually sounds like, without the arrival.
 */
export function cabinAt(s: Snapshot, ageSec = Infinity): Cabin {
  const { phase, altFt, gsKt } = s;
  const onGround =
    phase === "boarding" || phase === "taxi" || phase === "landed" || altFt < 40;

  let n1: number;
  let apu: number;
  let murmur: number;

  if (phase === "boarding") {
    // Nothing running but the tail, and a cabin full of people finding their
    // seats — which is the loudest a cabin gets without an engine in it.
    n1 = 0;
    apu = 1;
    murmur = 1;
  } else if (phase === "taxi") {
    // Both engines come up over about half a minute, and the tail goes out
    // once they have. Idle is not 0: an idling turbofan is the floor of every
    // taxi anybody has ever sat through, and 0 is a parked aeroplane.
    n1 = 0.3 * ramp(ageSec, 3, 30);
    apu = 1 - ramp(ageSec, 22, 34);
    murmur = 0.5;
  } else if (phase === "takeoff") {
    // Full power off the blocks, then the step back to climb thrust. The knee
    // is at a thousand feet, which is where it is on a real one and is the
    // reason a climb has an audible moment in it.
    n1 = altFt < 1000 ? 0.95 : 0.9 - 0.14 * clamp01(altFt / 32000);
    apu = 0;
    // Nobody talks on a climb.
    murmur = 0.1;
  } else if (phase === "cruise") {
    n1 = 0.52;
    apu = 0;
    murmur = 0.3;
  } else if (phase === "descent") {
    // Idle all the way down, then back up on the approach — the two engine
    // events a passenger actually notices, and they are both this line.
    n1 = altFt > 8000 ? 0.2 : 0.2 + 0.28 * (1 - clamp01(altFt / 8000));
    apu = 0;
    murmur = 0.32;
  } else {
    // On the ground again. Reverse is an event and not a level, so what is
    // left here is the rollout at a raised idle, then taxi idle, then
    // shutdown — and then the tail, which takes until somebody has asked for
    // it. Everybody stands up long before the aircraft stops, which is the
    // one moment in a flight where the cabin is louder than the aeroplane.
    n1 = ageSec < 12 ? 0.4 : ageSec < 45 ? 0.22 : 0;
    apu = ramp(ageSec, 24, 36);
    murmur = 0.3 + 0.7 * ramp(ageSec, 20, 50);
  }

  // The packs come off for the roll on a heavy departure, and the cabin goes
  // quiet for about thirty seconds. Almost nobody could name it; everybody has
  // felt it, because it is the half-minute the aeroplane holds its breath.
  const packs = phase === "takeoff" && altFt < 800 ? 0.3 : 1;

  return {
    n1,
    q: Math.min(1.15, dynamicPressure(altFt, gsKt)),
    roll: onGround ? clamp01(gsKt / 165) : 0,
    packs,
    apu,
    murmur,
    gsKt,
  };
}

/* ── What just happened ─────────────────────────────────────────────────── */

export type Cue = { kind: AmbienceEvent; delay: number };

/**
 * True when the aircraft was moved rather than flown.
 *
 * The bench can force a phase and scrub a timeline, and a real feed can drop
 * out for ten minutes and come back somewhere else. Both look like a flight
 * that skipped, and a bed that fired a landing because the slider was dragged
 * is worse than one that fires nothing. When this is true the whole graph is
 * put where it belongs with no glide and no cues at all.
 */
export function teleported(a: Snapshot, b: Snapshot) {
  const i = ORDER.indexOf(a.phase);
  const j = ORDER.indexOf(b.phase);
  if (j < i) return true;
  if (j - i > 1) return true;
  return Math.abs(b.altFt - a.altFt) > 6000;
}

/**
 * The sounds an aeroplane makes at the seams between one state and the next.
 *
 * Almost all of these are a consequence of something the crew did, and the
 * delays are how long it takes them. Gear up is six seconds after the wheels
 * leave because that is how long it takes to be sure they have; the tail
 * starts twenty-four seconds after the rollout because until then nobody has
 * had a hand free.
 */
export function cues(a: Snapshot, b: Snapshot): Cue[] {
  const out: Cue[] = [];
  const rose = (ft: number) => a.altFt < ft && b.altFt >= ft;
  const fell = (ft: number) => a.altFt > ft && b.altFt <= ft;

  // Pushback, which the cabin hears as a door, two engines, the tail going
  // out, and then the sign.
  if (a.phase === "boarding" && b.phase === "taxi") {
    out.push({ kind: "doorClose", delay: 0 });
    out.push({ kind: "engineStart", delay: 4 });
    out.push({ kind: "chimeTriple", delay: 20 });
    out.push({ kind: "apuStop", delay: 30 });
    out.push({ kind: "chimeDouble", delay: 44 });
  }
  if (b.phase === "takeoff") {
    if (rose(50)) out.push({ kind: "gearUp", delay: 6 });
    // Flaps come in on the way up in two bites, which is why a climb has two
    // moments in it and not one.
    if (rose(1200)) out.push({ kind: "flapsIn", delay: 2 });
    if (rose(3500)) out.push({ kind: "flapsIn", delay: 0 });
  }
  // Ten thousand feet, going up: the sign goes off and half the cabin stands.
  if (rose(10000)) out.push({ kind: "chime", delay: 0 });

  // Top of descent: the sign goes back on, and a minute later the cabin
  // starts coming down, which is the ears before it is the sound.
  if (a.phase === "cruise" && b.phase === "descent") {
    out.push({ kind: "chime", delay: 0 });
    out.push({ kind: "outflow", delay: 9 });
  }
  if (b.phase === "descent") {
    if (fell(18000)) out.push({ kind: "speedbrake", delay: 0 });
    if (fell(10000)) out.push({ kind: "chime", delay: 0 });
    if (fell(6000)) out.push({ kind: "flapsOut", delay: 0 });
    if (fell(3200)) out.push({ kind: "flapsOut", delay: 0 });
    if (fell(2500)) out.push({ kind: "gearDown", delay: 0 });
    if (fell(1500)) out.push({ kind: "flapsOut", delay: 0 });
  }
  // The landing, which is more things happening in one minute than the rest
  // of the flight put together.
  if (a.phase === "descent" && b.phase === "landed") {
    out.push({ kind: "touchdown", delay: 0 });
    out.push({ kind: "speedbrake", delay: 0.2 });
    out.push({ kind: "reverse", delay: 0.8 });
    out.push({ kind: "reverseStow", delay: 11 });
    out.push({ kind: "apuStart", delay: 24 });
    out.push({ kind: "chime", delay: 40 });
    out.push({ kind: "flapsIn", delay: 48 });
  }
  return out;
}

/* ── What happens anyway ────────────────────────────────────────────────── */

/**
 * The cabin being a room.
 *
 * A bed alone goes dead after about a quarter of an hour. What keeps a room
 * alive over seven of them is not more texture — it is that things
 * occasionally happen in it, rarely, quietly, and never on a schedule. A bin
 * catch. A drawer in the galley. A pump cycling behind the wall. None of them
 * is worth noticing and the absence of all of them is.
 *
 * Which things, and how often, is the whole of what a phase is like. Boarding
 * is nothing but bins; a climb is almost silent because everybody is pinned
 * to their seat; cruise is where the cart is; and the thirty seconds after
 * the wheels are down is three hundred people opening every locker at once.
 */
const INCIDENTAL: Record<
  FlightPhase,
  { gap: [number, number]; pick: Array<[AmbienceEvent, number]> }
> = {
  boarding: {
    gap: [5, 17],
    pick: [
      ["binLatch", 6],
      ["seatCreak", 4],
      ["galley", 2],
      ["hydPump", 1],
      ["chimeTriple", 1],
    ],
  },
  taxi: {
    gap: [9, 26],
    pick: [
      ["seatCreak", 4],
      ["binLatch", 2],
      ["hydPump", 3],
      ["galley", 1],
    ],
  },
  takeoff: {
    gap: [16, 48],
    pick: [
      ["seatCreak", 3],
      ["hydPump", 3],
      ["trim", 4],
      ["outflow", 2],
    ],
  },
  cruise: {
    gap: [26, 88],
    pick: [
      ["cartPass", 3],
      ["galley", 4],
      ["binLatch", 3],
      ["seatCreak", 4],
      ["hydPump", 3],
      ["trim", 3],
      ["outflow", 2],
      ["chimeTriple", 1],
      ["turbulence", 2],
    ],
  },
  descent: {
    gap: [17, 52],
    pick: [
      ["seatCreak", 4],
      ["binLatch", 2],
      ["hydPump", 3],
      ["trim", 3],
      ["outflow", 2],
      ["turbulence", 2],
      ["chimeTriple", 1],
    ],
  },
  landed: {
    gap: [3, 12],
    pick: [
      ["binLatch", 8],
      ["seatCreak", 5],
      ["galley", 2],
      ["chimeTriple", 1],
    ],
  },
};

export function incidentalGap(phase: FlightPhase, rng = Math.random) {
  const [lo, hi] = INCIDENTAL[phase].gap;
  return lo + rng() * (hi - lo);
}

export function incidental(phase: FlightPhase, rng = Math.random): AmbienceEvent {
  const pick = INCIDENTAL[phase].pick;
  let total = 0;
  for (const [, w] of pick) total += w;
  let r = rng() * total;
  for (const [kind, w] of pick) {
    r -= w;
    if (r <= 0) return kind;
  }
  return pick[pick.length - 1][0];
}

/* ── The switch ─────────────────────────────────────────────────────────── */

const KEY = "stratum:ife:ambience";

type Store = {
  on: boolean;
  /**
   * True when the cabin is actually making a sound — the switch is on, a
   * gesture has happened, and the context is running. `on` is what the
   * passenger asked for; this is what is true.
   */
  live: boolean;
  set: (on: boolean) => void;
  toggle: () => void;
};

export const useAmbience = create<Store>((set, get) => ({
  // On, unless this seat has been told otherwise. An aeroplane does not have
  // a switch for whether it makes a noise, and a cabin that arrives silent is
  // a cabin nobody ever finds the sound of. It still cannot make a sound
  // before the first touch — no browser will — so what this actually means is
  // that the room is there from the moment the passenger picks a language.
  on: (() => {
    try {
      const v = localStorage.getItem(KEY);
      return v === null ? true : v === "1";
    } catch {
      return true;
    }
  })(),
  live: false,
  set: (on) => {
    try {
      localStorage.setItem(KEY, on ? "1" : "0");
    } catch {}
    set({ on });
  },
  toggle: () => get().set(!get().on),
}));

/* ── The engine ─────────────────────────────────────────────────────────── */

const TICK_MS = 250;

let ctx: AudioContext | null = null;
let bed: Ambience | null = null;

/**
 * Builds the cabin once and keeps it for the flight.
 *
 * Mounted at the top of the screen and nowhere else, because the aeroplane is
 * not a screen: the sound does not stop because you opened the map, and it
 * does not stop because you switched the panel off either. Somebody who puts
 * their screen out to sleep has turned off a light, not an engine.
 */
export function useCabinSound() {
  const on = useAmbience((s) => s.on);
  const live = useAmbience((s) => s.live);
  const volume = useSelf((s) => s.volume);
  const screen = useSelf((s) => s.screen);
  const pa = useFlight((s) => s.paOverride);

  // Build and tear down.
  useEffect(() => {
    if (!on) return;
    let cancelled = false;

    const boot = () => {
      if (cancelled || bed) return true;
      try {
        ctx ??= new (window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext)();
      } catch {
        return false;
      }
      bed = buildAmbience(ctx);
      // Straight to where the aircraft already is, settled. Somebody who
      // presses this four hours into a flight gets the cruise, not a takeoff.
      bed.snap(cabinAt(snapshot()));
      ctx.onstatechange = () =>
        useAmbience.setState({ live: !!bed && ctx?.state === "running" });
      useAmbience.setState({ live: ctx.state === "running" });
      return true;
    };

    // A browser will not make a sound until somebody has touched the page, so
    // the switch being on cannot simply start it: it waits, silently, for the
    // first thing the passenger does — which on a seat-back screen is the
    // touch that wakes it out of idle.
    const gesture = () => {
      window.removeEventListener("pointerdown", gesture, true);
      window.removeEventListener("keydown", gesture, true);
      boot();
      void ctx?.resume().then(() =>
        useAmbience.setState({ live: !!bed && ctx?.state === "running" }),
      );
    };
    if (!boot() || ctx?.state !== "running") {
      window.addEventListener("pointerdown", gesture, true);
      window.addEventListener("keydown", gesture, true);
      void ctx
        ?.resume()
        .then(() =>
          useAmbience.setState({ live: !!bed && ctx?.state === "running" }),
        )
        .catch(() => {});
    }

    // Some browsers suspend the context when the tab goes away and do not
    // resume it when it comes back. Eight hours is long enough for that to
    // happen to anybody.
    const wake = () => {
      if (document.visibilityState === "visible" && ctx?.state === "suspended")
        void ctx.resume().catch(() => {});
    };
    document.addEventListener("visibilitychange", wake);

    let last = snapshot();
    // Minus infinity, so the first tick reads every phase as settled: a
    // screen switched on mid-cruise has not just arrived at cruise.
    let phaseSince = -Infinity;
    let nextIncidental = Infinity;
    let first = true;

    const id = window.setInterval(() => {
      if (!bed || !ctx) return;
      const now = snapshot();
      const at = ctx.currentTime;

      if (first || teleported(last, now)) {
        phaseSince = -Infinity;
        nextIncidental = at + incidentalGap(now.phase);
        bed.snap(cabinAt(now), at);
        first = false;
      } else {
        if (now.phase !== last.phase) {
          phaseSince = at;
          // Whatever was due under the old phase is not due under the new
          // one: an aeroplane that has just landed is not still four minutes
          // from its next galley drawer.
          nextIncidental = at + incidentalGap(now.phase);
        }
        for (const c of cues(last, now)) bed.event(c.kind, at + c.delay);
        bed.update(cabinAt(now, at - phaseSince), at);
        if (at >= nextIncidental) {
          bed.event(incidental(now.phase), at);
          nextIncidental = at + incidentalGap(now.phase);
        }
      }
      last = now;
    }, TICK_MS);

    return () => {
      cancelled = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("pointerdown", gesture, true);
      window.removeEventListener("keydown", gesture, true);
      bed?.setLevel(0, ctx?.currentTime, 1.2);
      const dying = bed;
      bed = null;
      useAmbience.setState({ live: false });
      window.setTimeout(() => dying?.dispose(), 1500);
    };
  }, [on]);

  // Level.
  //
  // One jack, one knob: the cabin and the music come out of the same pair of
  // headphones, so they answer to the same control. The rest is ducking —
  // under a film, because a film has its own room in it, and under an
  // announcement, because an announcement you can hear past is not one.
  useEffect(() => {
    if (!bed || !ctx) return;
    const duck = pa ? 0.45 : screen === "film" ? 0.6 : 1;
    bed.setLevel(volume * 1.1 * duck, ctx.currentTime, pa ? 0.4 : 1.6);
  }, [volume, screen, pa, on, live]);

  // The handset keying up. It is the quarter of a second before an
  // announcement that everybody on the aeroplane stops talking for, and
  // without it the overlay arrives out of nowhere.
  useEffect(() => {
    if (!pa || !bed || !ctx) return;
    bed.event("paClick", ctx.currentTime);
  }, [pa]);
}

function snapshot(): Snapshot {
  const f = useFlight.getState();
  return { phase: f.phase, altFt: f.position.altFt, gsKt: f.position.gsKt };
}
