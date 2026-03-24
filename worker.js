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
  '/api/trace/':    120,     // Flight traces — 2 min (fresher trails)
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

async function cachePut(cacheKey, response, ttl, swr = 0) {
  const cache = caches.default;
  const cached = new Response(response.body, response);
  const cc = swr > 0
    ? `public, max-age=${ttl}, stale-while-revalidate=${swr}`
    : `public, max-age=${ttl}`;
  cached.headers.set('Cache-Control', cc);
  cached.headers.set('X-Cache-TTL', String(ttl));
  cache.put(cacheKey, cached);
}

// ── Security + perf headers applied to all responses ──
function addPerfHeaders(response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

// ── Smart Overpass endpoint: /api/airports?lat=X&lon=Y&r=1.2 ──
// Cache hierarchy: PoP Cache API (instant same-DC) → KV (global, ~10ms) → Overpass (2-8s)
async function handleAirports(url, env) {
  const lat = parseFloat(url.searchParams.get('lat'));
  const lon = parseFloat(url.searchParams.get('lon'));
  const r = parseFloat(url.searchParams.get('r')) || 1.2;
  if (isNaN(lat) || isNaN(lon)) {
    return new Response('Missing lat/lon', { status: 400 });
  }

  const latR = lat.toFixed(1), lonR = lon.toFixed(1);
  const cacheKey = new Request(`https://cache.internal/airports/${latR}/${lonR}/${r}`);
  const kvKey = `apt:${latR}:${lonR}:${r}`;

  // 1. PoP-local Cache API — zero-latency for same datacenter
  const cached = await cacheGet(cacheKey);
  if (cached) {
    const res = corsResponse(cached);
    res.headers.set('X-Cache', 'HIT');
    return res;
  }

  // 2. KV — globally consistent, ~10ms, survives PoP cold-start
  if (env?.AIRPORT_CACHE) {
    const kvVal = await env.AIRPORT_CACHE.get(kvKey);
    if (kvVal) {
      const res = new Response(kvVal, {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'X-Cache': 'KV' },
      });
      // Backfill PoP cache so next request from same DC is instant
      cachePut(cacheKey, new Response(kvVal, { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }), 86400, 3600);
      return addPerfHeaders(res);
    }
  }

  // 3. Overpass — cold fetch, race all 3 mirrors
  const south = (lat - r).toFixed(4);
  const north = (lat + r).toFixed(4);
  const west  = (lon - r).toFixed(4);
  const east  = (lon + r).toFixed(4);
  const query = `[out:json][timeout:15];(way["aeroway"="runway"](${south},${west},${north},${east});way["aeroway"="taxiway"](${south},${west},${north},${east});way["aeroway"="terminal"](${south},${west},${north},${east});node["aeroway"="aerodrome"](${south},${west},${north},${east});way["aeroway"="aerodrome"](${south},${west},${north},${east});relation["aeroway"="aerodrome"](${south},${west},${north},${east}););out body geom;`;
  const body = `data=${encodeURIComponent(query)}`;

  const racePromises = OVERPASS_URLS.map(endpoint => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    return fetch(endpoint, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'STRATUM/1.0', 'Accept-Encoding': 'gzip, br' },
      signal: ctrl.signal,
    }).then(async res => {
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    }).catch(err => { clearTimeout(timer); throw err; });
  });

  try {
    const upstream = await Promise.any(racePromises);
    const responseBody = await upstream.text();

    // Write to both PoP cache (24h) and KV (30 days) — airport geometry almost never changes
    const toCache = new Response(responseBody, { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    cachePut(cacheKey, toCache, 86400, 3600);
    if (env?.AIRPORT_CACHE) env.AIRPORT_CACHE.put(kvKey, responseBody, { expirationTtl: 86400 * 30 });

    return addPerfHeaders(new Response(responseBody, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'X-Cache': 'MISS' },
    }));
  } catch {
    return new Response('All Overpass endpoints failed', { status: 502, headers: corsHeaders() });
  }
}

