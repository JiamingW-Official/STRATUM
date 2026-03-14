// ── NEKO — ATC channel log ──

let logEl = null;
let badgeEl = null;
let panelEl = null;
let toggleEl = null;
let isOpen = false;
let unread = 0;
let _initialized = false;

function zuluTime() {
  const d = new Date();
  return `${String(d.getUTCHours()).padStart(2, '0')}${String(d.getUTCMinutes()).padStart(2, '0')}Z`;
}

// sender: callsign string or 'SYS' for system messages
function addEntry(sender, text) {
  if (!logEl) return;

  const row = document.createElement('div');
  row.className = 'neko-row';

  const time = document.createElement('span');
  time.className = 'neko-zulu';
  time.textContent = zuluTime();

  const cs = document.createElement('span');
  cs.className = sender === 'SYS' ? 'neko-cs neko-cs--sys' : 'neko-cs';
  cs.textContent = sender.slice(0, 8); // ICAO callsigns max 7 chars

  const msg = document.createElement('span');
  msg.className = 'neko-text';
  msg.textContent = text;

  row.appendChild(time);
  row.appendChild(cs);
  row.appendChild(msg);
  logEl.appendChild(row);

  // Squelch flash on entry
  requestAnimationFrame(() => {
    row.classList.add('squelch');
    logEl.scrollTo({ top: logEl.scrollHeight, behavior: 'smooth' });
  });
  setTimeout(() => row.classList.remove('squelch'), 700);

  if (!isOpen) {
    unread++;
    _refreshBadge();
  }
}

function _refreshBadge() {
  if (!badgeEl) return;
  if (unread > 0) {
    badgeEl.textContent = unread > 9 ? '9+' : String(unread);
    badgeEl.classList.remove('hidden');
  } else {
    badgeEl.classList.add('hidden');
  }
}

export function initNeko() {
  if (_initialized) return;
  _initialized = true;

  logEl = document.getElementById('neko-log');
  badgeEl = document.getElementById('neko-badge');
  panelEl = document.getElementById('neko-panel');
  toggleEl = document.getElementById('neko-toggle');

  if (!toggleEl || !panelEl) return;

  toggleEl.addEventListener('click', () => {
    isOpen = !isOpen;
    panelEl.classList.toggle('open', isOpen);
    toggleEl.classList.toggle('active', isOpen);
    toggleEl.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      unread = 0;
      _refreshBadge();
      requestAnimationFrame(() => {
        if (logEl) logEl.scrollTop = logEl.scrollHeight;
      });
    }
  });

  // Guard frequency online
  setTimeout(() => addEntry('CTR', 'Guard frequency 121.500 active. All stations, monitoring.'), 2000);
}

// Realistic ATC phraseology pools for varied radio chatter
const _cruisePool = [
  (d) => `Radar contact. ${d.altitude}${d.speed !== '--' ? `, ${d.speed}` : ''}.`,
  () => `Maintain FL350 until advised.`,
  () => `Radar contact, squawk 4521.`,
  () => `Contact approach on 124.35.`,
  () => `Roger, heavy wake turbulence caution.`,
  (d) => `Radar contact, ${d.altitude !== '--' ? d.altitude : 'alt unknown'}. Squawk ident.`,
  () => `Climb and maintain FL410, when able direct WOBUX.`,
];

const _routePool = [
  (d, origin, dest, alt) => `Radar contact. ${origin} / ${dest}${alt}.`,
  (d, origin, dest) => `Cleared ${origin} to ${dest}. Squawk ident.`,
  (d, origin, dest) => `${origin} / ${dest}. Maintain present heading.`,
];

const _climbPool = [
  (d) => `Climbing through ${d.altitude}, ${d.verticalSpeed}.`,
  (d) => `Climb and maintain FL410. ${d.verticalSpeed}.`,
  (d) => `Passing ${d.altitude}, climbing. When able direct.`,
];

const _descendPool = [
  (d) => `Descending through ${d.altitude}, ${d.verticalSpeed}.`,
  (d) => `Descend via STAR, expect runway 25R. ${d.verticalSpeed}.`,
  (d) => `Turn left heading 270, vectors ILS runway 28L. ${d.verticalSpeed}.`,
  (d) => `Cleared ILS runway 09L approach. ${d.altitude}.`,
];

const _lowPool = [
  (d) => `Low altitude. ${d.altitude}. Traffic alert.`,
  (d) => `Hold short runway 27, traffic on final. ${d.altitude}.`,
  (d) => `Wind 280 at 12, cleared to land runway 28R.`,
];

function _pick(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function nekoTrackAircraft(d) {
  if (!d) return;

  const callsign = (d.callsign || d.icao24 || 'UNKNWN').trim();
  const rawAlt = d._rawAlt; // metres
  const status = d.status;
  const origin = d.originCity || d.origin;
  const dest   = d.destCity   || d.destination;

  let text;

  // A3: FIR transition log entry
  if (d._firTransition) {
    text = `Entering ${d._firTo}, ${d._firFL}. Leaving ${d._firFrom}.`;
    addEntry(callsign, text);
    return;
  }

  if (origin && dest) {
    const alt = rawAlt != null ? `, ${d.altitude}` : '';
    text = _pick(_routePool)(d, origin, dest, alt);
  } else if (rawAlt != null && rawAlt < 900 && rawAlt > 10) {
    text = _pick(_lowPool)(d);
  } else if (status === 'CLIMBING') {
    text = _pick(_climbPool)(d);
  } else if (status === 'DESCENDING') {
    text = _pick(_descendPool)(d);
  } else {
    text = _pick(_cruisePool)(d);
  }

  addEntry(callsign, text);
}
