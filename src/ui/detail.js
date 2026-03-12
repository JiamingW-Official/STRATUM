import { haversineDistance } from '../scene/aircraft.js';
import { fetchRouteNow, getRoute } from '../data/opensky.js';

const panel = document.getElementById('detail-panel');
const elCallsign = document.getElementById('detail-callsign');
const elType = document.getElementById('detail-type');
const elOrigin = document.getElementById('detail-origin');
const elDest = document.getElementById('detail-dest');
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

// Specs elements
const elSpecs = document.getElementById('detail-specs');
const elSpecsDivider = document.getElementById('detail-specs-divider');
const elAircraftName = document.getElementById('detail-aircraft-name');
const elMfr = document.getElementById('detail-mfr');
const elPax = document.getElementById('detail-pax');
const elRange = document.getElementById('detail-range');
const elTracked = document.getElementById('detail-tracked');

let selectedAircraft = null;

elClose.addEventListener('click', () => closeDetail());

export function showDetail(aircraftObj, userLat, userLon) {
  const isNew = selectedAircraft !== aircraftObj;
  selectedAircraft = aircraftObj;
  const d = aircraftObj.getDisplayData();

  elCallsign.textContent = d.callsign || d.icao24;

  if (d.aircraftType) {
    elType.textContent = d.aircraftType;
    elType.style.display = '';
  } else {
    elType.style.display = 'none';
  }

  elOrigin.textContent = d.origin || '---';
  elDest.textContent = d.destination || '---';

  // Fetch route from airplanes.live callsign endpoint when panel first opens for this aircraft
  if (isNew && (!d.origin || !d.destination) && d.callsign) {
    fetchRouteNow(d.callsign).then(() => {
      if (selectedAircraft !== aircraftObj) return;
      const route = getRoute(d.callsign);
      if (route?.origin) elOrigin.textContent = route.origin;
      if (route?.destination) elDest.textContent = route.destination;
      if (route?.origin || route?.destination) {
        const atc = route.origin || route.destination;
        elRadio.classList.remove('hidden');
        elRadio.onclick = () => window.open(`https://www.liveatc.net/search/?icao=${encodeURIComponent(atc)}`, '_blank');
      }
    });
  }

  elAlt.textContent = d.altitude;
  elSpd.textContent = d.speed;
  elHdg.textContent = d.heading;

  elVs.textContent = d.verticalSpeed;
  if (d.status === 'CLIMBING') {
    elVs.style.color = '#f59e0b';
  } else if (d.status === 'DESCENDING') {
    elVs.style.color = '#38bdf8';
  } else {
    elVs.style.color = '';
  }

  elIcao.textContent = d.icao24 || '--';
  elReg.textContent = d.registration || '--';

  // Operator
  if (d.operator) {
    elOperatorRow.classList.remove('hidden');
    elOperator.textContent = d.operator;
  } else {
    elOperatorRow.classList.add('hidden');
  }

  // Aircraft age
  if (d.age != null) {
    elAgeRow.classList.remove('hidden');
    elAge.textContent = `${d.year} (${d.age}y)`;
  } else {
    elAgeRow.classList.add('hidden');
  }

  // ATC radio — show button if we have an airport code
  const atcAirport = d.origin || d.destination;
  if (atcAirport && atcAirport.length >= 3) {
    elRadio.classList.remove('hidden');
    elRadio.onclick = () => {
      window.open(`https://www.liveatc.net/search/?icao=${encodeURIComponent(atcAirport)}`, '_blank');
    };
  } else {
    elRadio.classList.add('hidden');
  }

  // Specs
  if (d.specs) {
    elSpecs.classList.remove('hidden');
    elSpecsDivider.classList.remove('hidden');
    elAircraftName.textContent = d.specs.name;
    elMfr.textContent = d.specs.mfr;
    if (d.specs.cargo) {
      elPax.textContent = 'CARGO';
    } else {
      elPax.textContent = `${d.specs.pax} pax`;
    }
    elRange.textContent = `${d.specs.range.toLocaleString()} nm`;
    elTracked.textContent = d.trackedTime;
  } else {
    elSpecs.classList.add('hidden');
    elSpecsDivider.classList.add('hidden');
    // Still show tracked time in the distance area
  }

  if (d.latitude != null && d.longitude != null) {
    const dist = haversineDistance(userLat, userLon, d.latitude, d.longitude);
    elDistance.textContent = `${Math.round(dist)} km away`;
  } else {
    elDistance.textContent = '-- km away';
  }

  elStatus.textContent = d.status;
  elStatus.className = 'detail-status ' + d.status.toLowerCase();

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
