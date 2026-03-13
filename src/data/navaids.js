// Worldwide navaid data from OurAirports (public domain)
// Source: https://ourairports.com/data/navaids.csv

const NAVAIDS_URL = 'https://davidmegginson.github.io/ourairports-data/navaids.csv';
const FALLBACK_URL = '/api/navaids/ourairports-data/navaids.csv';

let _cache = null;
let _fetching = false;

/**
 * Fetch worldwide navaid data (~11K records, ~1.5MB).
 * Cached in memory after first fetch.
 * @returns {Promise<Array|null>} Array of { ident, name, type, freq, lat, lon }
 */
export async function fetchNavaidData() {
  if (_cache) return _cache;
  if (_fetching) return null;
  _fetching = true;

  try {
    let csv;
    try {
      const res = await fetch(NAVAIDS_URL, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      csv = await res.text();
    } catch {
      // Fallback to proxy
      const res = await fetch(FALLBACK_URL, { signal: AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      csv = await res.text();
    }

    const navaids = _parseCSV(csv);
    _cache = navaids;
    console.log(`[STRATUM] Navaids loaded: ${navaids.length}`);
    return navaids;
  } catch (err) {
    console.warn('[STRATUM] Navaids fetch failed:', err.message);
    return null;
  } finally {
    _fetching = false;
  }
}

function _parseCSV(csv) {
  const navaids = [];
  const lines = csv.split('\n');
  // Header: id,filename,ident,name,type,frequency_khz,latitude_deg,longitude_deg,...
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line || line.length < 10) continue;

    // Simple CSV parse — handle quoted fields
    const cols = [];
    let cur = '', inQuote = false;
    for (let j = 0; j < line.length; j++) {
      const ch = line[j];
      if (ch === '"') { inQuote = !inQuote; continue; }
      if (ch === ',' && !inQuote) { cols.push(cur); cur = ''; continue; }
      cur += ch;
    }
    cols.push(cur);

    if (cols.length < 8) continue;
    const type = cols[4];
    if (!type) continue;
    // Only keep navigational aids used for airway charts
    if (!['VOR', 'VOR-DME', 'VORTAC', 'NDB', 'NDB-DME', 'TACAN', 'DME'].includes(type)) continue;

    const lat = parseFloat(cols[6]);
    const lon = parseFloat(cols[7]);
    if (isNaN(lat) || isNaN(lon)) continue;

    navaids.push({
      ident: cols[2],
      name: cols[3],
      type,
      freq: cols[5] ? Math.round(parseFloat(cols[5]) / 10) / 100 : 0, // kHz → MHz
      lat,
      lon,
    });
  }
  return navaids;
}

/**
 * Filter navaids near a given lat/lon.
 */
export function filterNearbyNavaids(navaids, lat, lon, radius = 2.5) {
  if (!navaids) return [];
  return navaids.filter(n =>
    Math.abs(n.lat - lat) < radius && Math.abs(n.lon - lon) < radius
  );
}

/**
 * Generate synthetic airway segments by connecting nearby VOR-type navaids.
 * Produces a realistic-looking airway network.
 * @param {Array} navaids - nearby navaids (already filtered)
 * @returns {Array<{from, to}>} airway segments
 */
export function generateAirways(navaids) {
  // Only use VOR-type navaids as airway nodes
  const vors = navaids.filter(n =>
    n.type === 'VOR' || n.type === 'VOR-DME' || n.type === 'VORTAC'
  );
  if (vors.length < 2) return [];

  const MAX_DIST_DEG = 2.0;  // ~120 NM
  const MIN_DIST_DEG = 0.3;  // ~18 NM
  const MAX_CONNECTIONS = 4;
  const seen = new Set();
  const airways = [];

  for (const a of vors) {
    // Find distances to all other VORs
    const candidates = [];
    for (const b of vors) {
      if (a === b) continue;
      const dLat = a.lat - b.lat;
      const dLon = (a.lon - b.lon) * Math.cos(a.lat * Math.PI / 180);
      const dist = Math.sqrt(dLat * dLat + dLon * dLon);
      if (dist >= MIN_DIST_DEG && dist <= MAX_DIST_DEG) {
        candidates.push({ nav: b, dist });
      }
    }
    // Sort by distance, take nearest
    candidates.sort((x, y) => x.dist - y.dist);
    let count = 0;
    for (const c of candidates) {
      if (count >= MAX_CONNECTIONS) break;
      const key = [a.ident, c.nav.ident].sort().join('-');
      if (seen.has(key)) continue;
      seen.add(key);
      airways.push({ from: a, to: c.nav });
      count++;
    }
  }

  return airways;
}
