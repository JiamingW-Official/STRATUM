// ── STRATUM Radio ──
// Auto-plays shuffled tracks from station folders
// Users can switch stations but not skip songs

const STATIONS = [
  {
    id: "electronic",
    name: "NEON APPROACH",
    shortName: "NEON",
    color: "#c06cf0",
    folder: "Electronic",
    tracks: [
      "Daniel Brown - SENSATION",
      "Giorgio Vitté - Ataca",
      "LaFaye - Hidden",
      "NUEQ - Tiramisu",
      "Out of Flux - Sunnydance",
      "Rynn - Heart Beat - Instrumental version",
      "Yarin Primak - DREEEAAAMS",
      "ZISO - Gonna Freak",
      "Ziskoe - SIREN - Ziskoe Remix",
    ],
  },
  {
    id: "indie",
    name: "GOLDEN HOUR",
    shortName: "GOLDEN",
    color: "#e8a44c",
    folder: "Indie",
    tracks: [
      "Ben Juliet - Still Bloom",
      "Danger Roberts - Hard Reset",
      "Emma-Rose - Clouds",
      "IamDayLight - Hold On",
      "Lia Dsau - Grow",
      "Neska Rose - GROW",
      "Neska Rose - Rolling Through Da Night",
      "SOURWAH - Mandalas",
      "Southern Call - Smoke Show",
      "Tal Tamari - Love Her So - Instrumental version",
      "Tiko Tiko - Baby Lets Go - Stripped Version",
      "messwave - maybe its over",
    ],
  },
  {
    id: "relax",
    name: "FLIGHT LEVEL",
    shortName: "FL",
    color: "#5ab8e8",
    folder: "Relax_Ambiance",
    tracks: [
      "Assaf Ayalon - Locked in Silence",
      "Aves - Sunshine",
      "Ian Locke - Once Interlude",
      "MAIKY - Above the Clouds",
      "Master Minded - Strings of Soul",
    ],
  },
  {
    id: "soul",
    name: "VELVET TAXI",
    shortName: "VELVET",
    color: "#e85a8a",
    folder: "Soul_R&B",
    tracks: [
      "Aves - Summer Breakup Song",
      "Aves - Sunshine",
      "Aves - Velvet",
      "Honey G - More than Words",
      "Michael Shynes - Extra Extra - Instrumental version",
      "NOA - Made to Love You",
      "Skipp Whitman - Lush - Instrumental version",
      "Skipp Whitman - Vegas - Instrumental version",
      "Ziv Moran - Dance",
    ],
  },
];

// Fake FM frequencies
// ── The dial ────────────────────────────────────────────────────────────────
// Four buttons is a playlist with a radio's clothes on. A radio is a band you
// move through: the stations sit at fixed points on it, everything between
// them is noise, and finding one is a small act of skill rather than a click
// on a label that was already named for you.
//
// The band is the real FM one, and the frequencies are the ones the panel was
// already printing. LOCK_MHZ is how close you have to be before a station
// takes hold; inside it the music fades up and the static fades out in
// proportion, so the last tenth of a megahertz is the part that feels like
// tuning.
const _FREQS = ["88.3", "91.7", "96.5", "103.1"];
const BAND_LO = 87.5;
const BAND_HI = 108.0;
// 0.45 was a test of mouse precision, not a dial: the strip is 260px across
// 20.5 MHz, so that window was six pixels wide and you could not reliably hit
// one. 1.2 gives each station about 30px of capture, and the magnetic pull
// below closes the last of it for you -- which is what a detented knob does
// and why a real one never feels fiddly.
const LOCK_MHZ = 1.2;
// How hard the needle is drawn toward a station while you are dragging.
const PULL = 0.55;

let _freq = 88.3; // where the needle sits
let _tuning = false;
// Tower audio has priority over entertainment in a real cockpit, so it has it
// here. 0.18 rather than silence: the music should still be under the
// controller, the way it is when someone turns the cabin down to listen.
let _ducked = false;
const DUCK = 0.18;
let _staticCtx = null;
let _staticNodes = null;

