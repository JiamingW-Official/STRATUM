// ── The cabin, as a sound ────────────────────────────────────────────────────
//
// Synthesised, not sampled, and the reason is the length of a flight. A
// recording long enough not to betray itself over seven hours is a hundred
// megabytes; a recording short enough to ship is a loop, and a loop is the one
// thing the ear finds in a room tone. Give it four minutes and it has the
// period. Give it an hour and the period is all it can hear.
//
// So nothing here repeats. Every band is noise with no seam in it, every level
// is walking somewhere slightly different every few seconds, and the two noise
// sources are different lengths read at a rate that is never quite what it was
// a moment ago. There is no interval at which any of this comes back around.
//
// Eight beds, which is what an aeroplane is made of:
//
//   air     the boundary layer tearing along the skin — the loudest thing in
//           the cabin above ten thousand feet, and the one people mean when
//           they say a flight is loud
//   seal    the top of that: window seals and door frames, the whistle rather
//           than the roar. Almost nothing on the ground and most of what
//           makes cruise sound like altitude instead of like a basement
//   hiss    the packs, the conditioned air coming out of the ceiling. It is
//           the quietest band here and the only one that is on at the gate,
//           which is why a parked cabin sounds like a cabin and not a room
//   murmur  three hundred people and their bags. Speech-shaped noise under a
//           four-hertz wobble, which is what a crowd is when you stop being
//           able to make out any of it
//   roar    the engines' broadband, low and behind you
//   rumble  the bottom of that, felt through the seat frame more than heard.
//           Filtered noise, never oscillators: a fundamental with harmonics
//           on it is a propeller, and that is a mistake you can hear
//   fan     the buzz, up around two kilohertz and wide. Bandpassed noise
//           rather than an oscillator, and nothing like narrow: a sine is a
//           synthesiser and a narrow band is a blade
//   ground  concrete under the wheels. The one band that stops dead at
//           rotation, which is the moment everyone in the cabin notices
//
// And two dozen things that happen on top of them. Half are consequences of
// the flight — gear, flaps, the start, the landing — and half are the cabin
// being a room with people in it: a bin catch, a galley drawer, a pump
// cycling behind the wall. The second half is the reason this survives being
// left on. A bed alone is a texture and a texture goes dead after a quarter
// of an hour; what keeps a room alive is that things occasionally happen in
// it, rarely, and not on any schedule.
//
// Every node takes an explicit time rather than reading the clock, so the
// whole graph can be rendered offline at a hundred times speed and measured.
// tests/ambience.spec.ts does exactly that, and it is the only reason any of
// the numbers below can be claimed rather than hoped.

export type Cabin = {
  /** 0–1. Engine setting; everything tonal follows it. */
  n1: number;
  /** 0–1. Dynamic pressure on the skin, normalised to a cruise of about 0.9. */
  q: number;
  /** 0–1. How hard the wheels are working. Zero the instant they leave. */
  roll: number;
  /** 0–1. The packs. Dips for the roll on an aircraft that takes them off. */
  packs: number;
  /** 0–1, so it can be faded rather than switched: the tail takes a while. */
  apu: number;
  /** 0–1. How full of people the cabin sounds. */
  murmur: number;
  /** Knots over the ground, for the rate of the joints under the wheels. */
  gsKt: number;
};

export type AmbienceEvent =
  // The aircraft
  | "engineStart"
  | "apuStart"
  | "apuStop"
  | "gearUp"
  | "gearDown"
  | "flapsOut"
  | "flapsIn"
  | "speedbrake"
  | "touchdown"
  | "reverse"
  | "reverseStow"
  | "turbulence"
  // The cabin
  | "chime"
  | "chimeDouble"
  | "chimeTriple"
  | "paClick"
  | "doorClose"
  | "binLatch"
  | "galley"
  | "cartPass"
  | "hydPump"
  | "trim"
  | "outflow"
  | "seatCreak";

export type Ambience = {
  /** Move the bed towards `c`. `at` is a context time, so this renders offline. */
  update(c: Cabin, at?: number): void;
  /** Put the bed exactly at `c` with no glide. Used on the first tick and
   *  whenever the aircraft has been moved rather than flown. */
  snap(c: Cabin, at?: number): void;
  event(kind: AmbienceEvent, at?: number): void;
  /** 0–1, the one knob in front of the passenger. */
  setLevel(v: number, at?: number, seconds?: number): void;
  dispose(): void;
};

type Opts = {
  /** Injectable so the offline audit renders the same bed twice. */
  rng?: () => number;
  /** Where the bed goes. Defaults to the context's destination. */
  dest?: AudioNode;
};

/* ── Noise ──────────────────────────────────────────────────────────────── */

