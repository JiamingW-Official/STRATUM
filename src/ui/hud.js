import { getLastFetchTime, getPollInterval, isDemo, forcePoll } from '../data/opensky.js';

const hudCount = document.getElementById('hud-count');
const hudLocation = document.getElementById('hud-location');
const hudUpdated = document.getElementById('hud-updated');
const hudAirports = document.getElementById('hud-airports');
const hudLiveText = document.querySelector('.hud-live-text');
const hudLiveDot = document.querySelector('.hud-live-dot');
const hudZulu = document.getElementById('hud-zulu');
const hudClockLabel = document.getElementById('hud-clock-label');

let cityOverride = null;
let prevCount = 0;

export function updateHUDCity(name, code) {
  // Many city names already end in their own code — "New York JFK" — so the
  // prefix would just say it twice. Drop it when the name already carries it.
  const dup = code && new RegExp(`(^|\\s)${code}$`, 'i').test(name.trim());
  cityOverride = code && !dup ? `${code}  ·  ${name}` : name;
  if (hudLocation) hudLocation.textContent = cityOverride;
}

// Animated count-up
let displayCount = 0;
let targetCount = 0;
let countAnimFrame = null;

function animateCount() {
  if (displayCount === targetCount) { countAnimFrame = null; return; }
  const diff = targetCount - displayCount;
  const step = Math.ceil(Math.abs(diff) * 0.2) || 1;
  displayCount += diff > 0 ? Math.min(step, diff) : -Math.min(step, -diff);
  hudCount.textContent = displayCount;
  countAnimFrame = requestAnimationFrame(animateCount);
}

export function updateHUD(aircraftCount, lat, lon) {
  // T1-14: Flash count on change
  if (aircraftCount !== targetCount && hudCount) {
    hudCount.classList.remove('hud-count-up', 'hud-count-down');
    void hudCount.offsetWidth;
    if (aircraftCount > targetCount) hudCount.classList.add('hud-count-up');
    else if (aircraftCount < targetCount) hudCount.classList.add('hud-count-down');
    hudCount.addEventListener('animationend', () => {
      hudCount.classList.remove('hud-count-up', 'hud-count-down');
    }, { once: true });
    targetCount = aircraftCount;
    if (!countAnimFrame) countAnimFrame = requestAnimationFrame(animateCount);
  } else if (aircraftCount !== targetCount) {
    targetCount = aircraftCount;
    if (!countAnimFrame) countAnimFrame = requestAnimationFrame(animateCount);
  }
  if (!cityOverride) {
    hudLocation.textContent = `${lat.toFixed(4)}N  ${lon.toFixed(4)}${lon >= 0 ? 'E' : 'W'}`;
  }

  if (isDemo()) {
    hudLiveText.textContent = 'DEMO';
    hudLiveDot.style.background = '#f59e0b';
    hudLiveDot.style.boxShadow = '0 0 6px #f59e0b';
  } else {
    hudLiveText.textContent = 'LIVE';
    hudLiveDot.style.background = '';
    hudLiveDot.style.boxShadow = '';
  }
}

export function updateHUDAirports(count) {
  if (hudAirports) {
    hudAirports.textContent = count > 0 ? count : '--';
  }
}

// ── UTC / Local time cycling ──
let _utcOffsetSec = 0;
let _tzAbbr = '';
// The clock used to flip itself between UTC and local every 15 seconds, with a
// slide. That was defensible when it was a hero stat with its own label; it is
// not, now that it is the tail of a quiet context line, where the motion pulls
// the eye off the one number this panel is about and jitters the line's width
// twice a minute. It shows Zulu, which is the unit every timestamp in ADS-B
// actually arrives in, and swaps to local only when someone asks it to.
let _showLocal = false;

export function setLocalTimezone(offsetSeconds, abbr) {
  _utcOffsetSec = offsetSeconds || 0;
  _tzAbbr = abbr || '';
}

