// ── STRATUM Radio ──
// Auto-plays shuffled tracks from station folders
// Users can switch stations but not skip songs

const STATIONS = [
  {
    id: 'electronic',
    name: 'NEON APPROACH',
    shortName: 'NEON',
    color: '#c06cf0',
    folder: 'Electronic',
    tracks: [
      'Daniel Brown - SENSATION',
      'Giorgio Vitté - Ataca',
      'LaFaye - Hidden',
      'NUEQ - Tiramisu',
      'Out of Flux - Sunnydance',
      'Rynn - Heart Beat - Instrumental version',
      'Yarin Primak - DREEEAAAMS',
      'ZISO - Gonna Freak',
      'Ziskoe - SIREN - Ziskoe Remix',
    ],
  },
  {
    id: 'indie',
    name: 'GOLDEN HOUR',
    shortName: 'GOLDEN',
    color: '#e8a44c',
    folder: 'Indie',
    tracks: [
      'Ben Juliet - Still Bloom',
      'Danger Roberts - Hard Reset',
      'Emma-Rose - Clouds',
      'IamDayLight - Hold On',
      'Lia Dsau - Grow',
      'Neska Rose - GROW',
      'Neska Rose - Rolling Through Da Night',
      'SOURWAH - Mandalas',
      'Southern Call - Smoke Show',
      'Tal Tamari - Love Her So - Instrumental version',
      'Tiko Tiko - Baby Lets Go - Stripped Version',
      'messwave - maybe its over',
    ],
  },
  {
    id: 'relax',
    name: 'FLIGHT LEVEL',
    shortName: 'FL',
    color: '#5ab8e8',
    folder: 'Relax_Ambiance',
    tracks: [
      'Assaf Ayalon - Locked in Silence',
      'Aves - Sunshine',
      'Ian Locke - Once Interlude',
      'MAIKY - Above the Clouds',
      'Master Minded - Strings of Soul',
    ],
  },
  {
    id: 'soul',
    name: 'VELVET TAXI',
    shortName: 'VELVET',
    color: '#e85a8a',
    folder: 'Soul_R&B',
    tracks: [
      'Aves - Summer Breakup Song',
      'Aves - Sunshine',
      'Aves - Velvet',
      'Honey G - More than Words',
      'Michael Shynes - Extra Extra - Instrumental version',
      'NOA - Made to Love You',
      'Skipp Whitman - Lush - Instrumental version',
      'Skipp Whitman - Vegas - Instrumental version',
      'Ziv Moran - Dance',
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
const _FREQS = ['88.3', '91.7', '96.5', '103.1'];
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

let _freq = 88.3;          // where the needle sits
let _tuning = false;
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
  } catch { return false; }
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
  bp.type = 'bandpass';
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
  if (_staticCtx.state === 'suspended') _staticCtx.resume().catch(() => {});
  const g = _staticNodes.gain.gain;
  g.setTargetAtTime(level * _volume * 0.5, _staticCtx.currentTime, 0.05);
}

/** The station nearest a frequency, and how far off it we are. */
function _nearest(freq) {
  let idx = 0, best = Infinity;
  for (let i = 0; i < _FREQS.length; i++) {
    const d = Math.abs(parseFloat(_FREQS[i]) - freq);
    if (d < best) { best = d; idx = i; }
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
  if (_audio) _audio.volume = _volume * sig;
  _setStatic(_playing ? 1 - sig : 0);
  const needle = _panelEl?.querySelector('#radio-needle');
  if (needle) {
    needle.style.left = `${((_freq - BAND_LO) / (BAND_HI - BAND_LO)) * 100}%`;
    needle.classList.toggle('is-locked', sig > 0.999);
  }
  const freqEl = _panelEl?.querySelector('#radio-freq');
  if (freqEl) freqEl.textContent = `${_freq.toFixed(1)} FM`;
  const tuner = _panelEl?.querySelector('#radio-tuner');
  if (tuner) tuner.setAttribute('aria-valuenow', _freq.toFixed(1));
  if (_panelEl) _panelEl.classList.toggle('is-offstation', sig <= 0);
  const nameEl = _panelEl?.querySelector('#radio-station-name');
  if (nameEl && sig <= 0) nameEl.textContent = 'NO SIGNAL';
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
  const { idx, off } = _nearest(_freq);
  if (off < LOCK_MHZ && idx !== _stationIdx) {
    _crossfadeToStation(idx);
  }
  _applyTuning();
}

function _currentStation() { return STATIONS[_stationIdx]; }

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
  const sep = raw.indexOf(' - ');
  if (sep < 0) return { artist: '', title: raw };
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
  const bar = _panelEl?.querySelector('#radio-progress');
  const timeEl = _panelEl?.querySelector('#radio-time');
  if (!bar || !_audio) return;
  const tick = () => {
    if (_audio && _audio.duration && isFinite(_audio.duration)) {
      const pct = (_audio.currentTime / _audio.duration) * 100;
      bar.style.width = pct + '%';
      // Current time display
      const m = Math.floor(_audio.currentTime / 60);
      const s = Math.floor(_audio.currentTime % 60);
      const tm = Math.floor(_audio.duration / 60);
      const ts = Math.floor(_audio.duration % 60);
      if (timeEl) timeEl.textContent = `${m}:${s.toString().padStart(2,'0')} / ${tm}:${ts.toString().padStart(2,'0')}`;
    }
    _progressRAF = requestAnimationFrame(tick);
  };
  _progressRAF = requestAnimationFrame(tick);
}

function _stopProgress() {
  if (_progressRAF) { cancelAnimationFrame(_progressRAF); _progressRAF = null; }
}

// ── Playback ──
function _playTrack() {
  if (!_audio) {
    _audio = new Audio();
    _audio.volume = _volume * _signal(_freq);
    _audio.preload = 'auto';
    _audio.addEventListener('ended', () => { _advanceTrack(); _playTrack(); });
    _audio.addEventListener('error', () => {
      _loadRetries++;
      if (_loadRetries >= MAX_RETRIES) _advanceTrack();
      setTimeout(() => _playTrack(), 800);
    });
    _audio.addEventListener('canplaythrough', () => { _loadRetries = 0; });
  }
  _audio.src = _trackUrl();
  _audio.play().catch(() => {});
  _playing = true;
  _startProgress();
  _updateUI();
}

function _stop() {
  if (_audio) { _audio.pause(); _audio.currentTime = 0; }
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
  if (_volume <= 0) return `<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;
  if (_volume < 0.5) return `<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07"/>`;
  return `<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/>`;
}

// ── UI ──
function _createPanel() {
  if (_panelEl) return;
  _panelEl = document.createElement('div');
  _panelEl.id = 'radio-panel';
  _panelEl.className = 'radio-panel hidden';
  _panelEl.innerHTML = `
    <div class="radio-accent" id="radio-accent"></div>
    <div class="radio-header">
      <span class="radio-header-label">STRATUM RADIO</span>
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
    <div class="radio-bottom">
      <button type="button" class="radio-power-btn" id="radio-power-btn" title="Power">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="2" x2="12" y2="12"/><path d="M16.24 7.76a6 6 0 11-8.49 0"/></svg>
      </button>
      <button type="button" class="radio-vol-btn" id="radio-vol-btn" title="Mute">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="radio-vol-icon">${_volIcon()}</svg>
      </button>
      <input type="range" class="radio-volume" id="radio-volume" min="0" max="100" value="50" title="Volume">
      <button type="button" class="radio-close-btn" id="radio-close-btn" title="Close panel">&times;</button>
    </div>
  `;
  document.body.appendChild(_panelEl);

  // ── The tuner ──
  const tuner = _panelEl.querySelector('#radio-tuner');
  const scale = _panelEl.querySelector('#radio-scale');
  {
    // Ticks every 0.5 MHz, taller every 2. The four call-signs are printed on
    // the band where they actually sit, so the dial teaches its own layout:
    // you can see there is something at 96.5 before you have ever been there.
    let marks = '';
    for (let f = BAND_LO; f <= BAND_HI + 0.01; f += 0.5) {
      const pct = ((f - BAND_LO) / (BAND_HI - BAND_LO)) * 100;
      const major = Math.abs(f % 2) < 0.01;
      marks += `<i class="radio-tick${major ? ' is-major' : ''}" style="left:${pct}%"></i>`;
    }
    for (let i = 0; i < STATIONS.length; i++) {
      const f = parseFloat(_FREQS[i]);
      const pct = ((f - BAND_LO) / (BAND_HI - BAND_LO)) * 100;
      marks += `<b class="radio-stationmark" data-idx="${i}" style="left:${pct}%;--c:${STATIONS[i].color}">` +
               `<u></u><em>${STATIONS[i].shortName}</em></b>`;
    }
    scale.innerHTML = marks;
  }

  const _freqFromX = (clientX) => {
    const r = tuner.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    return BAND_LO + t * (BAND_HI - BAND_LO);
  };

  const onDown = (ev) => {
    _tuning = true;
    tuner.setPointerCapture?.(ev.pointerId);
    _tuneTo(_freqFromX(ev.clientX), true);
  };
  const onMove = (ev) => { if (_tuning) _tuneTo(_freqFromX(ev.clientX), true); };
  const onUp = () => {
    if (!_tuning) return;
    _tuning = false;
    // Let go near a station and it pulls in the last fraction, the way a
    // detented dial does. Let go in the noise and you stay in the noise.
    const { idx, off } = _nearest(_freq);
    if (off < LOCK_MHZ) _tuneTo(parseFloat(_FREQS[idx]));
  };
  tuner.addEventListener('pointerdown', onDown);
  tuner.addEventListener('pointermove', onMove);
  tuner.addEventListener('pointerup', onUp);
  tuner.addEventListener('pointercancel', onUp);
  tuner.addEventListener('keydown', (ev) => {
    const step = ev.shiftKey ? 0.1 : 0.5;
    if (ev.key === 'ArrowLeft') { ev.preventDefault(); _tuneTo(_freq - step); onUp(); }
    else if (ev.key === 'ArrowRight') { ev.preventDefault(); _tuneTo(_freq + step); onUp(); }
  });

  // Clicking a printed call-sign is still the fast way there.
  scale.querySelectorAll('.radio-stationmark').forEach((el) => {
    el.addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      _tuneTo(parseFloat(_FREQS[+el.dataset.idx]));
    });
  });

  // Power
  _panelEl.querySelector('#radio-power-btn').addEventListener('click', () => {
    if (_playing) _stop(); else _playTrack();
  });

  // Volume slider
  const volSlider = _panelEl.querySelector('#radio-volume');
  volSlider.addEventListener('input', (e) => {
    _volume = parseInt(e.target.value) / 100;
    _applyTuning();
    _updateVolIcon();
  });

  // Volume mute toggle
  let _prevVol = 0.5;
  _panelEl.querySelector('#radio-vol-btn').addEventListener('click', () => {
    if (_volume > 0) { _prevVol = _volume; _volume = 0; }
    else { _volume = _prevVol || 0.5; }
    volSlider.value = Math.round(_volume * 100);
    _applyTuning();
    _updateVolIcon();
  });

  // Close
  _panelEl.querySelector('#radio-close-btn').addEventListener('click', () => hideRadio());
}