// ── /api/airports/batch — Parallel multi-location airport lookup ──
// Client sends ?locs=lat1,lon1|lat2,lon2|... (up to 25 locations)
// Worker runs all lookups in parallel, each benefits from its own edge cache.
// Returns { "lat.1,lon.1": <raw Overpass JSON>, ... }
async function handleAirportsBatch(url, env) {
  const locsParam = url.searchParams.get('locs') || '';
  if (!locsParam) return new Response('Missing locs', { status: 400, headers: corsHeaders() });

  const locs = locsParam.split('|').slice(0, 25).map(s => {
    const parts = s.split(',');
    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);
    const r   = parseFloat(parts[2]) || 1.2;
    return (isNaN(lat) || isNaN(lon)) ? null : { lat, lon, r };
  }).filter(Boolean);

  if (locs.length === 0) return new Response('No valid locs', { status: 400, headers: corsHeaders() });

  // All lookups in parallel — each call reads/writes its own cache key
  const settled = await Promise.allSettled(
    locs.map(({ lat, lon, r }) =>
      handleAirports(new URL(`https://cache.internal/api/airports?lat=${lat}&lon=${lon}&r=${r}`), env)
        .then(res => res.text())
    )
  );

  const out = {};
  for (let i = 0; i < locs.length; i++) {
    const { lat, lon } = locs[i];
    const key = `${lat.toFixed(1)},${lon.toFixed(1)}`;
    if (settled[i].status === 'fulfilled') {
      try { out[key] = JSON.parse(settled[i].value); } catch { out[key] = null; }
    } else {
      out[key] = null;
    }
  }

  return new Response(JSON.stringify(out), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
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
async function handleEnrich(url, env) {
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

  // Cross-populate route cache (PoP + KV) so /api/routes calls for this callsign hit instantly
  if (callsign && route?.response?.flightroute) {
    const fr = route.response.flightroute;
    const parsedRoute = {
      origin:      fr.origin?.iata_code      || null,
      destination: fr.destination?.iata_code || null,
      originCity:  fr.origin?.municipality   || null,
      destCity:    fr.destination?.municipality || null,
      airline:     fr.airline?.name          || null,
    };
    const routeJson = JSON.stringify(parsedRoute);
    cachePut(
      new Request(`https://cache.internal/route/v1/${callsign}`),
      new Response(routeJson, { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }),
      86400, 3600,
    );
    // Also write to KV for 90-day persistence across PoP cold-starts
    if (env?.AIRPORT_CACHE) {
      env.AIRPORT_CACHE.put(`rt:v2:${callsign}`, routeJson, { expirationTtl: 86400 * 90 });
    }
  }

  const result = { trace, route, hexDetail };
  const body = JSON.stringify(result);
  const response = new Response(body, {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'X-Cache': 'MISS' },
  });

  // Cache 90s + stale-while-revalidate 30s — trace/route data doesn't change fast
  const toCache = new Response(body, {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
  cachePut(cacheKey, toCache, 90, 30);

  return addPerfHeaders(response);
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
    + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,dewpoint_2m,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,visibility,weather_code,is_day'
    + '&hourly=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation,precipitation_probability&forecast_hours=24'
    + '&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset&forecast_days=7'
    + '&timezone=auto';

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

    // Cache 15 min + stale-while-revalidate 5 min — weather is slow-changing
    const toCache = new Response(body, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
    cachePut(cacheKey, toCache, 900, 300);

    return addPerfHeaders(response);
  } catch {
    return new Response('Weather fetch failed', { status: 502, headers: corsHeaders() });
  }
}

// ── /api/atlas — Edge-cached world land outline (TopoJSON) ──
// Proxy cdn.jsdelivr.net to eliminate extra DNS+TLS handshake, cache 30 days
async function handleAtlas() {
  const cacheKey = new Request('https://cache.internal/atlas/land-110m');
  const cached = await cacheGet(cacheKey);
  if (cached) {
    const r = corsResponse(cached);
    r.headers.set('X-Cache', 'HIT');
    return r;
  }

  try {
    const upstream = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json', {
      headers: { 'User-Agent': 'STRATUM/1.0' },
      signal: AbortSignal.timeout(10000),
    });
    if (!upstream.ok) return corsResponse(upstream);

    const body = await upstream.text();
    const response = new Response(body, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'X-Cache': 'MISS' },
    });
    const toCache = new Response(body, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
    cachePut(cacheKey, toCache, 2592000); // 30 days — static data
    return addPerfHeaders(response);
  } catch {
    return new Response('Atlas fetch failed', { status: 502, headers: corsHeaders() });
  }
}

