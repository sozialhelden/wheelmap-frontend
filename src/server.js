const nextjs = require('next');
const express = require('express');
const proxy = require('http-proxy-middleware');
const router = require('./app/router');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dir: __dirname, dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('*', (req, res, next) => {
    const match = router.match(req.path);

    if (!match) {
      return next();
    }

    app.render(req, res, '/index', { ...match.params, ...req.query, routeName: match.route.name });
  });

  // changeOrigin: overwrite host with target host (needed to proxy to cloudflare)
  server.use(
    ['/api/*', '/nodes/*'],
    proxy({ target: 'https://wheelmap.org/', changeOrigin: true })
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
