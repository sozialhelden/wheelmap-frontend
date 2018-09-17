const next = require('next');
const express = require('express');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: __dirname, dev });
const handle = app.getRequestHandler();

const mapping = [{ to: '/nodes/:id', page: '/nodes' }, { to: '/', page: '/index' }];

app.prepare().then(() => {
  const server = express();

  mapping.forEach(route => {
    // Add route to server.
    server.get(route.to, (req, res) => {
      app.render(req, res, route.page, { ...req.query, ...req.params });
    });
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
