// Fetches real airport and runway data from Overpass API (OpenStreetMap)
// Works for any location worldwide — no hardcoded data needed.

const OVERPASS_ENDPOINTS = [
  '/api/ovp-de/api/interpreter',
  '/api/ovp-kumi/api/interpreter',
];
const DEG_TO_RAD = Math.PI / 180;

let cachedData = null;
let fetchPromise = null;
let _epoch = 0; // incremented on clear; prevents stale in-flight fetch from writing back
let _activeController = null; // AbortController for the in-flight Worker fetch

export function clearAirportCache() {
  _epoch++;
  cachedData = null;
  fetchPromise = null;
  // Cancel any in-flight network request immediately
  if (_activeController) { _activeController.abort(); _activeController = null; }
}

export async function fetchAirportData(centerLat, centerLon, radiusDeg = 1.5) {
  if (cachedData) return cachedData;
  if (fetchPromise) return fetchPromise;
  const myEpoch = _epoch;
  fetchPromise = _fetchFromOverpass(centerLat, centerLon, radiusDeg);
  try {
    const result = await fetchPromise;
    // Only write cache if no clearAirportCache() was called while we were fetching
    if (_epoch === myEpoch) cachedData = result;
    return result;
  } finally {
    if (_epoch === myEpoch) fetchPromise = null;
  }
}

// localStorage cache key for Overpass results (keyed by rounded lat/lon)
function _cacheKey(lat, lon) {
  return `stratum:apt:${lat.toFixed(1)}:${lon.toFixed(1)}`;
}

function _loadFromCache(lat, lon) {
  try {
    const raw = localStorage.getItem(_cacheKey(lat, lon));
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    // Cache valid for 7 days — airport geometry rarely changes
    if (Date.now() - ts > 604800000) { localStorage.removeItem(_cacheKey(lat, lon)); return null; }
    return data;
  } catch { return null; }
}

function _saveToCache(lat, lon, data) {
  try {
    localStorage.setItem(_cacheKey(lat, lon), JSON.stringify({ ts: Date.now(), data }));
  } catch { /* quota exceeded — ignore */ }
}

async function _fetchFromOverpass(centerLat, centerLon, radiusDeg) {
  // 0. Consume speculative early fetch if coords are near the NYC default pre-warmed in index.html
  const earlyP = window._earlyAirports;
  if (earlyP && Math.abs(centerLat - 40.7128) < 0.5 && Math.abs(centerLon - (-74.006)) < 0.5) {
    window._earlyAirports = null;
    try {
      const earlyData = await earlyP;
      if (earlyData) {
        console.log('[STRATUM] Airport data from speculative early fetch');
        const result = parseOverpassData(earlyData);
        _saveToCache(centerLat, centerLon, result);
        return result;
      }
    } catch { /* fall through */ }
  }

  // 1. Check localStorage cache first — instant
  const cached = _loadFromCache(centerLat, centerLon);
  if (cached) {
    console.log('[STRATUM] Airport data from localStorage cache');
    return cached;
  }

  // 2. Race Worker (edge-cached 24h) against direct Overpass in parallel.
  //    Worker starts immediately; Overpass fires after 1.5 s — covers Worker outages
  //    while not wasting Overpass bandwidth when the Worker responds quickly.
  _activeController = new AbortController();

  const workerFetch = fetch(`/api/airports?lat=${centerLat}&lon=${centerLon}&r=${radiusDeg}`, {
    signal: _activeController.signal,
  }).then(async res => {
    if (!res.ok) throw new Error(`Worker HTTP ${res.status}`);
    const hit = res.headers.get('X-Cache');
    console.log(`[STRATUM] Airport data from Worker (${hit || 'MISS'})`);
    return parseOverpassData(await res.json());
  });

  let _directTimer = null;
  const overpassFetch = new Promise((resolve, reject) => {
    _directTimer = setTimeout(() => {
      _raceOverpass(centerLat, centerLon, radiusDeg)
        .then(data => { console.log('[STRATUM] Airport data from Overpass direct'); resolve(parseOverpassData(data)); })
        .catch(reject);
    }, 300); // was 1500 — Worker responds in <100ms when cached; fire Overpass after 300ms not 1.5s
  });

  try {
    const result = await Promise.any([workerFetch, overpassFetch]);
    clearTimeout(_directTimer);
    _activeController?.abort();
    _activeController = null;
    _saveToCache(centerLat, centerLon, result);
    return result;
  } catch {
    clearTimeout(_directTimer);
    _activeController = null;
    console.warn('[STRATUM] All airport data sources failed');
    return { airports: [], runways: [], taxiways: [], terminals: [] };
  }
}

