// ── Ambience ─────────────────────────────────────────────────────────────────
// Room tone for a sky. Not music -- the radio is already the music, and a
// second piece of music would just be two of them. This is the sound the scene
// would make if it made one: moving air, and something very low underneath it.
//
// Synthesised rather than streamed, because a loop long enough not to betray
// itself is a megabyte or two and this project has just spent a whole pass
// making the second visit cheap. Filtered noise and a sine cost nothing to
// ship and never have to be fetched again.
//
// It follows the camera. Down among the runways the bed is quiet and dull,
// the way air sounds near the ground; pulled out and up it opens and thins,
// which is what altitude sounds like. That coupling is the only reason this
// is worth having: a fixed drone under a moving camera is wallpaper.

const KEY = 'stratum:ambience';

let _ctx = null;
let _nodes = null;
let _on = false;
let _armed = false;      // wants to play, waiting for a gesture
let _lastUpdate = 0;

export function ambienceOn() { return _on; }

function _prefers() {
  try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
}
function _remember(on) {
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch {}
}

// Two seconds of pink-ish noise, looped. White noise run through the usual
// cheap pink filter: white alone is too bright and reads as hiss rather than
// air.
function _noiseBuffer(ctx) {
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const out = buf.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.969 * b2 + w * 0.153852;
    b3 = 0.8665 * b3 + w * 0.3104856;
    b4 = 0.55 * b4 + w * 0.5329522;
    b5 = -0.7616 * b5 - w * 0.016898;
    out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  return buf;
}

function _build() {
  if (_nodes) return;
  const ctx = _ctx;
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // The air.
  const noise = ctx.createBufferSource();
  noise.buffer = _noiseBuffer(ctx);
  noise.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 420;
  lp.Q.value = 0.4;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 90;
  const airGain = ctx.createGain();
  airGain.gain.value = 0.5;
  noise.connect(hp).connect(lp).connect(airGain).connect(master);
  noise.start();

  // The thing underneath. A fifth apart so it reads as a space rather than a
  // note, and slow enough that it is felt and not heard.
  const subGain = ctx.createGain();
  subGain.gain.value = 0.11;
  subGain.connect(master);
  for (const f of [55, 82.5]) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = f === 55 ? 1 : 0.45;
    // Two detuned drifts, never in phase, so the pair never sits still.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = f === 55 ? 0.043 : 0.067;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.35;
    lfo.connect(lfoGain).connect(g.gain);
    lfo.start();
    o.connect(g).connect(subGain);
    o.start();
  }

  _nodes = { master, lp, airGain, subGain };
}

function _fade(to, seconds) {
  if (!_nodes) return;
  const g = _nodes.master.gain;
  const now = _ctx.currentTime;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(to, now + seconds);
}

/** Called every frame; does real work about four times a second. */
export function updateAmbience(camera, elapsed) {
  if (!_on || !_nodes || !camera) return;
  if (elapsed - _lastUpdate < 0.25) return;
  _lastUpdate = elapsed;
  // Distance from the airport, normalised across the range the controls allow.
  const d = camera.position.length();
  const t = Math.max(0, Math.min(1, (d - 3) / 34));
  const now = _ctx.currentTime;
  // High and far: the bed opens up and thins out. Low and close: dull, quiet.
  _nodes.lp.frequency.setTargetAtTime(340 + t * 1500, now, 0.6);
  _nodes.airGain.gain.setTargetAtTime(0.28 + t * 0.55, now, 0.6);
  _nodes.subGain.gain.setTargetAtTime(0.16 - t * 0.09, now, 0.6);
}

function _start() {
  try {
    _ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  } catch { return false; }
  _build();
  if (_ctx.state === 'suspended') _ctx.resume().catch(() => {});
  _on = true;
  _fade(0.055, 3.5);   // long enough in that nobody notices it arrive
  return true;
}

function _stop() {
  _on = false;
  _fade(0, 1.2);
}

export function toggleAmbience() {
  if (_on) { _stop(); _remember(false); return false; }
  const ok = _start();
  _remember(ok);
  return ok;
}

// Browsers will not start audio without a gesture, so a remembered preference
// cannot simply play on load: it waits for the first thing the visitor does.
export function initAmbience() {
  if (!_prefers() || _armed) return;
  _armed = true;
  const go = () => {
    window.removeEventListener('pointerdown', go, true);
    window.removeEventListener('keydown', go, true);
    _start();
  };
  window.addEventListener('pointerdown', go, true);
  window.addEventListener('keydown', go, true);
}
