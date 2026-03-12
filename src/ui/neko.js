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

export function nekoTrackAircraft(d) {
  if (!d) return;

  const callsign = (d.callsign || d.icao24 || 'UNKNWN').trim();
  const rawAlt = d._rawAlt; // metres
  const status = d.status;
  const origin = d.origin;
  const dest = d.destination;

  let text;

  if (origin && dest) {
    const alt = rawAlt != null ? `, ${d.altitude}` : '';
    text = `Radar contact. ${origin} / ${dest}${alt}.`;
  } else if (rawAlt != null && rawAlt < 900 && rawAlt > 10) {
    text = `Low altitude. ${d.altitude}. Traffic alert.`;
  } else if (status === 'CLIMBING') {
    text = `Climbing through ${d.altitude}, ${d.verticalSpeed}.`;
  } else if (status === 'DESCENDING') {
    text = `Descending through ${d.altitude}, ${d.verticalSpeed}.`;
  } else {
    const spd = d.speed !== '--' ? `, ${d.speed}` : '';
    const alt = d.altitude !== '--' ? d.altitude : 'alt unknown';
    text = `Radar contact. ${alt}${spd}.`;
  }

  addEntry(callsign, text);
}