function _updateVolIcon() {
  const svg = _panelEl?.querySelector('#radio-vol-icon');
  if (svg) svg.innerHTML = _volIcon();
}

function _updateUI() {
  if (!_panelEl) return;
  const st = _currentStation();

  // Accent line color
  _panelEl.querySelector('#radio-accent').style.background =
    `linear-gradient(90deg, transparent, ${st.color}, transparent)`;

  // Station name + freq
  const nameEl = _panelEl.querySelector('#radio-station-name');
  nameEl.textContent = st.name;
  nameEl.style.color = st.color;
  _panelEl.querySelector('#radio-freq').textContent = _FREQS[_stationIdx] + ' FM';

  // Track info
  if (_playing && _shuffled.length > 0) {
    const { artist, title } = _parseTrackName(_currentTrack());
    _panelEl.querySelector('#radio-track-title').textContent = title;
    _panelEl.querySelector('#radio-track-artist').textContent = artist;
  } else {
    _panelEl.querySelector('#radio-track-title').textContent = '--';
    _panelEl.querySelector('#radio-track-artist').textContent = '';
  }

  // Dial — the printed call-sign lights only while the needle is holding it.
  const locked = _signal(_freq) > 0 ? _nearest(_freq).idx : -1;
  _panelEl.querySelectorAll('.radio-stationmark').forEach((el, i) => {
    el.classList.toggle('active', i === locked);
  });

  // EQ — color matches station
  const eq = _panelEl.querySelector('#radio-eq');
  eq.classList.toggle('active', _playing);
  eq.style.setProperty('--eq-color', st.color);

  // Power
  _panelEl.querySelector('#radio-power-btn').classList.toggle('on', _playing);

  // Progress bar color
  const prog = _panelEl.querySelector('#radio-progress');
  if (prog) prog.style.background = st.color;

  // Reset progress if not playing
  if (!_playing) {
    if (prog) prog.style.width = '0%';
    const timeEl = _panelEl.querySelector('#radio-time');
    if (timeEl) timeEl.textContent = '0:00 / 0:00';
  }
  _applyTuning();
}

// ── Public API ──
export function showRadio() {
  _createPanel();
  _panelEl.classList.remove('hidden');
  _panelEl.classList.add('visible');
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
    _panelEl.classList.remove('visible');
    _panelEl.classList.add('hidden');
  }
  _visible = false;
}

export function toggleRadio() {
  if (_visible) hideRadio(); else showRadio();
}

export function isRadioVisible() { return _visible; }
export function isRadioPlaying() { return _playing; }

export function nextStation() {
  _crossfadeToStation((_stationIdx + 1) % STATIONS.length);
}
export function prevStation() {
  _crossfadeToStation((_stationIdx - 1 + STATIONS.length) % STATIONS.length);
}
