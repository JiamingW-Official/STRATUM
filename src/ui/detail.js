import { haversineDistance } from '../scene/aircraft.js';
import { getAirlineName } from '../data/airlineDb.js';
import { computeDensityAltitude, fetchDestinationWeather, estimateTurbulence } from '../data/weather.js';

// ── T2-02: Aircraft type silhouette SVG paths ──
const SILHOUETTES = {
  narrowbody: '<svg class="aircraft-silhouette" width="16" height="8" viewBox="0 0 16 8"><path d="M1 4h14M5 4l2-3h2l2 3M6 4l1 2h2l1-2" stroke="currentColor" stroke-width=".7" fill="none"/></svg>',
  'widebody-twin': '<svg class="aircraft-silhouette" width="16" height="8" viewBox="0 0 16 8"><path d="M0 4h16M4 4l2-3.5h4l2 3.5M5 4l1 2.5h4l1-2.5" stroke="currentColor" stroke-width=".8" fill="none"/></svg>',
  'widebody-quad': '<svg class="aircraft-silhouette" width="16" height="8" viewBox="0 0 16 8"><path d="M0 4h16M3 4l2-3.5h6l2 3.5M4 4l1 2.5h6l1-2.5M4.5 2.5v3M6 2v3.5M10 2v3.5M11.5 2.5v3" stroke="currentColor" stroke-width=".7" fill="none"/></svg>',
  regional: '<svg class="aircraft-silhouette" width="16" height="8" viewBox="0 0 16 8"><path d="M2 4h12M6 4l1-2h2l1 2M7 4l.5 1.5h1l.5-1.5" stroke="currentColor" stroke-width=".6" fill="none"/></svg>',
  bizjet: '<svg class="aircraft-silhouette" width="16" height="8" viewBox="0 0 16 8"><path d="M3 4h10M7 4l1-2h1l1 2M7.5 4l.5 1.5h.5l.5-1.5" stroke="currentColor" stroke-width=".5" fill="none"/></svg>',
};
const WIDEBODY_TWIN = new Set(['A330','A332','A333','A338','A339','A350','A359','A35K','B762','B763','B764','B772','B773','B77L','B77W','B778','B779','B788','B789','B78X','A310','A306','B767','B787','B777','A300']);
const WIDEBODY_QUAD = new Set(['A380','A388','A340','A342','A343','A345','A346','B741','B742','B743','B744','B748','B74S','A124','C5M']);
const REGIONAL = new Set(['E170','E175','E190','E195','E75L','E75S','E170','CRJ2','CRJ7','CRJ9','CRJX','DH8A','DH8B','DH8C','DH8D','AT43','AT45','AT72','AT76','SF34','JS31','JS32','J328','E120','BE99','B190','SW4']);
const BIZJET = new Set(['C525','C56X','C560','C680','C750','CL30','CL35','CL60','GL5T','GL7T','GLEX','GLF4','GLF5','GLF6','GA5C','GA6C','LJ35','LJ45','LJ60','LJ75','F900','FA7X','FA8X','E35L','E55P','E550','PC12','PC24','TBM8','TBM9','H25B','H25C','BE40','PRM1']);
function classifyAircraftType(typeCode) {
  if (!typeCode) return null;
  const t = typeCode.toUpperCase().replace(/-/g, '');
  if (WIDEBODY_QUAD.has(t)) return 'widebody-quad';
  if (WIDEBODY_TWIN.has(t)) return 'widebody-twin';
  if (REGIONAL.has(t)) return 'regional';
  if (BIZJET.has(t)) return 'bizjet';
  // Default narrowbody for A3xx/B7xx-like codes or anything with A/B prefix
  if (t.startsWith('A3') || t.startsWith('B73') || t.startsWith('A2') || t.startsWith('A1') || t.startsWith('B') || t.startsWith('A')) return 'narrowbody';
  return null;
}

// ── T1-03: Speed unit toggle — persisted preference ──
const SPEED_UNITS = ['kts', 'km/h', 'mph'];
let speedUnitIdx = parseInt(localStorage.getItem('stratum:speedUnit') || '0', 10) % 3;

function convertSpeed(kts, unit) {
  if (kts == null) return '--';
  switch (unit) {
    case 'km/h': return `${Math.round(kts * 1.852)} km/h`;
    case 'mph': return `${Math.round(kts * 1.15078)} mph`;
    default: return `${kts} kts`;
  }
}

// ── T1-09: ICAO phonetic callsign ──
const PHONETIC_ALPHA = {A:'Alpha',B:'Bravo',C:'Charlie',D:'Delta',E:'Echo',F:'Foxtrot',G:'Golf',H:'Hotel',I:'India',J:'Juliet',K:'Kilo',L:'Lima',M:'Mike',N:'November',O:'Oscar',P:'Papa',Q:'Quebec',R:'Romeo',S:'Sierra',T:'Tango',U:'Uniform',V:'Victor',W:'Whiskey',X:'X-ray',Y:'Yankee',Z:'Zulu'};
const PHONETIC_DIGIT = {0:'Zero',1:'One',2:'Two',3:'Three',4:'Four',5:'Five',6:'Six',7:'Seven',8:'Eight',9:'Niner'};

function toPhonetic(callsign) {
  if (!callsign) return '';
  return [...callsign].map(c => {
    const u = c.toUpperCase();
    return PHONETIC_ALPHA[u] || PHONETIC_DIGIT[u] || c;
  }).join(' ');
}

// ── T1-04: Copy + Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 2000);
}

// ── T2-01: Live tracked time counter ──
let _trackedInterval = null;
let _trackedStartTime = null;

function startTrackedTimer() {
  _trackedStartTime = Date.now();
  stopTrackedTimer();
  _trackedInterval = setInterval(() => {
    if (!elTrackedTime || !_trackedStartTime) return;
    const sec = Math.floor((Date.now() - _trackedStartTime) / 1000);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    elTrackedTime.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }, 1000);
}

function stopTrackedTimer() {
  if (_trackedInterval) { clearInterval(_trackedInterval); _trackedInterval = null; }
}

const panel = document.getElementById('detail-panel');
const elCallsign = document.getElementById('detail-callsign');
const elType = document.getElementById('detail-type');
const elStatusBadge = document.getElementById('detail-status-badge');
const elAirlineRow = document.getElementById('detail-airline-row');
const elAirline = document.getElementById('detail-airline');
const elEnrichLoader = document.getElementById('detail-enrich-loader');
const elAlt = document.getElementById('detail-alt');
const elSpd = document.getElementById('detail-spd');
const elHdg = document.getElementById('detail-hdg');
const elVs = document.getElementById('detail-vs');
const elIcao = document.getElementById('detail-icao');
const elReg = document.getElementById('detail-reg');
const elDistance = document.getElementById('detail-distance');
const elStatus = document.getElementById('detail-status');
const elClose = document.getElementById('detail-close');
const elOperatorRow = document.getElementById('detail-operator-row');
const elOperator = document.getElementById('detail-operator');
const elAgeRow = document.getElementById('detail-age-row');
const elAge = document.getElementById('detail-age');
// Route elements
const elRoute = document.getElementById('detail-route');
const elOriginCode = document.getElementById('detail-origin-code');
const elOriginCity = document.getElementById('detail-origin-city');
const elDestCode = document.getElementById('detail-dest-code');
const elDestCity = document.getElementById('detail-dest-city');
const elProgress = document.getElementById('detail-progress');
const elProgressBar = document.getElementById('detail-progress-bar');
const elProgressText = document.getElementById('detail-progress-text');
const elPosition = document.getElementById('detail-position');
const elPos = document.getElementById('detail-pos');
const elCountry = document.getElementById('detail-country');
const elBearing = document.getElementById('detail-bearing');

// Specs elements
const elSpecs = document.getElementById('detail-specs');
const elSpecsDivider = document.getElementById('detail-specs-divider');
const elAircraftName = document.getElementById('detail-aircraft-name');
const elMfr = document.getElementById('detail-mfr');
const elPax = document.getElementById('detail-pax');
const elRange = document.getElementById('detail-range');
const elTracked = document.getElementById('detail-tracked');

// Extended flight data elements
const elExtGrid = document.getElementById('detail-ext-grid');
const elIas = document.getElementById('detail-ias');
const elTas = document.getElementById('detail-tas');
const elMach = document.getElementById('detail-mach');
const elGeoAlt = document.getElementById('detail-geoalt');

// Transponder / navigation elements
const elXpdr = document.getElementById('detail-xpdr');
const elXpdrDivider = document.getElementById('detail-xpdr-divider');
const elSquawk = document.getElementById('detail-squawk');
const elWakeRow = document.getElementById('detail-wake-row');
const elWake = document.getElementById('detail-wake');
const elPhaseRow = document.getElementById('detail-phase-row');
const elPhase = document.getElementById('detail-phase');
const elNavAltRow = document.getElementById('detail-navalt-row');
const elNavAlt = document.getElementById('detail-navalt');
const elNavHdgRow = document.getElementById('detail-navhdg-row');
const elNavHdg = document.getElementById('detail-navhdg');
const elRssiRow = document.getElementById('detail-rssi-row');
const elRssi = document.getElementById('detail-rssi');

// T2-03: Phase timeline element
const elPhaseTimeline = document.getElementById('detail-phase-timeline');

// Distance to destination
const elDtdRow = document.getElementById('detail-dtd-row');
const elDtd = document.getElementById('detail-dtd');

