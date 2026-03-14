// Cloudflare Worker — API proxy for STRATUM
// Proxies /api/* requests to upstream services, serves static assets for everything else

const PROXY_ROUTES = {
  '/api/adsbfi/':   'https://opendata.adsb.fi/',
  '/api/adsboe/':   'https://api.adsb.one/',
  '/api/adsbx/':    'https://api.airplanes.live/',
  '/api/trace/':    'https://globe.airplanes.live/',
  '/api/hexdb/':    'https://hexdb.io/',
  '/api/opensky/':  'https://opensky-network.org/',
  '/api/ovp-de/':   'https://overpass-api.de/',
  '/api/ovp-kumi/': 'https://overpass.kumi.systems/',
  '/api/ovp-ru/':   'https://maps.mail.ru/osm/tools/overpass/',
  '/api/adsbdb/':   'https://api.adsbdb.com/',
  '/api/fir/':      'https://raw.githubusercontent.com/maiuswong/simaware-express/main/public/livedata/',
  '/api/navaids/':  'https://davidmegginson.github.io/',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // API proxy
    for (const [prefix, target] of Object.entries(PROXY_ROUTES)) {
      if (url.pathname.startsWith(prefix)) {
        const path = url.pathname.slice(prefix.length);
        const proxyUrl = target + path + url.search;

        const headers = { 'User-Agent': 'STRATUM/1.0' };
        const ct = request.headers.get('Content-Type');
        if (ct) headers['Content-Type'] = ct;
        const accept = request.headers.get('Accept');
        if (accept) headers['Accept'] = accept;

        const upstream = await fetch(proxyUrl, {
          method: request.method,
          headers,
          body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
        });

        const response = new Response(upstream.body, {
          status: upstream.status,
          statusText: upstream.statusText,
          headers: upstream.headers,
        });
        response.headers.set('Access-Control-Allow-Origin', '*');
        return response;
      }
    }

    // Static assets fallback
    return env.ASSETS.fetch(request);
  },
};
