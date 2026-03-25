// ── Airline data: ICAO code → name, logo, fleet, financials, routes ──
// Main index loaded eagerly; fleet/financials/routes loaded lazily on first use.

let _index = null;
let _loading = null;
let _fleet = null;
let _fleetLoading = null;
let _fin = null;
let _finLoading = null;
let _routes = null;
let _routesLoading = null;

async function _loadIndex() {
  if (_index) return _index;
  if (_loading) return _loading;
  _loading = fetch('/airlines/index.json')
    .then(r => r.ok ? r.json() : {})
    .then(data => { _index = data; return data; })
    .catch(() => { _index = {}; return {}; });
  return _loading;
}

function _lazyLoad(url) {
  return fetch(url).then(r => r.ok ? r.json() : {}).catch(() => ({}));
}

function _buildAirlineObj(code, e) {
  return {
    name: e.n, iata: e.i, callsign: e.c, country: e.co,
    alliance: e.al, founded: e.f, hq: e.hq, fleet: e.ft,
    businessModel: e.bm, destinations: e.dst, hubs: e.hubs || [],
    logoUrl: e.l ? `/airlines/${code}.webp` : null,
    ceo: e.ceo || null, website: e.web || null,
    focusCities: e.fc || [],
  };
}

/** Async lookup by ICAO prefix (first 3 chars of callsign). */
export async function getAirline(icaoPrefix) {
  if (!icaoPrefix || icaoPrefix.length < 3) return null;
  const code = icaoPrefix.slice(0, 3).toUpperCase();
  const idx = await _loadIndex();
  const e = idx[code];
  return e ? _buildAirlineObj(code, e) : null;
}

/** Synchronous lookup (returns null if index not yet loaded). */
export function getAirlineSync(icaoPrefix) {
  if (!_index || !icaoPrefix || icaoPrefix.length < 3) return null;
  const code = icaoPrefix.slice(0, 3).toUpperCase();
  const e = _index[code];
  return e ? _buildAirlineObj(code, e) : null;
}

/** Fleet detail for an airline — lazy-loaded on first call. */
export async function getAirlineFleet(icaoPrefix) {
  if (!icaoPrefix || icaoPrefix.length < 3) return null;
  const code = icaoPrefix.slice(0, 3).toUpperCase();
  if (!_fleet) {
    if (!_fleetLoading) _fleetLoading = _lazyLoad('/airlines/fleet.json').then(d => { _fleet = d; return d; });
    _fleet = await _fleetLoading;
  }
  return _fleet[code] || null;
}

/** Financials for an airline — lazy-loaded on first call. */
export async function getAirlineFinancials(icaoPrefix) {
  if (!icaoPrefix || icaoPrefix.length < 3) return null;
  const code = icaoPrefix.slice(0, 3).toUpperCase();
  if (!_fin) {
    if (!_finLoading) _finLoading = _lazyLoad('/airlines/financials.json').then(d => { _fin = d; return d; });
    _fin = await _finLoading;
  }
  return _fin[code] || null;
}

/** Route network for an airline — lazy-loaded on first call. */
export async function getAirlineRoutes(icaoPrefix) {
  if (!icaoPrefix || icaoPrefix.length < 3) return null;
  const code = icaoPrefix.slice(0, 3).toUpperCase();
  if (!_routes) {
    if (!_routesLoading) _routesLoading = _lazyLoad('/airlines/routes.json').then(d => { _routes = d; return d; });
    _routes = await _routesLoading;
  }
  return _routes[code] || null;
}

// Airport coordinates (IATA → [lat, lon]) for route map
let _aptCoords = null, _aptCoordsLoading = null;
export async function getAirportCoords() {
  if (_aptCoords) return _aptCoords;
  if (!_aptCoordsLoading) _aptCoordsLoading = _lazyLoad('/airlines/airports.json').then(d => { _aptCoords = d; return d; });
  return _aptCoordsLoading;
}

// Simplified world coastline for mini map
let _coast = null, _coastLoading = null;
export async function getCoastline() {
  if (_coast) return _coast;
  if (!_coastLoading) _coastLoading = _lazyLoad('/airlines/coastline.json').then(d => { _coast = d; return d; });
  return _coastLoading;
}

// Pre-load main index on import
_loadIndex();
