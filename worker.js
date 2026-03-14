// Cloudflare Worker — Edge proxy + caching layer for STRATUM
// Features: Cache API for slow-changing data, smart Overpass routing, CORS handling

// ── Proxy route map ──
const PROXY_ROUTES = {
  '/api/adsbfi/':   'https://opendata.adsb.fi/',
  '/api/adsboe/':   'https://api.adsb.one/',
  '/api/adsbx/':    'https://api.airplanes.live/',
  '/api/trace/':    'https://globe.airplanes.live/',
  '/api/hexdb/':    'https://hexdb.io/',
  '/api/opensky/':  'https://opensky-network.org/',
  '/api/ovp-de/':   'https://overpass-api.de/',
  '/api/ovp-kumi/': 'https://overpass.kumi.systems/',
  '/api/ovp-ru/':   'https://maps.mail.ru/osm/tools/overpass/',
  '/api/adsbdb/':   'https://api.adsbdb.com/',
  '/api/fir/':      'https://raw.githubusercontent.com/maiuswong/simaware-express/main/public/livedata/',
  '/api/navaids/':  'https://davidmegginson.github.io/',
};

// ── Cache TTLs (seconds) — 0 = no cache (live data) ──
const CACHE_TTLS = {
  '/api/adsbfi/':   0,       // Live aircraft — no cache
  '/api/adsboe/':   0,       // Live aircraft — no cache
  '/api/adsbx/':    0,       // Live aircraft — no cache
  '/api/trace/':    300,     // Flight traces — 5 min
  '/api/hexdb/':    3600,    // Aircraft details — 1 hour
  '/api/opensky/':  60,      // OpenSky — 1 min
  '/api/ovp-de/':   86400,   // Airport data — 24 hours
  '/api/ovp-kumi/': 86400,
  '/api/ovp-ru/':   86400,
  '/api/adsbdb/':   3600,    // Route data — 1 hour
  '/api/fir/':      604800,  // FIR boundaries — 7 days
  '/api/navaids/':  604800,  // Navaids — 7 days
};

// ── Overpass endpoints for smart routing ──
const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

// ── Helpers ──
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function corsResponse(response) {
  const r = new Response(response.body, response);
  r.headers.set('Access-Control-Allow-Origin', '*');
  return r;
}

async function hashText(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}

// ── Cache API helpers ──
async function cacheGet(cacheKey) {
  const cache = caches.default;
  return cache.match(cacheKey);
}

async function cachePut(cacheKey, response, ttl) {
  const cache = caches.default;
  const cached = new Response(response.body, response);
  cached.headers.set('Cache-Control', `public, max-age=${ttl}`);
  cached.headers.set('X-Cache-TTL', String(ttl));
  // Must be awaited but don't block on it
  cache.put(cacheKey, cached);
}

// ── Smart Overpass endpoint: /api/airports?lat=X&lon=Y&r=1.2 ──
// Races all 3 Overpass endpoints from the edge, caches 24h
async function handleAirports(url) {
  const lat = parseFloat(url.searchParams.get('lat'));
  const lon = parseFloat(url.searchParams.get('lon'));
  const r = parseFloat(url.searchParams.get('r')) || 1.2;
  if (isNaN(lat) || isNaN(lon)) {
    return new Response('Missing lat/lon', { status: 400 });
  }

  // Round for cache key stability
  const cacheKey = new Request(`https://cache.internal/airports/${lat.toFixed(1)}/${lon.toFixed(1)}/${r}`);

  // Check cache
  const cached = await cacheGet(cacheKey);
  if (cached) {
    const r = corsResponse(cached);
    r.headers.set('X-Cache', 'HIT');
    return r;
  }

  // Build Overpass query
  const south = (lat - r).toFixed(4);
  const north = (lat + r).toFixed(4);
  const west = (lon - r).toFixed(4);
  const east = (lon + r).toFixed(4);
  const query = `[out:json][timeout:15];(way["aeroway"="runway"](${south},${west},${north},${east});way["aeroway"="taxiway"](${south},${west},${north},${east});way["aeroway"="terminal"](${south},${west},${north},${east});way["building"]["aeroway"](${south},${west},${north},${east});node["aeroway"="aerodrome"](${south},${west},${north},${east});way["aeroway"="aerodrome"](${south},${west},${north},${east});relation["aeroway"="aerodrome"](${south},${west},${north},${east}););out body geom;`;
  const body = `data=${encodeURIComponent(query)}`;

  // Race all 3 Overpass endpoints from edge (datacenter → datacenter = fast)
  const racePromises = OVERPASS_URLS.map(endpoint => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    return fetch(endpoint, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'STRATUM/1.0' },
      signal: ctrl.signal,
    }).then(async res => {
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    }).catch(err => {
      clearTimeout(timer);
      throw err;
    });
  });

  try {
    const upstream = await Promise.any(racePromises);
    const responseBody = await upstream.text();
    const response = new Response(responseBody, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'X-Cache': 'MISS' },
    });

    // Cache for 24h (clone before caching since body can only be read once)
    const toCache = new Response(responseBody, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
    await cachePut(cacheKey, toCache, 86400);

    return response;
  } catch {
    return new Response('All Overpass endpoints failed', { status: 502, headers: corsHeaders() });
  }
}

