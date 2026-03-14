// FIR (Flight Information Region) boundary data
// Source: VATSIM vatspy-data-project via SimAware (CC-BY-SA-4.0)

const FIR_URL = '/api/fir/firboundaries.json';

let _firCache = null;
let _firPromise = null;

/**
 * Fetch worldwide FIR boundary GeoJSON (~880KB).
 * Cached in memory after first fetch. Concurrent callers share one fetch.
 * @returns {Promise<Array>} Array of { id, oceanic, labelLat, labelLon, polygons }
 */
export async function fetchFIRData() {
  if (_firCache) return _firCache;
  if (_firPromise) return _firPromise;

  _firPromise = (async () => {
    try {
      const res = await fetch(FIR_URL, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const geojson = await res.json();

      const firs = [];
      for (const feature of geojson.features) {
        const props = feature.properties;
        const id = props.id || '';
        const oceanic = props.oceanic === '1';
        const labelLat = parseFloat(props.label_lat) || 0;
        const labelLon = parseFloat(props.label_lon) || 0;

        // Extract all polygon rings from MultiPolygon
        const polygons = [];
        const geom = feature.geometry;
        if (geom.type === 'MultiPolygon') {
          for (const poly of geom.coordinates) {
            if (poly[0] && poly[0].length >= 3) {
              polygons.push(poly[0]);
            }
          }
        } else if (geom.type === 'Polygon') {
          if (geom.coordinates[0] && geom.coordinates[0].length >= 3) {
            polygons.push(geom.coordinates[0]);
          }
        }

        if (polygons.length > 0) {
          firs.push({ id, oceanic, labelLat, labelLon, polygons });
        }
      }

      _firCache = firs;
      console.log(`[STRATUM] FIR boundaries loaded: ${firs.length} regions`);
      return firs;
    } catch (err) {
      console.warn('[STRATUM] FIR fetch failed:', err.message);
      return null;
    } finally {
      _firPromise = null;
    }
  })();

  return _firPromise;
}

/**
 * Filter FIR boundaries to those near a given lat/lon.
 * @param {Array} firs - Full FIR dataset
 * @param {number} lat - Center latitude
 * @param {number} lon - Center longitude
 * @param {number} radius - Degrees radius to include (default 12)
 * @returns {Array} Filtered FIRs
 */
export function filterNearbyFIRs(firs, lat, lon, radius = 12) {
  if (!firs) return [];
  return firs.filter(fir => {
    // Quick check: is label within radius?
    if (Math.abs(fir.labelLat - lat) < radius && Math.abs(fir.labelLon - lon) < radius) {
      return true;
    }
    // Check if any polygon point is within radius
    for (const ring of fir.polygons) {
      for (const coord of ring) {
        if (Math.abs(coord[1] - lat) < radius && Math.abs(coord[0] - lon) < radius) {
          return true;
        }
      }
    }
    return false;
  });
}
