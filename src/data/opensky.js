// Position APIs (proxied — no CORS from browser)
// Primary: adsb.fi   Fallback: adsb.lol (same format, more permissive limits)
const ADSB_FI_BASE   = '/api/adsbfi/api/v2';
const ADSB_LOL_BASE  = '/api/adsblo/v2';
const ADSBX_BASE     = '/api/adsbx/v2';
const TRACE_BASE     = '/api/trace/data/traces';
const ADSBDB_BASE    = '/api/adsbdb';
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
let _adsbLolPausedUntil = 0;

async function _doFetch(url, pauseRef, label) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const r = await fetch(url, { cache: 'no-store', signal: controller.signal });
    if (r.status === 429) { pauseRef.v = Date.now() + 5000; throw new Error(`${label} 429`); }
    if (!r.ok) throw new Error(`${label} HTTP ${r.status}`);
    return parseAdsbResponse(await r.json());
  } finally {
    clearTimeout(timer);
  }
}

// Race adsb.fi and adsb.lol — whichever isn't paused and responds first wins
async function fetchStates() {
  const lat = userLat.toFixed(4);
  const lon = userLon.toFixed(4);
  const t   = Math.floor(Date.now() / 1000);

  const fiRef  = { v: _adsbFiPausedUntil };
  const lolRef = { v: _adsbLolPausedUntil };

  const candidates = [];
  if (Date.now() >= _adsbFiPausedUntil)
    candidates.push(_doFetch(`${ADSB_FI_BASE}/lat/${lat}/lon/${lon}/dist/${BBOX_RADIUS_NM}?_t=${t}`, fiRef, 'adsb.fi'));
  if (Date.now() >= _adsbLolPausedUntil)
    candidates.push(_doFetch(`${ADSB_LOL_BASE}/lat/${lat}/lon/${lon}/dist/${BBOX_RADIUS_NM}?_t=${t}`, lolRef, 'adsb.lol'));

  if (candidates.length === 0) throw new Error('all sources rate-limited');

  const result = await Promise.any(candidates);
  _adsbFiPausedUntil  = fiRef.v;
  _adsbLolPausedUntil = lolRef.v;
  return result;
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
  if (Date.now() < _adsbFiPausedUntil && Date.now() < _adsbLolPausedUntil) return;
  pollInFlight = true;
  _pollStarted = Date.now();
  try {
    const aircraft = await fetchStates();
    consecutiveErrors = 0;
    lastFetchTime = Date.now();
    if (onDataCallback) onDataCallback(aircraft);

    // Background: bulk-populate route cache (oa/da) from airplanes.live area query
    _enrichRoutesFromAdsbx();

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

// --- Background bulk route enrichment ---
// Called fire-and-forget on every position poll.
// airplanes.live area query returns oa/da for ALL visible aircraft — no per-click
// rate-limit pressure, no separate callsign lookup needed for most aircraft.
let _adsbxRoutePausedUntil = 0;

async function _enrichRoutesFromAdsbx() {
  if (Date.now() < _adsbxRoutePausedUntil) return;
  const lat = userLat.toFixed(4);
  const lon = userLon.toFixed(4);
  try {
    const r = await fetch(`${ADSBX_BASE}/lat/${lat}/lon/${lon}/dist/${BBOX_RADIUS_NM}`, { cache: 'no-store' });
    if (r.status === 429) { _adsbxRoutePausedUntil = Date.now() + 60000; return; }
    if (!r.ok) return;
    const data = await r.json();
    const list = data.ac || data.aircraft || [];
    for (const ac of list) {
      if (!ac.hex || (!ac.oa && !ac.da)) continue;
      const cs = (ac.flight || '').trim();
      if (!cs || cs.length < 3) continue;
      // Don't overwrite a fresh cache entry that already has city names
      const ex = routeCache.get(cs);
      if (ex && ex.fetchedAt > Date.now() - ROUTE_CACHE_TTL && (ex.originCity || ex.destCity)) continue;
      routeCache.set(cs, {
        origin: ac.oa || null, destination: ac.da || null,
        originCity: null, destCity: null, fetchedAt: Date.now(),
      });
    }
  } catch { /* silent — best effort */ }
}

// On-demand city-name enrichment via adsbdb — called when user opens detail panel.
// ICAO codes should already be in the cache from _enrichRoutesFromAdsbx();
// this only upgrades them to city names.
async function fetchRouteAsync(callsign, icao24) {
  routeFetchQueue.add(callsign);
  try {
    // If we still have no ICAO codes, do a targeted hex lookup as last resort
    const before = routeCache.get(callsign);
    if (!before?.origin && !before?.destination && icao24) {
      try {
        const r0 = await fetch(`${ADSBX_BASE}/hex/${icao24}`, { cache: 'no-store' });
        if (r0.ok) {
          const j0 = await r0.json();
          const a0 = (j0.ac || j0.aircraft || [])[0];
          if (a0?.oa || a0?.da) {
            routeCache.set(callsign, {
              origin: a0.oa || null, destination: a0.da || null,
              originCity: null, destCity: null, fetchedAt: Date.now(),
            });
          }
        }
      } catch { /* fall through */ }
    }

    // City-name enrichment via adsbdb (works on Vercel; CORS guard for localhost)
    try {
      const r2 = await fetch(`${ADSBDB_BASE}/v2/callsign/${encodeURIComponent(callsign.trim())}`);
      const ct = r2.headers.get('content-type') || '';
      if (r2.ok && ct.includes('json')) {
        const j2 = await r2.json();
        const fr = j2.response?.flightroute;
        if (fr && (fr.origin || fr.destination)) {
          const ex = routeCache.get(callsign) || {};
          routeCache.set(callsign, {
            origin:      fr.origin?.icao_code        || ex.origin      || null,
            destination: fr.destination?.icao_code   || ex.destination || null,
            originCity:  fr.origin?.municipality     || null,
            destCity:    fr.destination?.municipality || null,
            fetchedAt:   Date.now(),
          });
          return;
        }
      }
    } catch { /* fall through */ }

    // Keep ICAO codes from earlier steps if present
    const after = routeCache.get(callsign);
    if (after?.origin || after?.destination) return;

    // Complete miss — short TTL so next click retries in 30 s
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
  if (entry && Date.now() - entry.fetchedAt < ROUTE_CACHE_TTL) return;

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
