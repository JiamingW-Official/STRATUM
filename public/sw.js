// STRATUM Service Worker — smart caching by resource type
const CACHE_NAME = 'stratum-v6';
const TILE_CACHE = 'stratum-tiles-v1';
const RADIO_CACHE = 'stratum-radio-v1';

const MAX_TILE_ENTRIES = 4000;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  const keep = new Set([CACHE_NAME, TILE_CACHE, RADIO_CACHE]);
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !keep.has(k)).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (url.pathname.startsWith('/api/')) return;

  // ── Map tiles: cache-first (immutable by zoom/x/y) ──
  if (url.hostname.endsWith('basemaps.cartocdn.com')) {
    e.respondWith(
      caches.open(TILE_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          }).catch(() => cached || new Response('', { status: 408 }));
        })
      )
    );
    return;
  }

  // ── Radio MP3: cache-first ──
  if (url.pathname.startsWith('/radio/') && url.pathname.endsWith('.mp3')) {
    e.respondWith(
      caches.open(RADIO_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          }).catch(() => cached || new Response('', { status: 408 }));
        })
      )
    );
    return;
  }

  // ── Hashed static assets (/assets/*.js, /assets/*.css): cache-first ──
  // Content-hashed filenames are immutable — if the file changes, the hash changes.
  // Cache-first here means repeat visits load from disk instantly, zero network.
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(res => {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          });
        })
      )
    );
    return;
  }

  // ── HTML + SW itself: network-first (picks up new deployments) ──
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(async () => {
      const cached = await caches.match(e.request);
      return cached || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    })
  );
});
