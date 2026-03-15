// Vercel Serverless Function — LiveATC stream proxy (Node.js runtime)
// Uses native https module for better Icecast stream compatibility

import https from 'https';

export default function handler(req, res) {
  const feed = (req.query.feed || '').toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (!feed) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).send('Missing feed parameter');
  }

  const servers = [
    `https://s1-fmt2.liveatc.net/${feed}`,
    `https://s1-bos.liveatc.net/${feed}`,
  ];

  let serverIdx = 0;

  function tryServer() {
    if (serverIdx >= servers.length) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(404).send('Feed unavailable');
    }

    const url = servers[serverIdx++];
    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; STRATUM/1.0)',
        'Referer': 'https://www.liveatc.net/',
      },
      timeout: 10000,
    }, (upstream) => {
      if (upstream.statusCode !== 200) {
        upstream.resume(); // drain
        return tryServer();
      }

      res.setHeader('Content-Type', upstream.headers['content-type'] || 'audio/mpeg');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-cache, no-store');
      upstream.pipe(res);
    });

    request.on('error', () => tryServer());
    request.on('timeout', () => {
      request.destroy();
      tryServer();
    });
  }

  tryServer();
}
