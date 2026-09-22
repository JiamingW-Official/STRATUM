import { test, expect, type Page } from "@playwright/test";

/**
 * The cabin bed, measured rather than listened to.
 *
 * A room tone is the one thing in this repository that cannot be checked by
 * looking at it, and the two claims it makes — that it is a real aeroplane and
 * that it can be left on for eight hours — are exactly the two a person
 * auditioning it for thirty seconds cannot confirm. So the graph takes an
 * explicit time on every call and renders into an OfflineAudioContext, which
 * runs a flight in a second and hands back every sample of it.
 *
 * What is asserted here is what could not otherwise be known: the level of
 * each phase against every other, that the whole of it stays inside its
 * headroom, that no parameter move puts a step in the waveform, and that
 * nothing in it repeats. The last one has a control case next to it, because
 * a correlation test that cannot fail is not a test.
 */

const BENCH = "/dev/ife/";

async function boot(page: Page) {
  await page.goto(BENCH, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".bench-glass");
}

type Snap = { phase: string; altFt: number; gsKt: number };

const AT: Record<string, Snap> = {
  gate: { phase: "boarding", altFt: 0, gsKt: 0 },
  taxi: { phase: "taxi", altFt: 0, gsKt: 15 },
  roll: { phase: "takeoff", altFt: 0, gsKt: 150 },
  climb: { phase: "takeoff", altFt: 10000, gsKt: 300 },
  cruise: { phase: "cruise", altFt: 37000, gsKt: 480 },
  topOfDescent: { phase: "descent", altFt: 34000, gsKt: 470 },
  approach: { phase: "descent", altFt: 2000, gsKt: 180 },
  stand: { phase: "landed", altFt: 0, gsKt: 0 },
};

/** Renders `seconds` of one steady state and reports what came out. */
async function render(page: Page, snap: Snap, seconds = 10) {
  return page.evaluate(
    async ({ snap, seconds }) => {
      const g = await import("/src/ife/ambienceGraph.ts");
      const m = await import("/src/ife/ambience.ts");
      const rate = 48000;
      const ctx = new OfflineAudioContext(2, rate * seconds, rate);
      let seed = 987654321;
      const rng = () =>
        ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      const bed = g.buildAmbience(ctx, { rng });
      const cab = m.cabinAt(snap as never);
      bed.snap(cab, 0);
      bed.setLevel(1, 0, 0.001);
      for (let t = 0.25; t < seconds; t += 0.25) bed.update(cab, t);
      const buf = await ctx.startRendering();
      // The first two seconds are the filters settling, which is not a sound
      // anybody hears: the bed is faded in over three.
      const from = rate * 2;
      let peak = 0;
      let sum = 0;
      let n = 0;
      let finite = true;
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = from; i < d.length; i++) {
          const v = d[i];
          if (!Number.isFinite(v)) finite = false;
          const a = v < 0 ? -v : v;
          if (a > peak) peak = a;
          sum += v * v;
          n++;
        }
      }
      // And the bottom of it on its own, which is where the engines are. The
      // broadband level barely moves at the top of descent — the aircraft is
      // still doing four hundred and fifty knots — but the engines go to
      // idle, and that is the moment every passenger notices.
      const d = buf.getChannelData(0);
      // Four poles at two hundred hertz, not two at three hundred. Two poles
      // leak enough of the midrange to drown the thing being measured: the
      // first version of this reported the engines dropping by three
      // decibels at the top of descent when most of what it was weighing was
      // airflow at four hundred hertz.
      const a = 1 - Math.exp((-2 * Math.PI * 200) / rate);
      const y = [0, 0, 0, 0];
      let lo = 0;
      for (let i = from; i < d.length; i++) {
        let v = d[i];
        for (let k = 0; k < 4; k++) {
          y[k] += a * (v - y[k]);
          v = y[k];
        }
        lo += v * v;
      }
      return {
        peak,
        rms: Math.sqrt(sum / n),
        low: Math.sqrt(lo / (d.length - from)),
        finite,
      };
    },
    { snap, seconds },
  );
}

const dB = (rms: number) => 20 * Math.log10(rms);

/** Every sound this cabin can make. Kept by hand because it is a type. */
const EVENTS = [
  "engineStart", "apuStart", "apuStop", "gearUp", "gearDown", "flapsOut",
  "flapsIn", "speedbrake", "touchdown", "reverse", "reverseStow", "turbulence",
  "chime", "chimeDouble", "chimeTriple", "paClick", "doorClose", "binLatch",
  "galley", "cartPass", "hydPump", "trim", "outflow", "seatCreak",
] as const;

