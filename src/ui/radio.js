// ── Live ATC Radio Panel ──
// Streams real ATC audio from LiveATC via Cloudflare Worker proxy

// IATA → feed config: { icao, freqs: [{ type, mhz, feed }] }
// feed = LiveATC Icecast mount name (lowercase icao + suffix)
const RADIO_DB = {
  // ── North America ──
  ATL: { icao: 'KATL', freqs: [
    { type: 'TWR', mhz: '119.500', feed: 'katl_twr' },
    { type: 'GND', mhz: '121.900', feed: 'katl_gnd' },
    { type: 'APP', mhz: '125.200', feed: 'katl_app' },
    { type: 'ATIS', mhz: '127.175', feed: 'katl_atis' },
  ]},
  JFK: { icao: 'KJFK', freqs: [
    { type: 'TWR', mhz: '119.100', feed: 'kjfk_twr' },
    { type: 'GND', mhz: '121.900', feed: 'kjfk_gnd' },
    { type: 'APP', mhz: '128.125', feed: 'kjfk_app' },
    { type: 'ATIS', mhz: '128.725', feed: 'kjfk_atis' },
  ]},
  LAX: { icao: 'KLAX', freqs: [
    { type: 'TWR', mhz: '133.900', feed: 'klax_twr' },
    { type: 'GND', mhz: '121.650', feed: 'klax_gnd' },
    { type: 'APP', mhz: '124.500', feed: 'klax_app' },
    { type: 'ATIS', mhz: '133.800', feed: 'klax_atis' },
  ]},
  ORD: { icao: 'KORD', freqs: [
    { type: 'TWR', mhz: '132.700', feed: 'kord_twr' },
    { type: 'GND', mhz: '121.750', feed: 'kord_gnd' },
    { type: 'APP', mhz: '124.350', feed: 'kord_app' },
    { type: 'ATIS', mhz: '135.400', feed: 'kord_atis' },
  ]},
  DFW: { icao: 'KDFW', freqs: [
    { type: 'TWR', mhz: '124.150', feed: 'kdfw_twr' },
    { type: 'GND', mhz: '121.650', feed: 'kdfw_gnd' },
    { type: 'APP', mhz: '124.300', feed: 'kdfw_app' },
  ]},
  DEN: { icao: 'KDEN', freqs: [
    { type: 'TWR', mhz: '132.350', feed: 'kden_twr' },
    { type: 'GND', mhz: '121.850', feed: 'kden_gnd' },
    { type: 'APP', mhz: '120.800', feed: 'kden_app' },
  ]},
  SFO: { icao: 'KSFO', freqs: [
    { type: 'TWR', mhz: '120.500', feed: 'ksfo_twr' },
    { type: 'GND', mhz: '121.800', feed: 'ksfo_gnd' },
    { type: 'APP', mhz: '120.350', feed: 'ksfo_app' },
  ]},
  MIA: { icao: 'KMIA', freqs: [
    { type: 'TWR', mhz: '118.300', feed: 'kmia_twr' },
    { type: 'GND', mhz: '121.800', feed: 'kmia_gnd' },
    { type: 'APP', mhz: '124.850', feed: 'kmia_app' },
  ]},
  SEA: { icao: 'KSEA', freqs: [
    { type: 'TWR', mhz: '119.900', feed: 'ksea_twr' },
    { type: 'GND', mhz: '121.700', feed: 'ksea_gnd' },
    { type: 'APP', mhz: '124.200', feed: 'ksea_app' },
  ]},
  BOS: { icao: 'KBOS', freqs: [
    { type: 'TWR', mhz: '128.800', feed: 'kbos_twr' },
    { type: 'GND', mhz: '121.900', feed: 'kbos_gnd' },
    { type: 'APP', mhz: '120.600', feed: 'kbos_app' },
  ]},
  EWR: { icao: 'KEWR', freqs: [
    { type: 'TWR', mhz: '118.300', feed: 'kewr_twr' },
    { type: 'GND', mhz: '121.800', feed: 'kewr_gnd' },
    { type: 'APP', mhz: '119.200', feed: 'kewr_app' },
  ]},
  IAD: { icao: 'KIAD', freqs: [
    { type: 'TWR', mhz: '120.100', feed: 'kiad_twr' },
    { type: 'APP', mhz: '126.650', feed: 'kiad_app' },
  ]},
  MSP: { icao: 'KMSP', freqs: [
    { type: 'TWR', mhz: '126.700', feed: 'kmsp_twr' },
    { type: 'APP', mhz: '119.300', feed: 'kmsp_app' },
  ]},
  PHX: { icao: 'KPHX', freqs: [
    { type: 'TWR', mhz: '118.700', feed: 'kphx_twr' },
    { type: 'APP', mhz: '120.700', feed: 'kphx_app' },
  ]},
  LAS: { icao: 'KLAS', freqs: [
    { type: 'TWR', mhz: '119.900', feed: 'klas_twr' },
    { type: 'APP', mhz: '125.900', feed: 'klas_app' },
  ]},
  CLT: { icao: 'KCLT', freqs: [
    { type: 'TWR', mhz: '119.900', feed: 'kclt_twr' },
    { type: 'APP', mhz: '124.000', feed: 'kclt_app' },
  ]},
  YYZ: { icao: 'CYYZ', freqs: [
    { type: 'TWR', mhz: '118.700', feed: 'cyyz_twr' },
    { type: 'GND', mhz: '121.900', feed: 'cyyz_gnd' },
    { type: 'APP', mhz: '119.350', feed: 'cyyz_app' },
  ]},
  MEX: { icao: 'MMMX', freqs: [
    { type: 'TWR', mhz: '118.100', feed: 'mmmx_twr' },
    { type: 'APP', mhz: '119.150', feed: 'mmmx_app' },
  ]},
  GRU: { icao: 'SBGR', freqs: [
    { type: 'TWR', mhz: '118.200', feed: 'sbgr_twr' },
    { type: 'APP', mhz: '127.150', feed: 'sbgr_app' },
  ]},
  // ── Europe ──
  LHR: { icao: 'EGLL', freqs: [
    { type: 'TWR', mhz: '118.500', feed: 'egll_twr' },
    { type: 'GND', mhz: '121.900', feed: 'egll_gnd' },
    { type: 'APP', mhz: '119.725', feed: 'egll_app' },
    { type: 'ATIS', mhz: '113.750', feed: 'egll_atis' },
  ]},
  CDG: { icao: 'LFPG', freqs: [
    { type: 'TWR', mhz: '119.250', feed: 'lfpg_twr' },
    { type: 'GND', mhz: '121.600', feed: 'lfpg_gnd' },
    { type: 'APP', mhz: '121.150', feed: 'lfpg_app' },
  ]},
  FRA: { icao: 'EDDF', freqs: [
    { type: 'TWR', mhz: '119.900', feed: 'eddf_twr' },
    { type: 'GND', mhz: '121.900', feed: 'eddf_gnd' },
    { type: 'APP', mhz: '120.800', feed: 'eddf_app' },
  ]},
  AMS: { icao: 'EHAM', freqs: [
    { type: 'TWR', mhz: '118.100', feed: 'eham_twr' },
    { type: 'GND', mhz: '121.800', feed: 'eham_gnd' },
    { type: 'APP', mhz: '119.050', feed: 'eham_app' },
  ]},
  MAD: { icao: 'LEMD', freqs: [
    { type: 'TWR', mhz: '118.150', feed: 'lemd_twr' },
    { type: 'APP', mhz: '120.000', feed: 'lemd_app' },
  ]},
  IST: { icao: 'LTFM', freqs: [
    { type: 'TWR', mhz: '118.100', feed: 'ltfm_twr' },
    { type: 'APP', mhz: '120.600', feed: 'ltfm_app' },
  ]},
  MUC: { icao: 'EDDM', freqs: [
    { type: 'TWR', mhz: '118.700', feed: 'eddm_twr' },
    { type: 'APP', mhz: '120.200', feed: 'eddm_app' },
  ]},
  FCO: { icao: 'LIRF', freqs: [
    { type: 'TWR', mhz: '118.700', feed: 'lirf_twr' },
    { type: 'APP', mhz: '119.200', feed: 'lirf_app' },
  ]},
  ZRH: { icao: 'LSZH', freqs: [
    { type: 'TWR', mhz: '118.100', feed: 'lszh_twr' },
    { type: 'APP', mhz: '118.000', feed: 'lszh_app' },
  ]},
  // ── Asia-Pacific ──
  NRT: { icao: 'RJAA', freqs: [
    { type: 'TWR', mhz: '118.350', feed: 'rjaa_twr' },
    { type: 'APP', mhz: '119.100', feed: 'rjaa_app' },
  ]},
  HND: { icao: 'RJTT', freqs: [
    { type: 'TWR', mhz: '118.100', feed: 'rjtt_twr' },
    { type: 'APP', mhz: '119.700', feed: 'rjtt_app' },
  ]},
  ICN: { icao: 'RKSI', freqs: [
    { type: 'TWR', mhz: '118.200', feed: 'rksi_twr' },
    { type: 'APP', mhz: '119.500', feed: 'rksi_app' },
  ]},
  SIN: { icao: 'WSSS', freqs: [
    { type: 'TWR', mhz: '118.600', feed: 'wsss_twr' },
    { type: 'APP', mhz: '119.100', feed: 'wsss_app' },
  ]},
  HKG: { icao: 'VHHH', freqs: [
    { type: 'TWR', mhz: '118.400', feed: 'vhhh_twr' },
    { type: 'APP', mhz: '119.100', feed: 'vhhh_app' },
  ]},
  BKK: { icao: 'VTBS', freqs: [
    { type: 'TWR', mhz: '118.100', feed: 'vtbs_twr' },
    { type: 'APP', mhz: '119.500', feed: 'vtbs_app' },
  ]},
  SYD: { icao: 'YSSY', freqs: [
    { type: 'TWR', mhz: '120.500', feed: 'yssy_twr' },
    { type: 'APP', mhz: '126.100', feed: 'yssy_app' },
  ]},
  // ── Middle East ──
  DXB: { icao: 'OMDB', freqs: [
    { type: 'TWR', mhz: '118.350', feed: 'omdb_twr' },
    { type: 'APP', mhz: '124.900', feed: 'omdb_app' },
  ]},
  DOH: { icao: 'OTHH', freqs: [
    { type: 'TWR', mhz: '118.900', feed: 'othh_twr' },
    { type: 'APP', mhz: '119.400', feed: 'othh_app' },
  ]},
};

