import { haversineDistance } from '../scene/aircraft.js';

const panel = document.getElementById('detail-panel');
const elCallsign = document.getElementById('detail-callsign');
const elType = document.getElementById('detail-type');
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
const elPosition = document.getElementById('detail-position');
const elPos = document.getElementById('detail-pos');
const elCountry = document.getElementById('detail-country');

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

// Distance to destination
const elDtdRow = document.getElementById('detail-dtd-row');
const elDtd = document.getElementById('detail-dtd');

let selectedAircraft = null;

elClose.addEventListener('click', () => closeDetail());

// Flash animation when a numeric value changes

function flashUpdate(el, newText) {
  if (!el) return;
  if (el.textContent === newText) return;
  el.textContent = newText;
  el.classList.remove('flash');
  // Force reflow to restart animation
  void el.offsetWidth;
  el.classList.add('flash');
  // Remove class after animation to allow future flashes
  el.addEventListener('animationend', () => el.classList.remove('flash'), { once: true });
}

export function showDetail(aircraftObj, userLat, userLon) {
  selectedAircraft = aircraftObj;
  const d = aircraftObj.getDisplayData();

  elCallsign.textContent = d.callsign || d.icao24;

  if (d.aircraftType) {
    elType.textContent = d.aircraftType;
    elType.style.display = '';
  } else {
    elType.style.display = 'none';
  }

  // Route banner
  if (d.origin || d.destination) {
    elRoute.classList.remove('hidden');
    elOriginCode.textContent = d.origin || '---';
    elDestCode.textContent = d.destination || '---';
    elOriginCity.textContent = d.originCity || '';
    elDestCity.textContent = d.destCity || '';
    // Show "EST" indicator when route is locally inferred
    if (d.routeEstimated) {
      elRoute.classList.add('estimated');
      elRoute.title = '路由由本地轨迹推断 (estimated)';
    } else {
      elRoute.classList.remove('estimated');
      elRoute.title = '';
    }
  } else {
    elRoute.classList.add('hidden');
  }

  // Altitude with flight level for aviation enthusiasts
  if (d._rawAlt != null) {
    const altFt = Math.round(d._rawAlt * 3.28084);
    const altStr = altFt >= 18000 ? `FL${Math.round(altFt / 100)}` : `${altFt.toLocaleString()} ft`;
    flashUpdate(elAlt, altStr);
  } else {
    flashUpdate(elAlt, '--');
  }
  // Ground speed with Mach number for high-altitude flights
  if (d._rawSpd != null) {
    const kmh = Math.round(d._rawSpd * 3.6);
    const kts = d.gsKts != null ? d.gsKts : Math.round(d._rawSpd * 1.94384);
    flashUpdate(elSpd, `${kts} kts`);
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

  // Extended flight data row (IAS, TAS, Mach, Geometric Alt)
  const hasExtData = d.ias != null || d.tas != null || d.mach != null || d.geoAltFt != null;
  if (hasExtData && elExtGrid) {
    elExtGrid.classList.remove('hidden');
    flashUpdate(elIas, d.ias != null ? `${d.ias} kts` : '--');
    flashUpdate(elTas, d.tas != null ? `${d.tas} kts` : '--');
    flashUpdate(elMach, d.mach != null ? `M${d.mach}` : '--');
    if (d.geoAltFt != null) {
      const geoStr = d.geoAltFt >= 18000 ? `FL${Math.round(d.geoAltFt / 100)}` : `${d.geoAltFt.toLocaleString()} ft`;
      flashUpdate(elGeoAlt, geoStr);
    } else {
      flashUpdate(elGeoAlt, '--');
    }
  } else if (elExtGrid) {
    elExtGrid.classList.add('hidden');
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

  // Transponder & navigation section
  const hasXpdr = d.squawk || d.wakeCat || d.flightPhase || d.navAlt != null || d.rssi != null;
  if (hasXpdr && elXpdr) {
    elXpdr.classList.remove('hidden');
    elXpdrDivider.classList.remove('hidden');

    // Squawk with special code highlighting
    if (d.squawk) {
      elSquawk.textContent = d.squawk;
      // Highlight emergency squawk codes
      if (d.squawk === '7500') {
        elSquawk.style.color = 'var(--descend)';
        elSquawk.title = 'HIJACK';
      } else if (d.squawk === '7600') {
        elSquawk.style.color = '#e8a84c';
        elSquawk.title = 'COMM FAILURE';
      } else if (d.squawk === '7700') {
        elSquawk.style.color = '#ff4444';
        elSquawk.title = 'EMERGENCY';
      } else {
        elSquawk.style.color = '';
        elSquawk.title = '';
      }
    } else {
      elSquawk.textContent = '--';
      elSquawk.style.color = '';
    }

    // Wake turbulence category
    if (d.wakeCat && elWakeRow) {
      elWakeRow.classList.remove('hidden');
      elWake.textContent = d.wakeCat;
    } else if (elWakeRow) {
      elWakeRow.classList.add('hidden');
    }

    // Flight phase
    if (d.flightPhase && elPhaseRow) {
      elPhaseRow.classList.remove('hidden');
      elPhase.textContent = d.flightPhase;
      // Color-code flight phase
      if (d.flightPhase === 'CLIMB' || d.flightPhase === 'INITIAL CLIMB' || d.flightPhase === 'TAKEOFF') {
        elPhase.style.color = 'var(--climb)';
      } else if (d.flightPhase === 'DESCENT' || d.flightPhase === 'APPROACH' || d.flightPhase === 'LANDING') {
        elPhase.style.color = 'var(--descend)';
      } else if (d.flightPhase === 'CRUISE') {
        elPhase.style.color = 'rgba(196,160,88,0.9)';
      } else {
        elPhase.style.color = '';
      }
    } else if (elPhaseRow) {
      elPhaseRow.classList.add('hidden');
    }

    // Selected altitude (autopilot)
    if (d.navAlt != null && elNavAltRow) {
      elNavAltRow.classList.remove('hidden');
      const navStr = d.navAlt >= 18000 ? `FL${Math.round(d.navAlt / 100)}` : `${d.navAlt.toLocaleString()} ft`;
      elNavAlt.textContent = navStr;
    } else if (elNavAltRow) {
      elNavAltRow.classList.add('hidden');
    }

    // Selected heading
    if (d.navHdg != null && elNavHdgRow) {
      elNavHdgRow.classList.remove('hidden');
      elNavHdg.textContent = `${String(d.navHdg).padStart(3, '0')}°`;
    } else if (elNavHdgRow) {
      elNavHdgRow.classList.add('hidden');
    }

    // Signal strength
    if (d.rssi != null && elRssiRow) {
      elRssiRow.classList.remove('hidden');
      elRssi.textContent = `${d.rssi} dBFS`;
    } else if (elRssiRow) {
      elRssiRow.classList.add('hidden');
    }
  } else if (elXpdr) {
    elXpdr.classList.add('hidden');
    elXpdrDivider.classList.add('hidden');
  }

  if (d.latitude != null && d.longitude != null) {
    const dist = haversineDistance(userLat, userLon, d.latitude, d.longitude);
    elDistance.textContent = `${Math.round(dist)} km away`;
  } else {
    elDistance.textContent = '-- km away';
  }

  // Position
  if (d.latitude != null && d.longitude != null) {
    elPosition.classList.remove('hidden');
    const la = `${Math.abs(d.latitude).toFixed(3)}°${d.latitude >= 0 ? 'N' : 'S'}`;
    const lo = `${Math.abs(d.longitude).toFixed(3)}°${d.longitude >= 0 ? 'E' : 'W'}`;
    elPos.textContent = `${la}  ${lo}`;
    elCountry.textContent = d.originCountry || '--';

    // Distance to destination
    if (d.distToDest != null && elDtdRow) {
      elDtdRow.classList.remove('hidden');
      const nm = Math.round(d.distToDest * 0.539957);
      elDtd.textContent = `${d.distToDest} km (${nm} nm)`;
    } else if (elDtdRow) {
      elDtdRow.classList.add('hidden');
    }
  } else {
    elPosition.classList.add('hidden');
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
