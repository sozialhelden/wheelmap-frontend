const next = require('next');
const express = require('express');

const routes = require('./routes');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: __dirname, dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.get('*', (req, res, next) => {
    const match = routes.match(req.path);

    if (!match) {
      return next();
    }

    if (!match.route.nextPage) {
      throw new Error('Missing "nextPage" config in route.');
    }

    app.render(req, res, match.route.nextPage, { ...req.query, ...match.params });
  });

  // Fallback for routes not found.
  server.get('*', (req, res) => {
    handle(req, res);
  });

  // Start server.
  server.listen(port, error => {
    if (error) throw error;

    console.log('> Ready on http://localhost:3000');
  });
});