// ── State ──
let _audio = null;
// The track order was already shuffled, but the station was not: every session
// opened on the same one, so "the radio" was in practice a single channel with
// its songs reordered. Start somewhere at random and it behaves like tuning in.
let _stationIdx = Math.floor(Math.random() * STATIONS.length);
// The needle starts wherever the random station is, not at the bottom of the band.
_freq = parseFloat(_FREQS[_stationIdx]);
let _trackIdx = 0;
let _shuffled = [];
let _playing = false;
let _panelEl = null;
let _visible = false;
let _volume = 0.5;
let _fadeInterval = null;
let _loadRetries = 0;
let _progressRAF = null;
const MAX_RETRIES = 3;

function _shuffle(arr) {
  const a = [...arr.keys()];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Between-station noise. Its own tiny graph rather than a shared one: it has to
// be able to sit at full level while the music is silent, which is the opposite
// of what the ambience bed does.
function _ensureStatic() {
  if (_staticNodes) return true;
  try {
    _staticCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    return false;
  }
  const ctx = _staticCtx;
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const out = buf.getChannelData(0);
  for (let i = 0; i < len; i++) out[i] = (Math.random() * 2 - 1) * 0.5;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  // Band-limited: full-range white is a hiss, and a real receiver's noise is
  // shaped by its own front end.
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 2200;
  bp.Q.value = 0.55;
  const g = ctx.createGain();
  g.gain.value = 0;
  src.connect(bp).connect(g).connect(ctx.destination);
  src.start();
  _staticNodes = { gain: g, filter: bp };
  return true;
}

function _setStatic(level) {
  if (level > 0 && !_ensureStatic()) return;
  if (!_staticNodes) return;
  if (_staticCtx.state === "suspended") _staticCtx.resume().catch(() => {});
  const g = _staticNodes.gain.gain;
  g.setTargetAtTime(level * _volume * 0.5, _staticCtx.currentTime, 0.05);
}

/** The station nearest a frequency, and how far off it we are. */
function _nearest(freq) {
  let idx = 0,
    best = Infinity;
  for (let i = 0; i < _FREQS.length; i++) {
    const d = Math.abs(parseFloat(_FREQS[i]) - freq);
    if (d < best) {
      best = d;
      idx = i;
    }
  }
  return { idx, off: best };
}

/** 1 when dead on a station, 0 at the edge of its lock window and beyond. */
function _signal(freq) {
  const { off } = _nearest(freq);
  if (off >= LOCK_MHZ) return 0;
  return 1 - off / LOCK_MHZ;
}

/**
 * Everything the dial position implies: what the music is worth, what the
 * noise is worth, and what the panel says. One place, because the two levels
 * are a single quantity seen from both sides.
 */
function _applyTuning() {
  const sig = _signal(_freq);
  const duck = _ducked ? DUCK : 1;
  if (_audio) _audio.volume = _volume * sig * duck;
  _setStatic(_playing ? (1 - sig) * duck : 0);
  const needle = _panelEl?.querySelector("#radio-needle");
  if (needle) {
    needle.style.left = `${((_freq - BAND_LO) / (BAND_HI - BAND_LO)) * 100}%`;
    needle.classList.toggle("is-locked", sig > 0.999);
  }
  const freqEl = _panelEl?.querySelector("#radio-freq");
  if (freqEl) freqEl.textContent = `${_freq.toFixed(1)} FM`;
  // Signal strength, so the dial tells you you are getting warmer instead of
  // staying blank until the moment it locks. Four bars is enough resolution to
  // feel a gradient and few enough to read without looking at it.
  // The printed call-sign lights only while the needle is holding it, and it
  // has to follow the needle rather than the committed station -- otherwise it
  // lags a drag by however long the settle takes.
  const lockedIdx = sig > 0 ? _nearest(_freq).idx : -1;
  _panelEl?.querySelectorAll(".radio-stationmark").forEach((el, i) => {
    el.classList.toggle("active", i === lockedIdx);
  });
  const sigEl = _panelEl?.querySelector("#radio-sig");
  if (sigEl) {
    const lit = Math.ceil(sig * 4);
    sigEl
      .querySelectorAll("i")
      .forEach((b, i) => b.classList.toggle("on", i < lit));
    sigEl.classList.toggle("is-full", sig > 0.999);
  }
  const tuner = _panelEl?.querySelector("#radio-tuner");
  if (tuner) tuner.setAttribute("aria-valuenow", _freq.toFixed(1));
  if (_panelEl) {
    _panelEl.classList.toggle("is-offstation", sig <= 0);
    _panelEl.classList.toggle("is-tuning", _tuning);
  }
  const nameEl = _panelEl?.querySelector("#radio-station-name");
  // "NO SIGNAL" is right when you parked in the noise and wrong when the dial
  // is on its way somewhere: the same empty band means two different things
  // depending on whether anything is moving. And a seek that passes over a
  // station on its way to another should not stop to name it — until the set
  // locks, the only true answer is that it is still looking.
  if (nameEl) {
    // 0.9, not 1: the ease-out's tail spends its last 300ms covering the final
    // fraction of a megahertz, and holding "TUNING" through that left the name
    // trailing a readout that had already settled on the destination. The set
    // has locked well before the needle has finished creeping.
    if (_sweepRAF && sig < 0.9) nameEl.textContent = "TUNING";
    else if (sig <= 0) nameEl.textContent = "NO SIGNAL";
  }

  // The rail's thumbnail is the same receiver seen small, so it follows the
  // needle rather than the committed station — it sweeps too, and it is the
  // only writer of that readout.
  const toggle = document.getElementById("radio-toggle-btn");
  if (toggle) {
    const st = _currentStation();
    toggle.style.setProperty("--rt-color", st.color);
    const f = toggle.querySelector("#radio-toggle-freq");
    if (f) f.textContent = _freq.toFixed(1);
    // Only while the bar is away. With the bar open the two sit inches apart
    // saying the same number, and the thumbnail's whole job is to report when
    // the panel is not there to.
    toggle.classList.toggle("is-live", _playing && !_visible);
  }
}

/**
 * Move the needle. Crossing into a station's window is what changes the feed.
 * `raw` is the untouched pointer position; inside a capture zone the needle is
 * eased toward the station so the last few pixels happen without you, and the
 * closer you get the harder it pulls.
 */
function _tuneTo(freq, magnetic = false) {
  let f = Math.max(BAND_LO, Math.min(BAND_HI, freq));
  if (magnetic) {
    const n = _nearest(f);
    if (n.off < LOCK_MHZ) {
      const target = parseFloat(_FREQS[n.idx]);
      const strength = PULL * (1 - n.off / LOCK_MHZ);
      f = f + (target - f) * strength;
    }
  }
  _freq = f;
  _commitStation();
  _applyTuning();
}

// ── Committing a station ────────────────────────────────────────────────────
// Switching the feed the instant the needle crosses a window sounds like what
// it is: drag once across the band and four stations each load a track, none
// of which you hear. So the switch waits for the needle to settle. Visually
// nothing waits -- the meter, the readout and the lit call-sign all follow the
// needle immediately -- but the audio only changes once you have stopped
// moving, which is also when a real receiver would have finished locking.
let _settleTimer = null;
function _commitStation(immediate = false) {
  const { idx, off } = _nearest(_freq);
  const wants = off < LOCK_MHZ ? idx : -1;
  clearTimeout(_settleTimer);
  if (wants === -1 || wants === _stationIdx) return;
  if (immediate) {
    _crossfadeToStation(wants);
    return;
  }
  _settleTimer = setTimeout(() => {
    const now = _nearest(_freq);
    if (now.off < LOCK_MHZ && now.idx !== _stationIdx)
      _crossfadeToStation(now.idx);
  }, 260);
}

// ── Seeking ─────────────────────────────────────────────────────────────────
// Pressing seek used to swap the feed and leave the needle where it was: the
// readout still said 96.5 while 103.1 played, and the change arrived as a
// six-hundred-millisecond fade of one track into another with nothing to look
// at. That is a playlist skip wearing a radio's clothes.
//
// A tuner runs the dial across the band. The station you are leaving falls
// into noise, the band goes past, and the new one rises out of the noise when
// the needle arrives. So seek is now a drag you did not have to make, and
// almost none of it is new: the needle, the meter, the hiss and the volume all
// already follow _freq through _applyTuning. The only decision is when to
// exchange the audio — at 55%, while the signal is near its floor, so the
// swap happens under the noise instead of in front of it.
let _sweepRAF = null;
function _cancelSweep() {
  if (!_sweepRAF) return;
  cancelAnimationFrame(_sweepRAF);
  _sweepRAF = null;
  _tuning = false;
}

/** The next printed station up or down the band from where the needle is. */
function _stepFreq(dir) {
  const sorted = _FREQS.map(parseFloat).sort((a, b) => a - b);
  let next =
    dir > 0
      ? sorted.find((f) => f > _freq + 0.05)
      : [...sorted].reverse().find((f) => f < _freq - 0.05);
  if (next === undefined) next = dir > 0 ? sorted[0] : sorted[sorted.length - 1];
  return next;
}

function _seekTo(freq) {
  _cancelSweep();
  clearTimeout(_settleTimer);
  const from = _freq;
  const to = Math.max(BAND_LO, Math.min(BAND_HI, freq));
  const idx = _nearest(to).idx;
  if (Math.abs(to - from) < 0.05) {
    _freq = to;
    _commitStation(true);
    _applyTuning();
    return;
  }
  // Long enough to hear the band go past, short enough not to be a wait. The
  // distance is in the duration, so a neighbour arrives quickly and a wrap
  // across the whole dial visibly does not.
  // Measured the first version at 375ms for a neighbouring station, which put
  // about 150ms of noise between the two — short enough to read as a glitch
  // rather than as a band being crossed. The noise is the whole point, so it
  // gets time to be heard.
  const ms = Math.min(1100, 420 + Math.abs(to - from) * 42);
  const t0 = performance.now();
  let swapped = false;
  _tuning = true;
  const step = (now) => {
    const p = Math.min(1, (now - t0) / ms);
    const eased = 1 - Math.pow(1 - p, 3); // a dial thrown, coming to rest
    _freq = from + (to - from) * eased;
    if (!swapped && p >= 0.55) {
      swapped = true;
      _loadStation(idx);
    }
    _applyTuning();
    if (p < 1) {
      _sweepRAF = requestAnimationFrame(step);
      return;
    }
    _sweepRAF = null;
    _tuning = false;
    _freq = to;
    if (!swapped) _loadStation(idx);
    _applyTuning();
  };
  _sweepRAF = requestAnimationFrame(step);
}

// The state half of a station change with no fade of its own: during a seek
// the volume is already governed by the signal, and a second fade on top of
// that would mute the arrival it exists to reveal.
function _loadStation(idx) {
  if (idx === _stationIdx && _playing) return;
  _stationIdx = idx;
  _initShuffled();
  _loadRetries = 0;
  if (_fadeInterval) {
    clearInterval(_fadeInterval);
    _fadeInterval = null;
  }
  if (_playing) _playTrack();
  else _updateUI();
}

function _currentStation() {
  return STATIONS[_stationIdx];
}

function _currentTrack() {
  const st = _currentStation();
  return st.tracks[_shuffled[_trackIdx % _shuffled.length]];
}

function _trackUrl() {
  const st = _currentStation();
  // AAC rather than MP3. The sources were 128k MP3, which is not a high
  // bitrate to start from, so re-encoding as MP3 would only compound the loss;
  // AAC-LC at 96k measures identical to the source through 16 kHz and trims
  // only what sits above it, already 38 dB down. 90MB of tracks became 70MB.
  return `/radio/${encodeURIComponent(st.folder)}/${encodeURIComponent(_currentTrack())}.m4a`;
}

function _parseTrackName(raw) {
  const sep = raw.indexOf(" - ");
  if (sep < 0) return { artist: "", title: raw };
  return { artist: raw.substring(0, sep), title: raw.substring(sep + 3) };
}

function _initShuffled() {
  _shuffled = _shuffle(_currentStation().tracks);
  _trackIdx = 0;
}

function _advanceTrack() {
  _trackIdx++;
  _loadRetries = 0;
  if (_trackIdx >= _shuffled.length) _initShuffled();
}

// ── Progress bar loop ──
function _startProgress() {
  _stopProgress();
  const bar = _panelEl?.querySelector("#radio-progress");
  const timeEl = _panelEl?.querySelector("#radio-time");
  if (!bar || !_audio) return;
  const tick = () => {
    if (_audio && _audio.duration && isFinite(_audio.duration)) {
      const pct = (_audio.currentTime / _audio.duration) * 100;
      bar.style.width = pct + "%";
      // Current time display
      const m = Math.floor(_audio.currentTime / 60);
      const s = Math.floor(_audio.currentTime % 60);
      const tm = Math.floor(_audio.duration / 60);
      const ts = Math.floor(_audio.duration % 60);
      if (timeEl)
        timeEl.textContent = `${m}:${s.toString().padStart(2, "0")} / ${tm}:${ts.toString().padStart(2, "0")}`;
    }
    _progressRAF = requestAnimationFrame(tick);
  };
  _progressRAF = requestAnimationFrame(tick);
}

function _stopProgress() {
  if (_progressRAF) {
    cancelAnimationFrame(_progressRAF);
    _progressRAF = null;
  }
}

// ── Playback ──
function _playTrack() {
  if (!_audio) {
    _audio = new Audio();
    _audio.volume = _volume * _signal(_freq);
    _audio.preload = "auto";
    _audio.addEventListener("ended", () => {
      _advanceTrack();
      _playTrack();
    });
    _audio.addEventListener("error", () => {
      _loadRetries++;
      if (_loadRetries >= MAX_RETRIES) _advanceTrack();
      setTimeout(() => _playTrack(), 800);
    });
    _audio.addEventListener("canplaythrough", () => {
      _loadRetries = 0;
    });
  }
  _audio.src = _trackUrl();
  _audio.play().catch(() => {});
  _playing = true;
  _startProgress();
  _updateUI();
}

function _stop() {
  if (_audio) {
    _audio.pause();
    _audio.currentTime = 0;
  }
  _playing = false;
  // A receiver that is off does not hiss.
  _setStatic(0);
  _stopProgress();
  _updateUI();
}

// ── Crossfade ──
function _crossfadeToStation(newIdx) {
  if (newIdx === _stationIdx && _playing) return;
  _stationIdx = newIdx;
  _initShuffled();
  _loadRetries = 0;
  if (_fadeInterval) clearInterval(_fadeInterval);

  if (_audio && _playing) {
    let vol = _audio.volume;
    _fadeInterval = setInterval(() => {
      vol -= 0.05;
      if (vol <= 0) {
        clearInterval(_fadeInterval);
        _fadeInterval = null;
        _audio.volume = _volume * _signal(_freq);
        _playTrack();
      } else {
        _audio.volume = vol;
      }
    }, 30);
  } else {
    _playTrack();
  }
  _updateUI();
}

// ── Volume icon helper ──
function _volIcon() {
  if (_volume <= 0)
    return `<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
  if (_volume < 0.5)
    return `<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07"/>`;
  return `<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/>`;
}

// ── UI ──
function _createPanel() {
  if (_panelEl) return;
  _panelEl = document.createElement("div");
  _panelEl.id = "radio-panel";
  _panelEl.className = "radio-panel hidden";
  _panelEl.innerHTML = `
    <div class="radio-accent" id="radio-accent"></div>
    <!-- Compact grip: the whole bar opens the panel, and this is the piece
         that is not a transport button, so pressing play does not also
         expand. -->
    <button type="button" class="radio-grip" id="radio-grip" aria-label="Expand radio" title="Expand"></button>
    <div class="radio-header">
      <span class="radio-header-label">STRATUM RADIO</span>
      <span class="radio-sig" id="radio-sig" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
      <span class="radio-header-freq" id="radio-freq">88.3 FM</span>
    </div>
    <div class="radio-dial">
      <div class="radio-tuner" id="radio-tuner" role="slider" tabindex="0"
           aria-label="Tuning" aria-valuemin="87.5" aria-valuemax="108" aria-valuenow="88.3">
        <div class="radio-scale" id="radio-scale"></div>
        <div class="radio-needle" id="radio-needle"></div>
      </div>
    </div>
    <div class="radio-display">
      <div class="radio-station-name" id="radio-station-name">--</div>
      <div class="radio-now-playing">
        <div class="radio-track-title" id="radio-track-title">--</div>
        <div class="radio-track-artist" id="radio-track-artist">--</div>
      </div>
      <div class="radio-progress-wrap">
        <div class="radio-progress-bar"><div class="radio-progress" id="radio-progress"></div></div>
        <span class="radio-time" id="radio-time">0:00 / 0:00</span>
      </div>
      <div class="radio-eq" id="radio-eq">
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span>
      </div>
    </div>
    <!-- Transport, centred, the way a now-playing card carries it. Previous and
         next are stations rather than tracks: you can move across the band but
         you do not get to skip a song, which has been the rule since the first
         version of this panel. The glyphs say so — a double triangle with no
         bar is the seek of a physical tuner, where the bar is the skip-track of
         a player, and the pair had been drawn with the bar. -->
    <div class="radio-transport">
      <button type="button" class="radio-tp" id="radio-prev" title="Tune down the band" aria-label="Tune down the band">
        <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M7.4 3.4v9.2L2 8zM14 3.4v9.2L8.6 8z"/></svg>
      </button>
      <button type="button" class="radio-tp radio-tp--main" id="radio-power-btn" title="Play / stop" aria-label="Play or stop">
        <svg viewBox="0 0 16 16" width="17" height="17" fill="currentColor" aria-hidden="true">
          <path class="radio-tp-play" d="M4.6 3 L12.6 8 L4.6 13 Z"/>
          <rect class="radio-tp-stop" x="4.4" y="4.4" width="7.2" height="7.2" rx="1.2"/>
        </svg>
      </button>
      <button type="button" class="radio-tp" id="radio-next" title="Tune up the band" aria-label="Tune up the band">
        <svg viewBox="0 0 16 16" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M8.6 3.4v9.2L14 8zM2 3.4v9.2L7.4 8z"/></svg>
      </button>
    </div>
    <div class="radio-bottom">
      <button type="button" class="radio-vol-btn" id="radio-vol-btn" title="Mute">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="radio-vol-icon">${_volIcon()}</svg>
      </button>
      <input type="range" class="radio-volume" id="radio-volume" min="0" max="100" value="50" title="Volume">
      <button type="button" class="radio-close-btn" id="radio-close-btn" title="Close panel">&times;</button>
    </div>
  `;
  // The tower can start before the radio has ever been opened, and a duck
  // requested against a panel that does not exist yet is silently dropped by
  // the optional chain in setRadioDucked. The volume was right — _applyTuning
  // reads the flag — but the bar came up showing none of it. The panel adopts
  // the current state at birth instead.
  _panelEl.classList.toggle("is-ducked", _ducked);
  document.body.appendChild(_panelEl);

  // Opens as a bar. A now-playing strip is what you want nineteen times out of
  // twenty; the dial, the progress and the volume are what you want when you
  // went looking for them. The close button folds it back rather than
  // dismissing the panel, because dismissing is what the toolbar button does.
  _panelEl.classList.add("is-compact");
  _panelEl.querySelector("#radio-grip")?.addEventListener("click", () => {
    _panelEl.classList.remove("is-compact");
  });

  // ── The tuner ──
  const tuner = _panelEl.querySelector("#radio-tuner");
  const scale = _panelEl.querySelector("#radio-scale");
  {
    // Ticks every 0.5 MHz, taller every 2. The four call-signs are printed on
    // the band where they actually sit, so the dial teaches its own layout:
    // you can see there is something at 96.5 before you have ever been there.
    let marks = "";
    for (let f = BAND_LO; f <= BAND_HI + 0.01; f += 0.5) {
      const pct = ((f - BAND_LO) / (BAND_HI - BAND_LO)) * 100;
      const major = Math.abs(f % 2) < 0.01;
      marks += `<i class="radio-tick${major ? " is-major" : ""}" style="left:${pct}%"></i>`;
    }
    for (let i = 0; i < STATIONS.length; i++) {
      const f = parseFloat(_FREQS[i]);
      const pct = ((f - BAND_LO) / (BAND_HI - BAND_LO)) * 100;
      marks +=
        `<b class="radio-stationmark" data-idx="${i}" style="left:${pct}%;--c:${STATIONS[i].color}">` +
        `<u></u><em>${STATIONS[i].shortName}</em></b>`;
    }
    scale.innerHTML = marks;
  }

  const _freqFromX = (clientX) => {
    const r = tuner.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    return BAND_LO + t * (BAND_HI - BAND_LO);
  };

  // Relative, not absolute. Pressing used to teleport the needle to wherever
  // the cursor happened to be, which is the single thing that made this feel
  // like a scrubber rather than a dial: a dial does not jump, you turn it from
  // where it already is. Press picks the needle up, movement is a delta, and
  // the printed call-signs remain the fast way to cross the band in one go.
  let _grabX = 0;
  let _grabFreq = 0;

  const onDown = (ev) => {
    // A hand on the dial outranks a seek that is still running.
    _cancelSweep();
    _tuning = true;
    _grabX = ev.clientX;
    _grabFreq = _freq;
    tuner.setPointerCapture?.(ev.pointerId);
    _applyTuning();
  };
  const onMove = (ev) => {
    if (!_tuning) return;
    const r = tuner.getBoundingClientRect();
    const perPx = (BAND_HI - BAND_LO) / (r.width || 260);
    _tuneTo(_grabFreq + (ev.clientX - _grabX) * perPx, true);
  };
  const onUp = () => {
    if (!_tuning) return;
    _tuning = false;
    // Let go near a station and it pulls in the last fraction, the way a
    // detented dial does, and commits at once rather than waiting out the
    // settle timer. Let go in the noise and you stay in the noise.
    const { idx, off } = _nearest(_freq);
    if (off < LOCK_MHZ) {
      _freq = parseFloat(_FREQS[idx]);
      _commitStation(true);
    }
    _applyTuning();
  };
  tuner.addEventListener("pointerdown", onDown);
  tuner.addEventListener("pointermove", onMove);
  tuner.addEventListener("pointerup", onUp);
  tuner.addEventListener("pointercancel", onUp);
  tuner.addEventListener("keydown", (ev) => {
    // A plain arrow steps station to station. Stepping by frequency instead
    // was useless: any step smaller than the 1.2 MHz capture window is pulled
    // straight back to the station you started on, so the key did nothing.
    // Shift is the fine adjustment, and it deliberately does not snap, which
    // is the only way to park in the noise on purpose.
    if (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight") return;
    ev.preventDefault();
    const dir = ev.key === "ArrowRight" ? 1 : -1;
    if (ev.shiftKey) {
      _freq = Math.max(BAND_LO, Math.min(BAND_HI, _freq + dir * 0.2));
      _commitStation(true);
      _applyTuning();
      return;
    }
    _seekTo(_stepFreq(dir));
  });

  // Clicking a printed call-sign is still the fast way there.
  scale.querySelectorAll(".radio-stationmark").forEach((el) => {
    el.addEventListener("pointerdown", (ev) => {
      ev.stopPropagation();
      _seekTo(parseFloat(_FREQS[+el.dataset.idx]));
    });
  });

  // Transport: previous and next station along the band. The band walk lived
  // in three places — here, the arrow keys, and the exported next/prevStation —
  // and only the exported pair was ever updated. One function now, and it is
  // the one that sweeps.
  _panelEl.querySelector("#radio-prev")?.addEventListener("click", () => _seekTo(_stepFreq(-1)));
  _panelEl.querySelector("#radio-next")?.addEventListener("click", () => _seekTo(_stepFreq(1)));

  // Power
  _panelEl.querySelector("#radio-power-btn").addEventListener("click", () => {
    if (_playing) _stop();
    else _playTrack();
  });

  // Volume slider
  const volSlider = _panelEl.querySelector("#radio-volume");
  volSlider.addEventListener("input", (e) => {
    _volume = parseInt(e.target.value) / 100;
    _applyTuning();
    _updateVolIcon();
  });

  // Volume mute toggle
  let _prevVol = 0.5;
  _panelEl.querySelector("#radio-vol-btn").addEventListener("click", () => {
    if (_volume > 0) {
      _prevVol = _volume;
      _volume = 0;
    } else {
      _volume = _prevVol || 0.5;
    }
    volSlider.value = Math.round(_volume * 100);
    _applyTuning();
    _updateVolIcon();
  });

  // Close folds the panel back to its bar; dismissing it entirely is what the
  // toolbar button is for, and collapsing to something that still says what is
  // playing is almost always what was meant.
  _panelEl
    .querySelector("#radio-close-btn")
    .addEventListener("click", () => {
      if (!_panelEl.classList.contains("is-compact")) {
        _panelEl.classList.add("is-compact");
        return;
      }
      hideRadio();
    });
}

function _updateVolIcon() {
  const svg = _panelEl?.querySelector("#radio-vol-icon");
  if (svg) svg.innerHTML = _volIcon();
}

function _updateUI() {
  if (!_panelEl) return;
  const st = _currentStation();

  // Accent line color
  _panelEl.querySelector("#radio-accent").style.background =
    `linear-gradient(90deg, transparent, ${st.color}, transparent)`;

  // Station name + freq
  const nameEl = _panelEl.querySelector("#radio-station-name");
  nameEl.textContent = st.name;
  nameEl.style.color = st.color;
  // The frequency readout and the rail thumbnail are written by _applyTuning,
  // which follows the needle. They were written here as well, from the
  // committed station, and a mid-sweep repaint from this one put the
  // destination's number on screen for a frame before the needle got there.
  _applyTuning();

  // Track info
  if (_playing && _shuffled.length > 0) {
    const { artist, title } = _parseTrackName(_currentTrack());
    _panelEl.querySelector("#radio-track-title").textContent = title;
    _panelEl.querySelector("#radio-track-artist").textContent = artist;
  } else {
    _panelEl.querySelector("#radio-track-title").textContent = "--";
    _panelEl.querySelector("#radio-track-artist").textContent = "";
  }


  // EQ — color matches station
  const eq = _panelEl.querySelector("#radio-eq");
  eq.classList.toggle("active", _playing);
  eq.style.setProperty("--eq-color", st.color);

  // Power
  _panelEl.querySelector("#radio-power-btn").classList.toggle("on", _playing);

  // Progress bar color
  const prog = _panelEl.querySelector("#radio-progress");
  if (prog) prog.style.background = st.color;

  // Reset progress if not playing
  if (!_playing) {
    if (prog) prog.style.width = "0%";
    const timeEl = _panelEl.querySelector("#radio-time");
    if (timeEl) timeEl.textContent = "0:00 / 0:00";
  }
  _applyTuning();
}

// ── Public API ──
export function showRadio() {
  _createPanel();
  _panelEl.classList.remove("hidden");
  _panelEl.classList.add("visible");
  _visible = true;
  if (!_playing) {
    _initShuffled();
    _playTrack();
  } else {
    _startProgress();
  }
  _updateUI();
}

export function hideRadio() {
  if (_panelEl) {
    _panelEl.classList.remove("visible");
    _panelEl.classList.add("hidden");
  }
  _visible = false;
  // The thumbnail takes over the reporting the moment the bar stops doing it.
  if (_panelEl) _updateUI();
}

export function toggleRadio() {
  if (_visible) hideRadio();
  else showRadio();
}

export function isRadioVisible() {
  return _visible;
}
export function isRadioPlaying() {
  return _playing;
}

export function nextStation() {
  _seekTo(_stepFreq(1));
}
export function prevStation() {
  _seekTo(_stepFreq(-1));
}

/**
 * The tower is talking. Called by the ATC module rather than decided here,
 * because the radio has no idea a controller exists and should not have to.
 * The panel says so too: music that goes quiet for no visible reason reads as
 * a fault, not as priority.
 */
export function setRadioDucked(on) {
  const next = !!on;
  if (next === _ducked) return;
  _ducked = next;
  _panelEl?.classList.toggle("is-ducked", _ducked);
  _applyTuning();
}
