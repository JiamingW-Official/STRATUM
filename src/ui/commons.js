// ── The naming commons ───────────────────────────────────────────────────────
// An aircraft on the limiting list broadcasts where it is and withholds who it
// is. The map draws it as UNSEEN, which is honest and a dead end: there is
// nothing to learn and nothing to do.
//
// So the people watching name it. The first person ever to contact an airframe
// chooses from three words the address itself offers; the name is global and
// permanent, and everyone who meets the aircraft afterwards meets it by that
// name and learns how many heard it first.
//
// The name is fictional, and never touches the registration or the owner. That
// is the whole ethical shape of the thing: the commons gets a record, the owner
// keeps the privacy they asked for, and the two do not trade against each other,
// because the name the crowd gives is precisely not the aircraft's name.
//
// The multiplayer is asynchronous and needs no lobby, because the premise is
// already true: everyone looking at this airspace right now is looking at the
// same aircraft. Two people who contact the same airframe in the same minute
// are offered the same three words.

const API = '/api/ghost';
const MINE_KEY = 'stratum:named';

const _cache = new Map();   // hex -> record
const _inflight = new Map();
let _mine = null;

function _loadMine() {
  if (_mine) return _mine;
  try { _mine = JSON.parse(localStorage.getItem(MINE_KEY) || '{}') || {}; } catch { _mine = {}; }
  return _mine;
}
function _saveMine() {
  try { localStorage.setItem(MINE_KEY, JSON.stringify(_mine)); } catch {}
}

/** Airframes this visitor was first to name. */
export function myNames() { return { ..._loadMine() }; }
export function myNameCount() { return Object.keys(_loadMine()).length; }
export function namedByMe(hex) { return !!_loadMine()[String(hex).toLowerCase()]; }

/** Whatever is already known about this airframe, without asking the network. */
export function cachedRecord(hex) { return _cache.get(String(hex).toLowerCase()) || null; }

/** The record, fetched once per airframe per session. */
export function ghostRecord(hex) {
  const h = String(hex || '').toLowerCase();
  if (!/^[0-9a-f]{6}$/.test(h)) return Promise.resolve(null);
  if (_cache.has(h)) return Promise.resolve(_cache.get(h));
  if (_inflight.has(h)) return _inflight.get(h);
  const p = fetch(`${API}?hex=${h}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((rec) => { if (rec) _cache.set(h, rec); _inflight.delete(h); return rec; })
    .catch(() => { _inflight.delete(h); return null; });
  _inflight.set(h, p);
  return p;
}

/**
 * Contact without claiming: the aircraft already has a name, and this says
 * one more person heard it. Returns the updated record.
 */
export function ghostContact(hex) {
  const h = String(hex || '').toLowerCase();
  if (!/^[0-9a-f]{6}$/.test(h)) return Promise.resolve(null);
  return fetch(`${API}?hex=${h}`, { method: 'POST', body: '{}' })
    .then((r) => (r.ok ? r.json() : null))
    .then((rec) => { if (rec) _cache.set(h, rec); return rec; })
    .catch(() => null);
}

/**
 * Claim: this airframe has never been contacted, and `name` is one of the
 * three the address offers. Writes the name for everyone, forever.
 */
export function ghostClaim(hex, name, place) {
  const h = String(hex || '').toLowerCase();
  if (!/^[0-9a-f]{6}$/.test(h)) return Promise.resolve(null);
  return fetch(`${API}?hex=${h}`, {
    method: 'POST',
    body: JSON.stringify({ name, place: place || '' }),
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((rec) => {
      if (!rec) return null;
      _cache.set(h, rec);
      // Credit only for an actual claim. Someone else may have landed first in
      // the second between the offer and the press, and that is the honest
      // outcome to show: their name, not a consolation.
      if (rec.mine) { _loadMine()[h] = { n: rec.n, at: rec.at, p: rec.p }; _saveMine(); }
      if (rec.n) noteLocalName(h, rec.n);
      return rec;
    })
    .catch(() => null);
}

/** "3 days ago", for a line that should read as a sentence. */
export function sinceWords(ts) {
  const s = Math.max(0, (Date.now() - ts) / 1000);
  if (s < 90) return 'just now';
  const m = s / 60;
  if (m < 90) return `${Math.round(m)} minutes ago`;
  const h = m / 60;
  if (h < 36) return `${Math.round(h)} hours ago`;
  const d = Math.round(h / 24);
  return d === 1 ? 'yesterday' : `${d} days ago`;
}

/** "48th", for the sentence that tells you where you stand in the queue. */
export function ordinal(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] || 'th'}`;
}


// ── The commons, as one object ──────────────────────────────────────────────
// Every name anyone has ever given, fetched in one request and refreshed
// occasionally. The scene reads it synchronously to label a ringed aircraft
// with the name it was given, which is the whole point of the mechanic: you
// fly over an airspace you have never opened and it is already inhabited by
// names strangers chose.
let _index = Object.create(null);
let _indexAt = 0;
const INDEX_TTL = 300000;

export function nameFor(hex) {
  const h = String(hex || '').toLowerCase();
  return _index[h] || null;
}
export function indexSize() { return Object.keys(_index).length; }

/**
 * Resolves true only when the commons actually changed. The caller repaints
 * every ringed label on a true, and a poll-rate "nothing happened" would make
 * that forty canvas redraws every two seconds -- which is the stutter this
 * project already paid for once.
 */
export function refreshIndex(force) {
  const now = Date.now();
  if (!force && now - _indexAt < INDEX_TTL) return Promise.resolve(false);
  _indexAt = now;
  return fetch('/api/ghost/index')
    .then((r) => (r.ok ? r.json() : null))
    .then((obj) => {
      if (!obj || typeof obj !== 'object') return false;
      const keys = Object.keys(obj);
      let changed = keys.length !== Object.keys(_index).length;
      if (!changed) for (const k of keys) if (_index[k] !== obj[k]) { changed = true; break; }
      if (changed) _index = Object.assign(Object.create(null), obj);
      return changed;
    })
    .catch(() => false);
}

// A claim made here should show on the map immediately, not at the next
// refresh: the whole gesture is that the name appears.
export function noteLocalName(hex, name) {
  _index[String(hex).toLowerCase()] = name;
}
