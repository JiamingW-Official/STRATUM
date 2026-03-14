import { haversineDistance } from '../scene/aircraft.js';
import { getAirlineName } from '../data/airlineDb.js';

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
const elRadio = document.getElementById('detail-radio');

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
const ALT_HISTORY_MAX = 900; // 30 min at 2s intervals
let _altHistoryTimer = null;

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

// ── T3-03: Render altitude profile chart (FR24-accurate) ──
// Shows altitude in feet with grid lines, current value, and time axis.
// Data is already stored in feet (converted at sample time).
function renderAltChart() {
  let canvas = document.getElementById('detail-alt-chart');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'detail-alt-chart';
    canvas.style.cssText = 'display:none;width:100%;height:90px;margin:4px 0 2px;border-radius:6px;background:rgba(0,0,0,0.25);';
    const progressEl = document.getElementById('detail-progress');
    if (progressEl && progressEl.parentNode) {
      progressEl.parentNode.insertBefore(canvas, progressEl.nextSibling);
    } else {
      const panelContent = panel.querySelector('.detail-body') || panel;
      panelContent.appendChild(canvas);
    }
  }

  if (altHistory.length < 2) {
    canvas.style.display = 'none';
    return;
  }

  canvas.style.display = 'block';
  const rect = canvas.getBoundingClientRect();
  const w = Math.round(rect.width) || 260;
  const h = 90;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;

  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const PAD_L = 42; // left padding for Y-axis labels
  const PAD_R = 6;
  const PAD_T = 10;
  const PAD_B = 16; // bottom padding for time axis
  const plotW = w - PAD_L - PAD_R;
  const plotH = h - PAD_T - PAD_B;

  // Compute altitude range (values already in feet)
  let minAlt = Infinity, maxAlt = -Infinity;
  for (const entry of altHistory) {
    const a = entry.alt;
    if (a != null && isFinite(a)) {
      if (a < minAlt) minAlt = a;
      if (a > maxAlt) maxAlt = a;
    }
  }
  if (!isFinite(minAlt)) return;

  // Snap to nice altitude steps (500ft steps below FL180, 1000ft above)
  const altRange = maxAlt - minAlt;
  const step = altRange > 10000 ? 5000 : altRange > 3000 ? 2000 : altRange > 1000 ? 1000 : 500;
  const yMin = Math.max(0, Math.floor((minAlt - step * 0.3) / step) * step);
  const yMax = Math.ceil((maxAlt + step * 0.3) / step) * step;
  const yRange = yMax - yMin || 1;

  const tMin = altHistory[0].time;
  const tMax = altHistory[altHistory.length - 1].time;
  const tRange = tMax - tMin || 1;

  function xOf(t) { return PAD_L + ((t - tMin) / tRange) * plotW; }
  function yOf(a) { return PAD_T + plotH - ((a - yMin) / yRange) * plotH; }

  // ── Grid lines ──
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

  // ── Time axis labels ──
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = 'rgba(180,210,255,0.35)';
  const tRangeMin = tRange / 60000;
  const tStep = tRangeMin > 20 ? 600000 : tRangeMin > 8 ? 300000 : tRangeMin > 3 ? 120000 : 60000; // ms
  const tStart = Math.ceil(tMin / tStep) * tStep;
  for (let t = tStart; t <= tMax; t += tStep) {
    const x = xOf(t);
    if (x < PAD_L + 20 || x > w - PAD_R - 20) continue;
    // vertical tick
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.moveTo(x, PAD_T);
    ctx.lineTo(x, PAD_T + plotH);
    ctx.stroke();
    // time label (minutes ago)
    const minsAgo = Math.round((tMax - t) / 60000);
    ctx.fillText(minsAgo === 0 ? 'now' : `-${minsAgo}m`, x, PAD_T + plotH + 2);
  }

  // ── Altitude fill gradient ──
  const grad = ctx.createLinearGradient(0, PAD_T, 0, PAD_T + plotH);
  grad.addColorStop(0, 'rgba(74,127,255,0.15)');
  grad.addColorStop(1, 'rgba(74,127,255,0.02)');
  ctx.beginPath();
  let hasFirst = false;
  for (const entry of altHistory) {
    if (entry.alt == null || !isFinite(entry.alt)) continue;
    const x = xOf(entry.time), y = yOf(entry.alt);
    if (!hasFirst) { ctx.moveTo(x, y); hasFirst = true; } else ctx.lineTo(x, y);
  }
  if (hasFirst) {
    ctx.lineTo(xOf(altHistory[altHistory.length - 1].time), PAD_T + plotH);
    ctx.lineTo(xOf(altHistory[0].time), PAD_T + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // ── Altitude line — colored by vertical rate ──
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  for (let i = 1; i < altHistory.length; i++) {
    const prev = altHistory[i - 1];
    const cur = altHistory[i];
    if (prev.alt == null || cur.alt == null || !isFinite(prev.alt) || !isFinite(cur.alt)) continue;

    // Color by vertical rate: climb=orange, descent=blue, level=white
    const vs = cur.vs;
    if (vs != null && vs > 300) ctx.strokeStyle = '#ff9d4d';
    else if (vs != null && vs < -300) ctx.strokeStyle = '#4db8ff';
    else ctx.strokeStyle = 'rgba(255,255,255,0.85)';

    ctx.beginPath();
    ctx.moveTo(xOf(prev.time), yOf(prev.alt));
    ctx.lineTo(xOf(cur.time), yOf(cur.alt));
    ctx.stroke();
  }

  // ── Current altitude marker (right edge) ──
  const last = altHistory[altHistory.length - 1];
  if (last.alt != null && isFinite(last.alt)) {
    const cx = xOf(last.time);
    const cy = yOf(last.alt);

    // Dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    // Current altitude value label
    const curAltStr = last.alt >= 18000
      ? `FL${Math.round(last.alt / 100)}`
      : `${Math.round(last.alt).toLocaleString()} ft`;
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#fff';
    ctx.fillText(curAltStr, cx - 6, cy - 4);

    // Show recent change (delta from 30s ago)
    const t30sAgo = last.time - 30000;
    let refEntry = null;
    for (let i = altHistory.length - 1; i >= 0; i--) {
      if (altHistory[i].time <= t30sAgo && altHistory[i].alt != null) { refEntry = altHistory[i]; break; }
    }
    if (refEntry) {
      const delta = Math.round(last.alt - refEntry.alt);
      if (Math.abs(delta) >= 10) {
        const sign = delta > 0 ? '+' : '';
        const color = delta > 0 ? '#ff9d4d' : '#4db8ff';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.fillStyle = color;
        ctx.textBaseline = 'top';
        ctx.fillText(`${sign}${delta} ft/30s`, cx - 6, cy + 4);
      }
    }
  }
}

export function showDetail(aircraftObj, userLat, userLon) {
  selectedAircraft = aircraftObj;
  const d = aircraftObj.getDisplayData();

  // ── T2-01: Start live tracked timer ──
  startTrackedTimer();

  // ── T3-03: Altitude history sampling (2s, feet, geo-preferred) ──
  if (!_altHistoryTimer) {
    altHistory.length = 0;
    const pushSample = () => {
      if (!selectedAircraft) return;
      const sd = selectedAircraft.data || {};
      // Prefer geometric (GPS) altitude, fallback to barometric — convert to feet
      const altM = sd.geoAltitude != null ? sd.geoAltitude : sd.baroAltitude;
      const altFt = altM != null ? Math.round(altM * 3.28084) : null;
      const vsFtMin = sd.verticalRate != null ? Math.round(sd.verticalRate * 3.28084 * 60) : null;
      altHistory.push({ time: Date.now(), alt: altFt, speed: sd.velocity, vs: vsFtMin });
      if (altHistory.length > ALT_HISTORY_MAX) altHistory.shift();
      renderAltChart();
    };
    pushSample();
    _altHistoryTimer = setInterval(pushSample, 2000);
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
    // T1-02: Altitude trend arrow
    const vs = d.verticalSpeed || '';
    let arrow = '';
    if (vs && vs.includes('+') && parseInt(vs) > 300) arrow = ' ▲';
    else if (vs && vs.includes('-') && parseInt(vs) < -300) arrow = ' ▼';
    else if (vs && vs !== '--') arrow = ' —';
    flashUpdate(elAlt, altStr + arrow);
  } else {
    flashUpdate(elAlt, '--');
  }

  // T1-03: Speed unit toggle
  if (d._rawSpd != null) {
    const kts = d.gsKts != null ? d.gsKts : Math.round(d._rawSpd * 1.94384);
    flashUpdate(elSpd, convertSpeed(kts, SPEED_UNITS[speedUnitIdx]));
  } else {
    flashUpdate(elSpd, '--');
  }

  flashUpdate(elHdg, d.heading);

  const vsText = d.verticalSpeed;
  flashUpdate(elVs, vsText);
  if (d.status === 'CLIMBING') {
    elVs.style.color = 'var(--climb)';
  } else if (d.status === 'DESCENDING') {
    elVs.style.color = 'var(--descend)';
  } else {
    elVs.style.color = '';
  }

  // Extended flight data (IAS, TAS, Mach, Geometric Alt)
  const hasExtData = d.ias != null || d.tas != null || d.mach != null || d.geoAltFt != null;
  if (hasExtData && elExtGrid) {
    elExtGrid.classList.remove('hidden');
    flashUpdate(elIas, d.ias != null ? `${d.ias} kts` : '--');
    flashUpdate(elTas, d.tas != null ? `${d.tas} kts` : '--');
    flashUpdate(elMach, d.mach != null ? `M${d.mach}` : '--');
    if (d.geoAltFt != null) {
      const geoStr = d.geoAltFt >= 18000 ? `FL${Math.round(d.geoAltFt / 100)}` : `${d.geoAltFt.toLocaleString()} ft`;
      // Show altitude delta (geo - baro) — indicates pressure deviation
      const altFtBaro = d._rawAlt != null ? Math.round(d._rawAlt * 3.28084) : null;
      if (altFtBaro != null) {
        const delta = d.geoAltFt - altFtBaro;
        const sign = delta >= 0 ? '+' : '';
        flashUpdate(elGeoAlt, `${geoStr} (${sign}${delta} ft)`);
      } else {
        flashUpdate(elGeoAlt, geoStr);
      }
    } else {
      flashUpdate(elGeoAlt, '--');
    }
  } else if (elExtGrid) {
    elExtGrid.classList.add('hidden');
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
  } else if (elXpdr) {
    elXpdr.classList.add('hidden');
    elXpdrDivider.classList.add('hidden');
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
  const atcAirport = d.origin || d.destination;
  if (atcAirport && atcAirport.length >= 3) {
    elRadio.classList.remove('hidden');
    elRadio.onclick = () => {
      window.open(`https://www.liveatc.net/search/?icao=${encodeURIComponent(atcAirport)}`, '_blank');
    };
  } else {
    elRadio.classList.add('hidden');
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
  const altCanvas = document.getElementById('detail-alt-chart');
  if (altCanvas) altCanvas.style.display = 'none';
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

export function refreshDetail(aircraftManager, userLat, userLon) {
  if (!selectedAircraft) return;
  if (selectedAircraft.removed) {
    closeDetail();
    return;
  }
  showDetail(selectedAircraft, userLat, userLon);
}