let _radioPanel = null;
let _radioAudio = null;
let _radioState = { iata: null, activeFreq: null, playing: false, volume: 0.7 };

export function isRadioAvailable(iata) {
  return !!RADIO_DB[iata];
}

export function openRadio(iata, airportName) {
  const db = RADIO_DB[iata];
  if (!db) return;

  _radioState.iata = iata;
  _radioState.activeFreq = null;
  _radioState.playing = false;

  if (!_radioPanel) _createPanel();

  // Update header
  _radioPanel.querySelector('.radio-icao').textContent = db.icao;
  _radioPanel.querySelector('.radio-name').textContent = airportName || iata;

  // Build frequency buttons
  const btnRow = _radioPanel.querySelector('.radio-freq-row');
  btnRow.innerHTML = db.freqs.map(f =>
    `<button class="radio-freq-btn" data-feed="${f.feed}" data-mhz="${f.mhz}" data-type="${f.type}">${f.type}</button>`
  ).join('');

  // Reset display
  _radioPanel.querySelector('.radio-mhz').textContent = '---.- MHz';
  _radioPanel.querySelector('.radio-status').textContent = 'SELECT FREQUENCY';
  _radioPanel.querySelector('.radio-status').className = 'radio-status';
  _radioPanel.querySelector('.radio-play-btn').textContent = '▶';
  _radioPanel.classList.remove('hidden');
  _radioPanel.classList.add('visible');
  _setVizActive(false);

  // Stop any playing audio
  _stopAudio();

  // Bind frequency buttons
  btnRow.querySelectorAll('.radio-freq-btn').forEach(btn => {
    btn.addEventListener('click', () => _selectFreq(btn));
  });

  // Auto-select TWR if available
  const twrBtn = btnRow.querySelector('[data-type="TWR"]');
  if (twrBtn) _selectFreq(twrBtn);
}

