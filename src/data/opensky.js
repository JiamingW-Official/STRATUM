// Primary: adsb.fi (free, no auth, no harsh rate limits)
// Fallback: airplanes.live
// Trace history: globe.airplanes.live (full flight path)
const ADSB_FI_BASE = '/api/adsbfi/api/v2';
const ADSBX_BASE = '/api/adsbx/v2';
const TRACE_BASE = '/api/trace/data/traces';
const POLL_INTERVAL = 1000;  // 1s — maximum update rate
const BBOX_RADIUS_NM = 50;

let userLat = 40.7128;
let userLon = -74.0060;
let lastFetchTime = 0;
let pollTimer = null;
let onDataCallback = null;
let onErrorCallback = null;
let consecutiveErrors = 0;

// Route cache
const routeCache = new Map();
const ROUTE_CACHE_TTL = 600000;
const routeFetchQueue = new Set();

// Track cache — stores full trace history per aircraft
const trackCache = new Map();
const TRACK_CACHE_TTL = 420000;    // re-fetch trace every 7 min
const TRACK_RETAIN_TTL = 420000;   // keep in cache 7 min
const trackFetchQueue = new Set();

export function setUserLocation(lat, lon) {
  userLat = lat;
  userLon = lon;
}

export function getUserLocation() {
  return { lat: userLat, lon: userLon };
}

export function isDemo() {
  return false;
}

// --- Parse airplanes.live format ---
function parseAircraft(ac) {
  const alt = ac.alt_baro;
  if (alt === 'ground' || alt == null) return null;
  if (ac.lat == null || ac.lon == null) return null;

  return {
    icao24: ac.hex,
    callsign: (ac.flight || '').trim(),
    originCountry: null,
    timePosition: Math.floor(Date.now() / 1000),
    lastContact: Math.floor(Date.now() / 1000),
    longitude: ac.lon,
    latitude: ac.lat,
    baroAltitude: typeof alt === 'number' ? alt * 0.3048 : null,
    onGround: alt === 'ground',
    velocity: ac.gs != null ? ac.gs * 0.514444 : null,
    trueTrack: ac.track,
    verticalRate: ac.baro_rate != null ? ac.baro_rate * 0.00508 : null,
    geoAltitude: ac.alt_geom != null ? ac.alt_geom * 0.3048 : null,
    category: ac.category,
    registration: ac.r,
    aircraftType: ac.t,
    origin: ac.oa || null,
    destination: ac.da || null,
    operator: ac.ownOp || null,
    year: ac.year || null,
    typeDesc: ac.desc || null,
  };
}

// --- Fetch aircraft positions ---
function parseAdsbResponse(data) {
  // adsb.fi uses "aircraft", airplanes.live uses "ac"
  const list = data.ac || data.aircraft;
  if (!list || !Array.isArray(list)) return [];
  return list
    .map(parseAircraft)
    .filter((a) => a != null && a.baroAltitude != null && a.baroAltitude > 100);
}

async function fetchFromAdsbFi() {
  const url = `${ADSB_FI_BASE}/lat/${userLat.toFixed(4)}/lon/${userLon.toFixed(4)}/dist/${BBOX_RADIUS_NM}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`adsb.fi HTTP ${response.status}`);
  return parseAdsbResponse(await response.json());
}

async function fetchFromAdsbx() {
  const url = `${ADSBX_BASE}/point/${userLat.toFixed(4)}/${userLon.toFixed(4)}/${BBOX_RADIUS_NM}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`airplanes.live HTTP ${response.status}`);
  return parseAdsbResponse(await response.json());
}

// airplanes.live as sole primary — has oa/da route fields built in
// adsb.fi only as fallback when airplanes.live fails
let pollInFlight = false;

async function fetchStates() {
  try {
    return await fetchFromAdsbx();
  } catch (err) {
    console.warn('[Data] airplanes.live failed, trying adsb.fi:', err.message);
    return await fetchFromAdsbFi();
  }
}

// --- Trace fetching (globe.airplanes.live) ---
// Returns waypoints: [{latitude, longitude, baroAltitude, time}, ...]

async function fetchTraceAsync(icao24) {
  if (trackFetchQueue.has(icao24)) return;
  trackFetchQueue.add(icao24);

  try {
    // URL format: /data/traces/{last2hex}/trace_full_{hex}.json
    const suffix = icao24.slice(-2);
    const url = `${TRACE_BASE}/${suffix}/trace_full_${icao24}.json`;
    const response = await fetch(url);
    if (!response.ok) return;

    const data = await response.json();
    if (!data.trace || !Array.isArray(data.trace)) return;

    const baseTime = data.timestamp || 0;
    const now = Date.now() / 1000;
    const cutoff = now - 420; // last 7 minutes

    const waypoints = [];
    for (const pt of data.trace) {
      // trace format: [offset_seconds, lat, lon, alt_baro, ...]
      const time = baseTime + pt[0];
      if (time < cutoff) continue;

      const lat = pt[1];
      const lon = pt[2];
      const alt = pt[3];
      if (lat == null || lon == null || alt == null || alt === 'ground') continue;

      waypoints.push({
        latitude: lat,
        longitude: lon,
        baroAltitude: alt * 0.3048, // feet → meters
        time: time,
      });
    }

    if (waypoints.length >= 2) {
      trackCache.set(icao24, {
        path: waypoints,
        fetchedAt: Date.now(),
      });
    }
  } catch {
    // silently fail — trace is best-effort
  } finally {
    trackFetchQueue.delete(icao24);
  }
}