/** Race all Overpass mirrors with POST; returns raw JSON or throws */
async function _raceOverpass(centerLat, centerLon, radiusDeg) {
  const south = (centerLat - radiusDeg).toFixed(4);
  const north = (centerLat + radiusDeg).toFixed(4);
  const west = (centerLon - radiusDeg).toFixed(4);
  const east = (centerLon + radiusDeg).toFixed(4);

  const query = `
[out:json][timeout:15];
(
  way["aeroway"="runway"](${south},${west},${north},${east});
  way["aeroway"="taxiway"](${south},${west},${north},${east});
  way["aeroway"="terminal"](${south},${west},${north},${east});
  node["aeroway"="aerodrome"](${south},${west},${north},${east});
  way["aeroway"="aerodrome"](${south},${west},${north},${east});
  relation["aeroway"="aerodrome"](${south},${west},${north},${east});
);
out body geom;
`;
  const body = `data=${encodeURIComponent(query)}`;
  const racePromises = OVERPASS_ENDPOINTS.map(endpoint => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    return fetch(endpoint, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: controller.signal,
    }).then(async res => {
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log(`[STRATUM] Overpass OK from ${endpoint}`);
      return data;
    }).catch(err => {
      clearTimeout(timer);
      throw err;
    });
  });

  try {
    return await Promise.any(racePromises);
  } catch {
    throw new Error('All Overpass endpoints failed');
  }
}

function parseOverpassData(data) {
  const airportMap = new Map();
  const runways = [];
  const taxiways = [];
  const terminals = [];

  if (!data || !Array.isArray(data.elements)) {
    console.warn('[STRATUM] Overpass response missing elements array');
    return { airports: [], runways: [], taxiways: [], terminals: [] };
  }

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

    // Taxiway ways
    if (el.type === 'way' && el.tags?.aeroway === 'taxiway' && el.geometry?.length >= 2) {
      taxiways.push({
        ref: el.tags?.ref || '',
        width: parseFloat(el.tags?.width) || 20,
        geometry: el.geometry.map(n => ({ lat: n.lat, lon: n.lon })),
      });
    }

    // Terminal buildings
    if (el.type === 'way' && el.geometry?.length >= 3 &&
        (el.tags?.aeroway === 'terminal' || (el.tags?.building && el.tags?.aeroway))) {
      terminals.push({
        name: el.tags?.name || '',
        geometry: el.geometry.map(n => ({ lat: n.lat, lon: n.lon })),
      });
    }
  }

  return { airports: [...airportMap.values()], runways, taxiways, terminals };
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

  // Precompute both ends of each runway heading for track-alignment check.
  // Both 090° and 270° are valid for a 09/27 runway (aircraft approach from either end).
  const rwyHeadings = aptRunways.flatMap(r => [r.heading % 360, (r.heading + 180) % 360]);

  // True if the aircraft's track aligns with any runway (±35° tolerance).
  // Returns true when runway data is absent — erring toward inclusion.
  const trackAlignsRunway = (trackDeg) => {
    if (rwyHeadings.length === 0 || trackDeg == null) return true;
    return rwyHeadings.some(h => {
      const diff = Math.abs(((trackDeg - h) + 360) % 360);
      return diff < 35 || diff > 325; // ±35°
    });
  };

  for (const ac of aircraftList) {
    if (ac.latitude == null || ac.longitude == null) continue;

    const dist = haversine(ac.latitude, ac.longitude, airport.lat, airport.lon);
    if (dist > 52000) continue; // > ~28 nm — outside realistic terminal area

    // All values in SI units: altM in meters, vs in m/s (negative = descending)
    const vs  = ac.verticalRate || 0;
    const altM = ac.baroAltitude ?? ac.geoAltitude ?? 0;
    const track = ac.trueTrack;

    if (dist < 8000) {
      // ── Zone A (< 8 km / ~4 nm): very close — final approach or initial climb.
      // Threshold is loose; any low, moving aircraft near the airport counts.
      if (altM < 1200 && vs < -0.3) arrivals.push(ac);
      else if (altM < 2000 && vs > 0.3) departures.push(ac);
    } else if (dist < 25000) {
      // ── Zone B (8–25 km / ~4–14 nm): inner approach/departure corridor.
      // Require 300 ft/min vs AND runway-aligned track to exclude overflights.
      if (altM < 3000 && vs < -1.5 && trackAlignsRunway(track)) arrivals.push(ac);
      else if (altM < 3500 && vs > 1.5 && trackAlignsRunway(track)) departures.push(ac);
    } else {
      // ── Zone C (25–52 km / ~14–28 nm): outer funnel.
      // Need strong vs (≥ 500 ft/min) plus runway alignment to avoid false matches.
      if (altM < 4500 && vs < -2.5 && trackAlignsRunway(track)) arrivals.push(ac);
      else if (altM < 4500 && vs > 2.5 && trackAlignsRunway(track)) departures.push(ac);
    }
  }

  return { arrivals, departures, runways: aptRunways };
}