// ── /api/routes?cs=AAL123|UAL456|... — Batch callsign route lookup ──
// 3-tier cache: PoP Cache (instant) → KV (global, 90-day persistent) → adsbdb (live)
// A single round-trip from the browser replaces N sequential adsbdb fetches.
// KV acts as a permanent route database — once a callsign is seen it never re-hits adsbdb.
async function handleRoutes(url, env) {
  const csParam = url.searchParams.get('cs') || '';
  const callsigns = [...new Set(
    csParam.split('|')
      .map(s => s.trim().toUpperCase())
      .filter(s => /^[A-Z]{2,3}\d{1,4}[A-Z]?$/.test(s)),
  )].slice(0, 40); // max 40 callsigns per request

  if (callsigns.length === 0) {
    return new Response('{}', { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }

  const result = {};
  const toFetch = [];

  // Tier 1: PoP-local Cache API (zero latency, same datacenter)
  // Tier 2: KV global store (10ms, survives PoP eviction — our permanent route DB)
  await Promise.all(callsigns.map(async cs => {
    const cacheKey = new Request(`https://cache.internal/route/v1/${cs}`);
    const cached = await cacheGet(cacheKey);
    if (cached) {
      try { result[cs] = await cached.json(); } catch { /* corrupt — re-fetch */ }
      if (result[cs]) return;
    }
    // KV tier: persistent across PoP cold-starts, 90-day TTL
    if (env?.AIRPORT_CACHE) {
      const kvVal = await env.AIRPORT_CACHE.get(`rt:v2:${cs}`);
      if (kvVal) {
        try {
          result[cs] = JSON.parse(kvVal);
          // Backfill PoP cache so next request from same DC is instant
          cachePut(cacheKey, new Response(kvVal, { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }), 86400, 3600);
          return;
        } catch { /* corrupt KV entry — re-fetch */ }
      }
    }
    toFetch.push(cs);
  }));

  // Tier 3: adsbdb live fetch for remaining cache misses
  if (toFetch.length > 0) {
    const fetched = await Promise.allSettled(
      toFetch.map(cs =>
        fetch(`https://api.adsbdb.com/v0/callsign/${cs}`, {
          headers: { 'User-Agent': 'STRATUM/1.0' },
          signal: AbortSignal.timeout(5000),
        }).then(r => r.ok ? r.json() : null).catch(() => null),
      ),
    );

    const kvWrites = [];
    for (let i = 0; i < toFetch.length; i++) {
      const cs = toFetch[i];
      const data = fetched[i].status === 'fulfilled' ? fetched[i].value : null;
      if (data?.response?.flightroute) {
        const fr = data.response.flightroute;
        const route = {
          origin:      fr.origin?.iata_code      || null,
          destination: fr.destination?.iata_code || null,
          originCity:  fr.origin?.municipality   || null,
          destCity:    fr.destination?.municipality || null,
          airline:     fr.airline?.name          || null,
        };
        result[cs] = route;
        const routeJson = JSON.stringify(route);
        // Write to PoP cache (24h + SWR 1h)
        cachePut(
          new Request(`https://cache.internal/route/v1/${cs}`),
          new Response(routeJson, { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }),
          86400, 3600,
        );
        // Write to KV (90-day TTL — permanent route database moat)
        if (env?.AIRPORT_CACHE) {
          kvWrites.push(env.AIRPORT_CACHE.put(`rt:v2:${cs}`, routeJson, { expirationTtl: 86400 * 90 }));
        }
      }
    }
    if (kvWrites.length > 0) await Promise.allSettled(kvWrites);
  }

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
}

// ── Field pruning — strip unused fields to cut response size ~50% ──
const KEEP_FIELDS = [
  'hex','flight','lat','lon','alt_baro','alt_geom','gs','track','baro_rate',
  'category','r','t','oa','da','ownOp','year','desc','squawk','rssi',
  'nav_altitude','nav_heading','ias','tas','mach','emergency','seen_pos','seen',
];
function pruneAc(ac) {
  const o = {};
  for (const k of KEEP_FIELDS) if (ac[k] !== undefined) o[k] = ac[k];
  return o;
}

// ── /api/positions — Multi-source aircraft position aggregation ──
// Fetches from adsb.one + adsb.fi + airplanes.live in parallel at the edge,
// deduplicates by hex code, returns merged data in one round trip.
// This gives the client fresher positions (whichever source responds fastest)
// and eliminates client-side fallback logic.
async function handlePositions(url) {
  const lat = url.searchParams.get('lat');
  const lon = url.searchParams.get('lon');
  const r = url.searchParams.get('r') || '100';
  if (!lat || !lon) return new Response('Missing lat/lon', { status: 400 });

  // Edge cache: round coords to 0.01° (~1km) so nearby users share cache
  const rlat = parseFloat(lat).toFixed(2);
  const rlon = parseFloat(lon).toFixed(2);
  const cacheKey = new Request(`https://cache.internal/positions/${rlat}/${rlon}/${r}`);

  const cached = await cacheGet(cacheKey);
  if (cached) {
    const r = corsResponse(cached);
    r.headers.set('X-Cache', 'HIT');
    return r;
  }

  const t0 = Date.now();
  // Smart race: collect results as they arrive, return after 2s or when all done
  const resolved = [null, null, null];
  let settled = 0;
  const sources = [
    fetch(`https://api.adsb.one/v2/point/${lat}/${lon}/${r}`, {
      headers: { 'User-Agent': 'STRATUM/1.0' },
      signal: AbortSignal.timeout(4000),
    }).then(res => res.ok ? res.json() : null).catch(() => null),
    fetch(`https://opendata.adsb.fi/api/v2/lat/${lat}/lon/${lon}/dist/${r}`, {
      headers: { 'User-Agent': 'STRATUM/1.0' },
      signal: AbortSignal.timeout(4000),
    }).then(res => res.ok ? res.json() : null).catch(() => null),
    fetch(`https://api.airplanes.live/v2/point/${lat}/${lon}/${r}`, {
      headers: { 'User-Agent': 'STRATUM/1.0' },
      signal: AbortSignal.timeout(4000),
    }).then(res => res.ok ? res.json() : null).catch(() => null),
  ];
  sources.forEach((p, i) => p.then(v => { resolved[i] = v; settled++; }));
  // Wait for all sources OR 1.2s — gives time for 2-3 sources to respond
  // for richer merged data (more aircraft, richer fields per aircraft).
  await Promise.race([
    Promise.allSettled(sources),
    new Promise(r => setTimeout(r, 1200)),
  ]);
  const results = resolved;
  const merged = new Map(); // hex → best aircraft data

  for (const data of results) {
    if (!data) continue;
    const list = data.ac || data.aircraft;
    if (!Array.isArray(list)) continue;

    for (const ac of list) {
      const hex = ac.hex;
      if (!hex || ac.lat == null || ac.lon == null) continue;
      const alt = ac.alt_baro;
      if (alt == null || alt === 'ground') continue;

      const existing = merged.get(hex);
      if (!existing) {
        merged.set(hex, ac);
      } else {
        // Merge: prefer richer data (more fields filled)
        // Keep the entry with more enrichment data (route, operator, IAS/TAS)
        if (!existing.oa && ac.oa) existing.oa = ac.oa;
        if (!existing.da && ac.da) existing.da = ac.da;
        if (!existing.ownOp && ac.ownOp) existing.ownOp = ac.ownOp;
        if (!existing.r && ac.r) existing.r = ac.r;
        if (!existing.t && ac.t) existing.t = ac.t;
        if (existing.ias == null && ac.ias != null) existing.ias = ac.ias;
        if (existing.tas == null && ac.tas != null) existing.tas = ac.tas;
        if (existing.mach == null && ac.mach != null) existing.mach = ac.mach;
        if (existing.year == null && ac.year != null) existing.year = ac.year;
        if (existing.desc == null && ac.desc != null) existing.desc = ac.desc;
        if (!existing.squawk && ac.squawk) existing.squawk = ac.squawk;
        // Use freshest position (higher seen_pos or now timestamp)
        const eSeen = existing.seen_pos ?? existing.seen ?? 999;
        const aSeen = ac.seen_pos ?? ac.seen ?? 999;
        if (aSeen < eSeen) {
          existing.lat = ac.lat;
          existing.lon = ac.lon;
          existing.alt_baro = ac.alt_baro;
          existing.alt_geom = ac.alt_geom ?? existing.alt_geom;
          existing.gs = ac.gs ?? existing.gs;
          existing.track = ac.track ?? existing.track;
          existing.baro_rate = ac.baro_rate ?? existing.baro_rate;
          existing.nav_altitude = ac.nav_altitude ?? existing.nav_altitude;
          existing.nav_heading = ac.nav_heading ?? existing.nav_heading;
          existing.seen_pos = aSeen;
        }
      }
    }
  }

  const pruned = [...merged.values()].map(pruneAc);
  const fetchMs = Date.now() - t0;
  const body = JSON.stringify({ ac: pruned, total: merged.size });
  const response = new Response(body, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Cache': 'MISS',
      'Server-Timing': `fetch;dur=${fetchMs}, sources;desc="${settled}/3"`,
    },
  });

  // Cache 2s + SWR 3s — fresh data every ~2-3s with instant stale serves in between.
  const toCache = new Response(body, {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
  cachePut(cacheKey, toCache, 2, 3);

  return addPerfHeaders(response);
}

// ── /api/boot — Single round-trip first-load payload ──
// Replaces 2 parallel browser fetches (positions + airports) with 1 Worker call.
// Worker fans out all 3 at the edge in parallel; each handler reads its own cache tier.
// Net result: 1 HTTP request instead of 2 from the browser; airports+weather come for free
// alongside positions since they're served from edge cache (24h / 15min respectively).
async function handleBoot(url, env) {
  const lat = parseFloat(url.searchParams.get('lat'));
  const lon = parseFloat(url.searchParams.get('lon'));
  const r   = url.searchParams.get('r')  || '100';
  const ar  = parseFloat(url.searchParams.get('ar')) || 1.5;
  if (isNaN(lat) || isNaN(lon)) return new Response('Missing lat/lon', { status: 400, headers: corsHeaders() });

  // PoP cache — 2s+SWR3s (positions data is most volatile; determines TTL)
  const rlat = lat.toFixed(2), rlon = lon.toFixed(2);
  const cacheKey = new Request(`https://cache.internal/boot/v2/${rlat}/${rlon}/${r}`);
  const cached = await cacheGet(cacheKey);
  if (cached) {
    const res = corsResponse(cached);
    res.headers.set('X-Cache', 'HIT');
    return res;
  }

  // Fan out positions + airports + weather fully in parallel at the edge.
  // Each handler reads its own PoP/KV cache tier — airports+weather hit cache instantly.
  const [posRes, aptRes, wxRes] = await Promise.all([
    handlePositions(new URL(`https://cache.internal/api/positions?lat=${lat}&lon=${lon}&r=${r}`)),
    handleAirports(new URL(`https://cache.internal/api/airports?lat=${lat}&lon=${lon}&r=${ar}`), env),
    handleWeather(new URL(`https://cache.internal/api/weather?lat=${lat}&lon=${lon}`)),
  ]);

  const [positions, airports, weather] = await Promise.all([
    posRes.json().catch(() => null),
    aptRes.json().catch(() => null),
    wxRes.json().catch(() => null),
  ]);

  const body = JSON.stringify({ positions, airports, weather });
  cachePut(
    cacheKey,
    new Response(body, { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }),
    2, 3,
  );

  return addPerfHeaders(new Response(body, {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'X-Cache': 'MISS' },
  }));
}

// ── Cron: Pre-warm edge cache for top ~60 busiest airspaces worldwide ──
// Paid plan includes cron triggers — run every 5 min to keep cache hot.
// When a real user visits any of these cities, data is already cached = 0ms API latency.
// Airport data has a 24h edge cache so handleAirports is a no-op after first warm.
const WARM_CITIES = [
  // ── USA ──
  { lat: 40.71, lon:  -74.01 },  // NYC center — matches speculative /api/boot cache key exactly
  { lat: 33.64, lon:  -84.43 },  // ATL Atlanta
  { lat: 41.97, lon:  -87.91 },  // ORD Chicago O'Hare
  { lat: 32.90, lon:  -97.04 },  // DFW Dallas/Fort Worth
  { lat: 33.94, lon: -118.41 },  // LAX Los Angeles
  { lat: 39.86, lon: -104.67 },  // DEN Denver
  { lat: 36.08, lon: -115.15 },  // LAS Las Vegas
  { lat: 28.43, lon:  -81.31 },  // MCO Orlando
  { lat: 33.44, lon: -112.01 },  // PHX Phoenix
  { lat: 25.80, lon:  -80.29 },  // MIA Miami
  { lat: 37.62, lon: -122.38 },  // SFO San Francisco
  { lat: 47.45, lon: -122.31 },  // SEA Seattle
  { lat: 40.64, lon:  -73.78 },  // JFK New York
  { lat: 40.69, lon:  -74.17 },  // EWR Newark
  { lat: 42.37, lon:  -71.01 },  // BOS Boston
  { lat: 29.99, lon:  -95.34 },  // IAH Houston
  { lat: 44.88, lon:  -93.22 },  // MSP Minneapolis
  { lat: 42.21, lon:  -83.35 },  // DTW Detroit
  { lat: 26.07, lon:  -80.15 },  // FLL Fort Lauderdale
  { lat: 35.21, lon:  -80.94 },  // CLT Charlotte
  { lat: 39.87, lon:  -75.24 },  // PHL Philadelphia
  // ── Canada ──
  { lat: 43.68, lon:  -79.62 },  // YYZ Toronto
  { lat: 49.19, lon: -123.18 },  // YVR Vancouver
  { lat: 45.47, lon:  -73.74 },  // YUL Montreal
  { lat: 51.13, lon: -114.01 },  // YYC Calgary
  // ── Mexico & Caribbean ──
  { lat: 19.44, lon:  -99.07 },  // MEX Mexico City
  { lat: 21.04, lon:  -86.88 },  // CUN Cancún
  { lat: 18.44, lon:  -66.00 },  // SJU San Juan
  // ── South America ──
  { lat: -23.44, lon: -46.47 },  // GRU São Paulo
  { lat: -22.81, lon: -43.25 },  // GIG Rio de Janeiro
  { lat: -34.82, lon: -58.54 },  // EZE Buenos Aires
  { lat:   4.70, lon: -74.15 },  // BOG Bogotá
  { lat: -12.02, lon: -77.11 },  // LIM Lima
  { lat: -33.39, lon: -70.79 },  // SCL Santiago
  // ── Europe ──
  { lat: 51.48, lon:   -0.46 },  // LHR London Heathrow
  { lat: 51.15, lon:   -0.18 },  // LGW London Gatwick
  { lat: 49.01, lon:    2.55 },  // CDG Paris
  { lat: 50.04, lon:    8.56 },  // FRA Frankfurt
  { lat: 52.31, lon:    4.77 },  // AMS Amsterdam
  { lat: 40.47, lon:   -3.57 },  // MAD Madrid
  { lat: 41.30, lon:    2.08 },  // BCN Barcelona
  { lat: 48.35, lon:   11.77 },  // MUC Munich
  { lat: 52.37, lon:   13.50 },  // BER Berlin
  { lat: 41.80, lon:   12.24 },  // FCO Rome
  { lat: 47.46, lon:    8.55 },  // ZRH Zurich
  { lat: 48.11, lon:   16.57 },  // VIE Vienna
  { lat: 50.90, lon:    4.48 },  // BRU Brussels
  { lat: 55.63, lon:   12.66 },  // CPH Copenhagen
  { lat: 40.98, lon:   28.82 },  // IST Istanbul
  { lat: 53.37, lon:   -2.27 },  // MAN Manchester
  { lat: 55.95, lon:   -3.37 },  // EDI Edinburgh
  // ── Middle East ──
  { lat: 25.25, lon:   55.36 },  // DXB Dubai
  { lat: 25.27, lon:   51.61 },  // DOH Doha
  { lat: 24.43, lon:   46.70 },  // RUH Riyadh
  { lat: 24.90, lon:   67.16 },  // KHI Karachi
  // ── Asia-Pacific ──
  { lat:  1.36, lon:  103.99 },  // SIN Singapore
  { lat: 35.76, lon:  140.39 },  // NRT Tokyo Narita
  { lat: 35.55, lon:  139.78 },  // HND Tokyo Haneda
  { lat: 40.08, lon:  116.58 },  // PEK Beijing
  { lat: 31.14, lon:  121.81 },  // PVG Shanghai
  { lat: 22.31, lon:  113.91 },  // HKG Hong Kong
  { lat: 37.46, lon:  126.44 },  // ICN Seoul
  { lat: 13.69, lon:  100.75 },  // BKK Bangkok
  { lat:  2.74, lon:  101.71 },  // KUL Kuala Lumpur
  { lat: -6.13, lon:  106.65 },  // CGK Jakarta
  { lat: 28.57, lon:   77.10 },  // DEL Delhi
  { lat: 19.09, lon:   72.87 },  // BOM Mumbai
  // ── Oceania ──
  { lat: -33.95, lon:  151.18 }, // SYD Sydney
  { lat: -37.67, lon:  144.84 }, // MEL Melbourne
  // ── Africa ──
  { lat: -26.13, lon:   28.24 }, // JNB Johannesburg
  { lat:  30.12, lon:   31.41 }, // CAI Cairo
  { lat: -33.96, lon:   18.60 }, // CPT Cape Town
  { lat:  33.37, lon:   -7.59 }, // CMN Casablanca
];

// ── /api/liveatc — LiveATC Icecast stream proxy ──
// Proxies LiveATC audio streams with CORS headers for HTML5 Audio playback
const LIVEATC_SERVERS = [
  'https://s1-bos.liveatc.net/',
  'https://s1-fmt2.liveatc.net/',
];

async function handleLiveATC(url) {
  const feed = (url.searchParams.get('feed') || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (!feed) return new Response('Missing feed', { status: 400, headers: corsHeaders() });

  // Try each server until one responds
  for (const server of LIVEATC_SERVERS) {
    try {
      const upstream = await fetch(server + feed, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; STRATUM/1.0)',
          'Referer': 'https://www.liveatc.net/',
        },
        signal: AbortSignal.timeout(6000),
      });
      if (upstream.ok || upstream.status === 200) {
        const response = new Response(upstream.body, {
          headers: {
            'Content-Type': upstream.headers.get('Content-Type') || 'audio/mpeg',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
          },
        });
        return response;
      }
    } catch { /* try next server */ }
  }
  return new Response('Feed unavailable', { status: 404, headers: corsHeaders() });
}

