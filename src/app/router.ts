import Router from '../lib/Router';

const routes = [
  {
    name: 'equipment',
    path: '/nodes/:id/equipment/:eid',
  },
  {
    name: 'placeDetail',
    path: '/nodes/:id',
  },
  {
    name: 'way',
    path: '/way/:id',
  },
  {
    name: 'node',
    path: '/node/:id',
  },
  {
    name: 'relation',
    path: '/relation/:id',
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
    path: '/contribution-thanks/:id',
  },
  {
    name: 'contributionThanks',
    path: '/contribution-thanks',
  },
  {
    name: 'mappingEventJoin',
    path: '/events/:id/join',
  },
  {
    name: 'mappingEventDetail',
    path: '/events/:id',
  },
  {
    name: 'mappingEvents',
    path: '/events',
  },
  {
    name: 'map',
    path: '/',
  },
];

export default new Router(routes);
