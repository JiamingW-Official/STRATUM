import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
// vite.config.js is an ES module, so __dirname does not exist here.
const r = (p) => fileURLToPath(new URL(p, import.meta.url));
import { execSync } from "node:child_process";
import { HttpsProxyAgent } from "https-proxy-agent";

// Vite's dev proxy is node-http-proxy, which dials upstreams directly: it honours
// neither the *_PROXY env vars nor the OS proxy the browser is using. On a network
// that can only reach these hosts through a local proxy, every /api/* route fails
// (workers.dev and both Overpass mirrors time out or get connection-refused) while
// the browser's own requests succeed — so the app silently runs on its slow
// fallback paths. Resolve a proxy and hand node-http-proxy an agent for it.
function detectProxy() {
  const fromEnv =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy;
  if (fromEnv) return fromEnv;
  if (process.platform !== "darwin") return null;
  try {
    const out = execSync("scutil --proxy", { encoding: "utf8", timeout: 2000 });
    if (!/HTTPSEnable\s*:\s*1/.test(out)) return null;
    const host = out.match(/HTTPSProxy\s*:\s*(\S+)/)?.[1];
    const port = out.match(/HTTPSPort\s*:\s*(\d+)/)?.[1];
    return host && port ? `http://${host}:${port}` : null;
  } catch {
    return null;
  }
}

const PROXY_URL = detectProxy();
const proxyAgent = PROXY_URL ? new HttpsProxyAgent(PROXY_URL) : undefined;
console.log(
  PROXY_URL
    ? `[stratum] dev proxy upstreams routed via ${PROXY_URL}`
    : "[stratum] no system/env proxy detected — dev proxy dials upstreams directly",
);

const WORKER_ORIGIN = "https://stratum.jiamingwofficial.workers.dev";

// path prefix → upstream origin. Each is stripped from the path before forwarding.
const PASSTHROUGH = {
  "/api/adsbfi": "https://opendata.adsb.fi",
  "/api/adsboe": "https://api.adsb.one",
  "/api/adsbx": "https://api.airplanes.live",
  "/api/trace": "https://globe.airplanes.live",
  "/api/ovp-de": "https://overpass-api.de",
  "/api/ovp-kumi": "https://overpass.kumi.systems",
  "/api/hexdb": "https://hexdb.io",
  "/api/opensky": "https://opensky-network.org",
  "/api/adsbdb": "https://api.adsbdb.com",
  "/api/fir":
    "https://raw.githubusercontent.com/maiuswong/simaware-express/main/public/livedata",
  "/api/navaids": "https://davidmegginson.github.io",
};

// Worker smart endpoints — forwarded to the deployed Worker so dev mode gets the
// same caching and multi-source aggregation as production.
const WORKER_ROUTES = [
  "/api/boot",
  "/api/positions",
  "/api/airports",
  "/api/enrich",
  "/api/trail",
  "/api/visibility",
  // The naming commons. Missing here, dev served the SPA shell for it and every
  // claim came back as HTML.
  "/api/ghost",
  "/map/export",
  "/api/weather",
  "/api/atlas",
  "/api/routes",
  "/api/liveatc",
];

// globe.airplanes.live serves trace history only to requests carrying its own
// Referer; anything else gets a 403, which is why trail backfill never worked and
// trails only ever grew from live sampling.
const EXTRA_HEADERS = {
  "/api/trace": { Referer: "https://globe.airplanes.live/" },
};

// index.html loads type from /fonts/css/…, which the Worker proxies to Google
// Fonts in production. Dev had no route for it, so the request fell through to
// the SPA index.html and no font ever loaded — every local screenshot was
// rendering system fallbacks. Proxy the CSS here; the stylesheet it returns
// references fonts.gstatic.com directly, which the browser can reach itself.
const fontProxy = {
  "/fonts/css": {
    target: "https://fonts.googleapis.com",
    changeOrigin: true,
    agent: proxyAgent,
    rewrite: (path) => path.replace(/^\/fonts\/css/, ""),
  },
  "/fonts/file": {
    target: "https://fonts.gstatic.com",
    changeOrigin: true,
    agent: proxyAgent,
    rewrite: (path) => path.replace(/^\/fonts\/file/, ""),
  },
};

const apiProxy = { ...fontProxy };
for (const [prefix, target] of Object.entries(PASSTHROUGH)) {
  apiProxy[prefix] = {
    target,
    changeOrigin: true,
    agent: proxyAgent,
    headers: EXTRA_HEADERS[prefix],
    rewrite: (path) => path.slice(prefix.length),
  };
}
for (const prefix of WORKER_ROUTES) {
  apiProxy[prefix] = {
    target: WORKER_ORIGIN,
    changeOrigin: true,
    agent: proxyAgent,
  };
}

export default defineConfig({
  // Fast Refresh, at last. Only .tsx/.jsx go through it, so the sky view's
  // Vanilla JS is untouched.
  //
  // The note that used to sit here said the matching plugin could not be
  // installed from this network. That was wrong about which package was
  // missing: @vitejs/plugin-react@5 does support Vite 7 and had in fact
  // installed, and the hole was react-refresh — which an earlier install
  // reported as a success without ever writing it to disk. Without Fast
  // Refresh an edit needed a manual reload, and a stale service worker made
  // even that unreliable, so two problems were wearing each other's clothes.
  plugins: [react()],
  optimizeDeps: {
    // maplibre spawns its tile worker with `new Worker(new URL(...))`. Run
    // through the dep optimiser that URL points at a chunk which is never
    // emitted (404), so the raster basemap still draws on the main thread
    // while every GeoJSON source silently stays unloaded — a map with no
    // route on it and no error to explain why. Excluded, Vite's own worker
    // handling applies and the sources load.
    exclude: ["maplibre-gl"],
  },
  build: {
    // Terser gives 8-12% smaller output than esbuild for complex JS
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false, // keep console.log for debugging
        passes: 2, // two compression passes for better ratio
        pure_getters: true,
        unsafe_math: true, // safe for float display math
      },
      mangle: { toplevel: false },
      format: { comments: false },
    },
    rollupOptions: {
      // Multi-page, not a single-page app with a router. Every route is a real
      // file, so Cloudflare and Vercel both serve it from the filesystem and
      // nothing depends on a not-found fallback -- which, measured today,
      // throws on the deployed Worker for any path that is not a real file.
      input: {
        sky: r("index.html"),
        dev: r("dev/index.html"),
        ifeBench: r("dev/ife/index.html"),
        bookBench: r("dev/book/index.html"),
      },
      output: {
        // Split heavy chunks so critical path is smaller:
        // - three.js: 3D engine, needed on first frame
        // - maplibre: only the IFE bench pulls it, so it must not land in the
        //   sky view's critical path
        manualChunks(id) {
          // three core only — addons now lazy-loaded, so they split naturally
          if (id.includes("node_modules/three/") && !id.includes("/addons/"))
            return "three";
          if (id.includes("node_modules/maplibre-gl/")) return "maplibre";
        },
      },
    },
  },
  server: {
    port: 4000,
    proxy: apiProxy,
  },
  // The built bundle is the one that ships, and it was the one that could not
  // be run: preview had no proxy, so every /api route 404'd and the app sat at
  // "Connecting...". Same upstreams as dev, different port so both can be up.
  preview: {
    port: 4100,
    proxy: apiProxy,
  },
});