// ── Main handler ──
export default {
  // Cron trigger: pre-warm cache every 5 min (paid plan feature)
  // Positions + weather refresh every 5 min; airports refresh daily (24h cache)
  async scheduled(event, env, ctx) {
    // One handleBoot call per city replaces 3 individual calls — cleaner and equivalent.
    // handleBoot fans out positions + airports + weather internally in parallel,
    // each handler writes its own PoP/KV cache tier so individual endpoints also benefit.
    await Promise.allSettled(
      WARM_CITIES.map(c =>
        handleBoot(
          new URL(`https://cache.internal/api/boot?lat=${c.lat}&lon=${c.lon}&r=100&ar=1.2`),
          env,
        ).catch(() => null),
      ),
    );
  },

  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    // Smart endpoints
    if (url.pathname === '/api/boot')             return handleBoot(url, env);
    if (url.pathname === '/api/positions')        return handlePositions(url);
    if (url.pathname === '/api/airports')         return handleAirports(url, env);
    if (url.pathname === '/api/airports/batch')   return handleAirportsBatch(url, env);
    if (url.pathname === '/api/routes')    return handleRoutes(url, env);
    if (url.pathname === '/api/enrich')    return handleEnrich(url, env);
    if (url.pathname === '/api/weather')   return handleWeather(url);
    if (url.pathname === '/api/atlas')     return handleAtlas();

    // LiveATC audio stream proxy — /api/liveatc?feed=kjfk_twr
    if (url.pathname === '/api/liveatc') return handleLiveATC(url);

    // Font proxy — self-host Google Fonts (eliminates 2 DNS + 2 TLS handshakes)
    if (url.pathname.startsWith('/fonts/css')) {
      const gUrl = 'https://fonts.googleapis.com' + url.pathname.slice('/fonts/css'.length) + url.search;
      const cacheKey = new Request(gUrl);
      const fc = await cacheGet(cacheKey);
      if (fc) return addPerfHeaders(corsResponse(fc));
      const res = await fetch(gUrl, {
        headers: { 'User-Agent': request.headers.get('User-Agent') || '' },
      });
      if (!res.ok) return corsResponse(res);
      // Rewrite font URLs from fonts.gstatic.com → /fonts/file/
      let css = await res.text();
      css = css.replace(/https:\/\/fonts\.gstatic\.com\//g, '/fonts/file/');
      const out = new Response(css, { headers: { 'Content-Type': 'text/css', 'Access-Control-Allow-Origin': '*' } });
      cachePut(cacheKey, new Response(css, { headers: { 'Content-Type': 'text/css', 'Access-Control-Allow-Origin': '*' } }), 86400);
      return addPerfHeaders(out);
    }
    if (url.pathname.startsWith('/fonts/file/')) {
      const gUrl = 'https://fonts.gstatic.com/' + url.pathname.slice('/fonts/file/'.length);
      const cacheKey = new Request(gUrl);
      const fc = await cacheGet(cacheKey);
      if (fc) {
        const r = new Response(fc.body, fc);
        r.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        return addPerfHeaders(r);
      }
      const res = await fetch(gUrl);
      if (!res.ok) return res;
      const buf = await res.arrayBuffer();
      const ct = res.headers.get('Content-Type') || 'font/woff2';
      const out = new Response(buf, { headers: { 'Content-Type': ct, 'Cache-Control': 'public, max-age=31536000, immutable', 'Access-Control-Allow-Origin': '*' } });
      cachePut(cacheKey, new Response(buf, { headers: { 'Content-Type': ct, 'Access-Control-Allow-Origin': '*' } }), 31536000);
      return addPerfHeaders(out);
    }

    // Proxy routes
    for (const [prefix, target] of Object.entries(PROXY_ROUTES)) {
      if (url.pathname.startsWith(prefix)) {
        return handleProxy(request, prefix, target, url);
      }
    }

    // Static assets — immutable hashed files get long cache, HTML gets revalidation
    const response = await env.ASSETS.fetch(request);
    const path = url.pathname;

    // Radio MP3 files — long cache + correct MIME + CORS + range support
    if (path.startsWith('/radio/') && path.endsWith('.mp3')) {
      const r = new Response(response.body, response);
      r.headers.set('Content-Type', 'audio/mpeg');
      r.headers.set('Accept-Ranges', 'bytes');
      r.headers.set('Cache-Control', 'public, max-age=2592000, immutable'); // 30 days
      r.headers.set('Access-Control-Allow-Origin', '*');
      return addPerfHeaders(r);
    }

    if (path.startsWith('/assets/') && /\.[a-zA-Z0-9]{8,}\.(js|css)$/.test(path)) {
      const cached = new Response(response.body, response);
      cached.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return addPerfHeaders(cached);
    }
    if (path === '/' || path.endsWith('.html')) {
      // Parse HTML to extract critical asset URLs for 103 Early Hints
      const html = await response.text();
      const out = new Response(html, response);
      out.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      const links = [];
      const cssMatch = html.match(/href="(\/assets\/[^"]+\.css)"/);
      if (cssMatch) links.push(`<${cssMatch[1]}>; rel=preload; as=style`);
      // Preload all JS chunks (app + three.js) in parallel
      const jsMatches = html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g);
      for (const m of jsMatches) links.push(`<${m[1]}>; rel=modulepreload`);
      if (links.length) out.headers.set('Link', links.join(', '));
      return addPerfHeaders(out);
    }
    return addPerfHeaders(response);
  },
};