// Footer tracked time
const elTrackedTime = document.getElementById('detail-tracked-time');

// New T1 elements
const elPhonetic = document.getElementById('detail-phonetic');
const elCopy = document.getElementById('detail-copy');

let selectedAircraft = null;

// ── T3-03: Altitude profile chart (FR24-accurate) ──
const altHistory = []; // {time, alt, speed, vs} entries — alt in feet
const ALT_HISTORY_MAX = 2400; // 30 min track + 1s live samples
let _altHistoryTimer = null;
let _altHistorySeeded = false; // track data has been loaded into chart
let _seedFromTrack = null; // closure reference for external re-seed
let _altHoverX = null; // crosshair hover pixel X (null = no hover)
let _spdHoverX = null;

// Utility: draw a rounded rectangle path
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── T1-04: Copy flight info ──
if (elCopy) {
  elCopy.addEventListener('click', () => {
    if (!selectedAircraft) return;
    const d = selectedAircraft.getDisplayData();
    const cs = d.callsign || d.icao24;
    const type = d.aircraftType || '';
    const route = (d.origin && d.destination) ? `${d.origin}→${d.destination}` : '';
    const altVal = d._bestAltFt != null ? d._bestAltFt : (d._rawAlt != null ? Math.round(d._rawAlt * 3.28084) : null);
    const alt = altVal != null ? `FL${Math.round(altVal / 100)}` : '';
    const gs = d.gsKts != null ? `GS${d.gsKts}` : '';
    const text = [cs, type, route, alt, gs].filter(Boolean).join(' ');
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard'));
  });
}

// ── T1-03: Speed unit toggle ──
const elSpdLabel = document.querySelector('#detail-panel .detail-cell:nth-child(2) .detail-label');
if (elSpdLabel) {
  elSpdLabel.style.cursor = 'pointer';
  elSpdLabel.title = 'Click to change unit';
  elSpdLabel.addEventListener('click', () => {
    speedUnitIdx = (speedUnitIdx + 1) % 3;
    localStorage.setItem('stratum:speedUnit', String(speedUnitIdx));
    elSpdLabel.textContent = SPEED_UNITS[speedUnitIdx].toUpperCase();
    if (selectedAircraft) {
      const d = selectedAircraft.getDisplayData();
      const kts = d.gsKts != null ? d.gsKts : (d._rawSpd != null ? Math.round(d._rawSpd * 1.94384) : null);
      flashUpdate(elSpd, convertSpeed(kts, SPEED_UNITS[speedUnitIdx]));
    }
  });
}

elClose.addEventListener('click', () => closeDetail());

// Click-to-copy on any flight data cell value
panel.addEventListener('click', (e) => {
  const cell = e.target.closest('.detail-cell');
  if (!cell) return;
  const val = cell.querySelector('.detail-value');
  if (val && val.textContent && val.textContent !== '--') {
    navigator.clipboard.writeText(val.textContent).then(() => showToast('Copied: ' + val.textContent));
  }
});

// Flash animation when a numeric value changes
function flashUpdate(el, newText) {
  if (!el) return;
  if (el.textContent === newText) return;
  el.textContent = newText;
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
  el.addEventListener('animationend', () => el.classList.remove('flash'), { once: true });
}

