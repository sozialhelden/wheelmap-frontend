import env from '../lib/env';
import { createEnvironmentJSResponseHandler } from '@sozialhelden/twelve-factor-dotenv';

import startServerSideApm from '../lib/apm/startServerSideApm';
import nextjs from 'next';
import * as path from 'path';
import express from 'express';
import proxy from 'http-proxy-middleware';
import cache from 'express-cache-headers';
import compression from 'compression';
import * as querystring from 'querystring';

import router from '../app/router';
import registerHealthChecks from './healthChecks';
console.log('Node version:', process.version);

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dir: path.join(__dirname, '..'), dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // TODO: Re-enable APM
  // startServerSideApm();

  const server = express();
  server.use(cache(3600));
  server.use(compression());

  // TODO: Deploy new native apps that bring their own localizations and remove this redirect
  server.use(
    ['/beta/i18n/*'],
    proxy({
      target: 'http://classic.wheelmap.org',
      changeOrigin: true,
    })
  );

  server.get(/\/beta/, (req, res) => {
    res.redirect(`${req.originalUrl.replace(/\/beta\/?/, '/')}`);
  });

  // Old urls from the classic rails app
  // First capturing group represents optional locale
  server.get(
    [
      /(\/[a-zA-Z_-]+)?\/map\/.+/,
      /(\/[a-zA-Z_-]+)?\/community_support\/new.*/,
      /(\/[a-zA-Z_-]+)?\/api\/docs.*/,
    ],
    (req, res) => {
      res.redirect(`http://classic.wheelmap.org${req.originalUrl}`);
    }
  );

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
      target: process.env.REACT_APP_LEGACY_API_BASE_URL,
      changeOrigin: true,
    })
  );

  registerHealthChecks(server);

  // Fallback for routes not found.
  server.get('*', (req, res) => {
    handle(req, res);
  });

  // Start server.
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