const CACHE = new WeakMap<BaseAudioContext, Map<number, AudioBuffer>>();

/**
 * Pink noise, two channels, independent.
 *
 * The two channels matter more than they look. A mono bed in a pair of
 * headphones is a point source an inch behind your eyes, and after twenty
 * minutes it is a headache; two uncorrelated channels are a room. It costs a
 * second buffer and nothing else.
 */
function pinkBuffer(ctx: BaseAudioContext, seconds: number, rng: () => number) {
  // Kept per context. A minute of two-channel noise is four megabytes and
  // about twenty milliseconds of arithmetic, and the switch can be pressed
  // twice — paying for it once is the difference between a toggle and a
  // stutter.
  let per = CACHE.get(ctx);
  if (!per) CACHE.set(ctx, (per = new Map()));
  const had = per.get(seconds);
  if (had) return had;
  const len = Math.round(ctx.sampleRate * seconds);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const out = buf.getChannelData(ch);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const w = rng() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    }
  }
  per.set(seconds, buf);
  return buf;
}

/* ── Drift ──────────────────────────────────────────────────────────────── */

/**
 * A number that goes somewhere else every few seconds and never comes back.
 *
 * This is the whole answer to "for hours". An LFO would do the same job for
 * about a minute and then start telling you its period — 0.043Hz is twenty-
 * three seconds, and twenty-three seconds is well inside what a bored ear
 * will learn. A new random target every six to twenty-four seconds, glided to
 * by the graph itself, has no period to learn.
 */
function drift(amount: number, minSec: number, maxSec: number, rng: () => number) {
  let target = 0;
  let due = -1;
  return (now: number) => {
    if (now >= due) {
      target = (rng() * 2 - 1) * amount;
      due = now + minSec + rng() * (maxSec - minSec);
    }
    return target;
  };
}

/* ── Automation ─────────────────────────────────────────────────────────── */

/**
 * Glide a parameter, and keep its timeline short.
 *
 * Called four times a second for eight hours, `setTargetAtTime` alone would
 * append a hundred and fifteen thousand events to one parameter's automation
 * list. Two guards: nothing is written unless it actually moved, and what is
 * written first clears everything ahead of it, so the list never holds more
 * than the event in flight and the one replacing it.
 */
function glide(p: AudioParam, to: number, tau: number, now: number, eps: number) {
  const last = (p as AudioParam & { _last?: number })._last;
  if (last !== undefined && Math.abs(last - to) < eps) return;
  (p as AudioParam & { _last?: number })._last = to;
  p.cancelScheduledValues(now);
  p.setTargetAtTime(to, now, tau);
}

