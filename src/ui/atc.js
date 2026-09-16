// ── Tower audio ──
// The one trace a ghost still leaves: it will not let you see who it is, but
// it still talks to the tower. Streams come straight from LiveATC's Icecast
// servers — verified to allow cross-origin playback — with no proxy and no
// spoofed headers. Audio is attributed on screen. The map of airport → feed is
// built at development time and only contains feeds that answered as audio.
import FEEDS from '../data/atcFeeds.json';
import { setRadioDucked } from './radio.js';

// Every feed carries its own coordinates, so the common case — this airport has
// a feed — needs no lookup table at all. The 3,000-airport table is only needed
// to place an airport that has no feed of its own, so it is fetched then, once.
let AIRPORTS = null;
let _airportsLoad = null;
function _loadAirports() {
  _airportsLoad ??= fetch('/atc/airports.json')
    .then((r) => (r.ok ? r.json() : {}))
    .then((j) => (AIRPORTS = j))
    .catch(() => (AIRPORTS = {}));
  return _airportsLoad;
}

let _audio = null;
let _icao = null;
// Only the mirror the resolver named is known to carry a given mount. The others
// answer 200 with an empty content-type and no CORS header, so cycling through
// them turned one transient hiccup into "feed unavailable"; s1-bos is kept as a
// single alternate because it mirrors most mounts.
// Both answer this project's mounts as audio/mpeg today (checked by range
// request); s1-lax and s1-dal do not, and are not listed.
const MIRRORS = ['s1-bos', 's1-fmt2'];

// ── The order one feed is tried in ──
// LiveATC allowlists by Referer, and the allowlist has this project's Worker
// domain on it and nothing else: the same mount answers 200 with a workers.dev
// Referer and 403 with any other. So on every other host — the Vercel build,
// a custom domain, a fork — both direct mirrors 403 and the tower reads "No
// feed", which is what it had been doing.
//
// The Worker has proxied this stream since it was written; the client simply
// never asked it to. It goes last rather than first because a direct stream
// costs the project nothing and a proxied one costs it the whole audio
// bandwidth, and because the 403 arrives fast enough that the fallback is
// still immediate to a listener.
function _sources(f) {
  if (!f) return [];
  const hosts = [f.server, ...MIRRORS.filter((m) => m !== f.server)];
  return [
    ...hosts.map((h) => `https://${h}.liveatc.net/${f.mount}`),
    `/api/liveatc?feed=${encodeURIComponent(f.mount)}`,
  ];
}
// A stream that connects and never starts is the failure the user actually
// sees: the label said TUNING for as long as they cared to wait. Ten seconds
// without a first frame moves to the next mirror; after the last, say so.
const STALL_MS = 10000;
let _stallTimer = null;
function _armStall() {
  clearTimeout(_stallTimer);
  _stallTimer = setTimeout(() => {
    if (!_wanted || !_audio || !_audio.paused && _audio.readyState >= 3) return;
    _nextMirrorOrFail();
  }, STALL_MS);
}
function _nextMirrorOrFail() {
  const order = _sources(_entry(_heard));
  if (_mirrorIdx < order.length - 1) {
    _mirrorIdx++;
    const url = feedFor(_icao);
    if (url && _audio) { _audio.src = url; _render('loading'); _audio.play().catch(() => {}); _armStall(); return; }
  }
  _wanted = false; _mirrorIdx = 0; clearTimeout(_stallTimer); _render('error');
}
let _mirrorIdx = 0;
let _nearby = null; // set when the feed belongs to a neighbouring airport
let _btn = null, _label = null, _wrap = null;
let _wanted = false;
let _armed = false;

// Which airport we are actually listening to. Usually the active one; when it
// publishes no feed — O'Hare does not, and it is the busiest airport in the
// country — the nearest one that does, so the sky overhead still has a voice.
let _heard = null;

function _entry(icao) {
  return icao ? FEEDS[icao.toUpperCase()] || null : null;
}

function _nearestWithFeed(icao) {
  const here = AIRPORTS && AIRPORTS[icao];
  if (!here) return null;
  let best = null, bestKm = Infinity;
  for (const code of Object.keys(FEEDS)) {
    const there = FEEDS[code];
    if (there.lat === undefined) continue;
    const dLat = (there.lat - here.lat) * 111;
    const dLon = (there.lon - here.lon) * 111 * Math.cos((here.lat * Math.PI) / 180);
    const km = Math.hypot(dLat, dLon);
    if (km < bestKm) { bestKm = km; best = code; }
  }
  // Beyond a few hundred km it is no longer the same sky; say nothing instead.
  return bestKm <= 400 ? { code: best, km: Math.round(bestKm) } : null;
}

