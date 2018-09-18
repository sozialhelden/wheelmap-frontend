const Router = require('./lib/Router');

const routes = [
  {
    name: 'nodes_detail',
    path: '/nodes/:id',
    nextPage: '/nodes',
  },
  {
    name: 'map',
    path: '/',
    nextPage: '/index',
  },
];

module.exports = new Router(routes);
