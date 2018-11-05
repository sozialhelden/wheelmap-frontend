const nextjs = require('next');
const express = require('express');
const proxy = require('http-proxy-middleware');
const router = require('./app/router');
const env = require('./lib/env');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dir: __dirname, dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Old urls from the classic rails app
  // First capturing group represents optional locale
  server.get(
    [
      /(\/[a-zA-Z_-]+)?\/map\/.+/,
      /(\/[a-zA-Z_-]+)?\/community_support\/new.*/,
      /(\/[a-zA-Z_-]+)?\/embed.*/,
    ],
    (req, res) => {
      res.redirect(`https://classic.wheelmap.org${req.originalUrl}`);
    }
  );

  server.get('/:lang?/map', (req, res) => {
    const lang = req.param('lang');

    res.redirect(`/${lang ? `?locale=${lang}` : ''}`);
  });

  server.get('*', (req, res, next) => {
    const match = router.match(req.path);

    if (!match) {
      return next();
    }

    app.render(req, res, '/main', { ...match.params, ...req.query, routeName: match.route.name });
  });

  // changeOrigin: overwrite host with target host (needed to proxy to cloudflare)
  server.use(
    ['/api/*', '/nodes/*'],
    proxy({
      target: env.public.wheelmap.baseUrl,
      changeOrigin: true,
    })
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