// --- Polling ---

let traceQueueBatch = [];
let traceBatchTimer = null;

function queueTraceFetch(icao24) {
  if (trackCache.has(icao24) || trackFetchQueue.has(icao24)) return;
  if (traceQueueBatch.includes(icao24)) return;
  traceQueueBatch.push(icao24);

  if (!traceBatchTimer) {
    // Process trace fetches in small batches to avoid hammering the server
    traceBatchTimer = setInterval(() => {
      const batch = traceQueueBatch.splice(0, 20);
      if (batch.length === 0) {
        clearInterval(traceBatchTimer);
        traceBatchTimer = null;
        return;
      }
      for (const hex of batch) {
        fetchTraceAsync(hex);
      }
    }, 150);
  }
}

async function poll() {
  if (pollInFlight) return; // skip if previous request still pending
  pollInFlight = true;
  try {
    const aircraft = await fetchStates();
    consecutiveErrors = 0;
    lastFetchTime = Date.now();
    if (onDataCallback) onDataCallback(aircraft);

    // Queue trace fetches for aircraft that don't have cached tracks
    // Queue route lookups ONLY for aircraft missing origin/destination from API
    for (const ac of aircraft) {
      if (ac.icao24) {
        const cached = trackCache.get(ac.icao24);
        if (!cached || Date.now() - cached.fetchedAt > TRACK_CACHE_TTL) {
          queueTraceFetch(ac.icao24);
        }
      }
      if (ac.callsign && !ac.origin && !ac.destination) {
        queueRouteFetch(ac.callsign);
      }
    }
  } catch (err) {
    consecutiveErrors++;
    console.error('[Data] Fetch error:', err.message, `(${consecutiveErrors})`);
    if (onErrorCallback) onErrorCallback(err, consecutiveErrors);
  } finally {
    pollInFlight = false;
  }
}

export function startPolling(onData, onError) {
  onDataCallback = onData;
  onErrorCallback = onError;
  poll();
  pollTimer = setInterval(poll, POLL_INTERVAL);
}

export function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

export function getLastFetchTime() {
  return lastFetchTime;
}

export function getPollInterval() {
  return POLL_INTERVAL;
}

// --- Route fetching (adsbdb.com) ---
// Concurrent parallel fetching for fast loading

const ADSBDB_BASE = '/api/adsbdb/v0';
const ROUTE_CONCURRENCY = 20;
let routeBurstRunning = false;
const routePendingQueue = [];

async function fetchRouteAsync(callsign) {
  routeFetchQueue.add(callsign);
  try {
    const response = await fetch(`${ADSBDB_BASE}/callsign/${encodeURIComponent(callsign)}`);
    if (response.ok) {
      const data = await response.json();
      const fr = data?.response?.flightroute;
      if (fr && fr.origin && fr.destination) {
        routeCache.set(callsign, {
          origin: fr.origin.iata_code || fr.origin.icao_code || null,
          destination: fr.destination.iata_code || fr.destination.icao_code || null,
          originName: fr.origin.name || null,
          destName: fr.destination.name || null,
          fetchedAt: Date.now(),
        });
      } else {
        routeCache.set(callsign, { origin: null, destination: null, fetchedAt: Date.now() });
      }
    }
  } catch {
    // silently fail
  } finally {
    routeFetchQueue.delete(callsign);
  }
}

async function drainRouteQueue() {
  if (routeBurstRunning) return;
  routeBurstRunning = true;
  while (routePendingQueue.length > 0) {
    const chunk = routePendingQueue.splice(0, ROUTE_CONCURRENCY);
    await Promise.all(chunk.map(cs => fetchRouteAsync(cs)));
  }
  routeBurstRunning = false;
}

export function queueRouteFetch(callsign) {
  if (!callsign || callsign.length < 3) return;
  const entry = routeCache.get(callsign);
  if (entry && Date.now() - entry.fetchedAt < ROUTE_CACHE_TTL) return;
  if (routeFetchQueue.has(callsign) || routePendingQueue.includes(callsign)) return;
  routePendingQueue.push(callsign);
  drainRouteQueue();
}

export function getRoute(callsign) {
  if (!callsign) return null;
  const entry = routeCache.get(callsign);
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > ROUTE_CACHE_TTL) {
    routeCache.delete(callsign);
    return null;
  }
  return entry;
}

// --- Track data ---

export function getTrack(icao24) {
  if (!icao24) return null;
  const entry = trackCache.get(icao24);
  if (!entry || !entry.path) return null;
  if (Date.now() - entry.fetchedAt > TRACK_RETAIN_TTL) {
    trackCache.delete(icao24);
    return null;
  }
  return entry.path;
}

export function getTrackVersion(icao24) {
  if (!icao24) return 0;
  const entry = trackCache.get(icao24);
  if (!entry || !entry.path) return 0;
  return entry.fetchedAt;
}
