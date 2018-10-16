// @flow

import NextRouter from 'next/router';

import type RouterHistory from './RouterHistory';
import Router from './Router';

type routerMethod = 'push' | 'replace';

class CordovaRouterHistory implements RouterHistory {
  router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  push(name: string, params: { [name: string]: any } = {}) {
    this.change('push', name, params);
  }

  replace(name: string, params: { [name: string]: any } = {}) {
    this.change('replace', name, params);
  }

  change(method: routerMethod, name: string, params: { [name: string]: any } = {}) {
    const route = this.router.getRoute(name, true);
    const path = this.router.generate(name, params);

    const query = { routeName: route.name, path, ...params };
    const pathname = window.location.pathname;
    NextRouter[method]({ pathname: '/cordova', query }, { pathname, query });
  }
}

export default CordovaRouterHistory;
