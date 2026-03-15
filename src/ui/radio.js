// ── Live ATC Radio Panel ──
// Premium frequency reference + LiveATC launcher
// Opens LiveATC's own player (no proxy/CORS issues)

// IATA → feed config: { icao, freqs: [{ type, mhz, feed }] }
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
let _radioPopup = null;
let _radioState = { iata: null, icao: null, activeFreq: null };

export function isRadioAvailable(iata) {
  return !!RADIO_DB[iata];
}

export function openRadio(iata, airportName) {
  const db = RADIO_DB[iata];
  if (!db) return;

  _radioState.iata = iata;
  _radioState.icao = db.icao;
  _radioState.activeFreq = null;

  if (!_radioPanel) _createPanel();

  // Update header
  _radioPanel.querySelector('.radio-icao').textContent = db.icao;
  _radioPanel.querySelector('.radio-name').textContent = airportName || iata;

  // Build frequency cards
  const freqList = _radioPanel.querySelector('.radio-freq-list');
  freqList.innerHTML = db.freqs.map(f =>
    `<div class="radio-freq-card" data-feed="${f.feed}">
      <span class="radio-freq-type">${f.type}</span>
      <span class="radio-freq-mhz">${f.mhz}</span>
    </div>`
  ).join('');

  // Click on freq card → open that feed in LiveATC
  freqList.querySelectorAll('.radio-freq-card').forEach(card => {
    card.addEventListener('click', () => {
      freqList.querySelectorAll('.radio-freq-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      _radioState.activeFreq = card.dataset.feed;
      _openLiveATC(card.dataset.feed, db.icao);
    });
  });

  _radioPanel.querySelector('.radio-status').textContent = 'SELECT FREQUENCY';
  _radioPanel.querySelector('.radio-status').className = 'radio-status';
  _radioPanel.classList.remove('hidden');
  _radioPanel.classList.add('visible');
  _setVizActive(false);
}

export function closeRadio() {
  if (_radioPanel) {
    _radioPanel.classList.remove('visible');
    _radioPanel.classList.add('hidden');
  }
  _radioState.iata = null;
  _radioState.activeFreq = null;
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

function _openLiveATC(feed, icao) {
  const statusEl = _radioPanel.querySelector('.radio-status');

  // Build LiveATC listen URL
  const listenUrl = `https://www.liveatc.net/flisten.php?mount=${feed}&icao=${icao}`;

  // Open or reuse popup
  const popupFeatures = 'width=400,height=500,left=100,top=100,scrollbars=no,resizable=yes';
  _radioPopup = window.open(listenUrl, 'stratum_atc', popupFeatures);

  if (_radioPopup) {
    _radioPopup.focus();
    statusEl.textContent = 'LIVE';
    statusEl.className = 'radio-status live';
    _setVizActive(true);

    // Monitor popup close
    const checkClosed = setInterval(() => {
      if (!_radioPopup || _radioPopup.closed) {
        clearInterval(checkClosed);
        statusEl.textContent = 'STOPPED';
        statusEl.className = 'radio-status';
        _setVizActive(false);
        _radioPopup = null;
      }
    }, 1000);
  } else {
    // Popup blocked — open in new tab instead
    window.open(listenUrl, '_blank');
    statusEl.textContent = 'OPENED IN TAB';
    statusEl.className = 'radio-status live';
    _setVizActive(true);
    setTimeout(() => _setVizActive(false), 3000);
  }
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
      <button class="radio-close" aria-label="Close">&times;</button>
    </div>
    <div class="radio-name">--</div>
    <div class="radio-freq-list"></div>
    <div class="radio-viz">
      <div class="radio-bar"></div><div class="radio-bar"></div><div class="radio-bar"></div>
      <div class="radio-bar"></div><div class="radio-bar"></div><div class="radio-bar"></div>
      <div class="radio-bar"></div><div class="radio-bar"></div><div class="radio-bar"></div>
      <div class="radio-bar"></div><div class="radio-bar"></div><div class="radio-bar"></div>
      <div class="radio-bar"></div><div class="radio-bar"></div><div class="radio-bar"></div>
      <div class="radio-bar"></div>
    </div>
    <div class="radio-controls">
      <button class="radio-listen-btn">LISTEN LIVE</button>
    </div>
    <div class="radio-hint">Click frequency to tune in</div>
  `;
  document.body.appendChild(_radioPanel);

  // Close button
  _radioPanel.querySelector('.radio-close').addEventListener('click', closeRadio);

  // Listen button — opens LiveATC for the airport
  _radioPanel.querySelector('.radio-listen-btn').addEventListener('click', () => {
    if (_radioState.activeFreq) {
      _openLiveATC(_radioState.activeFreq, _radioState.icao);
    } else if (_radioState.icao) {
      // No freq selected — open airport overview
      const url = `https://www.liveatc.net/listen.php?ident=${_radioState.icao}`;
      window.open(url, 'stratum_atc', 'width=400,height=500,left=100,top=100');
    }
  });
}
