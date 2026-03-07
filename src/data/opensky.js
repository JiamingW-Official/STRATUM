// Primary: adsb.lol (free, no auth, no harsh rate limits)
// Fallback: OpenSky Network
const ADSB_LOL_BASE = '/api/adsb/v2';
const OPENSKY_BASE = '/api/opensky/api';
const POLL_INTERVAL = 5000;   // 5s — adsb.lol handles this fine
const BBOX_RADIUS_NM = 150;   // nautical miles radius for adsb.lol

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

// Track cache
const trackCache = new Map();
const TRACK_CACHE_TTL = 180000;
const TRACK_RETAIN_TTL = 1200000;
const trackFetchQueue = new Set();
let trackFetchDelay = 0;

export function setUserLocation(lat, lon) {
  userLat = lat;
  userLon = lon;
}

export function getUserLocation() {
  return { lat: userLat, lon: userLon };
}

export function isDemo() {
  return false; // no more demo — real API works
}

// --- Parse adsb.lol format ---
function parseAdsbLol(ac) {
  const alt = ac.alt_baro;
  if (alt === 'ground' || alt == null) return null;
  if (ac.lat == null || ac.lon == null) return null;

  return {
    icao24: ac.hex,
    callsign: (ac.flight || '').trim(),
    originCountry: ac.r || '--',  // registration country
    timePosition: Math.floor(Date.now() / 1000),
    lastContact: Math.floor(Date.now() / 1000),
    longitude: ac.lon,
    latitude: ac.lat,
    baroAltitude: typeof alt === 'number' ? alt * 0.3048 : null, // feet → meters
    onGround: alt === 'ground',
    velocity: ac.gs != null ? ac.gs * 0.514444 : null, // knots → m/s
    trueTrack: ac.track,
    verticalRate: ac.baro_rate != null ? ac.baro_rate * 0.00508 : null, // ft/min → m/s
    geoAltitude: ac.alt_geom != null ? ac.alt_geom * 0.3048 : null,
    category: ac.category,     // aircraft type category
    registration: ac.r,
    aircraftType: ac.t,        // type designator (e.g., B738)
  };
}

// --- Fetch from adsb.lol ---
async function fetchFromAdsbLol() {
  const url = `${ADSB_LOL_BASE}/lat/${userLat.toFixed(4)}/lon/${userLon.toFixed(4)}/dist/${BBOX_RADIUS_NM}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`adsb.lol HTTP ${response.status}`);

  const data = await response.json();
  if (!data.ac || !Array.isArray(data.ac)) return [];

  return data.ac
    .map(parseAdsbLol)
    .filter((a) => a != null && a.baroAltitude != null && a.baroAltitude > 100);
}

// --- Fetch from OpenSky (fallback) ---
async function fetchFromOpenSky() {
  const lamin = userLat - 2;
  const lamax = userLat + 2;
  const lomin = userLon - 2;
  const lomax = userLon + 2;

  const url = `${OPENSKY_BASE}/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`OpenSky HTTP ${response.status}`);

  const data = await response.json();
  if (!data.states) return [];

  return data.states
    .map((sv) => ({
      icao24: sv[0],
      callsign: (sv[1] || '').trim(),
      originCountry: sv[2],
      timePosition: sv[3],
      lastContact: sv[4],
      longitude: sv[5],
      latitude: sv[6],
      baroAltitude: sv[7],
      onGround: sv[8],
      velocity: sv[9],
      trueTrack: sv[10],
      verticalRate: sv[11],
      geoAltitude: sv[13],
    }))
    .filter((a) => !a.onGround && a.latitude != null && a.longitude != null && a.baroAltitude != null);
}

// --- Combined fetch with fallback ---
async function fetchStates() {
  try {
    return await fetchFromAdsbLol();
  } catch (err) {
    console.warn('[Data] adsb.lol failed, trying OpenSky:', err.message);
    return await fetchFromOpenSky();
  }
}

async function poll() {
  try {
    const aircraft = await fetchStates();
    consecutiveErrors = 0;
    lastFetchTime = Date.now();
    if (onDataCallback) onDataCallback(aircraft);

    // Queue route fetches (OpenSky routes API)
    for (const ac of aircraft) {
      if (ac.callsign && !routeCache.has(ac.callsign) && !routeFetchQueue.has(ac.callsign)) {
        fetchRouteAsync(ac.callsign);
      }
    }
  } catch (err) {
    consecutiveErrors++;
    console.error('[Data] Fetch error:', err.message, `(${consecutiveErrors})`);
    if (onErrorCallback) onErrorCallback(err, consecutiveErrors);
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

// --- Route fetching (OpenSky) ---

async function fetchRouteAsync(callsign) {
  routeFetchQueue.add(callsign);
  try {
    const response = await fetch(`${OPENSKY_BASE}/routes?callsign=${encodeURIComponent(callsign)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.route && data.route.length >= 2) {
        routeCache.set(callsign, {
          origin: data.route[0],
          destination: data.route[data.route.length - 1],
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
// adsb.lol doesn't have a track endpoint, so we accumulate positions ourselves.
// Each poll gives us a real position — over 20 minutes that's 240 data points.

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
