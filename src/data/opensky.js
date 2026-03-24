import { getAirportCity } from './airportCities.js';
import { batchUpdate as inferBatchUpdate, cleanupStale as inferCleanup, feedTrace as inferFeedTrace } from './routeInfer.js';

// Position APIs (proxied — no CORS from browser)
const ADSB_FI_BASE   = '/api/adsbfi/api/v2';
const ADSB_ONE_BASE  = '/api/adsboe/v2';
const ADSBX_BASE     = '/api/adsbx/v2';
const OPENSKY_BASE   = '/api/opensky';
const ADSBDB_BASE    = '/api/adsbdb/v0';
const TRACE_BASE     = '/api/trace/data/traces';
const FETCH_TIMEOUT_MS = 6000;
const POLL_INTERVAL  = 2000;   // 2s — fresher positions for smoother trails
const POLL_INTERVAL_BG = 8000;  // 8s when tab hidden
const BBOX_RADIUS_NM = 100;

let userLat = 40.7128;
let userLon = -74.0060;
let lastFetchTime = 0;
let pollTimer = null;
let onDataCallback = null;
let onErrorCallback = null;
let consecutiveErrors = 0;
let _tabVisible = true;

// ── Geo-validation helpers ─────────────────────────────────────────────────
// Validate that a reported origin/destination actually makes sense given the
// aircraft's current position, heading, and progress along the route.
// Returns: 'HIGH' | 'MEDIUM' | 'LOW' | 'INVALID' | 'UNVALIDATED'
const _GVR = Math.PI / 180;
function _hvKm(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * _GVR, dLon = (lon2 - lon1) * _GVR;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*_GVR)*Math.cos(lat2*_GVR)*Math.sin(dLon/2)**2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function _brDeg(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * _GVR;
  const y = Math.sin(dLon) * Math.cos(lat2 * _GVR);
  const x = Math.cos(lat1*_GVR)*Math.sin(lat2*_GVR) - Math.sin(lat1*_GVR)*Math.cos(lat2*_GVR)*Math.cos(dLon);
  return ((Math.atan2(y, x) / _GVR) + 360) % 360;
}
function _geoValidateRoute(originCode, destCode, acLat, acLon, trueTrack) {
  if (!originCode || !destCode || acLat == null || acLon == null) return 'UNVALIDATED';
  const findCity = window._findCityByCode;
  if (typeof findCity !== 'function') return 'UNVALIDATED';
  const oCity = findCity(originCode);
  const dCity = findCity(destCode);
  if (!oCity || !dCity) return 'UNVALIDATED';
  const totalKm  = _hvKm(oCity.lat, oCity.lon, dCity.lat, dCity.lon);
  if (totalKm < 50) return 'UNVALIDATED'; // too short to validate meaningfully
  const fromOrig = _hvKm(oCity.lat, oCity.lon, acLat, acLon);
  const toDest   = _hvKm(acLat, acLon, dCity.lat, dCity.lon);
  const progress  = fromOrig / totalKm;
  const deviation = (fromOrig + toDest) / totalKm - 1.0;
  const progressOk = progress >= -0.05 && progress <= 1.12;
  const deviOk     = deviation <= 0.22;
  // Bearing check: only useful when aircraft is >80km from destination
  let bearingOk = toDest <= 80;
  if (!bearingOk && trueTrack != null) {
    const diff = Math.abs(((trueTrack - _brDeg(acLat, acLon, dCity.lat, dCity.lon)) + 360) % 360);
    bearingOk = (diff > 180 ? 360 - diff : diff) < 80;
  }
  if (progressOk && deviOk && bearingOk) return 'HIGH';
  if (progressOk && deviOk) return 'MEDIUM';
  if (progressOk || (deviOk && bearingOk)) return 'LOW';
  return 'INVALID';
}

// Route cache
const routeCache = new Map();
const ROUTE_CACHE_TTL = 600000;
const routeFetchQueue = new Set();

