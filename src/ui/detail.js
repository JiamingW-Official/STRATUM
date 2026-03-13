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

// Flash animation when a numeric value changes
function flashUpdate(el, newText) {
  if (el.textContent === newText) return;
  el.textContent = newText;
  el.classList.remove('flash');
  // Force reflow to restart animation
  void el.offsetWidth;
  el.classList.add('flash');
  // Remove class after animation to allow future flashes
  el.addEventListener('animationend', () => el.classList.remove('flash'), { once: true });
}

// Format route endpoint: show city name prominently, ICAO below.
// If only ICAO known, show it at larger size. If nothing, show placeholder.
function fmtAirport(icao, city, el) {
  if (city && icao) {
    // Both available: city as primary, ICAO as secondary
    el.innerHTML = `<span class="route-city">${city}</span><span class="route-icao">${icao}</span>`;
    el.title = `${city} (${icao})`;
  } else if (icao) {
    // Only ICAO
    el.innerHTML = `<span class="route-code-only">${icao}</span>`;
    el.title = icao;
  } else {
    // Nothing known
    el.innerHTML = `<span class="route-placeholder">---</span>`;
    el.title = '';
  }
}

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

  fmtAirport(d.origin, d.originCity, elOrigin);
  fmtAirport(d.destination, d.destCity, elDest);

  // Fetch route when panel first opens, or when city names are missing
  if (isNew && (!d.origin || !d.destination || !d.originCity) && d.callsign) {
    fetchRouteNow(d.callsign, d.icao24).then(() => {
      if (selectedAircraft !== aircraftObj) return;
      const route = getRoute(d.callsign);
      if (route) {
        fmtAirport(route.origin, route.originCity, elOrigin);
        fmtAirport(route.destination, route.destCity, elDest);
      }
      const atcIcao = route?.origin || route?.destination;
      if (atcIcao) {
        elRadio.classList.remove('hidden');
        elRadio.onclick = () => window.open(
          `https://www.liveatc.net/search/?icao=${encodeURIComponent(atcIcao)}`, '_blank'
        );
      }
    });
  }

  flashUpdate(elAlt, d.altitude);
  flashUpdate(elSpd, d.speed);
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

  elIcao.textContent = d.icao24 || '--';
  elReg.textContent = d.registration || '--';

  if (d.operator) {
    elOperatorRow.classList.remove('hidden');
    elOperator.textContent = d.operator;
  } else {
    elOperatorRow.classList.add('hidden');
  }

  if (d.age != null) {
    elAgeRow.classList.remove('hidden');
    elAge.textContent = `${d.year} (${d.age}y)`;
  } else {
    elAgeRow.classList.add('hidden');
  }

  // ATC radio button
  const atcAirport = d.origin || d.destination;
  if (atcAirport && atcAirport.length >= 3) {
    elRadio.classList.remove('hidden');
    elRadio.onclick = () => {
      window.open(`https://www.liveatc.net/search/?icao=${encodeURIComponent(atcAirport)}`, '_blank');
    };
  } else {
    elRadio.classList.add('hidden');
  }

  if (d.specs) {
    elSpecs.classList.remove('hidden');
    elSpecsDivider.classList.remove('hidden');
    elAircraftName.textContent = d.specs.name;
    elMfr.textContent = d.specs.mfr;
    elPax.textContent = d.specs.cargo ? 'CARGO' : `${d.specs.pax} pax`;
    elRange.textContent = `${d.specs.range.toLocaleString()} nm`;
    elTracked.textContent = d.trackedTime;
  } else {
    elSpecs.classList.add('hidden');
    elSpecsDivider.classList.add('hidden');
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
