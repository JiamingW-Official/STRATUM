import { getLastFetchTime, getPollInterval, isDemo } from '../data/opensky.js';

const hudCount = document.getElementById('hud-count');
const hudLocation = document.getElementById('hud-location');
const hudUpdated = document.getElementById('hud-updated');
const hudLiveText = document.querySelector('.hud-live-text');
const hudLiveDot = document.querySelector('.hud-live-dot');

export function updateHUD(aircraftCount, lat, lon) {
  hudCount.textContent = `${aircraftCount} aircraft`;
  hudLocation.textContent = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

  if (isDemo()) {
    hudLiveText.textContent = 'DEMO';
    hudLiveDot.style.background = '#ff9d4d';
  } else {
    hudLiveText.textContent = 'LIVE';
    hudLiveDot.style.background = '';
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
    hudUpdated.textContent = 'Simulated data — API rate limited';
  } else {
    hudUpdated.textContent = `Updated ${ago}s ago`;
  }
}

export function showSignalLost(show) {
  const el = document.getElementById('signal-lost');
  // Don't show signal-lost when demo data is active
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