// Track cache — stores full trace history per aircraft
const trackCache = new Map();
const TRACK_CACHE_TTL = 120000;    // re-fetch trace every 2 min for accurate trajectories
const TRACK_RETAIN_TTL = 600000;   // keep in cache 10 min
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
    squawk: ac.squawk || null,
    rssi: ac.rssi != null ? ac.rssi : null,
    navAltitude: ac.nav_altitude != null ? ac.nav_altitude * 0.3048 : null,
    navHeading: ac.nav_heading != null ? ac.nav_heading : null,
    ias: ac.ias != null ? ac.ias : null,
    tas: ac.tas != null ? ac.tas : null,
    mach: ac.mach != null ? ac.mach : null,
    emergency: ac.emergency || null,
    groundSpeed: ac.gs != null ? ac.gs : null,
    seenPos: ac.seen_pos != null ? ac.seen_pos : null,
  };
}

// --- Fetch aircraft positions ---
function parseAdsbResponse(data) {
  const list = data.ac || data.aircraft;
  if (!list || !Array.isArray(list)) return [];
  const parsed = list.map(parseAircraft).filter((a) => a != null && a.baroAltitude != null && a.baroAltitude > 30);

  // Pre-seed route cache from API oa/da fields.
  // Geo-validate first — ADS-B oa/da can reflect stale or misassigned routes.
  for (const ac of parsed) {
    if (!ac.callsign || (!ac.origin && !ac.destination)) continue;
    if (routeCache.has(ac.callsign)) continue;
    const confidence = _geoValidateRoute(ac.origin, ac.destination, ac.latitude, ac.longitude, ac.trueTrack);
    if (confidence === 'INVALID') continue; // clearly wrong — skip, wait for adsbdb
    routeCache.set(ac.callsign, {
      origin: ac.origin,
      destination: ac.destination,
      originCity: getAirportCity(ac.origin),
      destCity: getAirportCity(ac.destination),
      airline: null,
      confidence,
      source: 'ADS-B',
      fetchedAt: Date.now(),
    });
  }

  return parsed;
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

// Primary: Worker /api/positions — fetches all 3 sources in parallel at the edge,
// merges by hex, returns best-of data in one round trip.
// Fallback: direct adsb.one if Worker is down.
async function fetchStates() {
  const lat = userLat.toFixed(4);
  const lon = userLon.toFixed(4);

  // Primary: Worker multi-source aggregation
  // Reuse speculative boot fetch from index.html — consume ONCE then clear
  try {
    const earlyP = window._earlyBoot;
    if (earlyP) {
      window._earlyBoot = null; // consume once — don't reuse stale NYC data on city switch
      const boot = await earlyP;
      if (boot?.positions) return parseAdsbResponse(boot.positions);
    }
    const r = await fetch(`/api/positions?lat=${lat}&lon=${lon}&r=${BBOX_RADIUS_NM}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (r.ok) return parseAdsbResponse(await r.json());
  } catch { /* fall through to direct sources */ }

  // Fallback: direct adsb.one
  const t = Math.floor(Date.now() / 1000);
  const oneRef = { v: _adsbOnePausedUntil };
  if (Date.now() >= _adsbOnePausedUntil) {
    try {
      const result = await _doFetch(`${ADSB_ONE_BASE}/point/${lat}/${lon}/${BBOX_RADIUS_NM}?_t=${t}`, oneRef, 'adsb.one');
      _adsbOnePausedUntil = oneRef.v;
      return result;
    } catch { _adsbOnePausedUntil = oneRef.v; }
  }

  // Last resort: adsb.fi
  const fiRef = { v: _adsbFiPausedUntil };
  if (Date.now() >= _adsbFiPausedUntil) {
    const result = await _doFetch(`${ADSB_FI_BASE}/lat/${lat}/lon/${lon}/dist/${BBOX_RADIUS_NM}?_t=${t}`, fiRef, 'adsb.fi');
    _adsbFiPausedUntil = fiRef.v;
    return result;
  }

  throw new Error('all sources unavailable');
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
    const response = await fetch(url, { signal: AbortSignal.timeout(12000) });
    if (!response.ok) return;

    const data = await response.json();
    if (!data.trace || !Array.isArray(data.trace)) return;

    const baseTime = data.timestamp || 0;
    const now = Date.now() / 1000;
    const cutoff = now - 1800; // last 30 minutes

    const waypoints = [];
    for (const pt of data.trace) {
      // trace format: [offset_seconds, lat, lon, alt_baro, alt_geom, ...]
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

      // Feed trace waypoints into the inference engine for origin detection.
      // Traces often contain the departure at low altitude — data we'd never
      // see from live polling if the aircraft entered our range at cruise.
      inferFeedTrace(icao24, waypoints, null);
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
    // Fire first batch immediately, then continue every 400ms — 8 per batch
    const processBatch = () => {
      const batch = traceQueueBatch.splice(0, 8);
      if (batch.length === 0) {
        clearInterval(traceBatchTimer);
        traceBatchTimer = null;
        return;
      }
      for (const hex of batch) fetchTraceAsync(hex);
    };
    processBatch();
    traceBatchTimer = setInterval(processBatch, 400);
  }
}

// ── Worker batch route pre-fetch ─────────────────────────────────────────────
// On first poll (and every 60s thereafter) send all visible callsigns without
// cached routes to /api/routes. The Worker fetches adsbdb for all in parallel
// at the edge and caches each result 24h — one round-trip replaces N per-click fetches.
let _lastRoutePrefetch = 0;

function _prefetchBatchRoutes(aircraftList) {
  // Build position lookup for geo-validation of received routes
  const acByCs = new Map();
  const missing = [];
  for (const ac of aircraftList) {
    const cs = ac.callsign;
    if (!cs || !isValidFlightCallsign(cs)) continue;
    acByCs.set(cs, ac);
    if (routeCache.has(cs)) continue; // already known
    missing.push(cs);
  }
  const unique = [...new Set(missing)].slice(0, 40);
  if (unique.length === 0) return;

  // Fire-and-forget — must not block the poll loop
  fetch(`/api/routes?cs=${unique.join('|')}`, {
    signal: AbortSignal.timeout(14000),
  }).then(async res => {
    if (!res.ok) return;
    const data = await res.json();
    for (const [cs, route] of Object.entries(data)) {
      if (!route) continue;
      if (routeCache.has(cs)) continue; // don't overwrite richer data
      // Geo-validate adsbdb route against aircraft's current position
      const ac = acByCs.get(cs);
      const confidence = ac
        ? _geoValidateRoute(route.origin, route.destination, ac.latitude, ac.longitude, ac.trueTrack)
        : 'UNVALIDATED';
      routeCache.set(cs, {
        origin:      route.origin      || null,
        destination: route.destination || null,
        originCity:  route.originCity  || getAirportCity(route.origin),
        destCity:    route.destCity    || getAirportCity(route.destination),
        airline:     route.airline     || null,
        confidence,
        source: 'adsbdb',
        fetchedAt:   Date.now(),
      });
    }
  }).catch(() => { /* network unavailable — will retry next interval */ });
}

// ── Inference throttling ─────────────────────────────────────────────────────
let _inferCleanupTimer = 0;
const INFER_CLEANUP_INTERVAL = 30000; // cleanup every 30s, not every poll
let _inferBatchOffset = 0;
const INFER_BATCH_SIZE = 15; // process max 15 aircraft per poll cycle

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
  // Safety: force-reset if a previous poll has been stuck for >10s
  if (pollInFlight && Date.now() - _pollStarted > 10000) pollInFlight = false;
  if (pollInFlight) return;
  if (Date.now() < _adsbFiPausedUntil && Date.now() < _adsbOnePausedUntil) return;
  pollInFlight = true;
  _pollStarted = Date.now();
  try {
    const aircraft = await fetchStates();
    consecutiveErrors = 0;
    lastFetchTime = Date.now();
    if (onDataCallback) onDataCallback(aircraft);

    // Populate route cache from poll data — geo-validate before caching.
    for (const ac of aircraft) {
      const cs = ac.callsign;
      if (!cs || cs.length < 3 || cs === ac.icao24) continue;
      if (!ac.origin && !ac.destination) continue;
      const ex = routeCache.get(cs);
      // Keep higher-confidence data; don't downgrade adsbdb entries with raw ADS-B
      if (ex && (ex.source === 'adsbdb' || ex.confidence === 'HIGH')) continue;
      if (ex && (ex.originCity || ex.destCity)) continue; // keep city names if present
      const confidence = _geoValidateRoute(ac.origin, ac.destination, ac.latitude, ac.longitude, ac.trueTrack);
      if (confidence === 'INVALID') continue;
      routeCache.set(cs, {
        origin: ac.origin || null, destination: ac.destination || null,
        originCity: getAirportCity(ac.origin),
        destCity:   getAirportCity(ac.destination),
        confidence,
        source: 'ADS-B',
        fetchedAt: Date.now(),
      });
    }

    // Batch route pre-fetch — once per 60s, ask the Worker for all missing routes
    if (Date.now() - _lastRoutePrefetch > 60000) {
      _lastRoutePrefetch = Date.now();
      _prefetchBatchRoutes(aircraft);
    }

    // Feed position data to the local route inference engine — staggered
    // Only process a slice of aircraft per poll to avoid blocking the main thread
    if (aircraft.length > 0) {
      const slice = aircraft.slice(_inferBatchOffset, _inferBatchOffset + INFER_BATCH_SIZE);
      _inferBatchOffset += INFER_BATCH_SIZE;
      if (_inferBatchOffset >= aircraft.length) _inferBatchOffset = 0;
      inferBatchUpdate(slice);
    }

    // Queue trace fetches for aircraft that don't have cached tracks
    const activeIcaoSet = new Set();
    for (const ac of aircraft) {
      if (ac.icao24) {
        activeIcaoSet.add(ac.icao24);
        const cached = trackCache.get(ac.icao24);
        if (!cached || Date.now() - cached.fetchedAt > TRACK_CACHE_TTL) {
          queueTraceFetch(ac.icao24);
        }
      }
    }

    // Periodic cleanup of stale inference data — every 30s, not every poll
    const now = Date.now();
    if (now - _inferCleanupTimer > INFER_CLEANUP_INTERVAL) {
      _inferCleanupTimer = now;
      inferCleanup(activeIcaoSet);
    }
  } catch (err) {
    consecutiveErrors++;
    console.error('[Data] Fetch error:', err.message, `(${consecutiveErrors})`);
    if (onErrorCallback) onErrorCallback(err, consecutiveErrors);
  } finally {
    pollInFlight = false;
  }
}

function _getInterval() {
  return _tabVisible ? POLL_INTERVAL : POLL_INTERVAL_BG;
}

function _restartTimer() {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = setInterval(poll, _getInterval());
}

export function startPolling(onData, onError) {
  onDataCallback = onData;
  onErrorCallback = onError;
  poll();
  pollTimer = setInterval(poll, POLL_INTERVAL);

  // Slow down when tab hidden — saves ~90% of Worker quota for background tabs
  document.addEventListener('visibilitychange', () => {
    _tabVisible = !document.hidden;
    _restartTimer();
    // Immediate poll on return to foreground for instant freshness
    if (_tabVisible) poll();
  });
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

export function forcePoll() {
  poll();
}

// --- Route fetching ---
// Primary: adsbdb.com — public flight route database, returns origin/dest/airline/city
// in a single callsign lookup. No API key required.
// 404 = unknown callsign (normal). Rate-limited on our side to max 1 req/s.

const routeFetchPromises = new Map();
const ROUTE_NULL_TTL = 120000; // 2 min retry for failed lookups
let _adsbxPausedUntil   = 0;
let _adsbFiRoutePausedUntil = 0;
let _lastAdsbdbFetch = 0;
const ADSBDB_MIN_INTERVAL = 1000; // max 1 adsbdb request per second
// Negative cache: callsigns confirmed not in adsbdb (avoid repeated 404s)
const _adsbdbNotFound = new Map();
const ADSBDB_NOT_FOUND_TTL = 600000; // don't retry 404'd callsigns for 10 min

// Validate callsign looks like a real flight number: 2-3 letter airline prefix + digits
// Filters out hex codes, test squitters, and non-airline traffic
function isValidFlightCallsign(cs) {
  if (!cs || cs.length < 4 || cs.length > 8) return false;
  // Standard ICAO format: 2-3 uppercase letters + 1-4 digits (optionally + 1 letter suffix)
  return /^[A-Z]{2,3}\d{1,4}[A-Z]?$/.test(cs);
}

async function fetchRouteAsync(callsign, icao24) {
  routeFetchQueue.add(callsign);
  try {
    const before = routeCache.get(callsign);
    if (before?.origin && before?.destination) {
      if (!before.originCity || !before.destCity) {
        routeCache.set(callsign, {
          ...before,
          originCity: before.originCity || getAirportCity(before.origin),
          destCity:   before.destCity   || getAirportCity(before.destination),
          fetchedAt:  Date.now(),
        });
      }
      return;
    }

    let origin = before?.origin || null;
    let destination = before?.destination || null;
    let originCity = before?.originCity || null;
    let destCity = before?.destCity || null;
    let airline = null;

    // === adsbdb.com callsign lookup ===
    // Only query if callsign looks like a valid flight number
    const csClean = callsign.trim();
    const skipAdsbdb = !isValidFlightCallsign(csClean)
      || (_adsbdbNotFound.has(csClean) && Date.now() - _adsbdbNotFound.get(csClean) < ADSBDB_NOT_FOUND_TTL);

    if (!skipAdsbdb) {
      // Rate limiter: wait if we queried too recently
      const wait = ADSBDB_MIN_INTERVAL - (Date.now() - _lastAdsbdbFetch);
      if (wait > 0) await new Promise(r => setTimeout(r, wait));
      _lastAdsbdbFetch = Date.now();

      try {
        const r = await fetch(`${ADSBDB_BASE}/callsign/${encodeURIComponent(csClean)}`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(5000),
        });
        if (r.ok) {
          const j = await r.json();
          const fr = j?.response?.flightroute;
          if (fr) {
            if (fr.origin) {
              origin = origin || fr.origin.iata_code || fr.origin.icao_code || null;
              originCity = originCity || fr.origin.municipality || fr.origin.name || null;
            }
            if (fr.destination) {
              destination = destination || fr.destination.iata_code || fr.destination.icao_code || null;
              destCity = destCity || fr.destination.municipality || fr.destination.name || null;
            }
            if (fr.airline) {
              airline = fr.airline.name || null;
            }
          }
        } else if (r.status === 404) {
          // Callsign not in database — cache negative result to avoid re-fetching
          _adsbdbNotFound.set(csClean, Date.now());
        }
      } catch { /* adsbdb unavailable */ }
    }

    // === Fallback: poll data (oa/da from adsb.one area response) ===
    if ((!origin || !destination) && icao24) {
      const hex = hexDetailCache.get(icao24);
      if (hex) {
        if (!origin && hex.origin) origin = hex.origin;
        if (!destination && hex.destination) destination = hex.destination;
      }
    }

    if (origin || destination) {
      routeCache.set(callsign, {
        origin, destination,
        originCity: originCity || getAirportCity(origin),
        destCity:   destCity   || getAirportCity(destination),
        airline,
        confidence: 'UNVALIDATED',
        source: 'adsbdb',
        fetchedAt: Date.now(),
      });
    } else {
      routeCache.set(callsign, {
        origin: null, destination: null, originCity: null, destCity: null,
        airline: null, confidence: null, source: null,
        fetchedAt: Date.now() - ROUTE_CACHE_TTL + ROUTE_NULL_TTL,
      });
    }
  } finally {
    routeFetchQueue.delete(callsign);
  }
}

// On-demand route fetch — triggered once when user clicks an aircraft.
export async function fetchRouteNow(callsign, icao24) {
  if (!callsign || callsign.length < 3) return;

  const entry = routeCache.get(callsign);
  const fresh = entry && Date.now() - entry.fetchedAt < ROUTE_CACHE_TTL;
  if (fresh && entry.origin && entry.destination && (entry.originCity || entry.destCity)) return;
  // Don't re-fetch if we recently got nothing — wait for ROUTE_NULL_TTL
  if (fresh && entry?.origin === null) return;

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

// --- Hex detail enrichment (on-demand) ---
// When user clicks an aircraft, fetch full data from adsb.fi hex endpoint
// to get IAS, TAS, Mach, operator — fields that adsb.one area API may omit.

const hexDetailCache = new Map();
const HEX_DETAIL_TTL = 60000; // refresh every 60s
const hexDetailQueue = new Set();
let _hexEnrichPausedUntil = 0; // separate from route rate limit

export async function fetchHexEnrich(icao24, callsign) {
  if (!icao24) return;
  const cached = hexDetailCache.get(icao24);
  if (cached && Date.now() - cached.fetchedAt < HEX_DETAIL_TTL) return;
  if (hexDetailQueue.has(icao24)) return;
  hexDetailQueue.add(icao24);

  try {
    // Try adsb.fi first, then airplanes.live as fallback
    let ac = null;
    if (Date.now() >= _hexEnrichPausedUntil) {
      try {
        const r = await fetch(`${ADSB_FI_BASE}/hex/${encodeURIComponent(icao24)}`, { cache: 'no-store' });
        if (r.status === 429) { _hexEnrichPausedUntil = Date.now() + 60000; }
        else if (r.ok) { const j = await r.json(); ac = (j?.ac || [])[0] || null; }
      } catch { /* try fallback */ }
    }
    if (!ac && Date.now() >= _adsbxPausedUntil) {
      try {
        const r = await fetch(`${ADSBX_BASE}/hex/${encodeURIComponent(icao24)}`, { cache: 'no-store' });
        if (r.status === 429) { _adsbxPausedUntil = Date.now() + 30000; }
        else if (r.ok) { const j = await r.json(); ac = (j?.ac || [])[0] || null; }
      } catch { /* silently fail */ }
    }
    if (!ac) return;

    const detail = {
      ias: ac.ias != null ? ac.ias : null,
      tas: ac.tas != null ? ac.tas : null,
      mach: ac.mach != null ? ac.mach : null,
      operator: ac.ownOp || null,
      origin: ac.oa || null,
      destination: ac.da || null,
      squawk: ac.squawk || null,
      rssi: ac.rssi != null ? ac.rssi : null,
      navAltitude: ac.nav_altitude != null ? ac.nav_altitude : null,
      navHeading: ac.nav_heading != null ? ac.nav_heading : null,
      emergency: ac.emergency || null,
      fetchedAt: Date.now(),
    };
    hexDetailCache.set(icao24, detail);

    // Also populate route cache if we got route data
    if (callsign && callsign.length >= 3 && (ac.oa || ac.da)) {
      const ex = routeCache.get(callsign);
      if (!ex || (!ex.origin && !ex.destination)) {
        routeCache.set(callsign, {
          origin: ac.oa || null,
          destination: ac.da || null,
          originCity: getAirportCity(ac.oa),
          destCity: getAirportCity(ac.da),
          confidence: 'UNVALIDATED',
          source: 'ADS-B',
          fetchedAt: Date.now(),
        });
      }
    }
  } catch {
    // silently fail
  } finally {
    hexDetailQueue.delete(icao24);
  }
}

export function getHexDetail(icao24) {
  if (!icao24) return null;
  const d = hexDetailCache.get(icao24);
  if (!d) return null;
  if (Date.now() - d.fetchedAt > HEX_DETAIL_TTL * 3) {
    hexDetailCache.delete(icao24);
    return null;
  }
  return d;
}

// --- Worker-powered parallel enrichment ---
// Single round-trip: trace + route + hex detail all at once via /api/enrich
export async function enrichAircraft(icao24, callsign) {
  if (!icao24) return;

  // Skip if all data is already fresh
  const hasTrack = trackCache.has(icao24) && Date.now() - trackCache.get(icao24).fetchedAt < TRACK_CACHE_TTL;
  const hasRoute = callsign && routeCache.has(callsign) && Date.now() - routeCache.get(callsign).fetchedAt < ROUTE_CACHE_TTL;
  const hasHex = hexDetailCache.has(icao24) && Date.now() - hexDetailCache.get(icao24).fetchedAt < HEX_DETAIL_TTL;
  if (hasTrack && hasRoute && hasHex) return;

  try {
    const cs = callsign || '';
    const res = await fetch(`/api/enrich?hex=${encodeURIComponent(icao24)}&cs=${encodeURIComponent(cs)}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { trace, route, hexDetail } = await res.json();

    // Process trace
    if (trace && trace.trace && Array.isArray(trace.trace)) {
      const baseTime = trace.timestamp || 0;
      const now = Date.now() / 1000;
      const cutoff = now - 1800;
      const waypoints = [];
      for (const pt of trace.trace) {
        const time = baseTime + pt[0];
        if (time < cutoff) continue;
        const lat = pt[1], lon = pt[2], alt = pt[3];
        if (lat == null || lon == null || alt == null || alt === 'ground') continue;
        waypoints.push({ latitude: lat, longitude: lon, baroAltitude: alt * 0.3048, time });
      }
      if (waypoints.length >= 1) {
        trackCache.set(icao24, { path: waypoints, fetchedAt: Date.now() });
        inferFeedTrace(icao24, waypoints, null);
      }
    }

    // Process route (adsbdb response)
    if (route && cs) {
      const resp = route.response;
      if (resp && resp.flightroute) {
        const fr = resp.flightroute;
        const origin = fr.origin?.iata_code || null;
        const dest = fr.destination?.iata_code || null;
        routeCache.set(cs, {
          origin, destination: dest,
          originCity: fr.origin?.municipality || getAirportCity(origin),
          destCity: fr.destination?.municipality || getAirportCity(dest),
          confidence: 'UNVALIDATED',
          source: 'adsbdb',
          fetchedAt: Date.now(),
        });
      }
    }

    // Process hex detail
    if (hexDetail) {
      const ac = (hexDetail.ac || [])[0];
      if (ac) {
        hexDetailCache.set(icao24, {
          ias: ac.ias ?? null, tas: ac.tas ?? null, mach: ac.mach ?? null,
          operator: ac.ownOp || null,
          origin: ac.oa || null, destination: ac.da || null,
          squawk: ac.squawk || null, rssi: ac.rssi ?? null,
          navAltitude: ac.nav_altitude ?? null, navHeading: ac.nav_heading ?? null,
          emergency: ac.emergency || null, fetchedAt: Date.now(),
        });
        // Populate route from hex data if missing
        if (cs && (ac.oa || ac.da) && !routeCache.has(cs)) {
          routeCache.set(cs, {
            origin: ac.oa || null, destination: ac.da || null,
            originCity: getAirportCity(ac.oa), destCity: getAirportCity(ac.da),
            confidence: 'UNVALIDATED',
            source: 'ADS-B',
            fetchedAt: Date.now(),
          });
        }
      }
    }

    console.log(`[STRATUM] Enriched ${icao24} via Worker (trace+route+hex)`);
  } catch (err) {
    // Fallback to individual fetches
    console.warn('[STRATUM] /api/enrich failed, using fallback:', err.message);
    priorityTraceFetch(icao24);
    if (callsign) fetchRouteNow(callsign, icao24);
    fetchHexEnrich(icao24, callsign);
  }
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
