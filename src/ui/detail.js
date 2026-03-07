import { haversineDistance } from '../scene/aircraft.js';
import { getRoute } from '../data/opensky.js';

const panel = document.getElementById('detail-panel');
const elCallsign = document.getElementById('detail-callsign');
const elOrigin = document.getElementById('detail-origin');
const elDest = document.getElementById('detail-dest');
const elAlt = document.getElementById('detail-alt');
const elSpd = document.getElementById('detail-spd');
const elHdg = document.getElementById('detail-hdg');
const elVs = document.getElementById('detail-vs');
const elDistance = document.getElementById('detail-distance');
const elClose = document.getElementById('detail-close');

let selectedAircraft = null;

elClose.addEventListener('click', () => {
  closeDetail();
});

export function showDetail(aircraftObj, userLat, userLon) {
  selectedAircraft = aircraftObj;
  const d = aircraftObj.getDisplayData();

  elCallsign.textContent = d.callsign || d.icao24;

  // Route info from cache
  const route = getRoute(d.callsign);
  if (route && route.origin) {
    elOrigin.textContent = route.origin;
    elDest.textContent = route.destination || '--';
  } else {
    elOrigin.textContent = d.originCountry;
    elDest.textContent = '--';
  }

  elAlt.textContent = d.altitude;
  elSpd.textContent = d.speed;
  elHdg.textContent = d.heading;

  elVs.textContent = `${d.verticalSpeed}  (${d.status.toLowerCase()})`;
  if (d.status === 'CLIMBING') {
    elVs.style.color = '#ff9d4d';
  } else if (d.status === 'DESCENDING') {
    elVs.style.color = '#4db8ff';
  } else {
    elVs.style.color = '';
  }

  if (d.latitude != null && d.longitude != null) {
    const dist = haversineDistance(userLat, userLon, d.latitude, d.longitude);
    elDistance.textContent = `${Math.round(dist)} km from you`;
  } else {
    elDistance.textContent = '-- km from you';
  }

  panel.classList.remove('hidden');
}

export function closeDetail() {
  selectedAircraft = null;
  panel.classList.add('hidden');
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
