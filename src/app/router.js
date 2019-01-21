const Router = require('../lib/Router');

const routes = [
  {
    name: 'placeDetail',
    path: '/nodes/:id',
  },
  {
    name: 'equipment',
    path: '/nodes/:id/equipment/:eid',
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
    name: 'createPlace',
    path: '/add-place',
  },
  {
    name: 'contributionThanks',
    path: '/contribution-thanks',
  },
  {
    name: 'map',
    path: '/',
  },
];

module.exports = new Router(routes);