function set(p: AudioParam, to: number, now: number) {
  (p as AudioParam & { _last?: number })._last = to;
  p.cancelScheduledValues(now);
  p.setValueAtTime(to, now);
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* ── The graph ──────────────────────────────────────────────────────────── */

export function buildAmbience(ctx: BaseAudioContext, opts: Opts = {}): Ambience {
  const rng = opts.rng ?? Math.random;
  const t0 = ctx.currentTime;

  // Master, then a limiter that should never do anything. It is here for the
  // one case the levels below cannot be reasoned about: a touchdown thump
  // landing on top of reverse thrust on top of a full ground bed.
  //
  // Its threshold is -2dBFS, and the loudest thing in the flight — a takeoff
  // roll at a volume nobody sets — peaks at 0.62, which is two decibels under
  // it. The audit measures every phase against that number, which is how this
  // stays insurance rather than quietly becoming a mixing decision made by a
  // compressor nobody is listening to.
  const out = ctx.createGain();
  out.gain.value = 0;
  const guard = ctx.createDynamicsCompressor();
  guard.threshold.value = -2;
  guard.knee.value = 3;
  guard.ratio.value = 12;
  guard.attack.value = 0.003;
  guard.release.value = 0.25;
  out.connect(guard).connect(opts.dest ?? ctx.destination);

  // Two beds of noise, different lengths, different rates — and then, on the
  // tick below, a slow random walk on each one's detune.
  //
  // The two lengths on their own are not enough, and that is measured rather
  // than assumed: two coprime buffers at fixed rates still look like
  // themselves 0.60 of the way at a lag of exactly 5.03 seconds, because half
  // the room does come back every five seconds and the other half only
  // half-hides it. Walking the read rate takes the same measurement to 0.011,
  // and the lag it finds is nowhere in particular. There is no period left to
  // hear, only two buffers being read at a speed that is never quite what it
  // was a moment ago.
  const sources: AudioBufferSourceNode[] = [];
  const noise = ctx.createGain();
  noise.gain.value = 0.7;
  for (const [sec, rate] of [
    [5.03, 1],
    [6.71, 0.9861],
  ] as const) {
    const s = ctx.createBufferSource();
    s.buffer = pinkBuffer(ctx, sec, rng);
    s.loop = true;
    s.playbackRate.value = rate;
    s.connect(noise);
    s.start(t0);
    sources.push(s);
  }

  const band = (
    type: BiquadFilterType,
    freq: number,
    q: number,
    gain: number,
    to: AudioNode = out,
    from: AudioNode = noise,
  ) => {
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    g.gain.value = gain;
    from.connect(f).connect(g).connect(to);
    return { f, g };
  };

  /* ── Beds ─────────────────────────────────────────────────────────────── */

  // Air. Two filters because one is a slope and the other is a ceiling: the
  // highpass keeps the airflow out of the engines' octave, the lowpass is the
  // fuselage, and the fuselage opens up as the air thins.
  const airHp = ctx.createBiquadFilter();
  airHp.type = "highpass";
  airHp.frequency.value = 60;
  airHp.Q.value = 0.5;
  const airLp = ctx.createBiquadFilter();
  airLp.type = "lowpass";
  airLp.frequency.value = 700;
  airLp.Q.value = 0.7;
  const airGain = ctx.createGain();
  airGain.gain.value = 0;
  noise.connect(airHp).connect(airLp).connect(airGain).connect(out);

  // The window seals, and only the window seals.
  //
  // This was a highpass, which meant it ran from two kilohertz to the top of
  // the audible spectrum with nothing stopping it, and that is precisely the
  // sound of air going past the outside of an aeroplane. From a seat there is
  // hardly anything up there: trim, blanket and skin are very good at eight
  // kilohertz, and the only high frequency that reaches a passenger is what
  // leaks past a seal near their head, which is a band and not a shelf.
  //
  // So it is bounded at both ends now, and about twelve decibels quieter. It
  // still climbs faster than the roar does — that is what makes cruise sound
  // like altitude rather than like a basement — but it climbs inside a window
  // three octaves wide instead of all the way out of the aeroplane.
  const sealHp = ctx.createBiquadFilter();
  sealHp.type = "highpass";
  sealHp.frequency.value = 1900;
  sealHp.Q.value = 0.6;
  const sealLp = ctx.createBiquadFilter();
  sealLp.type = "lowpass";
  sealLp.frequency.value = 3600;
  sealLp.Q.value = 0.7;
  const sealGain = ctx.createGain();
  sealGain.gain.value = 0;
  noise.connect(sealHp).connect(sealLp).connect(sealGain).connect(out);
  const seal = { f: sealHp, g: sealGain };

  // The packs, in two bands, because a pack is two things: the air coming out
  // of the ceiling, and the fans moving it somewhere behind the wall.
  //
  // Never loud and never off. Its level is set by what a cabin with the door
  // open sounds like rather than by what it needs to be under an engine,
  // because at the gate it is the entire room — and the low band is the half
  // that gives that room a body instead of a hiss.
  const hissHp = ctx.createBiquadFilter();
  hissHp.type = "highpass";
  hissHp.frequency.value = 520;
  hissHp.Q.value = 0.5;
  const hissLp = ctx.createBiquadFilter();
  hissLp.type = "lowpass";
  hissLp.frequency.value = 3900;
  hissLp.Q.value = 0.5;
  const hissGain = ctx.createGain();
  hissGain.gain.value = 0;
  noise.connect(hissHp).connect(hissLp).connect(hissGain).connect(out);
  const recirc = band("lowpass", 220, 0.7, 0);

  // Three hundred people, none of whom you can make out.
  //
  // Speech-shaped noise: a broad band around five hundred hertz, which is
  // where the long-term average of a talking human sits, under an amplitude
  // wobble at three to five hertz, which is roughly the rate of syllables.
  // Those two facts are the whole trick — a crowd stops being voices and
  // becomes a texture at about ten people, and the texture is this.
  //
  // Two nodes rather than one so that the wobble cannot make sound on its
  // own: the level is set on the outer gain, the modulation rides on the
  // inner one, and a cabin with nobody in it is silent no matter where the
  // oscillators happen to be.
  const murmurBp = ctx.createBiquadFilter();
  murmurBp.type = "bandpass";
  murmurBp.frequency.value = 520;
  murmurBp.Q.value = 0.75;
  const murmurMod = ctx.createGain();
  murmurMod.gain.value = 1;
  const murmurGain = ctx.createGain();
  murmurGain.gain.value = 0;
  noise.connect(murmurBp).connect(murmurMod).connect(murmurGain).connect(out);
  const wobble: OscillatorNode[] = [];
  for (const [hz, amt] of [
    [3.17, 0.4],
    [4.73, 0.29],
    [0.37, 0.24],
  ] as const) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = hz;
    const g = ctx.createGain();
    g.gain.value = amt;
    o.connect(g).connect(murmurMod.gain);
    o.start(t0);
    wobble.push(o);
  }

  // The engines, behind a wall.
  //
  // Everything the engines make goes through one lowpass before it reaches
  // the cabin, and that filter is the difference between sitting in an
  // aeroplane and standing next to one. There is no direct path from a
  // turbofan to a passenger: the sound arrives through eight feet of air, a
  // pressure vessel, a blanket and a trim panel, all of which are far better
  // at stopping two kilohertz than two hundred hertz. Outside you get the
  // whole engine. Inside you get its bottom two octaves and a rumour of the
  // rest, which is why a cabin is a dull place and a ramp is not.
  const fuselage = ctx.createBiquadFilter();
  fuselage.type = "lowpass";
  fuselage.frequency.value = 1100;
  fuselage.Q.value = 0.6;
  const engine = ctx.createGain();
  engine.gain.value = 1;
  engine.connect(fuselage).connect(out);

  const roar = band("bandpass", 150, 0.7, 0, engine);

  // The fan, wide. It was a Q of nine and it was the second reason this
  // sounded like a propeller from the outside — a narrow band at six hundred
  // hertz is a blade tone, and a blade tone with a harmonic series under it
  // is a Cessna. A turbofan's buzz is up at a couple of kilohertz and it is
  // broad, and by the time it has come through the fuselage above it is
  // barely a colour.
  const fan = band("bandpass", 1400, 2.6, 0, engine);

  // And the bottom, which is the part that had to be rebuilt.
  //
  // This used to be three sine oscillators at a fundamental and its second
  // and third harmonics. That is not what a jet does — it is exactly and
  // precisely what a propeller does, because a propeller's noise IS a blade
  // passing at a rate, and a rate with harmonics on it is a pitch. Measured,
  // the old bed's low end looked like itself 0.95 of the way at a lag of
  // seventy-three hertz, which is a two-blade prop at two thousand rpm.
  //
  // A turbofan heard from inside a cabin has no such thing. It is broadband,
  // and the only reason it seems to have a pitch is that the fuselage and the
  // air in it resonate somewhere. So: noise, and two filters. A broad body
  // under a hundred hertz, and one gentle resonance that moves with N1 and
  // is nowhere near sharp enough to be a note.
  // A bandpass and not a lowpass. Pink noise already piles up towards zero
  // hertz, and a resonant lowpass on top of that makes a very slow, very
  // large wave: the band measured a crest factor near five and was eating
  // the whole of the master's headroom to deliver energy nobody can hear.
  // Bounded below, it delivers the same weight at a third of the peak.
  const body = band("bandpass", 85, 0.9, 0, engine);
  const shaft = band("bandpass", 60, 2.2, 0, engine);
  // Concrete. Low, broad, and gone the instant the wheels are.
  const ground = band("lowpass", 180, 0.9, 0);

  // The tail. A narrow band and a partial above it, which is the whole of an
  // APU from inside the cabin: a steady whine you stop hearing until it stops.
  const apuLow = band("bandpass", 610, 7, 0);
  const apuHigh = band("bandpass", 1245, 11, 0);

  // Reverse thrust gets its own band rather than a louder roar, because it is
  // brighter than the engines ever are in flight — it is the fan blowing
  // forward into air that is not moving with it.
  const rev = band("bandpass", 520, 0.6, 0);

  /* Drifts. Nothing in this graph sits still, and no two of them move on the
     same schedule. */
  const dAir = drift(0.1, 7, 23, rng);
  const dAirLp = drift(0.14, 9, 31, rng);
  const dSeal = drift(0.13, 8, 27, rng);
  const dRoar = drift(0.11, 6, 19, rng);
  const dRumble = drift(0.09, 5, 17, rng);
  const dFan = drift(0.04, 11, 29, rng);
  const dHiss = drift(0.07, 13, 37, rng);
  const dShaft = drift(0.03, 6, 19, rng);
  const dMurmur = drift(0.2, 4, 15, rng);
  // The crew's hand on the thrust levers. Small, slow, and it moves the
  // pitch as well as the level, which is what makes it read as a thrust
  // change and not as somebody turning the engines down.
  const dN1 = drift(0.028, 21, 74, rng);
  // A gust, rarer and bigger than the rest. At cruise the air is mostly
  // smooth, so this is scaled down up there rather than switched off: an
  // aeroplane is never perfectly still and one that is reads as a recording.
  const dGust = drift(0.22, 14, 48, rng);
  // Cents, on the two noise beds. This is the one drift that is not there to
  // be heard: it is there so that nothing else can be.
  const dRate = [drift(9, 3, 11, rng), drift(9, 3, 11, rng)];

  /* ── One-shots ────────────────────────────────────────────────────────── */

  /**
   * Everything an event builds stops itself and lets go of itself.
   *
   * A silent source used only as a clock: a node that is started and stopped
   * fires `ended` whether or not it is connected to anything, which is the
   * one way to be told that a scheduled envelope is over. Without it, every
   * gear cycle and every bin catch leaves a filter hanging off the noise bus
   * for the rest of the flight, and there are a lot of bin catches.
   */
  const after = (at: number, dur: number, done: () => void) => {
    const s = ctx.createConstantSource();
    s.offset.value = 0;
    s.start(at);
    s.stop(at + dur);
    s.onended = () => {
      done();
      s.disconnect();
    };
  };

  /**
   * A shape cut out of the noise. Nearly every event here is one of these.
   *
   * The gain is put at zero before anything is scheduled on it, which is not
   * fussiness. A gain node is born at 1 and these are connected the moment
   * they are built, while some of them are scheduled half a minute out — gear
   * up six seconds after the wheels leave, the stand chime thirty after they
   * are back down. Left at its default, each one was a bandpassed shriek at
   * full level for the whole of the wait, and it took an offline render of a
   * whole flight to see it: the bed at the gate measured twelve decibels
   * above what a gate is supposed to be.
   */
  type Shape = {
    at: number;
    dur: number;
    f0: number;
    f1?: number;
    q?: number;
    type?: BiquadFilterType;
    peak: number;
    attack?: number;
    release?: number;
  };
  const shape = (o: Shape) => {
    const f = ctx.createBiquadFilter();
    f.type = o.type ?? "bandpass";
    f.Q.value = o.q ?? 2;
    f.frequency.setValueAtTime(o.f0, o.at);
    if (o.f1 !== undefined)
      f.frequency.linearRampToValueAtTime(o.f1, o.at + o.dur);
    const g = ctx.createGain();
    g.gain.value = 0;
    const a = Math.min(o.attack ?? o.dur * 0.18, o.dur * 0.45);
    const r = Math.min(o.release ?? o.dur * 0.35, o.dur * 0.5);
    g.gain.setValueAtTime(0.0001, o.at);
    g.gain.exponentialRampToValueAtTime(o.peak, o.at + a);
    g.gain.setValueAtTime(o.peak, o.at + Math.max(a, o.dur - r));
    g.gain.exponentialRampToValueAtTime(0.0001, o.at + o.dur);
    noise.connect(f).connect(g).connect(out);
    after(o.at, o.dur + 0.2, () => {
      noise.disconnect(f);
      f.disconnect();
      g.disconnect();
    });
  };

  // Four knocks, made once. A takeoff roll asks for two or three a second and
  // a taxi-in asks for hundreds more, and building a fresh quarter-second
  // buffer for each one is ten kilobytes of garbage per joint in the
  // concrete. Four is enough not to hear the repeat, because what the ear
  // follows here is the spacing and not the grain.
  const knocks: AudioBuffer[] = [];
  {
    const len = Math.round(ctx.sampleRate * 0.22);
    for (let k = 0; k < 4; k++) {
      const b = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (rng() * 2 - 1) * (1 - i / len) ** 3;
      knocks.push(b);
    }
  }
  const thump = (at: number, force: number, hz = 70 + rng() * 60) => {
    const src = ctx.createBufferSource();
    src.buffer = knocks[(rng() * knocks.length) | 0];
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = hz;
    lp.Q.value = 2.2;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.setValueAtTime(force, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
    src.connect(lp).connect(g).connect(out);
    src.start(at);
    src.stop(at + 0.24);
    src.onended = () => {
      src.disconnect();
      g.disconnect();
      lp.disconnect();
    };
  };

  /** A struck tone, with the inharmonic partials that make it metal. */
  const strike = (at: number, f: number, level: number, decay = 2) => {
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(level, at + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    g.connect(out);
    const oscs: OscillatorNode[] = [];
    for (const [mul, lv] of [
      [1, 1],
      [2.01, 0.34],
      [3.02, 0.12],
    ] as const) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f * mul;
      const og = ctx.createGain();
      og.gain.value = lv;
      o.connect(og).connect(g);
      o.start(at);
      o.stop(at + decay + 0.1);
      oscs.push(o);
    }
    oscs[oscs.length - 1].onended = () => {
      for (const o of oscs) o.disconnect();
      g.disconnect();
    };
  };

  /* ── Events ───────────────────────────────────────────────────────────── */

  const event = (kind: AmbienceEvent, at = ctx.currentTime) => {
    const jitter = (a: number, b: number) => a + rng() * (b - a);
    switch (kind) {
      /* The aircraft */

      // Two engines, not one. They are started in turn and the eleven seconds
      // between them is the difference between an aeroplane and a machine.
      case "engineStart":
        shape({ at, dur: 15, f0: 180, f1: 640, q: 5, peak: 0.18, attack: 7 });
        shape({ at: at + 11, dur: 15, f0: 175, f1: 630, q: 5, peak: 0.17, attack: 7 });
        break;
      case "apuStart":
        shape({ at, dur: 13, f0: 260, f1: 610, q: 5.5, peak: 0.17, attack: 8 });
        shape({ at: at + 2, dur: 11, f0: 700, f1: 1245, q: 7, peak: 0.09, attack: 7 });
        break;
      // Down rather than up, and longer: a turbine takes longer to stop than
      // to start, which is the one thing everybody has noticed about them.
      case "apuStop":
        shape({ at, dur: 11, f0: 610, f1: 190, q: 5.5, peak: 0.15, attack: 0.3, release: 6 });
        shape({ at, dur: 9, f0: 1245, f1: 520, q: 7, peak: 0.075, attack: 0.3, release: 5 });
        break;
      case "gearUp":
        shape({ at, dur: 7, f0: 380, f1: 880, q: 3.2, peak: 0.075, attack: 0.5 });
        thump(at + 0.15, 0.2);
        thump(at + 6.9, 0.28);
        break;
      case "gearDown":
        shape({ at, dur: 8, f0: 520, f1: 330, q: 3.2, peak: 0.062, attack: 0.5 });
        thump(at + 0.2, 0.26);
        thump(at + 7.6, 0.3);
        // And the air finds it. A gear leg in the airstream is a drag device
        // and it is heard as one, which is why an approach gets louder at the
        // moment it ought to be getting quieter.
        shape({ at: at + 2, dur: 9, f0: 260, q: 0.5, peak: 0.055, attack: 4, release: 3 });
        break;
      // No thumps. A flap track is a screwjack and it runs smoothly for its
      // whole travel — what tells you it has finished is that the whine stops
      // and the air behind you is a different air.
      case "flapsOut":
        shape({ at, dur: 9, f0: 640, f1: 575, q: 3.6, peak: 0.13, attack: 1.2, release: 1.4 });
        shape({ at: at + 1, dur: 10, f0: 320, q: 0.6, peak: 0.055, attack: 5, release: 4 });
        break;
      case "flapsIn":
        shape({ at, dur: 8, f0: 585, f1: 655, q: 3.6, peak: 0.13, attack: 1.2, release: 1.4 });
        break;
      // Boards out: broadband, and the buffet under it.
      case "speedbrake":
        shape({ at, dur: 8, f0: 300, q: 0.45, peak: 0.1, attack: 1.1, release: 2.5 });
        for (let i = 0; i < 9; i++)
          thump(at + jitter(0.4, 6.5), jitter(0.03, 0.08), jitter(50, 90));
        break;
      // Mains, then the nose four seconds later, which is how long it takes
      // and the reason a landing is two events and not one. The chirp is the
      // tyres going from nothing to a hundred and forty knots in a quarter of
      // a second.
      case "touchdown":
        thump(at, 0.5, 64);
        thump(at + 0.09, 0.34, 96);
        shape({ at, dur: 0.6, f0: 1900, f1: 850, q: 5, peak: 0.055, attack: 0.03, release: 0.4 });
        thump(at + 4.1, 0.33, 72);
        break;
      case "reverse": {
        const g = rev.g.gain;
        g.cancelScheduledValues(at);
        g.setValueAtTime(0.001, at);
        g.linearRampToValueAtTime(0.16, at + 0.7);
        g.setValueAtTime(0.16, at + 3.4);
        g.exponentialRampToValueAtTime(0.001, at + 9);
        break;
      }
      case "reverseStow":
        shape({ at, dur: 3.5, f0: 430, f1: 330, q: 3, peak: 0.13, attack: 0.4 });
        thump(at + 3.2, 0.22);
        break;
      // Rough air: a swell in the bed, and the airframe answering it. The
      // knocks are what makes it weather rather than a fade.
      case "turbulence": {
        const secs = jitter(9, 22);
        shape({ at, dur: secs, f0: 420, q: 0.5, peak: 0.1, attack: secs * 0.3, release: secs * 0.4 });
        const n = 5 + ((rng() * 9) | 0);
        for (let i = 0; i < n; i++)
          thump(at + jitter(0.5, secs - 1), jitter(0.05, 0.16), jitter(45, 95));
        break;
      }

      /* The cabin */

      // High, then low. Every cabin on earth, and the reason is that a rising
      // pair sounds like a question.
      case "chime":
        strike(at, 880, 0.085);
        break;
      case "chimeDouble":
        strike(at, 880, 0.085);
        strike(at + 0.62, 660, 0.075);
        break;
      // Three of the same, which is the one the crew use on each other.
      case "chimeTriple":
        strike(at, 880, 0.07, 1.2);
        strike(at + 0.44, 880, 0.062, 1.2);
        strike(at + 0.88, 880, 0.056, 1.8);
        break;
      // The handset keying up. A quarter of a second of nothing that everyone
      // on the aeroplane stops talking for.
      case "paClick":
        shape({ at, dur: 0.09, f0: 2200, q: 1.2, peak: 0.24, attack: 0.004, release: 0.05 });
        shape({ at: at + 0.14, dur: 0.5, f0: 900, q: 0.6, peak: 0.06, attack: 0.05, release: 0.3 });
        break;
      case "doorClose":
        shape({ at, dur: 1.1, f0: 340, f1: 220, q: 1.4, peak: 0.17, attack: 0.02, release: 0.8 });
        thump(at + 0.05, 0.34, 58);
        thump(at + 0.78, 0.18, 110);
        break;
      case "binLatch":
        thump(at, 0.3, 140);
        shape({ at, dur: 0.35, f0: 2400, q: 2.2, peak: 0.18, attack: 0.006, release: 0.28 });
        break;
      // A drawer, a tray, a kettle going back in its slot: two or three small
      // bright things close together, never the same two.
      case "galley": {
        const n = 2 + ((rng() * 3) | 0);
        for (let i = 0; i < n; i++) {
          const t = at + i * jitter(0.18, 0.55);
          shape({ at: t, dur: jitter(0.2, 0.5), f0: jitter(1500, 3400), q: jitter(1.5, 3), peak: jitter(0.1, 0.2), attack: 0.005, release: 0.2 });
          if (rng() < 0.5) thump(t + 0.02, jitter(0.13, 0.27), jitter(110, 190));
        }
        break;
      }
      // A cart coming up the aisle and going away again. Low, long, and the
      // rattle on top of it is the only reason it is a cart and not a gust.
      case "cartPass": {
        const secs = jitter(5, 9);
        shape({ at, dur: secs, f0: 190, q: 0.9, peak: 0.14, attack: secs * 0.4, release: secs * 0.45 });
        for (let i = 0; i < 12; i++)
          shape({ at: at + jitter(0.5, secs - 0.5), dur: 0.12, f0: jitter(900, 2600), q: 2.2, peak: jitter(0.04, 0.1), attack: 0.004, release: 0.09 });
        break;
      }
      // A pump cycling behind the wall. Two and a half seconds of a buzz that
      // was not there before and is not there afterwards, and the most
      // characteristic sound of a quiet cabin.
      case "hydPump":
        shape({ at, dur: 2.6, f0: 410, q: 5, peak: 0.3, attack: 0.25, release: 0.5 });
        shape({ at, dur: 2.6, f0: 822, q: 7, peak: 0.12, attack: 0.25, release: 0.5 });
        break;
      case "trim":
        shape({ at, dur: jitter(1.1, 2.2), f0: 760, q: 5, peak: 0.3, attack: 0.15, release: 0.3 });
        break;
      // The outflow valve, adjusting. A breath, and then the cabin is at a
      // slightly different altitude than it was.
      case "outflow":
        shape({ at, dur: 5.5, f0: 950, q: 0.55, peak: 0.16, attack: 2, release: 2.5 });
        break;
      case "seatCreak":
        shape({ at, dur: jitter(0.5, 1), f0: jitter(420, 680), f1: jitter(330, 520), q: 4.5, peak: jitter(0.2, 0.36), attack: 0.08, release: 0.4 });
        break;
    }
  };

  /* ── The tick ─────────────────────────────────────────────────────────── */

  let nextThump = 0;

  const apply = (c: Cabin, at: number, glideIt: boolean) => {
    const put = (p: AudioParam, v: number, tau: number, eps = 0.002) =>
      glideIt ? glide(p, v, tau, at, eps) : set(p, v, at);

    const q = clamp01(c.q);
    const n1 = clamp01(c.n1 * (1 + dN1(at)));
    const roll = clamp01(c.roll);

    // Air. The exponent is perceptual, not physical: pressure on the skin is
    // what makes the noise, loudness is what you hear, and the two are not
    // the same curve.
    const gust = dGust(at) * (0.35 + 0.65 * (1 - q));
    const air = 0.36 * Math.pow(q, 0.62) * (1 + dAir(at) + gust);
    put(airGain.gain, Math.max(0, air), 2.6);
    put(airLp.frequency, 520 + 1650 * Math.pow(q, 0.8) * (1 + dAirLp(at)), 3.4, 4);
    // Low enough to have a body. This was pushed up to two hundred hertz to
    // stop the airflow drowning the engines at the top of descent, and the
    // engines were never the problem — the measurement was, and it has been
    // fixed. Left up there it took the bottom two octaves out of cruise and
    // left a spectrum that was flat from sixty hertz to eight kilohertz,
    // which is what wind sounds like and not what a cabin does.
    put(airHp.frequency, 88 + 42 * q, 3.4, 1);

    // The seals. A steeper curve than the roar below it, which is what makes
    // the cabin brighten as it climbs rather than just get louder.
    put(seal.g.gain, Math.max(0, 0.085 * Math.pow(q, 1.35) * (1 + dSeal(at))), 3, 0.0008);
    put(seal.f.frequency, 1800 + 700 * q, 3.4, 6);

    // Packs. Present at the gate, which is the whole reason this band exists.
    const packs = clamp01(c.packs);
    put(hissGain.gain, 0.052 * packs * (1 + dHiss(at)), 2.2, 0.0012);
    put(recirc.g.gain, 0.036 * packs, 2.2, 0.0008);

    // People.
    put(murmurGain.gain, Math.max(0, 0.22 * clamp01(c.murmur) * (1 + dMurmur(at))), 2.4, 0.0006);

    // Engines. Broadband, all of it, because that is what carries through a
    // fuselage — and then the wall itself, which opens a little under power
    // but never far: what gets past it is the bottom of the engine and not
    // the engine.
    put(roar.g.gain, 0.74 * Math.pow(n1, 1.6) * (1 + dRoar(at)), 1.8);
    put(roar.f.frequency, 120 + 190 * n1, 2.4, 2);
    put(body.g.gain, 0.82 * Math.pow(n1, 1.4) * (1 + dRumble(at)), 1.8, 0.004);
    put(body.f.frequency, 72 + 52 * n1, 2.2, 1);
    put(shaft.g.gain, 0.30 * Math.pow(n1, 1.7), 2, 0.004);
    put(shaft.f.frequency, (48 + 36 * n1) * (1 + dShaft(at)), 2.4, 0.4);
    put(fan.g.gain, 0.16 * Math.pow(n1, 4.2) * (1 + dFan(at)), 2.2, 0.0006);
    put(fan.f.frequency, 950 + 1500 * n1, 2.6, 8);
    put(fuselage.frequency, 900 + 900 * n1, 2.4, 6);

    // Concrete. Fast, because rotation is an edge and not a fade.
    //
    // The exponent is shallow on purpose. Wheels on concrete at fifteen knots
    // and at a hundred and fifty are not thirty decibels apart — what changes
    // between a taxiway and a takeoff roll is mostly how fast the joints come,
    // which is the scheduler below and not this line.
    put(ground.g.gain, 0.26 * Math.pow(roll, 0.45), 0.45, 0.0015);
    put(ground.f.frequency, 95 + 190 * roll, 0.6, 3);

    // Tail.
    const apu = clamp01(c.apu);
    put(apuLow.g.gain, 0.028 * apu, 2.5, 0.0004);
    put(apuHigh.g.gain, 0.010 * apu, 2.5, 0.0003);

    // And the read heads, walking. Never glided to on a snap: a detune that
    // jumps is a pitch that jumps.
    for (let i = 0; i < sources.length; i++)
      glide(sources[i].detune, dRate[i](at), 5, at, 0.4);
  };

  let disposed = false;

  return {
    update(c, at = ctx.currentTime) {
      if (disposed) return;
      apply(c, at, true);
      // Joints under the wheels, half a second at a time. The spacing is a
      // length of concrete divided by a speed, so it tightens as the roll
      // builds and stops on its own when the wheels leave.
      if (c.roll > 0.02 && c.gsKt > 4) {
        const metresPerJoint = 18 + rng() * 26;
        const period = metresPerJoint / (c.gsKt * 0.5144);
        if (nextThump < at) nextThump = at;
        while (nextThump < at + 0.6) {
          thump(nextThump, 0.05 + 0.13 * clamp01(c.roll));
          nextThump += period;
        }
      } else {
        nextThump = 0;
      }
    },
    snap(c, at = ctx.currentTime) {
      if (disposed) return;
      apply(c, at, false);
      nextThump = 0;
    },
    event,
    setLevel(v, at = ctx.currentTime, seconds = 2.5) {
      const g = out.gain;
      g.cancelScheduledValues(at);
      g.setValueAtTime(Math.max(0.0001, g.value), at);
      g.linearRampToValueAtTime(clamp01(v), at + seconds);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      const now = ctx.currentTime;
      for (const s of [...sources, ...wobble]) {
        try {
          s.stop(now);
        } catch {}
      }
      out.disconnect();
      guard.disconnect();
    },
  };
}
