import { getAirportCity } from './airportCities.js';

// Position APIs (proxied — no CORS from browser)
// Primary: adsb.fi (/api/v2/lat/{lat}/lon/{lon}/dist/{nm})
// Fallback: adsb.one (/v2/point/{lat}/{lon}/{nm} — different path format)
const ADSB_FI_BASE   = '/api/adsbfi/api/v2';
const ADSB_ONE_BASE  = '/api/adsboe/v2';
const ADSBX_BASE     = '/api/adsbx/v2';
const OPENSKY_BASE   = '/api/opensky';
const TRACE_BASE     = '/api/trace/data/traces';
const FETCH_TIMEOUT_MS = 3500;
const POLL_INTERVAL  = 3000;   // 3s — stays within user's 4s budget, avoids 429
const BBOX_RADIUS_NM = 100;

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
const TRACK_CACHE_TTL = 900000;    // re-fetch trace every 15 min
const TRACK_RETAIN_TTL = 1800000;  // keep in cache 30 min
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
  const list = data.ac || data.aircraft;
  if (!list || !Array.isArray(list)) return [];
  return list.map(parseAircraft).filter((a) => a != null && a.baroAltitude != null && a.baroAltitude > 100);
}

let _adsbFiPausedUntil  = 0;
let _adsbOnePausedUntil = 0;

async function _doFetch(url, pauseRef, label) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const r = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (r.status === 429) { pauseRef.v = Date.now() + 120000; throw new Error(`${label} 429`); }
    if (!r.ok) throw new Error(`${label} HTTP ${r.status}`);
    return parseAdsbResponse(await r.json());
  } finally {
    clearTimeout(timer);
  }
}

// Position poll: adsb.one primary, adsb.fi fallback only.
// adsb.fi rate limit is reserved entirely for on-demand hex route lookups.
async function fetchStates() {
  const lat = userLat.toFixed(4);
  const lon = userLon.toFixed(4);
  const t   = Math.floor(Date.now() / 1000);

  const oneRef = { v: _adsbOnePausedUntil };

  // Primary: adsb.one (no route data, but stable and no rate limit conflicts)
  if (Date.now() >= _adsbOnePausedUntil) {
    try {
      const result = await _doFetch(`${ADSB_ONE_BASE}/point/${lat}/${lon}/${BBOX_RADIUS_NM}?_t=${t}`, oneRef, 'adsb.one');
      _adsbOnePausedUntil = oneRef.v;
      return result;
    } catch { _adsbOnePausedUntil = oneRef.v; }
  }

  // Fallback: adsb.fi (only when adsb.one is paused)
  const fiRef = { v: _adsbFiPausedUntil };
  if (Date.now() >= _adsbFiPausedUntil) {
    const result = await _doFetch(`${ADSB_FI_BASE}/lat/${lat}/lon/${lon}/dist/${BBOX_RADIUS_NM}?_t=${t}`, fiRef, 'adsb.fi');
    _adsbFiPausedUntil = fiRef.v;
    return result;
  }

  throw new Error('all sources rate-limited');
}

// pollInFlight guard with 5s safety reset to prevent permanent stall
let pollInFlight = false;
let _pollStarted = 0;

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
    const cutoff = now - 1800; // last 30 minutes

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

    if (waypoints.length >= 1) {
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
    // Fire the first batch immediately, then continue every 200ms
    const processBatch = () => {
      const batch = traceQueueBatch.splice(0, 8);
      if (batch.length === 0) {
        clearInterval(traceBatchTimer);
        traceBatchTimer = null;
        return;
      }
      for (const hex of batch) fetchTraceAsync(hex);
    };
    processBatch(); // instant first batch — no 500ms wait
    traceBatchTimer = setInterval(processBatch, 200);
  }
}

// Immediate priority fetch for the aircraft the user just selected.
// Bypasses the batch queue entirely.
export function priorityTraceFetch(icao24) {
  if (!icao24) return;
  if (trackFetchQueue.has(icao24)) return; // already in-flight
  // Remove from the pending queue so we don't double-fetch
  const idx = traceQueueBatch.indexOf(icao24);
  if (idx !== -1) traceQueueBatch.splice(idx, 1);
  fetchTraceAsync(icao24);
}

