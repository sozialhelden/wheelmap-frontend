const Router = require('../lib/Router');

const routes = [
  {
    name: 'place_detail',
    path: '/nodes/:id',
  },
  {
    name: 'search',
    path: '/search',
  },
  {
    name: 'map',
    path: '/',
  },
];

module.exports = new Router(routes);