test.describe("cabin ambience", () => {
  /* ── The model, with no audio anywhere near it ────────────────────────── */

  test("the flight is loudest in the climb, not at cruise", async ({ page }) => {
    await boot(page);
    const q = await page.evaluate(async () => {
      const m = await import("/src/ife/ambience.ts");
      return {
        roll: m.dynamicPressure(0, 160),
        climb: m.dynamicPressure(10000, 300),
        cruise: m.dynamicPressure(37000, 480),
        taxi: m.dynamicPressure(0, 15),
      };
    });
    // Five hundred knots in air a quarter as thick is not four times the
    // pressure of a hundred and sixty at sea level. Everybody who has flown
    // knows this and nobody can say it; a bed that got it wrong would be
    // wrong in a way people feel and cannot name.
    expect(q.climb).toBeGreaterThan(q.cruise);
    expect(q.cruise / q.roll).toBeLessThan(3);
    expect(q.taxi).toBeLessThan(0.02);
  });

  test("the model knows what is running and what is turning", async ({
    page,
  }) => {
    await boot(page);
    const c = await page.evaluate(async (at) => {
      const m = await import("/src/ife/ambience.ts");
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(at)) out[k] = m.cabinAt(v as never);
      // Fifty feet: the wheels have just left.
      out.rotation = m.cabinAt({ phase: "takeoff", altFt: 60, gsKt: 175 });
      return out as Record<
        string,
        { n1: number; roll: number; apu: number; packs: number; murmur: number }
      >;
    }, AT);

    // At the gate there is no engine, there is a tail, and there are three
    // hundred people — which is most of what a boarding cabin is.
    expect(c.gate.n1).toBe(0);
    expect(c.gate.apu).toBe(1);
    expect(c.gate.murmur).toBe(1);
    // Under way there is an engine, no tail, and a cabin that has sat down.
    expect(c.taxi.n1).toBeGreaterThan(0);
    expect(c.taxi.apu).toBe(0);
    expect(c.taxi.murmur).toBeLessThan(c.gate.murmur);
    // Full power on the roll, and the packs down with it.
    expect(c.roll.n1).toBeGreaterThan(0.9);
    expect(c.roll.packs).toBeLessThan(0.5);
    expect(c.climb.packs).toBe(1);
    // Nobody talks on a climb.
    expect(c.climb.murmur).toBeLessThan(c.cruise.murmur);
    // Rotation is an edge: the concrete stops, and that is the moment the
    // whole cabin looks up.
    expect(c.roll.roll).toBeGreaterThan(0.8);
    expect(c.rotation.roll).toBe(0);
    // Idle down the hill, spooled up on the approach.
    expect(c.topOfDescent.n1).toBeLessThan(c.cruise.n1);
    expect(c.approach.n1).toBeGreaterThan(c.topOfDescent.n1);
  });

  test("a phase is a clock, not a label", async ({ page }) => {
    await boot(page);
    const r = await page.evaluate(async () => {
      const m = await import("/src/ife/ambience.ts");
      const taxi = (age: number) =>
        m.cabinAt({ phase: "taxi", altFt: 0, gsKt: 12 } as never, age);
      const landed = (age: number) =>
        m.cabinAt({ phase: "landed", altFt: 0, gsKt: 0 } as never, age);
      return {
        taxi: [0, 8, 20, 40].map((a) => ({ age: a, ...taxi(a) })),
        landed: [2, 20, 30, 45, 70].map((a) => ({ age: a, ...landed(a) })),
      };
    });

    // Pushback: two engines come up over about half a minute, and the tail
    // goes out once they have. Both of those are things you hear happen, and
    // neither is anything the phase label can say.
    expect(r.taxi[0].n1).toBe(0);
    expect(r.taxi[1].n1).toBeGreaterThan(0);
    expect(r.taxi[1].n1).toBeLessThan(r.taxi[3].n1);
    expect(r.taxi[0].apu).toBe(1);
    expect(r.taxi[3].apu).toBe(0);

    // And the other end: the tail is started again on the taxi in, a good
    // half-minute after the wheels are down, and not during the rollout.
    expect(r.landed[0].apu).toBe(0);
    expect(r.landed[1].apu).toBe(0);
    expect(r.landed[3].apu).toBeGreaterThan(0);
    expect(r.landed[4].apu).toBe(1);
    // The engines go the other way.
    expect(r.landed[0].n1).toBeGreaterThan(r.landed[2].n1);
    expect(r.landed[4].n1).toBe(0);
    // And everybody stands up long before the aircraft stops, which is the
    // one moment in a flight where the cabin is louder than the aeroplane.
    expect(r.landed[4].murmur).toBeGreaterThan(r.landed[0].murmur);
  });

  test("an aircraft that was moved rather than flown makes no noise about it", async ({
    page,
  }) => {
    await boot(page);
    const r = await page.evaluate(async () => {
      const m = await import("/src/ife/ambience.ts");
      const tick = (a: never, b: never) => ({
        teleported: m.teleported(a, b),
        cues: m.cues(a, b).map((c: { kind: string }) => c.kind),
      });
      return {
        // A quarter of a second of a real climb.
        climbing: tick(
          { phase: "takeoff", altFt: 9900, gsKt: 300 } as never,
          { phase: "takeoff", altFt: 10100, gsKt: 302 } as never,
        ),
        // The panel forcing a phase, which skips three of them.
        forced: tick(
          { phase: "boarding", altFt: 0, gsKt: 0 } as never,
          { phase: "descent", altFt: 22000, gsKt: 430 } as never,
        ),
        // The timeline dragged backwards.
        scrubbed: tick(
          { phase: "cruise", altFt: 37000, gsKt: 480 } as never,
          { phase: "taxi", altFt: 0, gsKt: 15 } as never,
        ),
        // Adjacent phases, but the altitude jumped: a receiver that came back.
        jumped: tick(
          { phase: "cruise", altFt: 37000, gsKt: 480 } as never,
          { phase: "descent", altFt: 9000, gsKt: 400 } as never,
        ),
        // The landing, which is continuous and must not be suppressed even
        // though the ground speed falls off a cliff in one sample.
        landing: tick(
          { phase: "descent", altFt: 0, gsKt: 260 } as never,
          { phase: "landed", altFt: 0, gsKt: 0 } as never,
        ),
      };
    });
    expect(r.climbing.teleported).toBe(false);
    expect(r.climbing.cues).toEqual(["chime"]); // ten thousand feet, sign off
    expect(r.forced.teleported).toBe(true);
    expect(r.scrubbed.teleported).toBe(true);
    expect(r.jumped.teleported).toBe(true);
    expect(r.landing.teleported).toBe(false);
    expect(r.landing.cues).toEqual([
      "touchdown",
      "speedbrake",
      "reverse",
      "reverseStow",
      "apuStart",
      "chime",
      "flapsIn",
    ]);
  });

  test("a whole flight fires each cue once and in order", async ({ page }) => {
    await boot(page);
    const fired = await page.evaluate(async () => {
      const m = await import("/src/ife/ambience.ts");
      const mock = await import("/src/dev/mockFlight.ts");
      const out: string[] = [];
      let prev = {
        phase: mock.phaseAt(0),
        altFt: mock.altitudeFt(0),
        gsKt: mock.groundSpeedKt(0),
      };
      for (let i = 1; i <= 4000; i++) {
        const p = i / 4000;
        const now = {
          phase: mock.phaseAt(p),
          altFt: mock.altitudeFt(p),
          gsKt: mock.groundSpeedKt(p),
        };
        if (!m.teleported(prev as never, now as never))
          for (const c of m.cues(prev as never, now as never)) out.push(c.kind);
        prev = now;
      }
      return out;
    });
    expect(fired).toEqual([
      // Pushback
      "doorClose",
      "engineStart",
      "chimeTriple",
      "apuStop",
      "chimeDouble",
      // Up
      "gearUp",
      "flapsIn",
      "flapsIn",
      "chime", // ten thousand, sign off
      // Down
      "chime", // top of descent, sign on
      "outflow",
      "speedbrake",
      "chime", // ten thousand again, crew to stations
      "flapsOut",
      "flapsOut",
      "gearDown",
      "flapsOut",
      // On
      "touchdown",
      "speedbrake",
      "reverse",
      "reverseStow",
      "apuStart",
      "chime", // on the stand
      "flapsIn",
    ]);
  });

  /* ── The bed, rendered ────────────────────────────────────────────────── */

  test("every phase is finite, inside its headroom, and not silence", async ({
    page,
  }) => {
    await boot(page);
    const got: Record<string, { peak: number; rms: number; finite: boolean }> =
      {};
    for (const [name, snap] of Object.entries(AT)) {
      got[name] = await render(page, snap);
    }
    for (const [name, r] of Object.entries(got)) {
      expect(r.finite, `${name} is finite`).toBe(true);
      // The guard limiter sits at -2dBFS and is insurance, not a mixing
      // decision: at the loudest a passenger can set this, nothing reaches it.
      expect(r.peak, `${name} peak`).toBeLessThan(0.72);
      // Even the gate is a room. A cabin with the door open is the packs and
      // the tail and nothing else, and if that came out as silence the switch
      // would look broken to anybody who pressed it before pushback.
      expect(dB(r.rms), `${name} level`).toBeGreaterThan(-38);
    }

    // The shape of a flight, in decibels, and every one of these is a claim
    // about what it is like to sit in one.
    const d = Object.fromEntries(
      Object.entries(got).map(([k, v]) => [k, dB(v.rms)]),
    );
    expect(d.roll).toBeGreaterThan(d.taxi + 6); // power, and concrete
    expect(d.climb).toBeGreaterThan(d.cruise + 1.5); // thick air, high power
    expect(d.approach).toBeLessThan(d.cruise); // slow, low, quiet

    // The engines, measured on their own. Broadband, the top of descent is
    // the same level as cruise, because the aeroplane is still doing four
    // hundred and seventy knots and the air does not care what the thrust
    // levers are doing. Underneath three hundred hertz it is a different
    // aeroplane, and that is the one everybody feels.
    const lo = Object.fromEntries(
      Object.entries(got).map(([k, v]) => [k, dB(v.low)]),
    );
    expect(lo.cruise).toBeGreaterThan(lo.topOfDescent + 5); // thrust levers back
    expect(lo.approach).toBeGreaterThan(lo.topOfDescent + 3); // and forward again
    expect(lo.climb).toBeGreaterThan(lo.cruise + 3.5); // climb thrust
    expect(lo.roll).toBeGreaterThan(lo.climb + 3); // all of it
    expect(lo.gate).toBeLessThan(lo.cruise - 8); // nothing is running at all
    // The gate and the taxi are not far apart, and that is right rather than
    // sloppy: a cabin being boarded is three hundred people, and three
    // hundred people are about as loud as two engines at idle. What differs
    // between them is not the level, it is what is making it.
    expect(Math.abs(d.gate - d.taxi)).toBeLessThan(3);
    expect(d.roll).toBeGreaterThan(d.gate + 7);
    // And the whole range fits in what a pair of headphones can hold: set so
    // that cruise is comfortable, the gate must still be audible and the
    // climb must not be painful.
    const all = Object.values(d);
    expect(Math.max(...all) - Math.min(...all)).toBeLessThan(18);
  });

  test("nothing in it repeats", async ({ page }) => {
    await boot(page);
    const r = await page.evaluate(async () => {
      const g = await import("/src/ife/ambienceGraph.ts");
      const m = await import("/src/ife/ambience.ts");
      const rate = 8000;
      const seconds = 45;

      /**
       * The strongest similarity between the signal and itself, delayed.
       *
       * Differenced first, which is a six-decibel-per-octave tilt, because
       * the question is about texture and not about tone. The shaft orders
       * under this bed are sine waves and a sine wave correlates with itself
       * at every multiple of its period — undifferenced, this measurement
       * reported 0.47 at 1.51 seconds and what it had found was a steady
       * sixty-two hertz drone, which is not a seam and is not audible as one.
       * A tilt puts the drone twenty-four decibels down and leaves the noise
       * where it was, so what comes back is about the noise.
       */
      const selfSimilarity = (raw: Float32Array) => {
        const d = new Float32Array(raw.length - 1);
        for (let i = 1; i < raw.length; i++) d[i - 1] = raw[i] - raw[i - 1];
        let energy = 0;
        for (let i = 0; i < d.length; i++) energy += d[i] * d[i];
        let worst = 0;
        let atLag = 0;
        // From half a second — below that any signal correlates with itself —
        // out past the length of either noise bed.
        for (let lag = rate / 2; lag < rate * 12; lag += rate / 200) {
          let s = 0;
          for (let i = lag; i < d.length; i += 3) s += d[i] * d[i - lag];
          const norm = Math.abs(s * 3) / energy;
          if (norm > worst) {
            worst = norm;
            atLag = lag / rate;
          }
        }
        return { worst, atLag };
      };

      // The bed at cruise, where it is most exposed and where somebody is
      // going to leave it on for seven hours.
      const ctx = new OfflineAudioContext(1, rate * seconds, rate);
      let seed = 24680;
      const rng = () =>
        ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      const bed = g.buildAmbience(ctx, { rng });
      const cab = m.cabinAt({ phase: "cruise", altFt: 37000, gsKt: 480 } as never);
      bed.snap(cab, 0);
      bed.setLevel(1, 0, 0.001);
      for (let t = 0.25; t < seconds; t += 0.25) bed.update(cab, t);
      const live = selfSimilarity((await ctx.startRendering()).getChannelData(0));

      // The control. Same measurement, same length, on one buffer looped the
      // obvious way — which is what this bed would be if the two lengths and
      // the walk on the read heads were taken out of it. If this does not
      // come back loud, the measurement above proves nothing.
      const c2 = new OfflineAudioContext(1, rate * seconds, rate);
      const loopLen = Math.round(rate * 5.03);
      const buf = c2.createBuffer(1, loopLen, rate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < loopLen; i++) ch[i] = rng() * 2 - 1;
      const src = c2.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.connect(c2.destination);
      src.start(0);
      const looped = selfSimilarity((await c2.startRendering()).getChannelData(0));

      return { live, looped };
    });

    // The control finds its seam exactly where it was put, which is what
    // makes the number below mean anything.
    expect(r.looped.worst).toBeGreaterThan(0.5);
    expect(r.looped.atLag).toBeCloseTo(5.03, 1);
    // And the bed has none. Not a smaller seam — no lag anywhere out to
    // twelve seconds at which it looks like itself.
    expect(r.live.worst).toBeLessThan(0.05);
  });

  test("the engines are a turbofan through a wall, not a propeller outside one", async ({
    page,
  }) => {
    await boot(page);
    const r = await page.evaluate(async () => {
      const g = await import("/src/ife/ambienceGraph.ts");
      const m = await import("/src/ife/ambience.ts");
      const rate = 8000;

      /**
       * How spiky the bottom of the spectrum is: the loudest bin between
       * twenty-four and four hundred hertz, over the median one.
       *
       * This is the measurement that would have caught it. A propeller's
       * noise is blades passing at a rate, which is a fundamental with
       * harmonics on it, which is a pitch — and a pitch is a handful of bins
       * towering over everything around them. A turbofan heard from inside a
       * pressure vessel has no line spectrum at all down here: it is broad,
       * and whatever pitch it seems to have is the cabin resonating, not the
       * engine singing.
       */
      const peakiness = (d: Float32Array) => {
        const N = Math.min(d.length, rate * 4);
        const bins: number[] = [];
        for (let hz = 24; hz <= 400; hz += 2) {
          const w = (2 * Math.PI * hz) / rate;
          let re = 0;
          let im = 0;
          for (let i = 0; i < N; i++) {
            const win = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N);
            re += d[i] * win * Math.cos(w * i);
            im += d[i] * win * Math.sin(w * i);
          }
          bins.push(Math.sqrt(re * re + im * im) / N);
        }
        bins.sort((a, b) => a - b);
        return bins[bins.length - 1] / bins[bins.length >> 1];
      };

      const seeded = () => {
        let seed = 909;
        return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      };

      const bed = async (snap: unknown) => {
        const ctx = new OfflineAudioContext(1, rate * 8, rate);
        const b = g.buildAmbience(ctx, { rng: seeded() });
        const cab = m.cabinAt(snap as never);
        b.snap(cab, 0);
        b.setLevel(1, 0, 0.001);
        for (let t = 0.25; t < 8; t += 0.25) b.update(cab, t);
        return peakiness((await ctx.startRendering()).getChannelData(0).slice(rate * 3));
      };

      // The control, and it is not a hypothetical: this is exactly what the
      // bed had under it before somebody said it sounded like a propeller
      // outside the aeroplane rather than a jet inside one.
      const propeller = await (async () => {
        const ctx = new OfflineAudioContext(1, rate * 8, rate);
        const sum = ctx.createGain();
        sum.gain.value = 0.3;
        sum.connect(ctx.destination);
        for (const [mul, lv] of [
          [1, 1],
          [2.01, 0.42],
          [3.04, 0.16],
        ] as const) {
          const o = ctx.createOscillator();
          o.type = "sine";
          o.frequency.value = 62 * mul;
          const og = ctx.createGain();
          og.gain.value = lv;
          o.connect(og).connect(sum);
          o.start(0);
        }
        return peakiness((await ctx.startRendering()).getChannelData(0).slice(rate * 3));
      })();

      return {
        propeller,
        roll: await bed({ phase: "takeoff", altFt: 0, gsKt: 150 }),
        climb: await bed({ phase: "takeoff", altFt: 10000, gsKt: 300 }),
        cruise: await bed({ phase: "cruise", altFt: 37000, gsKt: 480 }),
        taxi: await bed({ phase: "taxi", altFt: 0, gsKt: 15 }),
      };
    });

    // A fundamental and two harmonics is off the end of this scale, which is
    // what makes the numbers below mean something.
    expect(r.propeller).toBeGreaterThan(1e4);
    // And the cabin is nowhere near it. Plain noise through a lowpass
    // measures about eight on this scale; anything under about thirty is a
    // spectrum with no line in it.
    for (const k of ["roll", "climb", "cruise", "taxi"] as const)
      expect(r[k], `${k} is not a propeller`).toBeLessThan(30);
  });

  test("no parameter move puts a step in the waveform", async ({ page }) => {
    await boot(page);
    const r = await page.evaluate(async () => {
      const g = await import("/src/ife/ambienceGraph.ts");
      const m = await import("/src/ife/ambience.ts");
      const mock = await import("/src/dev/mockFlight.ts");
      const rate = 48000;
      const seconds = 90;

      /**
       * How spiky the waveform's own slope is, half a second at a time.
       *
       * Not the size of the largest sample step: that was the first version
       * of this and it was measuring brightness, not clicks. A bed with
       * seven kilohertz in it moves further between samples than one without,
       * so the threshold had to be loosened every time the cabin got brighter
       * until it meant nothing. The crest factor of the difference signal is
       * scale-free and colour-free — filtered noise sits near four whatever
       * its spectrum — and a step in a parameter is the one thing that puts
       * a single sample well above it.
       */
      const spikiness = (d: Float32Array) => {
        const win = rate / 2;
        const crests: number[] = [];
        for (let b = 0; b + win <= d.length; b += win) {
          let mx = 0;
          let s = 0;
          for (let i = b + 1; i < b + win; i++) {
            const j = Math.abs(d[i] - d[i - 1]);
            if (j > mx) mx = j;
            s += j * j;
          }
          const rms = Math.sqrt(s / win);
          if (rms > 0) crests.push(mx / rms);
        }
        crests.sort((a, b) => a - b);
        return crests[crests.length - 1] / crests[crests.length >> 1];
      };

      const run = async (jam: boolean) => {
        const ctx = new OfflineAudioContext(1, rate * seconds, rate);
        let seed = 13579;
        const rng = () =>
          ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
        const bed = g.buildAmbience(ctx, { rng });
        bed.snap(m.cabinAt({ phase: "boarding", altFt: 0, gsKt: 0 } as never), 0);
        bed.setLevel(1, 0, 0.001);
        // The whole flight, gate to stand, with no cues fired: the events are
        // transients on purpose — a touchdown is a step and is meant to be —
        // so what is measured here is only the automation underneath.
        for (let t = 0.25; t < seconds; t += 0.25) {
          const p = t / seconds;
          if (jam && Math.abs(t % 6) < 0.13) {
            // The control: the master level thrown between two values in a
            // millisecond, which is the canonical click and the thing every
            // ramp and glide in this graph exists to avoid. It used to jam
            // the bed with `snap` instead, and that stopped working — with
            // the engines behind a lowpass and the bottom on a bandpass,
            // even an instant change of state comes out smooth, which is
            // good news for the cabin and useless as a control.
            bed.setLevel(((t / 6) | 0) % 2 ? 1 : 0.2, t, 0.001);
          }
          bed.update(
            m.cabinAt({
              phase: mock.phaseAt(p),
              altFt: mock.altitudeFt(p),
              gsKt: mock.groundSpeedKt(p),
            } as never),
            t,
          );
        }
        return spikiness((await ctx.startRendering()).getChannelData(0));
      };

      return { glided: await run(false), jammed: await run(true) };
    });
    // Jammed, the worst half-second is three times spikier than the median
    // one. Glided, no half-second of a whole flight stands out from any
    // other.
    expect(r.jammed).toBeGreaterThan(2.2);
    expect(r.glided).toBeLessThan(1.8);
  });

  test("the events land without touching the ceiling", async ({ page }) => {
    await boot(page);
    const peak = await page.evaluate(async () => {
      const g = await import("/src/ife/ambienceGraph.ts");
      const m = await import("/src/ife/ambience.ts");
      const rate = 48000;
      const ctx = new OfflineAudioContext(2, rate * 20, rate);
      let seed = 2468;
      const rng = () =>
        ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      const bed = g.buildAmbience(ctx, { rng });
      // The worst case in the whole flight: a full ground bed, a touchdown on
      // top of it, reverse thrust on top of that, and a chime over the lot.
      const cab = m.cabinAt({ phase: "landed", altFt: 0, gsKt: 140 } as never);
      bed.snap(cab, 0);
      bed.setLevel(1, 0, 0.001);
      for (let t = 0.25; t < 20; t += 0.25) bed.update(cab, t);
      bed.event("touchdown", 2);
      bed.event("reverse", 2.7);
      bed.event("chime", 3);
      bed.event("gearDown", 3.2);
      const buf = await ctx.startRendering();
      let p = 0;
      for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        for (let i = 0; i < d.length; i++) {
          const a = d[i] < 0 ? -d[i] : d[i];
          if (a > p) p = a;
        }
      }
      return p;
    });
    expect(peak).toBeLessThan(0.98);
  });

  test("an event scheduled for later is silent until later", async ({ page }) => {
    await boot(page);
    const r = await page.evaluate(async () => {
      const g = await import("/src/ife/ambienceGraph.ts");
      const m = await import("/src/ife/ambience.ts");
      const rate = 16000;
      const before = (withEvents: boolean) => {
        const ctx = new OfflineAudioContext(1, rate * 14, rate);
        let seed = 555;
        const rng = () =>
          ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
        const bed = g.buildAmbience(ctx, { rng });
        const cab = m.cabinAt({ phase: "boarding", altFt: 0, gsKt: 0 } as never);
        bed.snap(cab, 0);
        bed.setLevel(1, 0, 0.001);
        for (let t = 0.25; t < 14; t += 0.25) bed.update(cab, t);
        if (withEvents) {
          // The delays the cabin actually uses: gear six seconds after the
          // wheels leave, the stand chime thirty after they are back down.
          bed.event("gearUp", 11);
          bed.event("startEngines", 12);
          bed.event("chime", 13);
        }
        return ctx.startRendering().then((buf) => {
          const d = buf.getChannelData(0);
          let s = 0;
          const from = rate * 3;
          const to = rate * 9;
          for (let i = from; i < to; i++) s += d[i] * d[i];
          return 20 * Math.log10(Math.sqrt(s / (to - from)));
        });
      };
      return { quiet: await before(false), armed: await before(true) };
    });
    // A gain node is born at 1 and these are connected the moment they are
    // built. Envelope the level from the event's own start time and forget to
    // put the node at zero first, and everything between now and then is a
    // bandpassed shriek at full level — which measured twelve decibels over
    // the top of the gate before anybody noticed it was there.
    expect(Math.abs(r.armed - r.quiet)).toBeLessThan(0.2);
  });

  test("every sound this cabin can make actually makes one", async ({
    page,
  }) => {
    await boot(page);
    const rows = await page.evaluate(async (kinds) => {
      const g = await import("/src/ife/ambienceGraph.ts");
      const out: Array<{ kind: string; rms: number; peak: number }> = [];
      for (const kind of kinds) {
        const rate = 24000;
        const ctx = new OfflineAudioContext(1, rate * 40, rate);
        let seed = 777;
        const rng = () =>
          ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
        const bed = g.buildAmbience(ctx, { rng });
        // A cabin with nothing running in it, so what is measured is the
        // event and only the event.
        const dead = {
          n1: 0, q: 0, roll: 0, packs: 0, apu: 0, murmur: 0, gsKt: 0,
        };
        bed.snap(dead as never, 0);
        bed.setLevel(1, 0, 0.001);
        for (let t = 0.25; t < 40; t += 0.25) bed.update(dead as never, t);
        bed.event(kind as never, 2);
        const d = (await ctx.startRendering()).getChannelData(0);
        let s = 0;
        let peak = 0;
        for (let i = 0; i < d.length; i++) {
          const a = d[i] < 0 ? -d[i] : d[i];
          if (a > peak) peak = a;
          s += d[i] * d[i];
        }
        out.push({ kind, rms: Math.sqrt(s / d.length), peak });
      }
      return out;
    }, EVENTS);

    for (const r of rows) {
      // A `case` that fell through the switch, or an envelope scheduled on a
      // node nothing is connected to, comes out as exactly this: silence,
      // from a control that looks implemented.
      // Peak, not level over the window: these run from a tenth of a second
      // to half a minute, so an average says how long a sound is and not
      // whether it is there. A `case` that fell through the switch, or an
      // envelope scheduled on a node nothing is connected to, comes out as
      // exactly this — silence, from a control that looks implemented.
      expect(r.peak, `${r.kind} is audible`).toBeGreaterThan(0.01);
      expect(r.peak, `${r.kind} has headroom`).toBeLessThan(0.9);
      expect(Number.isFinite(r.rms), `${r.kind} is finite`).toBe(true);
    }
    // The chimes are the loudest thing in the cabin, and nothing else comes
    // near them. That is the whole point of a chime: everything else here is
    // a room being a room, and a bin catch that makes somebody look up is a
    // bin catch that is too loud.
    const chimes = rows.filter((r) => r.kind.startsWith("chime"));
    const rest = rows.filter((r) => !r.kind.startsWith("chime"));
    expect(Math.min(...chimes.map((r) => r.peak))).toBeGreaterThan(
      Math.max(...rest.map((r) => r.peak)) * 1.5,
    );
  });

  test("an hour of cruise is neither silent nor busy", async ({ page }) => {
    await boot(page);
    const r = await page.evaluate(async () => {
      const m = await import("/src/ife/ambience.ts");
      let seed = 31337;
      const rng = () =>
        ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      const walk = (phase: string, hours: number) => {
        const kinds: Record<string, number> = {};
        let t = 0;
        let n = 0;
        while (t < hours * 3600) {
          t += m.incidentalGap(phase as never, rng);
          const k = m.incidental(phase as never, rng);
          kinds[k] = (kinds[k] ?? 0) + 1;
          n++;
        }
        return { n, kinds: Object.keys(kinds).length, all: Object.keys(kinds) };
      };
      return {
        cruise: walk("cruise", 1),
        boarding: walk("boarding", 1),
        landed: walk("landed", 1),
      };
    });

    // Rare enough to be a room and not a sound effects reel: something
    // happens about once a minute at cruise, which over seven hours is four
    // hundred small events and no two of them in the same place.
    expect(r.cruise.n).toBeGreaterThan(40);
    expect(r.cruise.n).toBeLessThan(140);
    // And varied enough that an hour does not become a pattern. Nine things
    // can happen at cruise and over an hour all nine should have.
    expect(r.cruise.kinds).toBeGreaterThanOrEqual(8);
    // A cabin being boarded and a cabin being emptied are busy; that is what
    // three hundred people opening lockers sounds like.
    expect(r.boarding.n).toBeGreaterThan(r.cruise.n * 3);
    expect(r.landed.n).toBeGreaterThan(r.cruise.n * 5);
    // Nothing that belongs to a flight happens at the gate.
    for (const k of r.boarding.all)
      expect(["gearUp", "gearDown", "flapsOut", "flapsIn", "turbulence"]).not.toContain(k);
  });

  /* ── And the switch, in a real browser ────────────────────────────────── */

  test("the placard starts the cabin, and it survives the screen going out", async ({
    page,
  }) => {
    await page.goto(BENCH, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".bench-glass");
    await page.locator(".ife-idle").click();
    await page.getByRole("button", { name: "English" }).click();
    await page.getByRole("button", { name: "Skip" }).click();

    // The module the *page* loaded, not a second copy of it.
    //
    // Vite serves an edited module as `…/ambience.ts?t=<stamp>` so that hot
    // replacement can bust the browser's cache, and a plain `import()` of the
    // unstamped path therefore evaluates the file a second time — a separate
    // store, reading the same localStorage, agreeing about the switch and
    // knowing nothing about the cabin. That cost an hour once. Ask the page
    // which URL it actually used.
    const state = () =>
      page.evaluate(async () => {
        const seen = performance
          .getEntriesByType("resource")
          .map((e) => e.name)
          .filter((n) => /\/src\/ife\/ambience\.ts(\?|$)/.test(n));
        const url = seen.find((n) => n.includes("?")) ?? seen[0] ?? "/src/ife/ambience.ts";
        const m = await import(/* @vite-ignore */ url);
        return m.useAmbience.getState() as { on: boolean; live: boolean };
      });

    // On, without being asked. An aeroplane has no switch for whether it
    // makes a noise — and it cannot make one before the page has been
    // touched, so what this means in practice is that the room is there from
    // the moment somebody picks a language.
    expect((await state()).on).toBe(true);
    await expect.poll(async () => (await state()).live).toBe(true);

    const key = page.locator(".ife-rail").getByRole("button", { name: "Cabin sound" });
    await expect(key).toHaveAttribute("aria-pressed", "true");

    // And it stops when asked, which is the half of a switch that gets
    // forgotten.
    await key.click();
    await expect(key).toHaveAttribute("aria-pressed", "false");
    await expect.poll(async () => (await state()).live).toBe(false);
    await key.click();
    await expect.poll(async () => (await state()).live).toBe(true);

    // Out goes the screen. The aeroplane does not stop: a passenger who puts
    // their panel out to sleep has turned off a light, not an engine — and
    // somebody asleep is the one case where eight hours of this matters most.
    await page.locator(".ife-rail").getByRole("button", { name: "Screen off" }).click();
    await expect(page.locator(".ife-root")).toHaveAttribute("data-screen", "off");
    expect((await state()).live).toBe(true);
  });

  test("four minutes in, it is neither where it was nor anywhere else", async ({
    page,
  }) => {
    await boot(page);
    const r = await page.evaluate(async () => {
      const g = await import("/src/ife/ambienceGraph.ts");
      const m = await import("/src/ife/ambience.ts");
      const rate = 8000;
      const seconds = 240;
      const ctx = new OfflineAudioContext(1, rate * seconds, rate);
      let seed = 31415;
      const rng = () =>
        ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      const bed = g.buildAmbience(ctx, { rng });
      const cab = m.cabinAt({ phase: "cruise", altFt: 37000, gsKt: 480 } as never);
      bed.snap(cab, 0);
      bed.setLevel(1, 0, 0.001);
      for (let t = 0.25; t < seconds; t += 0.25) bed.update(cab, t);
      const d = (await ctx.startRendering()).getChannelData(0);
      // Thirty-second blocks, all the way through.
      const out: number[] = [];
      const block = rate * 30;
      for (let b = 0; b + block <= d.length; b += block) {
        let s = 0;
        for (let i = b; i < b + block; i++) s += d[i] * d[i];
        out.push(20 * Math.log10(Math.sqrt(s / block)));
      }
      return out;
    });
    const settled = r.slice(1);
    const spread = Math.max(...settled) - Math.min(...settled);
    // It has not walked off. Four minutes of a random walk with no leash on
    // it is how a bed ends up silent, or twice as loud, an hour in.
    expect(spread).toBeLessThan(2.5);
    // And it has not sat still either, which is the whole point of the walk:
    // a level that is identical block after block is a recording.
    expect(spread).toBeGreaterThan(0.05);
  });
});
