// @flow

import NextRouter from 'next/router';

import type RouterHistory from './RouterHistory';
import Router from './Router';

type routerMethod = 'push' | 'replace';

class NextRouterHistory implements RouterHistory {
  router: Router;
  isCordova: boolean;

  constructor(router: Router, isCordova: boolean = false) {
    this.router = router;
    this.isCordova = isCordova;
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

    if (this.isCordova) {
      const query = { routeName: route.name, path, ...params };
      const pathname = window.location.pathname;
      NextRouter[method]({ pathname: '/cordova', query }, { pathname });
    } else {
      const query = { routeName: route.name, ...params };
      NextRouter[method]({ pathname: '/main', query }, path);
    }
  }
}

export default NextRouterHistory;
