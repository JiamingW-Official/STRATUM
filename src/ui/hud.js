import { getLastFetchTime, getPollInterval, isDemo } from '../data/opensky.js';

const hudCount = document.getElementById('hud-count');
const hudLocation = document.getElementById('hud-location');
const hudUpdated = document.getElementById('hud-updated');
const hudAirports = document.getElementById('hud-airports');
const hudLiveText = document.querySelector('.hud-live-text');
const hudLiveDot = document.querySelector('.hud-live-dot');

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
  if (aircraftCount !== targetCount) {
    targetCount = aircraftCount;
    if (!countAnimFrame) countAnimFrame = requestAnimationFrame(animateCount);
  }
  hudLocation.textContent = `${lat.toFixed(4)}N  ${lon.toFixed(4)}${lon >= 0 ? 'E' : 'W'}`;

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

export function updateHUDTimer() {
  const last = getLastFetchTime();
  if (!last) {
    hudUpdated.textContent = 'Connecting...';
    return;
  }
  const ago = Math.floor((Date.now() - last) / 1000);
  if (isDemo()) {
    hudUpdated.textContent = 'Simulated data';
  } else {
    hudUpdated.textContent = ago < 2 ? 'Just now' : `${ago}s ago`;
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
    retryEl.textContent = `Retrying every ${Math.ceil(interval / 1000)}s...`;
  } else {
    el.classList.add('hidden');
  }
}
