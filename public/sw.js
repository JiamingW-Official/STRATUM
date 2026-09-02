// STRATUM Service Worker — smart caching by resource type
const CACHE_NAME = "stratum-v7";
const TILE_CACHE = "stratum-tiles-v1";
const RADIO_CACHE = "stratum-radio-v1";

// Sized for rasterised region images (~600KB each), not the 7KB tiles this cache
// originally held: 400 entries is roughly 240MB and covers ~80 cities at five
// images apiece. The limit was previously declared but never enforced, so the
// cache grew without bound.
const MAX_TILE_ENTRIES = 400;

// cache.keys() returns insertion order, so the overflow is the oldest.
async function trimTileCache(cache) {
  const keys = await cache.keys();
  const excess = keys.length - MAX_TILE_ENTRIES;
  for (let i = 0; i < excess; i++) await cache.delete(keys[i]);
}

self.addEventListener("install", (e) => {
  // Pre-cache the HTML shell and favicon for instant repeat visits
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(["/", "/favicon.svg"]).catch(() => {}))
      .then(() => self.skipWaiting()),
  );
});
self.addEventListener("activate", (e) => {
  const keep = new Set([CACHE_NAME, TILE_CACHE, RADIO_CACHE]);
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (url.pathname.startsWith("/api/")) return;

  // ── Map tiles: cache-first (immutable by zoom/x/y) ──
  if (
    url.hostname.endsWith("basemaps.cartocdn.com") ||
    url.hostname === "server.arcgisonline.com"
  ) {
    e.respondWith(
      caches.open(TILE_CACHE).then((cache) =>
        cache.match(e.request).then((cached) => {
          if (cached) return cached;
          return fetch(e.request)
            .then((res) => {
              // Storing must never take the response down with it: a full quota
              // makes cache.put reject, and an unhandled rejection here would
              // fail the image load itself.
              if (res.ok) {
                cache
                  .put(e.request, res.clone())
                  .then(() => trimTileCache(cache))
                  .catch(() => {});
              }
              return res;
            })
            .catch(() => cached || new Response("", { status: 408 }));
        }),
      ),
    );
    return;
  }

  // ── Radio MP3: cache-first ──
  if (url.pathname.startsWith("/radio/") && url.pathname.endsWith(".mp3")) {
    e.respondWith(
      caches.open(RADIO_CACHE).then((cache) =>
        cache.match(e.request).then((cached) => {
          if (cached) return cached;
          return fetch(e.request)
            .then((res) => {
              if (res.ok) cache.put(e.request, res.clone());
              return res;
            })
            .catch(() => cached || new Response("", { status: 408 }));
        }),
      ),
    );
    return;
  }

  // ── Hashed static assets, plus the static data files: cache-first ──
  // Content-hashed filenames are immutable — if the file changes, the hash changes.
  // /cifp/ waypoint tiles and /atc/airports.json are generated at build time and
  // change only with a deploy; without this they went to the network on every
  // airspace change, four tiles at a time. Cache-first means zero network after
  // the first visit, and the version bump above clears them on a new deploy.
  if (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/cifp/") ||
    url.pathname.startsWith("/atc/")
  ) {
    e.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(e.request).then((cached) => {
          if (cached) return cached;
          return fetch(e.request).then((res) => {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          });
        }),
      ),
    );
    return;
  }

  // ── HTML + SW itself: network-first (picks up new deployments) ──
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        }
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(e.request);
        return (
          cached ||
          new Response("Offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          })
        );
      }),
  );
});