// Compute bearing from point A to point B (degrees)
function bearingFromTo(lat1, lon1, lat2, lon2) {
  const toRad = Math.PI / 180;
  const dLon = (lon2 - lon1) * toRad;
  const y = Math.sin(dLon) * Math.cos(lat2 * toRad);
  const x = Math.cos(lat1 * toRad) * Math.sin(lat2 * toRad)
          - Math.sin(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.cos(dLon);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function headingToCardinal(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

// Format ETA from distance (km) and speed (m/s)
function formatETA(distKm, speedMs) {
  if (!distKm || !speedMs || speedMs < 10) return null;
  const hours = (distKm * 1000) / speedMs / 3600;
  if (hours < 0.02) return '<1m';
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h${m > 0 ? ` ${m}m` : ''}`;
}

// ── T3-03: Render altitude profile chart (professional aviation grade) ──
function renderAltChart() {
  let canvas = document.getElementById('detail-alt-chart');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'detail-alt-chart';
    canvas.style.cssText = 'display:none;width:100%;height:130px;margin:4px 0 0;border-radius:8px;background:rgba(0,0,0,0.3);cursor:crosshair;';
    const progressEl = document.getElementById('detail-progress');
    if (progressEl && progressEl.parentNode) {
      progressEl.parentNode.insertBefore(canvas, progressEl.nextSibling);
    } else {
      (panel.querySelector('.detail-body') || panel).appendChild(canvas);
    }
  }
  // Interactive crosshair event listeners (once)
  if (!canvas._ev) {
    canvas._ev = true;
    const setH = x => { _altHoverX = x; renderAltChart(); };
    canvas.addEventListener('mousemove', e => setH(e.clientX - canvas.getBoundingClientRect().left));
    canvas.addEventListener('mouseleave', () => setH(null));
    canvas.addEventListener('touchmove', e => { e.preventDefault(); setH(e.touches[0].clientX - canvas.getBoundingClientRect().left); }, { passive: false });
    canvas.addEventListener('touchend', () => setH(null));
  }

  if (altHistory.length < 2) { canvas.style.display = 'none'; return; }

  canvas.style.display = 'block';
  let w = Math.round(canvas.getBoundingClientRect().width);
  if (!w) { void canvas.offsetWidth; w = Math.round(canvas.getBoundingClientRect().width) || 260; }
  const H = 130;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, H);

  const PAD_L = 44, PAD_R = 8, PAD_T = 20, PAD_B = 16;
  const VS_STRIP = 10;
  const plotW = w - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B - VS_STRIP;

  // ─── Compute ranges ───
  let minA = Infinity, maxA = -Infinity;
  for (const e of altHistory) {
    if (e.alt != null && isFinite(e.alt)) {
      if (e.alt < minA) minA = e.alt;
      if (e.alt > maxA) maxA = e.alt;
    }
  }
  if (!isFinite(minA)) return;

  const last = altHistory[altHistory.length - 1];
  const navAlt = last?.navAlt;
  if (navAlt != null && isFinite(navAlt)) {
    if (navAlt < minA) minA = navAlt;
    if (navAlt > maxA) maxA = navAlt;
  }

  const aRange = maxA - minA;
  const step = aRange > 10000 ? 5000 : aRange > 3000 ? 2000 : aRange > 1000 ? 1000 : 500;
  const yMin = Math.max(0, Math.floor((minA - step * 0.3) / step) * step);
  const yMax = Math.ceil((maxA + step * 0.3) / step) * step;
  const yRange = yMax - yMin || 1;

  const tMin = altHistory[0].time;
  const tMax = altHistory[altHistory.length - 1].time;
  const tRange = tMax - tMin || 1;

  const xOf = t => PAD_L + ((t - tMin) / tRange) * plotW;
  const yOf = a => PAD_T + plotH - ((a - yMin) / yRange) * plotH;

  // ─── Header: title + live stats ───
  ctx.font = 'bold 9px JetBrains Mono, monospace';
  ctx.fillStyle = 'rgba(180,210,255,0.5)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('ALTITUDE', PAD_L, 4);

  if (last && last.alt != null) {
    ctx.textAlign = 'right';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(220,230,255,0.6)';
    const curA = last.alt >= 18000 ? `FL${Math.round(last.alt / 100)}` : `${Math.round(last.alt).toLocaleString()}ft`;
    let stats = curA;
    if (last.vs != null) {
      const arrow = last.vs > 200 ? '▲' : last.vs < -200 ? '▼' : '—';
      const vsAbs = Math.abs(last.vs);
      stats += `  ${arrow}${vsAbs >= 1000 ? (last.vs / 1000).toFixed(1) + 'k' : last.vs}`;
    }
    if (navAlt != null) {
      const navStr = navAlt >= 18000 ? `FL${Math.round(navAlt / 100)}` : `${Math.round(navAlt).toLocaleString()}`;
      stats += `  SEL ${navStr}`;
    }
    ctx.fillText(stats, w - PAD_R, 4);
  }

  // ─── Grid lines ───
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 0.5;
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.fillStyle = 'rgba(180,210,255,0.4)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let alt = yMin; alt <= yMax; alt += step) {
    const y = yOf(alt);
    ctx.beginPath();
    ctx.moveTo(PAD_L, y);
    ctx.lineTo(w - PAD_R, y);
    ctx.stroke();
    const label = alt >= 18000 ? `FL${Math.round(alt / 100)}` : `${(alt / 1000).toFixed(alt % 1000 === 0 ? 0 : 1)}k`;
    ctx.fillText(label, PAD_L - 4, y);
  }

  // ─── Time axis ───
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(180,210,255,0.35)';
  const tRangeMin = tRange / 60000;
  const tStep = tRangeMin > 20 ? 600000 : tRangeMin > 8 ? 300000 : tRangeMin > 3 ? 120000 : 60000;
  const tStart = Math.ceil(tMin / tStep) * tStep;
  for (let t = tStart; t <= tMax; t += tStep) {
    const x = xOf(t);
    if (x < PAD_L + 20 || x > w - PAD_R - 20) continue;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, PAD_T);
    ctx.lineTo(x, PAD_T + plotH + VS_STRIP);
    ctx.stroke();
    const minsAgo = Math.round((tMax - t) / 60000);
    ctx.fillText(minsAgo === 0 ? 'now' : `-${minsAgo}m`, x, PAD_T + plotH + VS_STRIP + 2);
  }

  // ─── Nav altitude reference line (SEL ALT) ───
  if (navAlt != null && navAlt >= yMin && navAlt <= yMax) {
    const yNav = yOf(navAlt);
    ctx.strokeStyle = 'rgba(238,180,68,0.5)';
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD_L, yNav);
    ctx.lineTo(w - PAD_R, yNav);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(238,180,68,0.6)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('SEL', PAD_L + 2, yNav - 2);
  }

  // ─── Altitude fill gradient ───
  const grad = ctx.createLinearGradient(0, PAD_T, 0, PAD_T + plotH);
  grad.addColorStop(0, 'rgba(74,127,255,0.18)');
  grad.addColorStop(1, 'rgba(74,127,255,0.02)');
  ctx.beginPath();
  let hasFirst = false;
  for (const e of altHistory) {
    if (e.alt == null || !isFinite(e.alt)) continue;
    const x = xOf(e.time), y = yOf(e.alt);
    if (!hasFirst) { ctx.moveTo(x, y); hasFirst = true; } else ctx.lineTo(x, y);
  }
  if (hasFirst) {
    ctx.lineTo(xOf(tMax), PAD_T + plotH);
    ctx.lineTo(xOf(tMin), PAD_T + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // ─── Altitude line colored by vertical rate ───
  ctx.lineWidth = 1.8;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  for (let i = 1; i < altHistory.length; i++) {
    const prev = altHistory[i - 1], cur = altHistory[i];
    if (prev.alt == null || cur.alt == null || !isFinite(prev.alt) || !isFinite(cur.alt)) continue;
    const vs = cur.vs;
    if (vs != null && vs > 300) ctx.strokeStyle = '#ff9d4d';
    else if (vs != null && vs < -300) ctx.strokeStyle = '#4db8ff';
    else ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();
    ctx.moveTo(xOf(prev.time), yOf(prev.alt));
    ctx.lineTo(xOf(cur.time), yOf(cur.alt));
    ctx.stroke();
  }

  // ─── VS mini-bar strip ───
  const vsTop = PAD_T + plotH;
  let maxVS = 0;
  for (const e of altHistory) {
    if (e.vs != null) maxVS = Math.max(maxVS, Math.abs(e.vs));
  }
  if (maxVS > 0) {
    const barW = Math.max(1, plotW / altHistory.length);
    for (let i = 0; i < altHistory.length; i++) {
      const e = altHistory[i];
      if (e.vs == null || Math.abs(e.vs) < 100) continue;
      const x = xOf(e.time);
      const ratio = Math.min(1, Math.abs(e.vs) / maxVS);
      const barH = ratio * VS_STRIP;
      if (e.vs > 100) {
        ctx.fillStyle = `rgba(255,157,77,${0.25 + ratio * 0.5})`;
        ctx.fillRect(x - barW / 2, vsTop + VS_STRIP - barH, barW, barH);
      } else {
        ctx.fillStyle = `rgba(77,184,255,${0.25 + ratio * 0.5})`;
        ctx.fillRect(x - barW / 2, vsTop, barW, barH);
      }
    }
    ctx.font = '7px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(180,210,255,0.25)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('VS', PAD_L - 14, vsTop + VS_STRIP / 2);
  }

  // ─── Current altitude marker ───
  if (last && last.alt != null && isFinite(last.alt)) {
    const cx = xOf(last.time), cy = yOf(last.alt);
    // Glow
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fill();
    // Dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    // Value label
    const curStr = last.alt >= 18000 ? `FL${Math.round(last.alt / 100)}` : `${Math.round(last.alt).toLocaleString()} ft`;
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#fff';
    ctx.fillText(curStr, cx - 6, cy - 5);
    // 30s delta
    const t30 = last.time - 30000;
    let ref = null;
    for (let i = altHistory.length - 1; i >= 0; i--) {
      if (altHistory[i].time <= t30 && altHistory[i].alt != null) { ref = altHistory[i]; break; }
    }
    if (ref) {
      const delta = Math.round(last.alt - ref.alt);
      if (Math.abs(delta) >= 10) {
        const sign = delta > 0 ? '+' : '';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = delta > 0 ? '#ff9d4d' : '#4db8ff';
        ctx.textBaseline = 'top';
        ctx.fillText(`${sign}${delta} ft`, cx - 6, cy + 5);
      }
    }
  }

  // ─── Interactive crosshair ───
  if (_altHoverX != null) {
    let bestIdx = -1, bestDist = Infinity;
    for (let i = 0; i < altHistory.length; i++) {
      if (altHistory[i].alt == null) continue;
      const d = Math.abs(xOf(altHistory[i].time) - _altHoverX);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    if (bestIdx >= 0 && bestDist < 40) {
      const e = altHistory[bestIdx];
      const hx = xOf(e.time), hy = yOf(e.alt);
      // Vertical crosshair line
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(hx, PAD_T);
      ctx.lineTo(hx, PAD_T + plotH + VS_STRIP);
      ctx.stroke();
      ctx.setLineDash([]);
      // Horizontal crosshair line
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.moveTo(PAD_L, hy);
      ctx.lineTo(w - PAD_R, hy);
      ctx.stroke();
      // Highlight dot
      ctx.beginPath();
      ctx.arc(hx, hy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fill();

      // Tooltip
      const minsAgo = Math.round((tMax - e.time) / 60000);
      const timeStr = minsAgo === 0 ? 'now' : `-${minsAgo}m`;
      const altStr = e.alt >= 18000 ? `FL${Math.round(e.alt / 100)}` : `${Math.round(e.alt).toLocaleString()} ft`;
      const lines = [altStr + '  ' + timeStr];
      if (e.vs != null) {
        const arrow = e.vs > 200 ? '▲' : e.vs < -200 ? '▼' : '—';
        lines.push(`VS ${e.vs > 0 ? '+' : ''}${e.vs} ft/m  ${arrow}`);
      }
      if (e.gsKts != null) lines.push(`GS ${e.gsKts} kts`);
      if (e.mach != null) lines.push(`Mach ${e.mach.toFixed(3)}`);

      ctx.font = '9px JetBrains Mono, monospace';
      const lineH = 14;
      const maxTW = Math.max(...lines.map(l => ctx.measureText(l).width));
      const ttW = maxTW + 14;
      const ttH = lines.length * lineH + 10;
      let ttX = hx + 12;
      if (ttX + ttW > w - 4) ttX = hx - ttW - 12;
      let ttY = hy - ttH / 2;
      ttY = Math.max(2, Math.min(ttY, H - ttH - 2));

      roundRect(ctx, ttX, ttY, ttW, ttH, 5);
      ctx.fillStyle = 'rgba(8,12,28,0.92)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(90,130,220,0.35)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.fillStyle = 'rgba(220,235,255,0.9)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], ttX + 7, ttY + 5 + i * lineH);
      }
    }
  }
}

// ── P6: Speed Profile Chart (professional aviation grade) ──
function renderSpeedChart() {
  let canvas = document.getElementById('detail-spd-chart');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'detail-spd-chart';
    canvas.style.cssText = 'display:none;width:100%;height:130px;margin:2px 0 4px;border-radius:8px;background:rgba(0,0,0,0.3);cursor:crosshair;';
    // Insert after alt chart if it exists, otherwise after progress bar, otherwise append to body
    const altCanvas = document.getElementById('detail-alt-chart');
    const progressEl = document.getElementById('detail-progress');
    const insertAfter = altCanvas || progressEl;
    if (insertAfter && insertAfter.parentNode) {
      insertAfter.parentNode.insertBefore(canvas, insertAfter.nextSibling);
    } else {
      (panel.querySelector('.detail-body') || panel).appendChild(canvas);
    }
  }
  if (!canvas._ev) {
    canvas._ev = true;
    const setH = x => { _spdHoverX = x; renderSpeedChart(); };
    canvas.addEventListener('mousemove', e => setH(e.clientX - canvas.getBoundingClientRect().left));
    canvas.addEventListener('mouseleave', () => setH(null));
    canvas.addEventListener('touchmove', e => { e.preventDefault(); setH(e.touches[0].clientX - canvas.getBoundingClientRect().left); }, { passive: false });
    canvas.addEventListener('touchend', () => setH(null));
  }

  const speedEntries = altHistory.filter(e => e.gsKts != null && isFinite(e.gsKts));
  if (speedEntries.length < 2) { canvas.style.display = 'none'; return; }

  canvas.style.display = 'block';
  let w = Math.round(canvas.getBoundingClientRect().width);
  if (!w) { void canvas.offsetWidth; w = Math.round(canvas.getBoundingClientRect().width) || 260; }
  const H = 130;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, H);

  const PAD_L = 44, PAD_R = 8, PAD_T = 20, PAD_B = 16;
  const plotW = w - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  // ─── Speed range (include IAS) ───
  let minS = Infinity, maxS = -Infinity;
  for (const e of speedEntries) {
    if (e.gsKts < minS) minS = e.gsKts;
    if (e.gsKts > maxS) maxS = e.gsKts;
    if (e.ias != null && isFinite(e.ias)) {
      if (e.ias < minS) minS = e.ias;
      if (e.ias > maxS) maxS = e.ias;
    }
  }
  if (!isFinite(minS)) return;

  const sRange = maxS - minS;
  const step = sRange > 300 ? 100 : sRange > 100 ? 50 : 25;
  const yMin = Math.max(0, Math.floor((minS - step * 0.5) / step) * step);
  const yMax = Math.ceil((maxS + step * 0.5) / step) * step;
  const yRange = yMax - yMin || 1;

  const tMin = speedEntries[0].time;
  const tMax = speedEntries[speedEntries.length - 1].time;
  const tRange = tMax - tMin || 1;

  const xOf = t => PAD_L + ((t - tMin) / tRange) * plotW;
  const yOf = s => PAD_T + plotH - ((s - yMin) / yRange) * plotH;

  // ─── Header: title + live multi-speed stats ───
  ctx.font = 'bold 9px JetBrains Mono, monospace';
  ctx.fillStyle = 'rgba(180,210,255,0.5)';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('SPEED', PAD_L, 4);

  const lastE = speedEntries[speedEntries.length - 1];
  if (lastE) {
    ctx.textAlign = 'right';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(220,230,255,0.6)';
    let stats = `GS ${lastE.gsKts}`;
    if (lastE.ias != null) stats += `  IAS ${lastE.ias}`;
    if (lastE.mach != null && lastE.mach >= 0.3) stats += `  M${lastE.mach.toFixed(2)}`;
    ctx.fillText(stats, w - PAD_R, 4);
  }

  // ─── Grid lines ───
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 0.5;
  ctx.font = '9px JetBrains Mono, monospace';
  ctx.fillStyle = 'rgba(180,210,255,0.4)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let s = yMin; s <= yMax; s += step) {
    const y = yOf(s);
    ctx.beginPath();
    ctx.moveTo(PAD_L, y);
    ctx.lineTo(w - PAD_R, y);
    ctx.stroke();
    ctx.fillText(`${s}`, PAD_L - 4, y);
  }

  // ─── Time axis ───
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(180,210,255,0.35)';
  const tRangeMin = tRange / 60000;
  const tStep = tRangeMin > 20 ? 600000 : tRangeMin > 8 ? 300000 : tRangeMin > 3 ? 120000 : 60000;
  const tStart = Math.ceil(tMin / tStep) * tStep;
  for (let t = tStart; t <= tMax; t += tStep) {
    const x = xOf(t);
    if (x < PAD_L + 20 || x > w - PAD_R - 20) continue;
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x, PAD_T);
    ctx.lineTo(x, PAD_T + plotH);
    ctx.stroke();
    const minsAgo = Math.round((tMax - t) / 60000);
    ctx.fillText(minsAgo === 0 ? 'now' : `-${minsAgo}m`, x, PAD_T + plotH + 2);
  }

  // ─── 250kt restriction zone (shaded + dashed line) ───
  const lastAlt = altHistory[altHistory.length - 1]?.alt;
  if (lastAlt != null && lastAlt < 18000 && yMin < 250 && yMax > 250) {
    const y250 = yOf(250);
    ctx.fillStyle = 'rgba(232,68,68,0.06)';
    ctx.fillRect(PAD_L, PAD_T, plotW, y250 - PAD_T);
    ctx.strokeStyle = 'rgba(232,68,68,0.45)';
    ctx.setLineDash([5, 3]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD_L, y250);
    ctx.lineTo(w - PAD_R, y250);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font = '8px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(232,68,68,0.55)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('250 KT LIMIT', PAD_L + 3, y250 - 2);
  }

  // ─── IAS line (thin dashed, green) ───
  const iasEntries = speedEntries.filter(e => e.ias != null && isFinite(e.ias));
  if (iasEntries.length > 1) {
    ctx.strokeStyle = 'rgba(120,220,160,0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 3]);
    ctx.lineJoin = 'round';
    ctx.beginPath();
    let firstIAS = true;
    for (const e of iasEntries) {
      const x = xOf(e.time), y = yOf(e.ias);
      if (firstIAS) { ctx.moveTo(x, y); firstIAS = false; } else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    const liAS = iasEntries[iasEntries.length - 1];
    const iasLabelX = xOf(liAS.time) + 4;
    if (iasLabelX < w - 30) {
      ctx.font = '8px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(120,220,160,0.5)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('IAS', iasLabelX, yOf(liAS.ias));
    }
  }

  // ─── GS fill gradient ───
  const grad = ctx.createLinearGradient(0, PAD_T, 0, PAD_T + plotH);
  grad.addColorStop(0, 'rgba(238,136,51,0.14)');
  grad.addColorStop(1, 'rgba(238,136,51,0.02)');
  ctx.beginPath();
  let hasFirst = false;
  for (const e of speedEntries) {
    const x = xOf(e.time), y = yOf(e.gsKts);
    if (!hasFirst) { ctx.moveTo(x, y); hasFirst = true; } else ctx.lineTo(x, y);
  }
  if (hasFirst) {
    ctx.lineTo(xOf(tMax), PAD_T + plotH);
    ctx.lineTo(xOf(tMin), PAD_T + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // ─── GS line colored by acceleration ───
  ctx.lineWidth = 1.8;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  for (let i = 1; i < speedEntries.length; i++) {
    const prev = speedEntries[i - 1], cur = speedEntries[i];
    const accel = cur.gsKts - prev.gsKts;
    if (accel > 5) ctx.strokeStyle = '#ff9d4d';
    else if (accel < -5) ctx.strokeStyle = '#4db8ff';
    else ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.moveTo(xOf(prev.time), yOf(prev.gsKts));
    ctx.lineTo(xOf(cur.time), yOf(cur.gsKts));
    ctx.stroke();
  }

  // ─── Current speed marker ───
  if (lastE && lastE.gsKts != null && isFinite(lastE.gsKts)) {
    const cx = xOf(lastE.time), cy = yOf(lastE.gsKts);
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(238,136,51,0.15)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ee8833';
    ctx.fill();
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#ee8833';
    ctx.fillText(`${lastE.gsKts} kts`, cx - 6, cy - 5);
    // 30s delta
    const t30 = lastE.time - 30000;
    let ref = null;
    for (let i = speedEntries.length - 1; i >= 0; i--) {
      if (speedEntries[i].time <= t30 && speedEntries[i].gsKts != null) { ref = speedEntries[i]; break; }
    }
    if (ref) {
      const delta = Math.round(lastE.gsKts - ref.gsKts);
      if (Math.abs(delta) >= 2) {
        const sign = delta > 0 ? '+' : '';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = delta > 0 ? '#ff9d4d' : '#4db8ff';
        ctx.textBaseline = 'top';
        ctx.fillText(`${sign}${delta} kts`, cx - 6, cy + 5);
      }
    }
  }

  // ─── Interactive crosshair ───
  if (_spdHoverX != null) {
    let bestIdx = -1, bestDist = Infinity;
    for (let i = 0; i < speedEntries.length; i++) {
      const d = Math.abs(xOf(speedEntries[i].time) - _spdHoverX);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    if (bestIdx >= 0 && bestDist < 40) {
      const e = speedEntries[bestIdx];
      const hx = xOf(e.time), hy = yOf(e.gsKts);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(hx, PAD_T);
      ctx.lineTo(hx, PAD_T + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.beginPath();
      ctx.moveTo(PAD_L, hy);
      ctx.lineTo(w - PAD_R, hy);
      ctx.stroke();
      // GS dot
      ctx.beginPath();
      ctx.arc(hx, hy, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(238,136,51,0.8)';
      ctx.fill();
      // IAS dot
      if (e.ias != null && isFinite(e.ias)) {
        ctx.beginPath();
        ctx.arc(hx, yOf(e.ias), 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(120,220,160,0.7)';
        ctx.fill();
      }

      // Tooltip
      const minsAgo = Math.round((tMax - e.time) / 60000);
      const timeStr = minsAgo === 0 ? 'now' : `-${minsAgo}m`;
      const lines = [`GS ${e.gsKts} kts  ${timeStr}`];
      if (e.ias != null) lines.push(`IAS ${e.ias} kts`);
      if (e.mach != null && e.mach >= 0.3) lines.push(`Mach ${e.mach.toFixed(3)}`);
      if (e.alt != null) {
        const aStr = e.alt >= 18000 ? `FL${Math.round(e.alt / 100)}` : `${Math.round(e.alt).toLocaleString()} ft`;
        lines.push(aStr);
      }

      ctx.font = '9px JetBrains Mono, monospace';
      const lineH = 14;
      const maxTW = Math.max(...lines.map(l => ctx.measureText(l).width));
      const ttW = maxTW + 14;
      const ttH = lines.length * lineH + 10;
      let ttX = hx + 12;
      if (ttX + ttW > w - 4) ttX = hx - ttW - 12;
      let ttY = hy - ttH / 2;
      ttY = Math.max(2, Math.min(ttY, H - ttH - 2));

      roundRect(ctx, ttX, ttY, ttW, ttH, 5);
      ctx.fillStyle = 'rgba(8,12,28,0.92)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(90,130,220,0.35)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      ctx.fillStyle = 'rgba(220,235,255,0.9)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], ttX + 7, ttY + 5 + i * lineH);
      }
    }
  }
}

export function showDetail(aircraftObj, userLat, userLon) {
  selectedAircraft = aircraftObj;
  const d = aircraftObj.getDisplayData();

  // ── T2-01: Start live tracked timer ──
  startTrackedTimer();

  // ── T3-03: Altitude history — seed from track + live 1s sampling ──
  // Seed function — try to load historical track data into chart
  function seedFromTrack() {
    if (_altHistorySeeded || !selectedAircraft || !selectedAircraft.getAltitudeHistory) return;
    const hist = selectedAircraft.getAltitudeHistory();
    if (hist.length > 2) {
      const liveOnly = altHistory.filter(e => e._live);
      altHistory.length = 0;
      for (const entry of hist) altHistory.push(entry);
      for (const entry of liveOnly) altHistory.push(entry);
      _altHistorySeeded = true;
      renderAltChart();
      renderSpeedChart();
    }
  }
  _seedFromTrack = seedFromTrack;

  if (!_altHistoryTimer) {
    altHistory.length = 0;
    _altHistorySeeded = false;
    seedFromTrack();

    const pushSample = () => {
      if (!selectedAircraft) return;

      // Re-try seeding if track data arrived async
      if (!_altHistorySeeded) seedFromTrack();

      const sd = selectedAircraft.data || {};
      // Use barometric altitude consistently (matches track history source)
      const altFt = sd.baroAltitude != null ? Math.round(sd.baroAltitude * 3.28084) : null;
      const vsFtMin = sd.verticalRate != null ? Math.round(sd.verticalRate * 3.28084 * 60) : null;
      // Ground speed in knots — use getDisplayData() for best fallback chain
      const dd = selectedAircraft.getDisplayData ? selectedAircraft.getDisplayData() : {};
      const liveGsKts = dd.gsKts != null ? dd.gsKts
        : (sd.groundSpeed != null ? Math.round(sd.groundSpeed)
        : (sd.velocity != null ? Math.round(sd.velocity * 1.94384) : null));
      // Always push live sample (1s resolution) with full aviation data
      altHistory.push({
        time: Date.now(), alt: altFt, vs: vsFtMin, gsKts: liveGsKts,
        ias: dd.ias || null, tas: dd.tas || null,
        mach: dd.mach ? parseFloat(dd.mach) : null,
        navAlt: dd.navAlt || null,
        _live: true,
      });
      if (altHistory.length > ALT_HISTORY_MAX) altHistory.shift();
      renderAltChart();
      renderSpeedChart();
    };
    pushSample();
    _altHistoryTimer = setInterval(pushSample, 1000); // 1s updates
  } else {
    // Timer already running but aircraft changed — clear old data and re-seed
    altHistory.length = 0;
    _altHistorySeeded = false;
    seedFromTrack();
  }

  // ── HEADER ──
  elCallsign.textContent = d.callsign || d.icao24;

  // ── T1-09: Phonetic callsign ──
  if (elPhonetic) {
    const ph = toPhonetic(d.callsign || d.icao24);
    if (ph) { elPhonetic.textContent = ph; elPhonetic.classList.remove('hidden'); }
    else { elPhonetic.classList.add('hidden'); }
  }

  if (d.aircraftType) {
    // T2-02: Aircraft type silhouette
    const silCat = classifyAircraftType(d.aircraftType);
    const silSvg = silCat ? SILHOUETTES[silCat] : '';
    elType.innerHTML = silSvg + d.aircraftType;
    elType.style.display = '';
  } else {
    elType.style.display = 'none';
  }

  // Status badge (colored pill)
  if (elStatusBadge) {
    const phase = d.flightPhase || '';
    elStatusBadge.className = 'detail-status-badge';
    if (phase === 'CLIMB' || phase === 'INITIAL CLIMB' || phase === 'TAKEOFF') {
      elStatusBadge.textContent = phase;
      elStatusBadge.classList.add('climb');
    } else if (phase === 'DESCENT' || phase === 'APPROACH' || phase === 'LANDING') {
      elStatusBadge.textContent = phase;
      elStatusBadge.classList.add('descent');
    } else if (phase === 'CRUISE') {
      elStatusBadge.textContent = 'CRUISE';
      elStatusBadge.classList.add('cruise');
    }
  }

  // S1: Unusual Attitude Alert
  let uaAlert = document.getElementById('detail-ua-alert');
  if (!uaAlert) {
    uaAlert = document.createElement('div');
    uaAlert.id = 'detail-ua-alert';
    uaAlert.className = 'ua-alert';
    if (elStatusBadge && elStatusBadge.parentNode) {
      elStatusBadge.parentNode.insertBefore(uaAlert, elStatusBadge.nextSibling);
    }
  }
  if (d.unusualAttitude) {
    uaAlert.classList.add('active');
    uaAlert.textContent = `⚠ ${d.unusualAttitude}`;
  } else {
    uaAlert.classList.remove('active');
  }

  // A2: Holding Pattern badge
  let holdBadge = document.getElementById('detail-hold-badge');
  if (!holdBadge) {
    holdBadge = document.createElement('div');
    holdBadge.id = 'detail-hold-badge';
    holdBadge.className = 'hold-badge';
    holdBadge.textContent = 'HOLDING PATTERN';
    if (uaAlert && uaAlert.parentNode) {
      uaAlert.parentNode.insertBefore(holdBadge, uaAlert.nextSibling);
    }
  }
  if (d.isHolding) holdBadge.classList.add('active');
  else holdBadge.classList.remove('active');

  // ── AIRLINE ──
  const cs = d.callsign || '';
  const airlineMatch = cs.match(/^([A-Z]{2,3})\d/);
  const airlineName = d.routeAirline || d.operator || (airlineMatch ? getAirlineName(airlineMatch[1]) : null);
  if (airlineName && elAirlineRow) {
    elAirlineRow.classList.remove('hidden');
    elAirline.textContent = airlineName;
  } else if (elAirlineRow) {
    elAirlineRow.classList.add('hidden');
  }

  // ── ROUTE BANNER ──
  if (d.origin || d.destination) {
    elRoute.classList.remove('hidden');
    elOriginCode.textContent = d.origin || '---';
    elDestCode.textContent = d.destination || '---';
    if (d.origin && !d.originCity) {
      elOriginCity.innerHTML = '<span class="city-loading"></span>';
    } else {
      elOriginCity.textContent = d.originCity || '';
    }
    if (d.destination && !d.destCity) {
      elDestCity.innerHTML = '<span class="city-loading"></span>';
    } else {
      elDestCity.textContent = d.destCity || '';
    }
    if (d.routeEstimated) {
      elRoute.classList.add('estimated');
      elRoute.title = 'Route estimated from trajectory';
    } else {
      elRoute.classList.remove('estimated');
      elRoute.title = '';
    }
  } else {
    elRoute.classList.add('hidden');
  }

  // ── PROGRESS BAR + ETA ──
  if (elProgress && d.distToDest != null && d.distToDest > 0 && d.origin && d.destination) {
    // Estimate total distance from route completion ratio
    // distToDest is remaining, need total. Use specs range as upper bound or estimate
    const remainNm = Math.round(d.distToDest * 0.539957);
    const eta = formatETA(d.distToDest, d._rawSpd);

    // Estimate progress: if we have both origin distance and dest distance
    // we can compute fraction. Otherwise show just ETA.
    if (d._originDist != null && d._originDist > 0) {
      const total = d._originDist + d.distToDest;
      const pct = Math.min(99, Math.max(1, Math.round((d._originDist / total) * 100)));
      elProgressBar.style.width = `${pct}%`;
      elProgressText.textContent = eta ? `${pct}%  ·  ETA ${eta}` : `${pct}%`;
      elProgress.classList.remove('hidden');
    } else if (eta) {
      elProgressBar.style.width = '0';
      elProgressText.textContent = `ETA ${eta}  ·  ${remainNm} nm remaining`;
      elProgress.classList.remove('hidden');
    } else {
      elProgress.classList.add('hidden');
    }
  } else if (elProgress) {
    elProgress.classList.add('hidden');
  }

  // ── T2-03: Flight Phase Timeline ──
  if (elPhaseTimeline) {
    const PHASES = ['TAXI', 'CLIMB', 'CRUISE', 'DESCENT', 'APPROACH', 'LAND'];
    const phaseMap = {
      'ON GROUND': 'TAXI', 'TAKEOFF': 'TAXI',
      'INITIAL CLIMB': 'CLIMB', 'CLIMB': 'CLIMB',
      'CRUISE': 'CRUISE', 'EN ROUTE': 'CRUISE',
      'DESCENT': 'DESCENT',
      'APPROACH': 'APPROACH',
      'LANDING': 'LAND',
    };
    const curPhase = phaseMap[d.flightPhase] || null;
    const curIdx = curPhase ? PHASES.indexOf(curPhase) : -1;
    if (curIdx >= 0) {
      elPhaseTimeline.classList.remove('hidden');
      elPhaseTimeline.innerHTML = PHASES.map((p, i) => {
        const cls = i < curIdx ? 'past' : i === curIdx ? 'active' : '';
        return `<div class="phase-step ${cls}">${p}</div>`;
      }).join('');
    } else {
      elPhaseTimeline.classList.add('hidden');
    }
  }

  // ── FLIGHT DATA — altitude uses best available (geo > baro) ──
  const bestAltFt = d._bestAltFt != null ? d._bestAltFt : (d._rawAlt != null ? Math.round(d._rawAlt * 3.28084) : null);
  if (bestAltFt != null) {
    const altStr = bestAltFt >= 18000 ? `FL${Math.round(bestAltFt / 100)}` : `${bestAltFt.toLocaleString()} ft`;
    flashUpdate(elAlt, altStr);
    // Micro-tooltip: baro vs geo comparison
    const altCell = elAlt.closest('.detail-cell');
    if (altCell) {
      const geoFt = d.geoAltFt;
      if (geoFt != null && bestAltFt != null) {
        const delta = geoFt - bestAltFt;
        altCell.setAttribute('data-tip', `Baro ${bestAltFt.toLocaleString()}ft · Geo ${geoFt.toLocaleString()}ft (${delta >= 0 ? '+' : ''}${delta}ft)`);
      } else {
        altCell.setAttribute('data-tip', `${bestAltFt.toLocaleString()} ft barometric`);
      }
    }
  } else {
    flashUpdate(elAlt, '--');
  }

  // T1-03: Speed unit toggle
  if (d._rawSpd != null) {
    const kts = d.gsKts != null ? d.gsKts : Math.round(d._rawSpd * 1.94384);
    flashUpdate(elSpd, convertSpeed(kts, SPEED_UNITS[speedUnitIdx]));
    // Micro-tooltip: multi-speed comparison
    const spdCell = elSpd.closest('.detail-cell');
    if (spdCell) {
      let tip = `GS ${kts} kts`;
      if (d.ias != null) tip += ` · IAS ${d.ias}`;
      if (d.tas != null) tip += ` · TAS ${d.tas}`;
      if (d.mach != null) tip += ` · M${d.mach}`;
      spdCell.setAttribute('data-tip', tip);
    }
  } else {
    flashUpdate(elSpd, '--');
  }

  flashUpdate(elHdg, d.heading);
  // HDG tooltip
  const hdgCell = elHdg.closest('.detail-cell');
  if (hdgCell && d.heading && d.heading !== '--') {
    const hdgDeg = parseInt(d.heading);
    if (!isNaN(hdgDeg)) {
      const card = headingToCardinal(hdgDeg);
      hdgCell.setAttribute('data-tip', `${hdgDeg}° ${card} true`);
    }
  }

  // V/S with climb/descent color class
  const vsText = d.verticalSpeed;
  flashUpdate(elVs, vsText);
  elVs.classList.remove('vs-climb', 'vs-descent');
  elVs.style.color = '';
  if (d.status === 'CLIMBING') {
    elVs.classList.add('vs-climb');
  } else if (d.status === 'DESCENDING') {
    elVs.classList.add('vs-descent');
  }
  // VS tooltip
  const vsCell = elVs.closest('.detail-cell');
  if (vsCell && vsText && vsText !== '--') {
    const vsFpm = parseInt(vsText.replace(/[+,]/g, ''));
    if (!isNaN(vsFpm)) {
      const msVal = Math.round(vsFpm * 0.00508 * 100) / 100;
      vsCell.setAttribute('data-tip', `${vsFpm > 0 ? '+' : ''}${vsFpm} ft/min · ${msVal.toFixed(1)} m/s`);
    }
  }

  // Extended flight data (IAS, TAS, Mach, Geometric Alt)
  const hasExtData = d.ias != null || d.tas != null || d.mach != null || d.geoAltFt != null;
  if (hasExtData && elExtGrid) {
    elExtGrid.classList.remove('hidden');
    flashUpdate(elIas, d.ias != null ? `${d.ias}` : '--');
    flashUpdate(elTas, d.tas != null ? `${d.tas}` : '--');
    flashUpdate(elMach, d.mach != null ? `${d.mach}` : '--');
    if (d.geoAltFt != null) {
      const geoStr = d.geoAltFt >= 18000 ? `FL${Math.round(d.geoAltFt / 100)}` : `${d.geoAltFt.toLocaleString()}`;
      const altFtBaro = d._rawAlt != null ? Math.round(d._rawAlt * 3.28084) : null;
      if (altFtBaro != null) {
        const delta = d.geoAltFt - altFtBaro;
        const sign = delta >= 0 ? '+' : '';
        flashUpdate(elGeoAlt, `${geoStr}`);
        const geoCell = elGeoAlt.closest('.detail-cell');
        if (geoCell) geoCell.setAttribute('data-tip', `Geo ${d.geoAltFt.toLocaleString()}ft · Baro delta ${sign}${delta}ft`);
      } else {
        flashUpdate(elGeoAlt, geoStr);
      }
    } else {
      flashUpdate(elGeoAlt, '--');
    }
  } else if (elExtGrid) {
    elExtGrid.classList.add('hidden');
  }

  // ── CONDITIONS SECTION (W1 DA, W2 Dest Wind, W3 Turbulence) ──
  const condSection = document.getElementById('detail-conditions');
  const condMeta = document.getElementById('detail-cond-meta');
  let showCond = false;

  // W1: Density Altitude — shown during takeoff/approach/landing
  let daRow = document.getElementById('detail-da-row');
  if (!daRow) {
    daRow = document.createElement('div');
    daRow.id = 'detail-da-row';
    daRow.className = 'detail-meta-row hidden';
    daRow.innerHTML = '<span class="detail-meta-label">DENSITY ALT</span><span id="detail-da" class="detail-meta-value">--</span>';
    condMeta.appendChild(daRow);
  }
  const lowPhase = d.flightPhase === 'TAKEOFF' || d.flightPhase === 'INITIAL CLIMB' ||
                   d.flightPhase === 'APPROACH' || d.flightPhase === 'LANDING' || d.flightPhase === 'ON GROUND';
  if (lowPhase && typeof window._cachedWeather !== 'undefined' && window._cachedWeather) {
    const wda = window._cachedWeather;
    const da = computeDensityAltitude(wda.pressure, wda.temp, 0);
    if (da != null) {
      daRow.classList.remove('hidden');
      showCond = true;
      const daEl = document.getElementById('detail-da');
      const cls = da > 5000 ? 'detail-indicator--danger' : da > 3000 ? 'detail-indicator--warn' : 'detail-indicator--ok';
      daEl.innerHTML = `<span class="detail-indicator ${cls}">${da.toLocaleString()} ft</span>`;
    } else {
      daRow.classList.add('hidden');
    }
  } else {
    daRow.classList.add('hidden');
  }

  // W2: Destination Crosswind
  let destWindRow = document.getElementById('detail-destwind-row');
  if (!destWindRow) {
    destWindRow = document.createElement('div');
    destWindRow.id = 'detail-destwind-row';
    destWindRow.className = 'detail-meta-row hidden';
    destWindRow.innerHTML = '<span class="detail-meta-label">DEST WIND</span><span id="detail-destwind" class="detail-meta-value">--</span>';
    condMeta.appendChild(destWindRow);
  }
  const isDescending = d.flightPhase === 'DESCENT' || d.flightPhase === 'APPROACH';
  if (isDescending && d.destination && d.latitude != null) {
    const destApt = typeof window._findCityByCode === 'function' ? window._findCityByCode(d.destination) : null;
    if (destApt) {
      fetchDestinationWeather(destApt.lat, destApt.lon).then(dw => {
        if (!dw || !document.getElementById('detail-destwind-row')) return;
        destWindRow.classList.remove('hidden');
        condSection.classList.remove('hidden');
        const destWindEl = document.getElementById('detail-destwind');
        const hdgRaw = d.heading ? parseInt(d.heading) : null;
        const rwyHdg = hdgRaw != null ? Math.round(hdgRaw / 10) * 10 : null;
        if (rwyHdg != null && dw.windDir != null && dw.windSpeed != null) {
          const angleDiff = (dw.windDir - rwyHdg) * Math.PI / 180;
          const xwind = Math.round(Math.abs(dw.windSpeed * Math.sin(angleDiff) * 0.539957));
          const hwind = Math.round(dw.windSpeed * Math.cos(angleDiff) * 0.539957);
          const hwLabel = hwind >= 0 ? `H/W ${Math.abs(hwind)}` : `T/W ${Math.abs(hwind)}`;
          const cls = xwind > 25 ? 'detail-indicator--critical' : xwind > 15 ? 'detail-indicator--warn' : 'detail-indicator--ok';
          let html = `<span class="detail-indicator ${cls}">X/W ${xwind}</span> · ${hwLabel} kts`;
          if (xwind > 25) html += ' <span class="detail-indicator detail-indicator--critical">LIMIT</span>';
          destWindEl.innerHTML = html;
        } else {
          destWindEl.textContent = `${Math.round(dw.windSpeed * 0.539957)} kts / ${Math.round(dw.windDir)}°`;
        }
      });
    }
  } else {
    destWindRow.classList.add('hidden');
  }

  // W3: Turbulence Indicator
  let turbRow = document.getElementById('detail-turb-row');
  if (!turbRow) {
    turbRow = document.createElement('div');
    turbRow.id = 'detail-turb-row';
    turbRow.className = 'detail-meta-row hidden';
    turbRow.innerHTML = '<span class="detail-meta-label">TURBULENCE</span><span id="detail-turb" class="detail-meta-value">--</span>';
    condMeta.appendChild(turbRow);
  }
  const w = typeof window._cachedWeather !== 'undefined' ? window._cachedWeather : null;
  if (w) {
    let nearbyHeavy = 0;
    if (d.latitude != null && typeof window._aircraftManager !== 'undefined' && window._aircraftManager) {
      for (const [, ac] of window._aircraftManager.aircraft) {
        if (ac.fadingOut || ac.data.latitude == null) continue;
        const acType = ac.data.aircraftType;
        if (!acType) continue;
        const t = acType.toUpperCase();
        const isHeavy = ['A380','A388','B744','B748','A340','A342','A343','A345','A346','B772','B773','B77L','B77W','A332','A333','A338','A339','A359','A35K','B788','B789','B78X'].includes(t);
        if (isHeavy) {
          const dx = (ac.data.latitude - d.latitude);
          const dy = (ac.data.longitude - d.longitude);
          if (Math.sqrt(dx*dx + dy*dy) < 0.2) nearbyHeavy++;
        }
      }
    }
    const turb = estimateTurbulence(w, nearbyHeavy);
    if (turb) {
      turbRow.classList.remove('hidden');
      showCond = true;
      const cls = turb.label === 'SEVERE' ? 'detail-indicator--critical'
        : turb.label === 'MODERATE' ? 'detail-indicator--danger'
        : turb.label === 'LIGHT' ? 'detail-indicator--warn' : 'detail-indicator--ok';
      document.getElementById('detail-turb').innerHTML = `<span class="detail-indicator ${cls}">${turb.label}</span>`;
    } else {
      turbRow.classList.add('hidden');
    }
  } else {
    turbRow.classList.add('hidden');
  }

  // Show/hide CONDITIONS section
  if (condSection) {
    if (showCond) condSection.classList.remove('hidden');
    else condSection.classList.add('hidden');
  }

  // ── AIRCRAFT SECTION ──
  if (d.specs) {
    elSpecs.classList.remove('hidden');
    elAircraftName.textContent = d.specs.name;
    elMfr.textContent = d.specs.mfr;
    elPax.textContent = d.specs.cargo ? 'CARGO' : `${d.specs.pax} pax`;
    elRange.textContent = `${d.specs.range.toLocaleString()} nm`;
    elTracked.textContent = d.trackedTime;
  } else {
    elSpecs.classList.add('hidden');
  }

  elIcao.textContent = d.icao24 || '--';
  elReg.textContent = d.registration || '--';

  if (d.operator) {
    elOperatorRow.classList.remove('hidden');
    elOperator.textContent = d.operator;
  } else {
    elOperatorRow.classList.add('hidden');
  }

  // T1-13: Aircraft age with color badge
  if (d.age != null) {
    elAgeRow.classList.remove('hidden');
    const cls = d.age < 5 ? 'age-new' : d.age < 15 ? 'age-mid' : d.age < 25 ? 'age-old' : 'age-vintage';
    elAge.innerHTML = `${d.year} <span class="age-badge ${cls}">${d.age}y</span>`;
  } else {
    elAgeRow.classList.add('hidden');
  }

  // ── NAVIGATION SECTION ──
  const hasXpdr = d.squawk || d.wakeCat || d.flightPhase || d.navAlt != null || d.rssi != null;
  if (hasXpdr && elXpdr) {
    elXpdr.classList.remove('hidden');
    elXpdrDivider.classList.remove('hidden');

    if (d.squawk) {
      // T1-01: Squawk code alert styling
      elSquawk.className = 'detail-meta-value';
      if (d.squawk === '7500') {
        elSquawk.innerHTML = `<span class="squawk-alert squawk-7500">${d.squawk}</span>`;
        elSquawk.title = 'HIJACK';
      } else if (d.squawk === '7600') {
        elSquawk.innerHTML = `<span class="squawk-alert squawk-7600">${d.squawk}</span>`;
        elSquawk.title = 'COMM FAILURE';
      } else if (d.squawk === '7700') {
        elSquawk.innerHTML = `<span class="squawk-alert squawk-7700">${d.squawk}</span>`;
        elSquawk.title = 'EMERGENCY';
      } else if (d.squawk === '1200') {
        elSquawk.innerHTML = `<span class="squawk-alert squawk-1200">${d.squawk}</span>`;
        elSquawk.title = 'VFR';
      } else {
        elSquawk.textContent = d.squawk;
        elSquawk.title = '';
      }
    } else {
      elSquawk.textContent = '--';
      elSquawk.className = 'detail-meta-value';
    }

    if (d.wakeCat && elWakeRow) {
      elWakeRow.classList.remove('hidden');
      elWake.textContent = d.wakeCat;
    } else if (elWakeRow) {
      elWakeRow.classList.add('hidden');
    }

    if (d.flightPhase && elPhaseRow) {
      elPhaseRow.classList.remove('hidden');
      elPhase.textContent = d.flightPhase;
      if (d.flightPhase === 'CLIMB' || d.flightPhase === 'INITIAL CLIMB' || d.flightPhase === 'TAKEOFF') {
        elPhase.style.color = '#6ec87a';
      } else if (d.flightPhase === 'DESCENT' || d.flightPhase === 'APPROACH' || d.flightPhase === 'LANDING') {
        elPhase.style.color = '#e8836a';
      } else if (d.flightPhase === 'CRUISE') {
        elPhase.style.color = 'rgba(196,160,88,0.9)';
      } else {
        elPhase.style.color = '';
      }
    } else if (elPhaseRow) {
      elPhaseRow.classList.add('hidden');
    }

    if (d.navAlt != null && elNavAltRow) {
      elNavAltRow.classList.remove('hidden');
      const navStr = d.navAlt >= 18000 ? `FL${Math.round(d.navAlt / 100)}` : `${d.navAlt.toLocaleString()} ft`;
      elNavAlt.textContent = navStr;
    } else if (elNavAltRow) {
      elNavAltRow.classList.add('hidden');
    }

    if (d.navHdg != null && elNavHdgRow) {
      elNavHdgRow.classList.remove('hidden');
      elNavHdg.textContent = `${String(d.navHdg).padStart(3, '0')}°`;
    } else if (elNavHdgRow) {
      elNavHdgRow.classList.add('hidden');
    }

    if (d.rssi != null && elRssiRow) {
      elRssiRow.classList.remove('hidden');
      elRssi.textContent = `${d.rssi} dBFS`;
    } else if (elRssiRow) {
      elRssiRow.classList.add('hidden');
    }

    // T2-08: Runway detection badge
    let rwyRow = document.getElementById('detail-rwy-row');
    if (!rwyRow) {
      rwyRow = document.createElement('div');
      rwyRow.id = 'detail-rwy-row';
      rwyRow.className = 'detail-meta-row hidden';
      rwyRow.innerHTML = '<span class="detail-meta-label">RWY</span><span id="detail-rwy" class="detail-meta-value">--</span>';
      const navMeta = elXpdr.querySelector('.detail-meta');
      if (navMeta) navMeta.appendChild(rwyRow);
    }
    const altFtRaw = d._rawAlt != null ? Math.round(d._rawAlt * 3.28084) : null;
    const hdgRaw = d.heading ? parseInt(d.heading) : null;
    if (altFtRaw != null && altFtRaw < 8000 && hdgRaw != null && d.latitude != null && d.longitude != null) {
      // Find nearest airport
      const cities = window._CITIES;
      let nearApt = null, nearDist = Infinity;
      if (cities) {
        for (let i = 0; i < cities.length; i++) {
          const dd = haversineDistance(d.latitude, d.longitude, cities[i].lat, cities[i].lon);
          if (dd < nearDist) { nearDist = dd; nearApt = cities[i]; }
        }
      }
      const nearNm = nearDist * 0.539957;
      if (nearApt && nearNm < 30) {
        // Check if airport data has runway info
        const aptData = typeof window._getAirportData === 'function' ? window._getAirportData(nearApt.code) : null;
        const numRwys = aptData?.rwys || 1;
        // Generate runway designator from aircraft heading
        const rwyNum = Math.round(hdgRaw / 10) % 36 || 36;
        const rwyStr = String(rwyNum).padStart(2, '0');
        // Determine L/C/R suffix based on number of runways
        const suffix = numRwys >= 4 ? 'L' : numRwys >= 2 ? '' : '';
        // Determine departure vs arrival
        const isDep = d.flightPhase === 'TAKEOFF' || d.flightPhase === 'INITIAL CLIMB' || d.flightPhase === 'CLIMB';
        const isArr = d.flightPhase === 'APPROACH' || d.flightPhase === 'LANDING';
        const phaseTxt = isDep ? 'DEP' : isArr ? 'ILS' : '';
        if (isDep || isArr) {
          rwyRow.classList.remove('hidden');
          document.getElementById('detail-rwy').innerHTML = `<span class="rwy-badge">RWY ${rwyStr}${suffix} ${phaseTxt}</span>`;
        } else {
          rwyRow.classList.add('hidden');
        }
      } else {
        rwyRow.classList.add('hidden');
      }
    } else if (rwyRow) {
      rwyRow.classList.add('hidden');
    }
    // ── P1: Wind Component ──
    let windRow = document.getElementById('detail-wind-row');
    if (!windRow) {
      windRow = document.createElement('div');
      windRow.id = 'detail-wind-row';
      windRow.className = 'detail-meta-row hidden';
      windRow.innerHTML = '<span class="detail-meta-label">WIND</span><span id="detail-wind" class="detail-meta-value">--</span>';
      const navMeta = elXpdr.querySelector('.detail-meta');
      if (navMeta) navMeta.appendChild(windRow);
    }
    if (d.headwind != null) {
      windRow.classList.remove('hidden');
      const hw = d.headwind;
      const cw = d.crosswind || 0;
      const hwLabel = hw >= 0 ? `H/W ${hw}` : `T/W ${Math.abs(hw)}`;
      const cwLabel = Math.abs(cw) >= 3 ? ` · X/W ${Math.abs(cw)}` : '';
      document.getElementById('detail-wind').textContent = `${hwLabel}${cwLabel} kts`;
    } else {
      windRow.classList.add('hidden');
    }

    // ── P3: Altitude Deviation (VNAV) ──
    if (d.navAlt != null && d.altDeviation != null && elNavAltRow) {
      const dev = d.altDeviation;
      const absDev = Math.abs(dev);
      const sign = dev >= 0 ? '+' : '';
      let devColor = '';
      if (absDev > 500) devColor = ' style="color:#e8836a"'; // red
      else if (absDev > 200) devColor = ' style="color:#e8c36a"'; // yellow
      const navStr = d.navAlt >= 18000 ? `FL${Math.round(d.navAlt / 100)}` : `${d.navAlt.toLocaleString()} ft`;
      elNavAlt.innerHTML = absDev > 50 ? `${navStr} <span${devColor}>(${sign}${dev})</span>` : navStr;
    }

    // ── P4: RVSM Compliance ──
    let rvsmRow = document.getElementById('detail-rvsm-row');
    if (!rvsmRow) {
      rvsmRow = document.createElement('div');
      rvsmRow.id = 'detail-rvsm-row';
      rvsmRow.className = 'detail-meta-row hidden';
      rvsmRow.innerHTML = '<span class="detail-meta-label">RVSM</span><span id="detail-rvsm" class="detail-meta-value">--</span>';
      const navMeta = elXpdr.querySelector('.detail-meta');
      if (navMeta) navMeta.appendChild(rvsmRow);
    }
    if (d.rvsm) {
      rvsmRow.classList.remove('hidden');
      const rvsmEl = document.getElementById('detail-rvsm');
      if (d.rvsm === 'OK') {
        rvsmEl.innerHTML = '<span class="detail-indicator detail-indicator--ok">COMPLIANT</span>';
      } else {
        rvsmEl.innerHTML = '<span class="detail-indicator detail-indicator--danger">NON-STANDARD</span>';
      }
    } else if (rvsmRow) {
      rvsmRow.classList.add('hidden');
    }
  } else if (elXpdr) {
    elXpdr.classList.add('hidden');
    elXpdrDivider.classList.add('hidden');
  }

  // ── PERFORMANCE SECTION (P2 TOD, P5 Efficiency) ──
  const perfSection = document.getElementById('detail-performance');
  const perfMeta = document.getElementById('detail-perf-meta');
  let showPerf = false;

  // P2: Top of Descent
  let todRow = document.getElementById('detail-tod-row');
  if (!todRow) {
    todRow = document.createElement('div');
    todRow.id = 'detail-tod-row';
    todRow.className = 'detail-meta-row hidden';
    todRow.innerHTML = '<span class="detail-meta-label">TOP OF DESC</span><span id="detail-tod" class="detail-meta-value">--</span>';
    perfMeta.appendChild(todRow);
  }
  if (d.todNm != null) {
    todRow.classList.remove('hidden');
    showPerf = true;
    const todEl = document.getElementById('detail-tod');
    if (d.todNm === 0) {
      todEl.innerHTML = '<span class="detail-indicator detail-indicator--warn">PAST TOD</span>';
    } else {
      const minStr = d.todMin != null ? ` (${d.todMin} min)` : '';
      todEl.textContent = `${d.todNm} nm${minStr}`;
    }
  } else if (todRow) {
    todRow.classList.add('hidden');
  }

  // P5: Route Efficiency
  let effRow = document.getElementById('detail-eff-row');
  if (!effRow) {
    effRow = document.createElement('div');
    effRow.id = 'detail-eff-row';
    effRow.className = 'detail-meta-row hidden';
    effRow.innerHTML = '<span class="detail-meta-label">EFFICIENCY</span><span id="detail-eff" class="detail-meta-value">--</span>';
    perfMeta.appendChild(effRow);
  }
  if (d.routeEfficiency != null) {
    effRow.classList.remove('hidden');
    showPerf = true;
    const effEl = document.getElementById('detail-eff');
    const pct = d.routeEfficiency;
    const cls = pct >= 95 ? 'detail-indicator--ok' : pct >= 85 ? 'detail-indicator--warn' : 'detail-indicator--danger';
    effEl.innerHTML = `<span class="detail-indicator ${cls}">${pct}%</span>`;
  } else if (effRow) {
    effRow.classList.add('hidden');
  }

  // Show/hide PERFORMANCE section
  if (perfSection) {
    if (showPerf) perfSection.classList.remove('hidden');
    else perfSection.classList.add('hidden');
  }

  // ── POSITION SECTION ──
  if (d.latitude != null && d.longitude != null) {
    elPosition.classList.remove('hidden');
    const la = `${Math.abs(d.latitude).toFixed(4)}°${d.latitude >= 0 ? 'N' : 'S'}`;
    const lo = `${Math.abs(d.longitude).toFixed(4)}°${d.longitude >= 0 ? 'E' : 'W'}`;
    elPos.textContent = `${la}  ${lo}`;
    elCountry.textContent = d.originCountry || '--';

    // Bearing from user to aircraft
    if (elBearing) {
      const brg = bearingFromTo(userLat, userLon, d.latitude, d.longitude);
      const brgDeg = Math.round(brg);
      elBearing.textContent = `${String(brgDeg).padStart(3, '0')}° ${headingToCardinal(brgDeg)}`;
    }

    // Distance from user
    const dist = haversineDistance(userLat, userLon, d.latitude, d.longitude);
    const distNm = Math.round(dist * 0.539957);
    elDistance.textContent = `${Math.round(dist)} km (${distNm} nm)`;

    // Distance to destination
    if (d.distToDest != null && elDtdRow) {
      elDtdRow.classList.remove('hidden');
      const nm = Math.round(d.distToDest * 0.539957);
      elDtd.textContent = `${d.distToDest.toLocaleString()} km (${nm.toLocaleString()} nm)`;
    } else if (elDtdRow) {
      elDtdRow.classList.add('hidden');
    }

    // T2-04: Nearest airport distance
    let nearestRow = document.getElementById('detail-nearest-row');
    if (!nearestRow) {
      nearestRow = document.createElement('div');
      nearestRow.id = 'detail-nearest-row';
      nearestRow.className = 'detail-meta-row hidden';
      nearestRow.innerHTML = '<span class="detail-meta-label">NEAREST</span><span id="detail-nearest" class="detail-meta-value detail-nearest-value">--</span>';
      const positionMeta = elPosition.querySelector('.detail-meta');
      if (positionMeta) positionMeta.appendChild(nearestRow);
    }
    const cities = window._CITIES;
    if (cities && cities.length > 0) {
      let bestDist = Infinity, bestCode = '';
      for (let i = 0; i < cities.length; i++) {
        const dd = haversineDistance(d.latitude, d.longitude, cities[i].lat, cities[i].lon);
        if (dd < bestDist) { bestDist = dd; bestCode = cities[i].code; }
      }
      const nearNm = Math.round(bestDist * 0.539957);
      nearestRow.classList.remove('hidden');
      document.getElementById('detail-nearest').textContent = `${nearNm} NM from ${bestCode}`;
    } else {
      nearestRow.classList.add('hidden');
    }
  } else {
    elPosition.classList.add('hidden');
  }

  // ── FOOTER ──
  if (elTrackedTime) {
    elTrackedTime.textContent = d.trackedTime ? `tracked ${d.trackedTime}` : '';
  }
  elStatus.textContent = d.status;
  elStatus.className = 'detail-status ' + d.status.toLowerCase();

  panel.classList.remove('hidden');
}

export function closeDetail() {
  selectedAircraft = null;
  panel.classList.add('hidden');
  showDetailLoading(false);
  stopTrackedTimer();
  // T3-03: Stop altitude history sampling
  if (_altHistoryTimer) { clearInterval(_altHistoryTimer); _altHistoryTimer = null; }
  altHistory.length = 0;
  _altHistorySeeded = false;
  _seedFromTrack = null;
  const altCanvas = document.getElementById('detail-alt-chart');
  if (altCanvas) altCanvas.style.display = 'none';
  const spdCanvas = document.getElementById('detail-spd-chart');
  if (spdCanvas) spdCanvas.style.display = 'none';
  // Hide dynamic sections
  const condSec = document.getElementById('detail-conditions');
  if (condSec) condSec.classList.add('hidden');
  const perfSec = document.getElementById('detail-performance');
  if (perfSec) perfSec.classList.add('hidden');
}

export function showDetailLoading(loading) {
  if (!elEnrichLoader) return;
  if (loading) {
    elEnrichLoader.classList.remove('hidden');
  } else {
    elEnrichLoader.classList.add('hidden');
  }
}

export function getSelectedAircraft() {
  return selectedAircraft;
}

// Re-seed chart data after enrichment fetches trace
export function reseedChartData() {
  if (_seedFromTrack) {
    _altHistorySeeded = false;
    _seedFromTrack();
  }
}

export function refreshDetail(aircraftManager, userLat, userLon) {
  if (!selectedAircraft) return;
  if (selectedAircraft.removed) {
    closeDetail();
    return;
  }
  showDetail(selectedAircraft, userLat, userLon);
}
