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
const _FREQS = ['88.3', '91.7', '96.5', '103.1'];

// ── State ──
let _audio = null;
let _stationIdx = 0;
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

function _currentStation() { return STATIONS[_stationIdx]; }

function _currentTrack() {
  const st = _currentStation();
  return st.tracks[_shuffled[_trackIdx % _shuffled.length]];
}

function _trackUrl() {
  const st = _currentStation();
  return `/radio/${encodeURIComponent(st.folder)}/${encodeURIComponent(_currentTrack())}.mp3`;
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
    _audio.volume = _volume;
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
        _audio.volume = _volume;
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
      <div class="radio-dial-stations" id="radio-dial-stations"></div>
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

  // Station dial
  const dial = _panelEl.querySelector('#radio-dial-stations');
  STATIONS.forEach((st, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'radio-dial-btn';
    btn.dataset.idx = i;
    btn.innerHTML = `<span class="radio-dial-dot" style="--c:${st.color}"></span><span class="radio-dial-label">${st.shortName}</span>`;
    btn.addEventListener('click', () => _crossfadeToStation(i));
    dial.appendChild(btn);
  });

  // Power
  _panelEl.querySelector('#radio-power-btn').addEventListener('click', () => {
    if (_playing) _stop(); else _playTrack();
  });

  // Volume slider
  const volSlider = _panelEl.querySelector('#radio-volume');
  volSlider.addEventListener('input', (e) => {
    _volume = parseInt(e.target.value) / 100;
    if (_audio) _audio.volume = _volume;
    _updateVolIcon();
  });

  // Volume mute toggle
  let _prevVol = 0.5;
  _panelEl.querySelector('#radio-vol-btn').addEventListener('click', () => {
    if (_volume > 0) { _prevVol = _volume; _volume = 0; }
    else { _volume = _prevVol || 0.5; }
    volSlider.value = Math.round(_volume * 100);
    if (_audio) _audio.volume = _volume;
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

  // Dial
  _panelEl.querySelectorAll('.radio-dial-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === _stationIdx);
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
