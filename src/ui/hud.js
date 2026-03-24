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
  cityOverride = code ? `${code}  ·  ${name}` : name;
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
let _showLocal = false;
let _lastToggle = 0;
const TOGGLE_INTERVAL = 15000; // cycle every 15 seconds

export function setLocalTimezone(offsetSeconds, abbr) {
  _utcOffsetSec = offsetSeconds || 0;
  _tzAbbr = abbr || '';
}

export function updateHUDTimer() {
  const last = getLastFetchTime();
  if (!last) {
    hudUpdated.textContent = 'Connecting...';
  } else {
    const ago = Math.floor((Date.now() - last) / 1000);
    if (isDemo()) {
      hudUpdated.textContent = 'Simulated data';
    } else {
      hudUpdated.textContent = ago < 2 ? 'Just now' : `${ago}s ago`;
    }
  }

  if (!hudZulu) return;

  const now = Date.now();

  // Auto-toggle between UTC and local every TOGGLE_INTERVAL
  if (_utcOffsetSec !== 0 && now - _lastToggle > TOGGLE_INTERVAL) {
    _lastToggle = now;
    const wasLocal = _showLocal;
    _showLocal = !_showLocal;

    // Trigger slide animation
    if (hudZulu) {
      hudZulu.classList.remove('clock-slide-in');
      void hudZulu.offsetWidth;
      hudZulu.classList.add('clock-slide-in');
    }
    if (hudClockLabel) {
      hudClockLabel.classList.remove('clock-slide-in');
      void hudClockLabel.offsetWidth;
      hudClockLabel.classList.add('clock-slide-in');
    }
  }

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
    if (hudClockLabel) hudClockLabel.textContent = 'UTC';
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
