import { createEnvironmentJSResponseHandler } from '@sozialhelden/twelve-factor-dotenv';
import compression from 'compression';
import express from 'express';
import cache from 'express-cache-headers';
import { createProxyMiddleware } from 'http-proxy-middleware';
import nextjs from 'next';
import * as path from 'path';
import * as querystring from 'querystring';
import env from '../lib/env';

import router from '../app/router';
import registerHealthChecks from './healthChecks';
console.log('Node version:', process.version);

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dir: path.join(__dirname, '..'), dev });

app.prepare().then(() => {
  const server = express();
  server.use(cache(3600));
  server.use(compression());
  server.use(express.static('public'));
  server.use(
    ['/t/*'],
    createProxyMiddleware({
      target: 'https://service.sozialhelden.de/',
      pathRewrite: {
        '^/t/': '/',
      },
      changeOrigin: true,
      logLevel: 'debug',
    })
  );

  server.get(/\/beta/, (req, res) => {
    res.redirect(`${req.originalUrl.replace(/\/beta\/?/, '/')}`);
  });

  server.get([/(\/[a-zA-Z_-]+)?\/embed.*/], (req, res) => {
    const extendedQueryString = querystring.stringify({
      ...req.query,
      embedded: true,
    });
    res.redirect(`/?${extendedQueryString}`);
  });

  server.get('/:lang?/map', (req, res) => {
    const lang = req.param('lang');

    res.redirect(`/${lang ? `?locale=${lang}` : ''}`);
  });

  // Provides access to a filtered set of environment variables on the client.
  // Read https://github.com/sozialhelden/twelve-factor-dotenv for more infos.
  server.get('/clientEnv.js', createEnvironmentJSResponseHandler(env));

  server.get(
    '/nodes/:id',
    (req, res, next) => {
      const id = req.params.id;
      console.log('id', id);
      if (!id.match(/^-?\d+$/)) {
        return next();
      }
      if (id.slice(0, 1) === '-') {
        res.redirect(`/way/${id.replace(/-/, '')}`);
        return;
      }
      res.redirect(`/node/${id}`);
    }
  );
  
  registerHealthChecks(server);

  server.get('*', (req, res, next) => {
    const match = router.match(req.path);

    if (!match) {
      return next();
    }

    console.log('Match!', match);

    app.render(req, res, '/main', { ...match.params, ...req.query, routeName: match.route.name });
  });

  server.use(
    ['/images/*'],
    createProxyMiddleware({
      target: process.env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL,
      changeOrigin: true,
    })
  );

  const handle = app.getRequestHandler();

  // Fallback for routes not found.
  server.get('*', (req, res) => {
    handle(req, res);
  });

  // Start server.
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