let _overlayShown = false;
export function updateHUDTimer() {
  const last = getLastFetchTime();
  if (!last) {
    hudUpdated.textContent = 'Connecting...';
  } else {
    const ago = Math.floor((Date.now() - last) / 1000);
    if (isDemo()) {
      hudUpdated.textContent = 'Simulated data';
    } else {
      // "Just now" is noise: it is the answer nineteen times out of twenty and
      // the panel already says LIVE. Only a silence worth noticing gets words,
      // and the LIVE label carries it so nothing new appears to say it.
      hudUpdated.textContent = ago < 8 ? '' : `No fix for ${ago}s`;
      if (hudLiveText) hudLiveText.textContent = ago < 8 ? 'LIVE' : `${ago}s`;
      // The age is the signal indicator: amber past 8s, red past 20s. It is the
      // same element that says "Just now", so nothing new appears to say it.
      hudUpdated.classList.toggle('is-stale', ago >= 8 && ago < 20);
      hudUpdated.classList.toggle('is-dead', ago >= 20);
      // The overlay is decided here, from the same number, on the same tick, so
      // the age line and the overlay can never disagree about how long it has
      // been. Nothing else opens it; a successful poll closes it.
      const sub = document.getElementById('signal-lost-sub');
      if (ago >= 20) {
        if (sub) sub.textContent = `No position fix for ${ago}s. The tracker is up; the data path is not answering.`;
        if (!_overlayShown) { _overlayShown = true; showSignalLost(true); }
      } else if (_overlayShown) {
        _overlayShown = false; showSignalLost(false);
      }
    }
  }

  if (!hudZulu) return;

  const d = new Date();

  if (_showLocal && _utcOffsetSec !== 0) {
    // Local time = UTC + offset
    const localMs = d.getTime() + _utcOffsetSec * 1000;
    const local = new Date(localMs);
    const hh = String(local.getUTCHours()).padStart(2, '0');
    const mm = String(local.getUTCMinutes()).padStart(2, '0');
    hudZulu.textContent = `${hh}:${mm}`;
    if (hudClockLabel) hudClockLabel.textContent = _tzAbbr || 'LCL';
  } else {
    hudZulu.textContent = `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}Z`;
    // The Z already says UTC. "14:41Z UTC" said it twice.
    if (hudClockLabel) hudClockLabel.textContent = '';
  }
}

export function showSignalLost(show) {
  const el = document.getElementById('signal-lost');
  if (isDemo()) {
    el.classList.add('hidden');
    return;
  }
  if (show) {
    el.classList.remove('hidden');
    const retryEl = document.getElementById('signal-lost-retry');
    const interval = getPollInterval();
    retryEl.textContent = `Auto-retrying every ${Math.ceil(interval / 1000)}s...`;
    // Wire retry button once
    const btn = document.getElementById('signal-lost-btn');
    if (btn && !btn._wired) {
      btn._wired = true;
      btn.addEventListener('click', () => {
        btn.textContent = 'Retrying…';
        btn.disabled = true;
        forcePoll();
        setTimeout(() => { btn.textContent = 'Retry Now'; btn.disabled = false; }, 3000);
      });
    }
  } else {
    el.classList.add('hidden');
  }
}


// ── Sky as people / visibility ──
const hudSky = document.getElementById('hud-sky');
// Addressed by id, not by ".hud-sky-line": that class is on three lines now
// and querySelector would silently pick whichever one is written first.
const hudSkyLine = document.getElementById('hud-sky-people-line');
const hudSkyUnseen = document.getElementById('hud-sky-unseen');
// .hud-hero stopped existing when the panel became a grid of tiles and the
// class became .hud-mod--hero. The lookup returned null and the toggle below
// threw on every poll, inside the data path, where the fetch's own catch
// swallowed it as a "Fetch error" -- so updateHUDSky quietly stopped halfway
// and everything after it in handleData never ran at all. Addressed by id
// now, which is the one name that does not move when the layout does.
const hudSkyUnseenLine = document.getElementById('hud-sky-unseen-btn');

/** people: estimated seats overhead; cities: distinct destinations; unseen: LADD/PIA count */
export function updateHUDSky({ people, cities, unseen }) {
  if (!hudSky) return;
  hudSky.classList.remove('hidden');
  const n = people >= 1000 ? `≈${(people / 1000).toFixed(1)}k` : `≈${people}`;
  // Rebuilt from a template every time: routes resolve a few seconds after
  // positions, so the "bound for" clause appears once there is something to say.
  hudSkyLine.innerHTML = cities > 0
    ? `<span id="hud-sky-people" class="inferred" title="Estimated: seats for this aircraft type, not a passenger count">${n}</span> people overhead, bound for <span id="hud-sky-cities">${cities}</span> cities`
    : `<span id="hud-sky-people" class="inferred" title="Estimated: seats for this aircraft type, not a passenger count">${n}</span> people overhead`;
  hudSkyUnseen.textContent = String(unseen);
  hudSkyUnseenLine?.classList.toggle('is-zero', unseen === 0);
}

// The swap is a gesture now, not a timer.
(() => {
  const el = document.getElementById('hud-clock');
  if (!el) return;
  el.addEventListener('click', () => {
    if (_utcOffsetSec === 0) return;
    _showLocal = !_showLocal;
  });
})();
