// Aircraft metadata lookup via hexdb.io
// Provides: operator, built year, type description
const HEXDB_BASE = '/api/hexdb/api/v1/aircraft';
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour
const fetchQueue = new Set();
const batchQueue = [];
let batchTimer = null;

async function fetchAircraftMeta(hex) {
  if (fetchQueue.has(hex)) return;
  fetchQueue.add(hex);
  try {
    const res = await fetch(`${HEXDB_BASE}/${hex}`);
    if (!res.ok) {
      cache.set(hex, { data: null, fetchedAt: Date.now() });
      return;
    }
    const json = await res.json();
    cache.set(hex, {
      data: {
        registration: json.Registration || null,
        typeCode: json.ICAOTypeCode || null,
        typeName: json.Type || null,
        manufacturer: json.Manufacturer || null,
        operator: json.RegisteredOwners || null,
        operatorCode: json.OperatorFlagCode || null,
      },
      fetchedAt: Date.now(),
    });
  } catch {
    cache.set(hex, { data: null, fetchedAt: Date.now() });
  } finally {
    fetchQueue.delete(hex);
  }
}

export function queueHexLookup(hex) {
  if (!hex) return;
  const entry = cache.get(hex);
  if (entry && Date.now() - entry.fetchedAt < CACHE_TTL) return;
  if (fetchQueue.has(hex) || batchQueue.includes(hex)) return;
  batchQueue.push(hex);
  if (!batchTimer) {
    batchTimer = setInterval(() => {
      const batch = batchQueue.splice(0, 5);
      if (batch.length === 0) {
        clearInterval(batchTimer);
        batchTimer = null;
        return;
      }
      for (const h of batch) fetchAircraftMeta(h);
    }, 300);
  }
}

export function getAircraftMeta(hex) {
  if (!hex) return null;
  const entry = cache.get(hex);
  if (!entry || !entry.data) return null;
  if (Date.now() - entry.fetchedAt > CACHE_TTL) {
    cache.delete(hex);
    return null;
  }
  return entry.data;
}