// Every feed within reach of the active airspace, nearest first. Over New
// York that is JFK, LaGuardia, Newark, Teterboro and White Plains: one sky,
// five towers, and the visitor can listen to any of them.
const NEARBY_KM = 60;
function _nearbyFeeds() {
  const here = (_icao && (FEEDS[_icao] || (AIRPORTS && AIRPORTS[_icao]))) || null;
  if (!here || here.lat === undefined) return [];
  const out = [];
  for (const code of Object.keys(FEEDS)) {
    const f = FEEDS[code];
    if (f.lat === undefined) continue;
    const dLat = (f.lat - here.lat) * 111;
    const dLon = (f.lon - here.lon) * 111 * Math.cos((here.lat * Math.PI) / 180);
    const km = Math.hypot(dLat, dLon);
    if (km <= NEARBY_KM) out.push({ code, km: Math.round(km) });
  }
  return out.sort((a, b) => a.km - b.km);
}
export function nextTower() {
  const list = _nearbyFeeds();
  if (list.length < 2) return;
  const i = Math.max(0, list.findIndex((x) => x.code === _heard));
  const n = list[(i + 1) % list.length];
  _heard = n.code;
  _nearby = n.code === _icao ? null : n;
  _mirrorIdx = 0;
  _preconnect(FEEDS[n.code].server);
  const url = feedFor(_icao);
  if (url) {
    const a = _ensureAudio();
    if (a.src !== url) a.src = url;
    if (_wanted) { _render('loading'); a.play().catch(() => _nextMirrorOrFail()); _armStall(); }
  }
  _render(_wanted ? 'loading' : _armed ? 'armed' : 'idle');
}

function feedFor(icao) {
  const order = _sources(_entry(_heard));
  if (!order.length) return null;
  // Clamped, not wrapped: wrapping walks back onto a source that has already
  // refused once, which is how a failover becomes a loop.
  return order[Math.min(_mirrorIdx, order.length - 1)];
}
function kindFor(icao) {
  const f = _entry(icao);
  return (f && f.kind) || 'tower';
}

function _render(state) {
  // One place decides whether the tower is audible, because there are four
  // ways in and only this one is passed through by all of them. Ducking on
  // startATC alone left the music under a controller who was not talking
  // whenever a feed stalled through every mirror and gave up.
  setRadioDucked(state === 'playing' || state === 'loading');
  if (!_wrap) return;
  // 'armed' is a standing state, not an event: any idle render while autoplay is
  // waiting should still read as waiting, including after an airspace change.
  if (state === 'idle' && _armed && !_wanted) state = 'armed';
  const has = !!feedFor(_icao);
  _wrap.classList.toggle('hidden', !has);
  const nx = document.getElementById('hud-atc-next');
  if (nx) nx.classList.toggle('hidden', _nearbyFeeds().length < 2);
  _btn?.classList.toggle('is-live', state === 'playing');
  _btn?.classList.toggle('is-busy', state === 'loading');
  // The tile is a widget now rather than one long string in a pill: the
  // station is the value, what kind of position it is and how far off it sits
  // is the caption, and what it is doing is its own line with a level meter
  // beside it. One string had to say all three and so said none of them
  // loudly -- and it changed width on every state, which made the tile twitch.
  const codeEl = document.getElementById('hud-atc-code');
  const kindEl = document.getElementById('hud-atc-kind');
  const lvlEl = document.getElementById('hud-atc-level');
  if (codeEl) codeEl.textContent = _heard || _icao || '----';
  if (kindEl) {
    // The tile is already headed TOWER, so repeating it under the station said
    // nothing twice. This line only earns its place when the position is not a
    // tower, or when the feed belongs to a different field than the one you
    // are looking at -- both of which change what you are listening to.
    const kind = kindFor(_heard).toUpperCase();
    const near = _nearby ? `${_nearby.km}km away` : '';
    const parts = [kind === 'TOWER' ? '' : kind, near].filter(Boolean);
    kindEl.textContent = parts.join(' · ');
    kindEl.classList.toggle('hidden', parts.length === 0);
  }
  if (lvlEl) {
    lvlEl.classList.toggle('is-live', state === 'playing');
    lvlEl.classList.toggle('is-busy', state === 'loading');
  }
  // The glyph swap keys off the tile rather than :has() on the button, since
  // the meter no longer lives inside it.
  _wrap?.classList.toggle('is-on', state === 'playing' || state === 'loading');
  if (_label) {
    // Name the host the element is actually on, not the one the index points at;
    // the two differed for a beat after a mirror switch.
    const host = (_audio && _audio.src && _audio.src.split('/')[2]?.split('.')[0]) ||
      (() => { const f = _entry(_heard); const order = f ? [f.server, ...MIRRORS.filter((m) => m !== f.server)] : MIRRORS; return order[_mirrorIdx % order.length]; })();
    _label.textContent =
      state === 'playing' ? 'Listening' :
      state === 'loading' ? `Tuning ${host.toUpperCase()}` :
      state === 'error'   ? 'No feed — press to retry' :
      state === 'armed'   ? 'Off' :
      'Off';
  }
}

