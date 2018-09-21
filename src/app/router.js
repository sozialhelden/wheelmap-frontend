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
    name: 'categories',
    path: '/categories/:category',
  },
  {
    name: 'map',
    path: '/',
  },
];

module.exports = new Router(routes);
