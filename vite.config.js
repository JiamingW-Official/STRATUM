import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    // Terser gives 8-12% smaller output than esbuild for complex JS
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,     // keep console.log for debugging
        passes: 2,               // two compression passes for better ratio
        pure_getters: true,
        unsafe_math: true,       // safe for float display math
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
          if (id.includes('node_modules/three/') && !id.includes('/addons/')) return 'three';
        },
      },
    },
  },
  server: {
    port: 4000,
    proxy: {
      '/api/adsbfi': {
        target: 'https://opendata.adsb.fi',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/adsbfi/, ''),
      },
      '/api/adsboe': {
        target: 'https://api.adsb.one',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/adsboe/, ''),
      },
      '/api/adsbx': {
        target: 'https://api.airplanes.live',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/adsbx/, ''),
      },
      '/api/trace': {
        target: 'https://globe.airplanes.live',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trace/, ''),
      },
      '/api/ovp-de': {
        target: 'https://overpass-api.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ovp-de/, ''),
      },
      '/api/ovp-kumi': {
        target: 'https://overpass.kumi.systems',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ovp-kumi/, ''),
      },
      '/api/ovp-ru': {
        target: 'https://maps.mail.ru/osm/tools/overpass',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ovp-ru/, ''),
      },
      '/api/hexdb': {
        target: 'https://hexdb.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hexdb/, ''),
      },
      '/api/opensky': {
        target: 'https://opensky-network.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/opensky/, ''),
      },
      '/api/adsbdb': {
        target: 'https://api.adsbdb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/adsbdb/, ''),
      },
      '/api/fir': {
        target: 'https://raw.githubusercontent.com/maiuswong/simaware-express/main/public/livedata',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/fir/, ''),
      },
      '/api/navaids': {
        target: 'https://davidmegginson.github.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/navaids/, ''),
      },
      // Worker smart endpoints — proxy to deployed Worker so dev mode uses real caching/aggregation
      '/api/positions': { target: 'https://stratum.jiamingwofficial.workers.dev', changeOrigin: true },
      '/api/airports':  { target: 'https://stratum.jiamingwofficial.workers.dev', changeOrigin: true },
      '/api/enrich':    { target: 'https://stratum.jiamingwofficial.workers.dev', changeOrigin: true },
      '/api/weather':   { target: 'https://stratum.jiamingwofficial.workers.dev', changeOrigin: true },
      '/api/atlas':     { target: 'https://stratum.jiamingwofficial.workers.dev', changeOrigin: true },
      '/api/routes':    { target: 'https://stratum.jiamingwofficial.workers.dev', changeOrigin: true },
      '/api/liveatc':   { target: 'https://stratum.jiamingwofficial.workers.dev', changeOrigin: true },
    },
  },
});
