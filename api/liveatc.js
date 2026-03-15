// Vercel Edge Function — LiveATC stream proxy
// Sets Referer header so LiveATC accepts the request, streams audio back
export const config = { runtime: 'edge' };

const SERVERS = [
  'https://s1-bos.liveatc.net/',
  'https://s1-fmt2.liveatc.net/',
];

export default async function handler(req) {
  const url = new URL(req.url);
  const feed = (url.searchParams.get('feed') || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (!feed) {
    return new Response('Missing feed parameter', {
      status: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }

  for (const server of SERVERS) {
    try {
      const upstream = await fetch(server + feed, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; STRATUM/1.0)',
          'Referer': 'https://www.liveatc.net/',
        },
        signal: AbortSignal.timeout(8000),
      });
      if (upstream.ok) {
        return new Response(upstream.body, {
          headers: {
            'Content-Type': upstream.headers.get('Content-Type') || 'audio/mpeg',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store',
          },
        });
      }
    } catch { /* try next server */ }
  }

  return new Response('Feed unavailable', {
    status: 404,
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
