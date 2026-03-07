// Fetches real airport and runway data from Overpass API (OpenStreetMap)
// Works for any location worldwide — no hardcoded data needed.

const OVERPASS_ENDPOINTS = [
  '/api/ovp-ru/api/interpreter',
  '/api/ovp-de/api/interpreter',
  '/api/ovp-kumi/api/interpreter',
];
const DEG_TO_RAD = Math.PI / 180;

let cachedData = null;
let fetchPromise = null;

export async function fetchAirportData(centerLat, centerLon, radiusDeg = 1.5) {
  if (cachedData) return cachedData;
  if (fetchPromise) return fetchPromise;
  fetchPromise = _fetchFromOverpass(centerLat, centerLon, radiusDeg);
  try {
    cachedData = await fetchPromise;
    return cachedData;
  } finally {
    fetchPromise = null;
  }
}

async function _fetchFromOverpass(centerLat, centerLon, radiusDeg) {
  const south = (centerLat - radiusDeg).toFixed(4);
  const north = (centerLat + radiusDeg).toFixed(4);
  const west = (centerLon - radiusDeg).toFixed(4);
  const east = (centerLon + radiusDeg).toFixed(4);

  const query = `
[out:json][timeout:30];
(
  way["aeroway"="runway"](${south},${west},${north},${east});
  node["aeroway"="aerodrome"](${south},${west},${north},${east});
  way["aeroway"="aerodrome"](${south},${west},${north},${east});
  relation["aeroway"="aerodrome"](${south},${west},${north},${east});
);
out body geom;
`;

  let lastErr;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      console.log(`[STRATUM] Trying Overpass: ${endpoint}`);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const response = await fetch(endpoint, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      console.log(`[STRATUM] Overpass OK from ${endpoint}`);
      return parseOverpassData(data);
    } catch (err) {
      console.warn(`[STRATUM] Overpass failed (${endpoint}):`, err.message);
      lastErr = err;
    }
  }
  throw lastErr || new Error('All Overpass endpoints failed');
}

function parseOverpassData(data) {
  const airportMap = new Map();
  const runways = [];

  for (const el of data.elements) {
    // Aerodrome nodes/ways/relations
    if (el.tags?.aeroway === 'aerodrome') {
      const iata = el.tags?.iata || '';
      const icao = el.tags?.icao || el.tags?.['icao:code'] || '';
      if (!iata && !icao) continue;

      let lat, lon;
      if (el.type === 'node') {
        lat = el.lat;
        lon = el.lon;
      } else if (el.bounds) {
        lat = (el.bounds.minlat + el.bounds.maxlat) / 2;
        lon = (el.bounds.minlon + el.bounds.maxlon) / 2;
      } else if (el.geometry?.length > 0) {
        lat = el.geometry.reduce((s, n) => s + n.lat, 0) / el.geometry.length;
        lon = el.geometry.reduce((s, n) => s + n.lon, 0) / el.geometry.length;
      } else continue;

      const key = iata || icao;
      if (!airportMap.has(key)) {
        airportMap.set(key, {
          lat, lon,
          name: el.tags?.name || '',
          iata,
          icao,
        });
      }
    }

    // Runway ways
    if (el.type === 'way' && el.tags?.aeroway === 'runway' && el.geometry?.length >= 2) {
      const geom = el.geometry;
      const start = geom[0];
      const end = geom[geom.length - 1];

      // Heading from start→end geometry
      const dLon = (end.lon - start.lon) * Math.cos((start.lat + end.lat) / 2 * DEG_TO_RAD);
      const dLat = end.lat - start.lat;
      let heading = Math.atan2(dLon, dLat) / DEG_TO_RAD;
      if (heading < 0) heading += 360;

      // Length via haversine
      const length = haversine(start.lat, start.lon, end.lat, end.lon);

      runways.push({
        lat: (start.lat + end.lat) / 2,
        lon: (start.lon + end.lon) / 2,
        startLat: start.lat,
        startLon: start.lon,
        endLat: end.lat,
        endLon: end.lon,
        heading,
        length, // meters
        width: parseFloat(el.tags?.width) || 45,
        ref: el.tags?.ref || refFromHeading(heading),
        surface: el.tags?.surface || 'asphalt',
      });
    }
  }

  return { airports: [...airportMap.values()], runways };
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * DEG_TO_RAD;
  const dLon = (lon2 - lon1) * DEG_TO_RAD;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * DEG_TO_RAD) * Math.cos(lat2 * DEG_TO_RAD) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function refFromHeading(heading) {
  const num = Math.round(heading / 10) % 36 || 36;
  const opp = ((num + 18 - 1) % 36) + 1;
  return `${String(num).padStart(2, '0')}/${String(opp).padStart(2, '0')}`;
}

/**
 * Categorize aircraft as arriving or departing relative to an airport.
 * Uses altitude + vertical rate for classification.
 */
export function categorizeFlights(aircraftList, airport, allRunways) {
  const arrivals = [];
  const departures = [];

  // Find runways within 5km of this airport
  const aptRunways = allRunways.filter(r =>
    haversine(r.lat, r.lon, airport.lat, airport.lon) < 5000
  );

  for (const ac of aircraftList) {
    if (ac.latitude == null || ac.longitude == null) continue;
    const dist = haversine(ac.latitude, ac.longitude, airport.lat, airport.lon);
    if (dist > 55000) continue; // >55km, skip

    const vs = ac.verticalRate || 0;
    const alt = ac.baroAltitude || 0;

    if (vs < -0.5 && alt < 4000) {
      arrivals.push(ac);
    } else if (vs > 0.5 && alt < 5000) {
      departures.push(ac);
    } else if (dist < 15000 && alt < 1000) {
      if (vs > 0.3) departures.push(ac);
      else arrivals.push(ac);
    }
  }

  return { arrivals, departures, runways: aptRunways };
}
