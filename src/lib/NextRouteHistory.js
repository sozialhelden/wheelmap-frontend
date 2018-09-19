// @flow

import NextRouter from 'next/router';

import type RouterHistory from './RouterHistory';
import Router from './Router';

type routerMethod = 'push' | 'replace';

class NextRouterHistory implements RouterHistory {
  router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  push(name: string, params: { [name: string]: any } = {}) {
    this.change('push', name, params);
  }

  change(method: routerMethod, name: string, params: { [name: string]: any } = {}) {
    const route = this.router.getRoute(name, true);
    const path = this.router.generate(name, params);

    NextRouter[method]({ pathname: '/index', query: { routeName: route.name, ...params } }, path);
  }
}

export default NextRouterHistory;
