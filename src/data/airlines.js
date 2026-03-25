// ── Airline data: ICAO code → name, logo, info ──
// Index loaded lazily on first query; logos loaded per-airline on demand.

let _index = null;
let _loading = null;

async function _loadIndex() {
  if (_index) return _index;
  if (_loading) return _loading;
  _loading = fetch('/airlines/index.json')
    .then(r => r.ok ? r.json() : {})
    .then(data => { _index = data; return data; })
    .catch(() => { _index = {}; return {}; });
  return _loading;
}

/**
 * Look up airline by ICAO prefix (first 3 chars of callsign).
 * Returns { name, iata, callsign, country, alliance, founded, hq, fleet, bm, destinations, hubs, logoUrl } or null.
 */
export async function getAirline(icaoPrefix) {
  if (!icaoPrefix || icaoPrefix.length < 3) return null;
  const code = icaoPrefix.slice(0, 3).toUpperCase();
  const idx = await _loadIndex();
  const e = idx[code];
  if (!e) return null;
  return {
    name: e.n,
    iata: e.i,
    callsign: e.c,
    country: e.co,
    alliance: e.al,
    founded: e.f,
    hq: e.hq,
    fleet: e.ft,
    businessModel: e.bm,
    destinations: e.dst,
    hubs: e.hubs || [],
    logoUrl: e.l ? `/airlines/${code}.webp` : null,
  };
}

/**
 * Synchronous lookup (returns null if index not yet loaded).
 */
export function getAirlineSync(icaoPrefix) {
  if (!_index || !icaoPrefix || icaoPrefix.length < 3) return null;
  const code = icaoPrefix.slice(0, 3).toUpperCase();
  const e = _index[code];
  if (!e) return null;
  return {
    name: e.n,
    iata: e.i,
    callsign: e.c,
    country: e.co,
    alliance: e.al,
    founded: e.f,
    hq: e.hq,
    fleet: e.ft,
    businessModel: e.bm,
    destinations: e.dst,
    hubs: e.hubs || [],
    logoUrl: e.l ? `/airlines/${code}.webp` : null,
  };
}

// Pre-load index on import
_loadIndex();
