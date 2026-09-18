// STRATUM Service Worker — smart caching by resource type
const CACHE_NAME = "stratum-v11";
const TILE_CACHE = "stratum-tiles-v1";
// v2: the tracks are AAC now, so every .mp3 entry in v1 is dead weight in
// somebody's browser that will never be requested again. The activate handler
// drops any cache not in `keep`, so renaming is the eviction.
const RADIO_CACHE = "stratum-radio-v3";
const TRAIL_CACHE = "stratum-trails-v1";

// Ten minutes: long enough that leaving and coming back paints the sky at once,
// short enough that nothing on screen is meaningfully behind where it was.
const TRAIL_MAX_AGE = 10 * 60 * 1000;
// One airspace is a few hundred aircraft; this holds a couple of them and then
// drops the oldest, so the cache cannot grow for the life of the browser.
const MAX_TRAIL_ENTRIES = 600;

async function _trimTrailCache(cache) {
  const keys = await cache.keys();
  if (keys.length <= MAX_TRAIL_ENTRIES) return;
  for (const k of keys.slice(0, keys.length - MAX_TRAIL_ENTRIES)) await cache.delete(k);
}

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
  const keep = new Set([CACHE_NAME, TILE_CACHE, RADIO_CACHE, TRAIL_CACHE]);
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

  // ── Not ours: the developer pages and anything a dev server serves ──────
  //
  // This worker is registered from the sky view at scope "/", which means it
  // also controls /dev/ and /dev/ife/ — the developer directory and the IFE
  // bench. Caching a bench is pointless, and the default branch below is
  // worse than pointless: it is network-first, but its catch falls back to
  // whatever is in the cache, so one failed fetch pins the page to a stale
  // copy of itself. That is exactly what happened — the bench went on running
  // a player that had been replaced, and reloading could not shift it,
  // because the reload was answered from here.
  //
  // Vite's own module URLs get the same treatment for the same reason: a dev
  // module has no business in a production cache, and a stale one is a lie
  // about what the source says.
  if (
    url.pathname.startsWith("/dev/") ||
    url.pathname.startsWith("/src/") ||
    url.pathname.startsWith("/@vite") ||
    url.pathname.startsWith("/@id") ||
    url.pathname.startsWith("/@fs") ||
    url.pathname.startsWith("/node_modules/")
  )
    return;
  // ── Trails: stale-while-revalidate ──────────────────────────────────────
  // Measured on a return visit: 148 requests to /api/trail, 35.5 seconds of
  // cumulative request time, and not one of them cached across visits, because
  // the blanket /api/ bail-out below skipped them. The shell was interactive in
  // 0.8s and the sky then took fourteen more seconds to grow its trails.
  //
  // A trail is history, so unlike a position it is safe to show a slightly old
  // copy: it is drawn instantly from cache and corrected within a second by the
  // revalidation that is already in flight. Capped at ten minutes -- past that
  // the aircraft has moved far enough that a stale trail would be a visible lie
  // rather than a head start, and the network answer is worth waiting for.
  if (url.pathname.startsWith("/api/trail")) {
    e.respondWith(
      caches.open(TRAIL_CACHE).then(async (cache) => {
        const hit = await cache.match(e.request);
        const fresh = fetch(e.request)
          .then((res) => {
            if (res.ok) {
              const clone = res.clone();
              const stamped = new Response(clone.body, {
                status: res.status,
                headers: (() => {
                  const h = new Headers(res.headers);
                  h.set("x-stratum-cached-at", String(Date.now()));
                  return h;
                })(),
              });
              cache.put(e.request, stamped).then(() => _trimTrailCache(cache));
            }
            return res;
          })
          .catch(() => hit || Response.error());
        if (!hit) return fresh;
        const at = Number(hit.headers.get("x-stratum-cached-at") || 0);
        if (Date.now() - at > TRAIL_MAX_AGE) return fresh;
        return hit;
      }),
    );
    return;
  }

  if (url.pathname.startsWith("/api/")) return;

  // ── Map tiles: cache-first (immutable by zoom/x/y) ──
  if (
    url.hostname.endsWith("basemaps.cartocdn.com") ||
    url.hostname === "server.arcgisonline.com" ||
    url.pathname.startsWith("/map/export/")
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
  if (url.pathname.startsWith("/radio/") && url.pathname.endsWith(".m4a")) {
    // Range requests go straight to the network, untouched.
    //
    // A media element asks for byte ranges -- to read an MP4's index, and
    // every time anyone drags the scrubber. This handler used to answer them
    // from the cache, and two things went wrong at once: a cached full 200 is
    // not a valid answer to a Range request, and `cache.put` REJECTS on the
    // 206 that comes back from the network ("Response must not be a partial
    // response"). That rejection was not caught, so the promise passed to
    // respondWith rejected, which the browser reports as a network error, so
    // the player's error handler advanced to the next track -- and then did
    // the same thing again, and again, silently, forever.
    // In practice a media element asks for ranges almost every time, so this
    // cache now fires rarely and repeat listening is carried by the HTTP cache
    // instead -- public/_headers gives /radio/ thirty days immutable, and the
    // browser's own cache handles ranged media correctly, which a Cache API
    // store fundamentally does not without slicing every response by hand.
    if (e.request.headers.has("range")) return;
    e.respondWith(
      caches.open(RADIO_CACHE).then((cache) =>
        cache.match(e.request).then((cached) => {
          if (cached) return cached;
          return fetch(e.request)
            .then((res) => {
              // Only a whole, ordinary response belongs in a cache.
              if (res.ok && res.status === 200) {
                cache.put(e.request, res.clone()).catch(() => {});
              }
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
    url.pathname.startsWith("/atc/") ||
    // The aircraft models and the fleet tables: four megabytes of static bytes
    // that were re-fetched on every visit because they sat outside this list.
    // Measured at 1.5-2.6s each on a return visit, and they gate the moment an
    // aircraft stops being a dot and becomes an aeroplane.
    url.pathname.startsWith("/airplane_model/") ||
    url.pathname.startsWith("/airlines/")
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
  // 'no-cache' so the browser's own HTTP cache revalidates with the edge
  // instead of answering from a copy it was told was good for a while: a
  // visitor was still running a bundle three deployments old because the
  // shell that named it came back from disk.
  e.respondWith(
    fetch(e.request, { cache: "no-cache" })
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