/**
 * Background-prefetch airport data for a list of cities.
 * Only fetches cities that aren't already in localStorage cache.
 * Uses the /api/airports/batch endpoint so the Worker runs all lookups
 * in parallel — one HTTP round-trip per 20 cities instead of 20 individual calls.
 * @param {Array<{lat:number, lon:number}>} cities
 */
export function prefetchAirportData(cities) {
  const uncached = cities.filter(c => !_loadFromCache(c.lat, c.lon));
  if (uncached.length === 0) return;
  console.log(`[STRATUM] Prefetching airport data for ${uncached.length} cities`);
  let i = 0;
  const BATCH = 25;  // Worker runs all in parallel — one HTTP call covers 25 cities
  const nextBatch = () => {
    if (i >= uncached.length) return;
    const batch = uncached.slice(i, i + BATCH);
    i += BATCH;
    _prefetchBatch(batch).then(nextBatch);
  };
  nextBatch();
}

// Prefetch via batch endpoint: one HTTP request → Worker runs all in parallel
async function _prefetchBatch(cities) {
  const locsParam = cities.map(c => `${c.lat},${c.lon}`).join('|');
  try {
    const res = await fetch(`/api/airports/batch?locs=${encodeURIComponent(locsParam)}`, {
      signal: AbortSignal.timeout(28000),
    });
    if (res.ok) {
      const data = await res.json();
      for (const [key, rawResult] of Object.entries(data)) {
        if (!rawResult) continue;
        const [latStr, lonStr] = key.split(',');
        const lat = parseFloat(latStr), lon = parseFloat(lonStr);
        const parsed = parseOverpassData(rawResult);
        _saveToCache(lat, lon, parsed);
      }
      return;
    }
  } catch { /* batch endpoint unavailable — fall through */ }

  // Fallback: individual requests (dev mode / batch endpoint unavailable)
  await Promise.allSettled(cities.map(c => _prefetchSingle(c.lat, c.lon)));
}

// Prefetch single city: try Worker first, fall back to Overpass directly
async function _prefetchSingle(lat, lon) {
  const cached = _loadFromCache(lat, lon);
  if (cached) return cached;

  try {
    const res = await fetch(`/api/airports?lat=${lat}&lon=${lon}&r=1.2`, {
      signal: AbortSignal.timeout(12000),
    });
    if (res.ok) {
      const data = await res.json();
      const result = parseOverpassData(data);
      _saveToCache(lat, lon, result);
      return result;
    }
  } catch { /* Worker unavailable — fall through */ }

  // Fallback: direct Overpass
  const data = await _raceOverpass(lat, lon, 1.2);
  const result = parseOverpassData(data);
  _saveToCache(lat, lon, result);
  return result;
}
