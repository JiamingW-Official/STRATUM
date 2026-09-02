// ── Tower audio ──
// The one trace a ghost still leaves: it will not let you see who it is, but
// it still talks to the tower. Streams come straight from LiveATC's Icecast
// servers — verified to allow cross-origin playback — with no proxy and no
// spoofed headers. Audio is attributed on screen. The map of airport → feed is
// built at development time and only contains feeds that answered as audio.
import FEEDS from '../data/atcFeeds.json';

let _audio = null;
let _icao = null;
// A mount is served from more than one Icecast mirror and the resolver rotates
// between them; if the recorded one refuses, try the others with the same mount.
const MIRRORS = ['s1-bos', 's1-fmt2', 's1-lax', 's1-dal'];
let _mirrorIdx = 0;
let _btn = null, _label = null, _wrap = null;
let _wanted = false;

function feedFor(icao) {
  const f = icao && FEEDS[icao.toUpperCase()];
  if (!f) return null;
  const order = [f.server, ...MIRRORS.filter((m) => m !== f.server)];
  return `https://${order[_mirrorIdx % order.length]}.liveatc.net/${f.mount}`;
}
function kindFor(icao) {
  const f = icao && FEEDS[icao.toUpperCase()];
  return (f && f.kind) || 'tower';
}

function _render(state) {
  if (!_wrap) return;
  const has = !!feedFor(_icao);
  _wrap.classList.toggle('hidden', !has);
  _btn?.classList.toggle('is-live', state === 'playing');
  _btn?.classList.toggle('is-busy', state === 'loading');
  if (_label) {
    _label.textContent =
      state === 'playing' ? `Listening · ${_icao} ${kindFor(_icao)}` :
      state === 'loading' ? 'Tuning…' :
      state === 'error'   ? 'Feed unavailable' :
                            `Hear ${_icao || 'the'} ${kindFor(_icao)}`;
  }
}

function _ensureAudio() {
  if (_audio) return _audio;
  _audio = new Audio();
  _audio.preload = 'none';
  _audio.crossOrigin = 'anonymous';
  _audio.volume = 0.7;
  _audio.addEventListener('playing', () => _render('playing'));
  _audio.addEventListener('waiting', () => _render('loading'));
  _audio.addEventListener('error', () => {
    // One retry per mirror, then give up honestly.
    if (_wanted && _mirrorIdx < MIRRORS.length - 1) {
      _mirrorIdx++;
      const url = feedFor(_icao);
      if (url) { _audio.src = url; _audio.play().catch(() => {}); return; }
    }
    _wanted = false; _mirrorIdx = 0; _render('error');
  });
  _audio.addEventListener('pause', () => { if (!_wanted) _render('idle'); });
  return _audio;
}

export function initATC() {
  _wrap = document.getElementById('hud-atc');
  _btn = document.getElementById('hud-atc-btn');
  _label = document.getElementById('hud-atc-label');
  if (!_btn) return;
  _btn.addEventListener('click', () => (_wanted ? stopATC() : startATC()));
  _render('idle');
}

/** Called whenever the active airspace changes. */
export function setATCAirport(icao) {
  const next = icao ? icao.toUpperCase() : null;
  if (next === _icao) return;
  _icao = next;
  _mirrorIdx = 0;
  if (_wanted) {
    // Follow the listener to the new tower if it has one; otherwise fall silent.
    const url = feedFor(_icao);
    if (url) { _ensureAudio().src = url; _audio.play().catch(() => _render('error')); }
    else stopATC();
  }
  _render(_wanted ? 'loading' : 'idle');
}

export function startATC() {
  const url = feedFor(_icao);
  if (!url) return;
  _wanted = true;
  const a = _ensureAudio();
  if (a.src !== url) a.src = url;
  _render('loading');
  a.play().catch(() => { _wanted = false; _render('error'); });
}

export function stopATC() {
  _wanted = false;
  _mirrorIdx = 0;
  if (_audio) { _audio.pause(); _audio.removeAttribute('src'); _audio.load(); }
  _render('idle');
}

export function isATCPlaying() { return _wanted; }
