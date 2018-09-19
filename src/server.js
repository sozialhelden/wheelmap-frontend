const next = require('next');
const express = require('express');
const proxy = require('http-proxy-middleware');

const router = require('./router');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: __dirname, dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('*', (req, res, next) => {
    const match = router.match(req.path);

    if (!match) {
      return next();
    }

    if (!match.route.nextPage) {
      throw new Error('Missing "nextPage" config in route.');
    }

    app.render(req, res, match.route.nextPage, { ...req.query, ...match.params });
  });

  // changeOrigin: overwrite host with target host (needed to proxy to cloudflare)
  server.use(
    ['/api/*', '/nodes/*'],
    proxy({ target: process.env.WHEELMAP_PROXY_URL, changeOrigin: true })
  );

  // Fallback for routes not found.
  server.get('*', (req, res) => {
    handle(req, res);
  });

  // Start server.
  server.listen(port, error => {
    if (error) throw error;

    console.log(`> Ready on http://localhost:${port}`);
  });
});
