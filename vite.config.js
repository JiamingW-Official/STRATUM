import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4000,
    proxy: {
      '/api/adsbfi': {
        target: 'https://opendata.adsb.fi',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/adsbfi/, ''),
      },
      '/api/adsblo': {
        target: 'https://api.adsb.lol',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/adsblo/, ''),
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
      '/api/adsbdb': {
        target: 'https://api.adsbdb.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/adsbdb/, ''),
      },
    },
  },
});
