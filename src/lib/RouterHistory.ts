import Router from './Router';

export interface Route {
  name: string;
}

export type RouterHistoryMethod = 'push' | 'replace';

export type RouteParams = { [name: string]: any };

export interface RouterHistory {
  push(name: string, params?: RouteParams): void;
  replace(name: string, params?: RouteParams): void;
  getRoute(name: string): Route;
  generatePath(name: string, params?: RouteParams): string;
}

class AbstractRouterHistory implements RouterHistory {
  router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  getRoute(name: string): Route {
    return this.router.getRoute(name, true);
  }

  generatePath(name: string, params: RouteParams = {}): string {
    return this.router.generatePath(name, params);
  }

  push(name: string, params?: RouteParams) {
    throw new Error('Please implement this in your subclass.');
  }

  replace(name: string, params?: RouteParams) {
    throw new Error('Please implement this in your subclass.');
  }
}

export default AbstractRouterHistory;