function _ensureAudio() {
  if (_audio) return _audio;
  _audio = new Audio();
  // 'auto' rather than 'none': the element opens the stream and fills its buffer
  // while the page settles, so pressing the button starts sound immediately
  // instead of spending several seconds in "Tuning…".
  _audio.preload = 'auto';
  // No crossOrigin: we only play the stream, never read its samples, and
  // requesting CORS mode makes an otherwise playable stream fail.
  _audio.volume = 0.7;
  _audio.addEventListener('playing', () => { clearTimeout(_stallTimer); _render('playing'); });
  _audio.addEventListener('waiting', () => { _render('loading'); if (_wanted) _armStall(); });
  _audio.addEventListener('error', () => { if (_wanted) _nextMirrorOrFail(); else _render('idle'); });
  window._atcAudio = _audio; // for anyone diagnosing a silent stream from the console
  _audio.addEventListener('pause', () => { if (!_wanted) _render('idle'); });
  return _audio;
}

// One preconnect per mirror. The handshake to an Icecast host is most of the
// delay before first sound; doing it while the map is still drawing removes it
// from the moment the visitor actually acts.
function _preconnect(host) {
  if (document.querySelector(`link[data-atc="${host}"]`)) return;
  for (const rel of ['preconnect', 'dns-prefetch']) {
    const l = document.createElement('link');
    l.rel = rel; l.href = `https://${host}.liveatc.net`; l.crossOrigin = 'anonymous';
    l.dataset.atc = host;
    document.head.appendChild(l);
  }
}

export function initATC() {
  _wrap = document.getElementById('hud-atc');
  _btn = document.getElementById('hud-atc-btn');
  _label = document.getElementById('hud-atc-label');
  if (!_btn) return;
  _btn.addEventListener('click', () => (_wanted ? stopATC() : startATC()));
  const nx = document.getElementById('hud-atc-next');
  if (nx) nx.addEventListener('click', (e) => { e.stopPropagation(); nextTower(); });
  _render('idle');
}

/** Called whenever the active airspace changes. */
export function setATCAirport(icao) {
  const next = icao ? icao.toUpperCase() : null;
  if (next === _icao) return;
  _icao = next;
  _mirrorIdx = 0;
  _nearby = null;
  if (_entry(_icao)) {
    _heard = _icao;
  } else if (_icao) {
    // No feed here. Resolving the nearest one needs the full airport table, so
    // settle for silence now and re-resolve once it arrives.
    _heard = null;
    const want = _icao;
    _loadAirports().then(() => {
      if (_icao !== want || _entry(_heard)) return;
      const n = _nearestWithFeed(want);
      _heard = n ? n.code : null;
      _nearby = n;
      if (n) {
        _preconnect(FEEDS[n.code].server);
        const u = feedFor(want);
        if (u) {
          const a = _ensureAudio();
          if (a.src !== u) a.src = u;
          if (_wanted) a.play().catch(() => _render('error'));
        }
      }
      _render(_wanted ? 'loading' : _armed ? 'armed' : 'idle');
    });
  } else {
    _heard = null;
  }
  if (_wanted) {
    // Follow the listener to the new tower if it has one; otherwise fall silent.
    const url = feedFor(_icao);
    if (url) { _ensureAudio().src = url; _audio.play().catch(() => _render('error')); }
    else stopATC();
  }
  // Open the stream now so the buffer is already filling when the visitor acts.
  const f = _entry(_heard);
  if (f) _preconnect(f.server);
  const url = feedFor(_icao);
  if (url && !_wanted) { const a = _ensureAudio(); if (a.src !== url) a.src = url; }
  _render(_wanted ? 'loading' : _armed ? 'armed' : 'idle');
}

export function startATC() {
  const url = feedFor(_icao);
  if (!url) return;
  _wanted = true;
  const a = _ensureAudio();
  if (a.src !== url) a.src = url;
  _render('loading');
  a.play().catch(() => { if (_wanted) _nextMirrorOrFail(); });
  _armStall();
}

export function stopATC() {
  _wanted = false;
  _mirrorIdx = 0;
  clearTimeout(_stallTimer);
  if (_audio) { _audio.pause(); _audio.removeAttribute('src'); _audio.load(); }
  _render('idle');
}

export function isATCPlaying() { return _wanted; }

// Autoplay, honestly: no browser will start audio before the visitor has
// interacted with the page, so the feed is armed and begins on their first
// click, key or touch anywhere. Until then the control says it is waiting.
export function armATCAutoplay() {
  if (_armed) return;
  _armed = true;
  const go = () => {
    window.removeEventListener('pointerdown', go, true);
    window.removeEventListener('keydown', go, true);
    if (!_wanted && feedFor(_icao)) startATC();
  };
  window.addEventListener('pointerdown', go, true);
  window.addEventListener('keydown', go, true);
  _render('armed');
}
