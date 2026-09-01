import { defineConfig } from "vite";
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

const apiProxy = {};
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
  plugins: [],
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
      output: {
        // Split heavy chunks so critical path is smaller:
        // - three.js: 3D engine, needed on first frame
        // - data: large static datasets, most used post-init
        manualChunks(id) {
          // three core only — addons now lazy-loaded, so they split naturally
          if (id.includes("node_modules/three/") && !id.includes("/addons/"))
            return "three";
        },
      },
    },
  },
  server: {
    port: 4000,
    proxy: apiProxy,
  },
});