// ── Generic proxy with edge caching ──
async function handleProxy(request, prefix, target, url) {
  const path = url.pathname.slice(prefix.length);
  const proxyUrl = target + path + url.search;
  const ttl = CACHE_TTLS[prefix] || 0;

  // For cacheable GET requests, check Cache API
  if (ttl > 0 && request.method === 'GET') {
    const cacheKey = new Request(proxyUrl);
    const cached = await cacheGet(cacheKey);
    if (cached) {
      const r = corsResponse(cached);
      r.headers.set('X-Cache', 'HIT');
      return r;
    }

    // Fetch upstream
    const upstream = await fetch(proxyUrl, {
      headers: { 'User-Agent': 'STRATUM/1.0', 'Accept': request.headers.get('Accept') || '*/*' },
    });
    if (upstream.ok) {
      const body = await upstream.arrayBuffer();
      const response = new Response(body, {
        status: upstream.status,
        headers: upstream.headers,
      });
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('X-Cache', 'MISS');

      // Cache in background
      const toCache = new Response(body, { status: upstream.status, headers: upstream.headers });
      toCache.headers.set('Access-Control-Allow-Origin', '*');
      cachePut(new Request(proxyUrl), toCache, ttl);

      return response;
    }
    return corsResponse(upstream);
  }

  // For cacheable POST requests (Overpass), hash body for cache key
  if (ttl > 0 && request.method === 'POST') {
    const bodyText = await request.text();
    const bodyHash = await hashText(bodyText);
    const cacheKey = new Request(`https://cache.internal/post/${prefix}/${bodyHash}`);

    const cached = await cacheGet(cacheKey);
    if (cached) {
      const r = corsResponse(cached);
      r.headers.set('X-Cache', 'HIT');
      return r;
    }

    const upstream = await fetch(proxyUrl, {
      method: 'POST',
      headers: {
        'User-Agent': 'STRATUM/1.0',
        'Content-Type': request.headers.get('Content-Type') || 'application/x-www-form-urlencoded',
      },
      body: bodyText,
    });
    if (upstream.ok) {
      const body = await upstream.arrayBuffer();
      const response = new Response(body, { status: upstream.status, headers: upstream.headers });
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('X-Cache', 'MISS');

      const toCache = new Response(body, { status: upstream.status, headers: upstream.headers });
      toCache.headers.set('Access-Control-Allow-Origin', '*');
      cachePut(cacheKey, toCache, ttl);

      return response;
    }
    return corsResponse(upstream);
  }

  // No cache — direct proxy (live ADS-B data)
  const headers = { 'User-Agent': 'STRATUM/1.0' };
  const ct = request.headers.get('Content-Type');
  if (ct) headers['Content-Type'] = ct;
  const accept = request.headers.get('Accept');
  if (accept) headers['Accept'] = accept;

  const upstream = await fetch(proxyUrl, {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });
  return corsResponse(upstream);
}