export function closeRadio() {
  _stopAudio();
  if (_radioPanel) {
    _radioPanel.classList.remove('visible');
    _radioPanel.classList.add('hidden');
  }
  _radioState.iata = null;
  _radioState.activeFreq = null;
  _radioState.playing = false;
}

export function toggleRadio(iata, airportName) {
  if (_radioPanel && !_radioPanel.classList.contains('hidden') && _radioState.iata === iata) {
    closeRadio();
  } else {
    openRadio(iata, airportName);
  }
}

export function isRadioOpen() {
  return _radioPanel && !_radioPanel.classList.contains('hidden');
}

function _selectFreq(btn) {
  const row = btn.parentElement;
  row.querySelectorAll('.radio-freq-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const feed = btn.dataset.feed;
  const mhz = btn.dataset.mhz;
  _radioState.activeFreq = feed;

  _radioPanel.querySelector('.radio-mhz').textContent = `${mhz} MHz`;
  _radioPanel.querySelector('.radio-status').textContent = 'READY';
  _radioPanel.querySelector('.radio-status').className = 'radio-status';

  // Auto-play on frequency select
  _playAudio(feed);
}

function _playAudio(feed) {
  _stopAudio();

  _radioAudio = new Audio();
  // Do NOT set crossOrigin — opaque mode bypasses CORS for <audio>
  _radioAudio.volume = _radioState.volume;

  const statusEl = _radioPanel.querySelector('.radio-status');
  const playBtn = _radioPanel.querySelector('.radio-play-btn');

  statusEl.textContent = 'CONNECTING';
  statusEl.className = 'radio-status connecting';
  playBtn.textContent = '⏸';

  // Proxy first (Vercel Edge Function / CF Worker sets Referer header)
  // Direct servers as fallback (may work for some browsers/networks)
  const urls = [
    `/api/liveatc?feed=${feed}`,
    `https://s1-bos.liveatc.net/${feed}`,
    `https://s1-fmt2.liveatc.net/${feed}`,
  ];

  _radioAudio.src = urls[0];

  _radioAudio.addEventListener('playing', () => {
    _radioState.playing = true;
    statusEl.textContent = 'LIVE';
    statusEl.className = 'radio-status live';
    playBtn.textContent = '⏸';
    _setVizActive(true);
  });

  _radioAudio.addEventListener('waiting', () => {
    statusEl.textContent = 'BUFFERING';
    statusEl.className = 'radio-status connecting';
  });

  _radioAudio.addEventListener('error', () => {
    // Cycle through fallback servers
    if (!_radioAudio._fallbackIdx) _radioAudio._fallbackIdx = 1; // 0 already tried
    if (_radioAudio._fallbackIdx < urls.length) {
      _radioAudio.src = urls[_radioAudio._fallbackIdx++];
      _radioAudio.play().catch(() => {});
    } else {
      statusEl.textContent = 'NO SIGNAL';
      statusEl.className = 'radio-status no-signal';
      playBtn.textContent = '▶';
      _radioState.playing = false;
      _setVizActive(false);
    }
  });

  _radioAudio.addEventListener('ended', () => {
    statusEl.textContent = 'ENDED';
    statusEl.className = 'radio-status';
    playBtn.textContent = '▶';
    _radioState.playing = false;
    _setVizActive(false);
  });

  _radioAudio.play().catch(() => {
    // Autoplay blocked — user must click play
    statusEl.textContent = 'PRESS PLAY';
    statusEl.className = 'radio-status';
    playBtn.textContent = '▶';
  });
}

function _stopAudio() {
  if (_radioAudio) {
    _radioAudio.pause();
    _radioAudio.src = '';
    _radioAudio.load();
    _radioAudio = null;
  }
  _radioState.playing = false;
  _setVizActive(false);
}

function _setVizActive(active) {
  if (!_radioPanel) return;
  const viz = _radioPanel.querySelector('.radio-viz');
  if (viz) viz.classList.toggle('active', active);
}

function _createPanel() {
  _radioPanel = document.createElement('div');
  _radioPanel.id = 'radio-panel';
  _radioPanel.className = 'radio-panel hidden';
  _radioPanel.innerHTML = `
    <div class="radio-header">
      <div class="radio-title-row">
        <span class="radio-icon">📻</span>
        <span class="radio-icao">----</span>
        <span class="radio-status">STANDBY</span>
      </div>
      <button class="radio-close" aria-label="Close">×</button>
    </div>
    <div class="radio-name">--</div>
    <div class="radio-freq-row"></div>
    <div class="radio-viz">
      <div class="radio-bar"></div><div class="radio-bar"></div><div class="radio-bar"></div>
      <div class="radio-bar"></div><div class="radio-bar"></div><div class="radio-bar"></div>
      <div class="radio-bar"></div><div class="radio-bar"></div><div class="radio-bar"></div>
      <div class="radio-bar"></div><div class="radio-bar"></div><div class="radio-bar"></div>
      <div class="radio-bar"></div><div class="radio-bar"></div><div class="radio-bar"></div>
      <div class="radio-bar"></div>
    </div>
    <div class="radio-mhz">---.- MHz</div>
    <div class="radio-controls">
      <button class="radio-play-btn">▶</button>
      <input type="range" class="radio-volume" min="0" max="100" value="70" />
      <span class="radio-vol-icon">🔊</span>
    </div>
    <div class="radio-hint">R to close</div>
  `;
  document.body.appendChild(_radioPanel);

  // Close button
  _radioPanel.querySelector('.radio-close').addEventListener('click', closeRadio);

  // Play/pause toggle
  _radioPanel.querySelector('.radio-play-btn').addEventListener('click', () => {
    if (!_radioState.activeFreq) return;
    if (_radioState.playing && _radioAudio) {
      _radioAudio.pause();
      _radioState.playing = false;
      _radioPanel.querySelector('.radio-play-btn').textContent = '▶';
      _radioPanel.querySelector('.radio-status').textContent = 'PAUSED';
      _radioPanel.querySelector('.radio-status').className = 'radio-status';
      _setVizActive(false);
    } else if (_radioState.activeFreq) {
      if (_radioAudio && _radioAudio.src) {
        _radioAudio.play().catch(() => {});
      } else {
        _playAudio(_radioState.activeFreq);
      }
    }
  });

  // Volume slider
  _radioPanel.querySelector('.radio-volume').addEventListener('input', (e) => {
    const vol = parseInt(e.target.value) / 100;
    _radioState.volume = vol;
    if (_radioAudio) _radioAudio.volume = vol;
    const icon = _radioPanel.querySelector('.radio-vol-icon');
    icon.textContent = vol === 0 ? '🔇' : vol < 0.4 ? '🔈' : vol < 0.7 ? '🔉' : '🔊';
  });
}