async function poll() {
  // Safety: force-reset if a previous poll has been stuck for >5s
  if (pollInFlight && Date.now() - _pollStarted > 5000) pollInFlight = false;
  if (pollInFlight) return;
  if (Date.now() < _adsbFiPausedUntil && Date.now() < _adsbOnePausedUntil) return;
  pollInFlight = true;
  _pollStarted = Date.now();
  try {
    const aircraft = await fetchStates();
    consecutiveErrors = 0;
    lastFetchTime = Date.now();
    if (onDataCallback) onDataCallback(aircraft);

    // Populate route cache from poll data — adsb.fi includes oa/da for many flights.
    // This means FROM/TO shows immediately on click without needing a separate API call.
    for (const ac of aircraft) {
      const cs = ac.callsign;
      if (!cs || cs.length < 3 || cs === ac.icao24) continue; // skip if no real callsign
      if (!ac.origin && !ac.destination) continue;            // skip if no route data
      const ex = routeCache.get(cs);
      if (ex && (ex.originCity || ex.destCity)) continue;     // keep city names if present
      routeCache.set(cs, {
        origin: ac.origin || null, destination: ac.destination || null,
        originCity: getAirportCity(ac.origin),
        destCity:   getAirportCity(ac.destination),
        fetchedAt: Date.now(),
      });
    }

    // Queue trace fetches for aircraft that don't have cached tracks
    for (const ac of aircraft) {
      if (ac.icao24) {
        const cached = trackCache.get(ac.icao24);
        if (!cached || Date.now() - cached.fetchedAt > TRACK_CACHE_TTL) {
          queueTraceFetch(ac.icao24);
        }
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

// --- Route fetching ---
// Strategy: position polls use adsb.fi (1s, permissive).
// Route data uses airplanes.live /v2/callsign/{cs} — a targeted single-flight lookup
// that returns oa/da fields without hammering the main area endpoint.

const routeFetchPromises = new Map();
const ROUTE_NULL_TTL = 30000; // 30 s retry window for failed lookups

// On-demand route fetch — called when user opens detail panel.
// adsb.fi rate limit is no longer shared with position poll, so hex lookups are safe.
let _adsbxPausedUntil   = 0;
let _openskyPausedUntil = 0;
let _adsbFiRoutePausedUntil = 0;

async function fetchRouteAsync(callsign, icao24) {
  routeFetchQueue.add(callsign);
  try {
    const before = routeCache.get(callsign);
    const needsCodes = !before?.origin && !before?.destination;

    if (needsCodes) {
      // Three sources in parallel, merge best origin + destination from any
      const [adsbFiResult, openskyResult, adsbxResult] = await Promise.allSettled([
        // Source A: adsb.fi hex — direct FMS broadcast (oa=origin, da=destination)
        // Now safe to call: position poll uses adsb.one, not adsb.fi
        icao24 && Date.now() > _adsbFiRoutePausedUntil
          ? fetch(`${ADSB_FI_BASE}/hex/${encodeURIComponent(icao24)}`, { cache: 'no-store' })
              .then(r => {
                if (r.status === 429) { _adsbFiRoutePausedUntil = Date.now() + 60000; return null; }
                return r.ok ? r.json() : null;
              })
              .then(j => {
                const ac = (j?.ac || [])[0];
                return (ac?.oa || ac?.da) ? { origin: ac.oa || null, destination: ac.da || null } : null;
              })
          : Promise.resolve(null),
        // Source B: OpenSky routes — scheduled route database (both airports when found)
        Date.now() > _openskyPausedUntil
          ? fetch(`${OPENSKY_BASE}/api/routes?callsign=${encodeURIComponent(callsign.trim())}`, { cache: 'no-store' })
              .then(r => {
                if (r.status === 429) { _openskyPausedUntil = Date.now() + 300000; return null; }
                return r.ok ? r.json() : null;
              })
              .then(j => j?.route?.length >= 2 ? { origin: j.route[0], destination: j.route[1] } : null)
          : Promise.resolve(null),
        // Source C: airplanes.live hex — fallback transponder data
        icao24 && Date.now() > _adsbxPausedUntil
          ? fetch(`${ADSBX_BASE}/hex/${encodeURIComponent(icao24)}`, { cache: 'no-store' })
              .then(r => {
                if (r.status === 429) { _adsbxPausedUntil = Date.now() + 30000; return null; }
                return r.ok ? r.json() : null;
              })
              .then(j => {
                const ac = (j?.ac || [])[0];
                return (ac?.oa || ac?.da) ? { origin: ac.oa || null, destination: ac.da || null } : null;
              })
          : Promise.resolve(null),
      ]);

      // Merge: pick best origin AND best destination from any source
      let origin = null, destination = null;
      for (const r of [adsbFiResult, openskyResult, adsbxResult]) {
        const v = r.status === 'fulfilled' ? r.value : null;
        if (!v) continue;
        if (!origin && v.origin) origin = v.origin;
        if (!destination && v.destination) destination = v.destination;
        if (origin && destination) break;
      }

      if (origin || destination) {
        routeCache.set(callsign, { origin, destination, originCity: null, destCity: null, fetchedAt: Date.now() });
      }
    }

    // Resolve city names from local lookup
    const entry = routeCache.get(callsign);
    if (entry?.origin || entry?.destination) {
      routeCache.set(callsign, {
        ...entry,
        originCity: entry.originCity || getAirportCity(entry.origin),
        destCity:   entry.destCity   || getAirportCity(entry.destination),
        fetchedAt:  Date.now(),
      });
      return;
    }

    // Nothing found — short TTL so next click retries after 30 s
    routeCache.set(callsign, {
      origin: null, destination: null, originCity: null, destCity: null,
      fetchedAt: Date.now() - ROUTE_CACHE_TTL + ROUTE_NULL_TTL,
    });
  } finally {
    routeFetchQueue.delete(callsign);
  }
}

// On-demand route fetch — triggered once when user opens detail panel.
export async function fetchRouteNow(callsign, icao24) {
  if (!callsign || callsign.length < 3) return;

  const entry = routeCache.get(callsign);
  const fresh = entry && Date.now() - entry.fetchedAt < ROUTE_CACHE_TTL;
  // Skip only when entry is fresh AND already has city names (or confirmed empty)
  if (fresh && (entry.originCity || entry.destCity || entry.origin === null)) return;

  if (routeFetchPromises.has(callsign)) {
    await routeFetchPromises.get(callsign);
    return;
  }

  const p = fetchRouteAsync(callsign, icao24).finally(() => routeFetchPromises.delete(callsign));
  routeFetchPromises.set(callsign, p);
  await p;
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