// ── /api/enrich — Parallel aircraft detail aggregation ──
// Fetches trace + route + hex detail in ONE round-trip from the edge
async function handleEnrich(url) {
  const hex = url.searchParams.get('hex');
  const callsign = (url.searchParams.get('cs') || '').trim();
  if (!hex) return new Response('Missing hex', { status: 400 });

  const cacheKey = new Request(`https://cache.internal/enrich/${hex}/${callsign}`);
  const cached = await cacheGet(cacheKey);
  if (cached) {
    const r = corsResponse(cached);
    r.headers.set('X-Cache', 'HIT');
    return r;
  }

  const last2 = hex.slice(-2);
  const promises = [];

  // 1. Trace data (globe.airplanes.live)
  promises.push(
    fetch(`https://globe.airplanes.live/data/traces/${last2}/trace_full_${hex}.json`, {
      headers: { 'User-Agent': 'STRATUM/1.0' },
      signal: AbortSignal.timeout(8000),
    }).then(r => r.ok ? r.json() : null).catch(() => null)
  );

  // 2. Route data (adsbdb — only if valid callsign)
  const csValid = /^[A-Z]{2,3}\d{1,4}[A-Z]?$/.test(callsign);
  if (csValid) {
    promises.push(
      fetch(`https://api.adsbdb.com/v0/callsign/${callsign}`, {
        headers: { 'User-Agent': 'STRATUM/1.0' },
        signal: AbortSignal.timeout(6000),
      }).then(r => r.ok ? r.json() : null).catch(() => null)
    );
  } else {
    promises.push(Promise.resolve(null));
  }

  // 3. Hex detail (adsb.fi — aircraft type, registration, etc.)
  promises.push(
    fetch(`https://opendata.adsb.fi/api/v2/hex/${hex}`, {
      headers: { 'User-Agent': 'STRATUM/1.0' },
      signal: AbortSignal.timeout(6000),
    }).then(r => r.ok ? r.json() : null).catch(() => null)
  );

  const [trace, route, hexDetail] = await Promise.all(promises);

  const result = { trace, route, hexDetail };
  const body = JSON.stringify(result);
  const response = new Response(body, {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'X-Cache': 'MISS' },
  });

  // Cache 2 min (trace updates frequently, but saves burst on rapid re-clicks)
  const toCache = new Response(body, {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
  cachePut(cacheKey, toCache, 120);

  return response;
}

// ── /api/weather — Edge-cached Open-Meteo proxy ──
async function handleWeather(url) {
  const lat = parseFloat(url.searchParams.get('lat'));
  const lon = parseFloat(url.searchParams.get('lon'));
  if (isNaN(lat) || isNaN(lon)) {
    return new Response('Missing lat/lon', { status: 400 });
  }

  // Round to 0.1° for cache stability (same city = same weather)
  const rlat = lat.toFixed(1), rlon = lon.toFixed(1);
  const cacheKey = new Request(`https://cache.internal/weather/${rlat}/${rlon}`);

  const cached = await cacheGet(cacheKey);
  if (cached) {
    const r = corsResponse(cached);
    r.headers.set('X-Cache', 'HIT');
    return r;
  }

  const meteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${rlat}&longitude=${rlon}`
    + '&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,visibility,weather_code'
    + '&hourly=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m'
    + '&forecast_hours=8&timezone=auto';

  try {
    const upstream = await fetch(meteoUrl, {
      headers: { 'User-Agent': 'STRATUM/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (!upstream.ok) return corsResponse(upstream);

    const body = await upstream.text();
    const response = new Response(body, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'X-Cache': 'MISS' },
    });

    // Cache 15 min — weather doesn't change faster than that
    const toCache = new Response(body, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
    cachePut(cacheKey, toCache, 900);

    return response;
  } catch {
    return new Response('Weather fetch failed', { status: 502, headers: corsHeaders() });
  }
}

// ── Main handler ──
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    // Smart endpoints
    if (url.pathname === '/api/airports') return handleAirports(url);
    if (url.pathname === '/api/enrich')  return handleEnrich(url);
    if (url.pathname === '/api/weather') return handleWeather(url);

    // Proxy routes
    for (const [prefix, target] of Object.entries(PROXY_ROUTES)) {
      if (url.pathname.startsWith(prefix)) {
        return handleProxy(request, prefix, target, url);
      }
    }

    // Static assets
    return env.ASSETS.fetch(request);
  },
};
