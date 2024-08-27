import Router from '../lib/Router'

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
    path: '/contribution-thanks/:id',
  },
  {
    name: 'contributionThanks',
    path: '/contribution-thanks',
  },
  {
    name: 'mappingEvents',
    path: '/events',
  },
  {
    name: 'mappingEventDetail',
    path: '/events/:id',
  },
  {
    name: 'mappingEventJoin',
    path: '/events/:id/join',
  },
  {
    name: 'map',
    path: '/',
  },
]

export default new Router(routes)
