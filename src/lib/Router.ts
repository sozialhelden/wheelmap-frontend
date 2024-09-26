import { compile } from 'path-to-regexp';
import * as queryString from 'query-string';

// todo: types
class Router {
  private routes: any
  private compiledRouteCache: any

  constructor(routes) {
    this.routes = routes;
    this.compiledRouteCache = new Map();
  }

  public match(pathname) {
    for (let i = 0; i < this.routes.length; i++) {
      const route = this.routes[i];
      const compiledRoute = this.getCompiledRoute(route);
      const match = compiledRoute.pattern.exec(pathname);

      if (!match) {
        continue;
      }

      const params = {};

      for (let i = 1; i < match.length; i++) {
        const key = compiledRoute.keys[i - 1];
        const value = match[i];

        if (value === undefined) {
          continue;
        }

        params[key.name] = key.repeat ? value.split(key.delimiter) : value;
      }

      return { route, params };
    }

    return null;
  }

  public generatePath(name, params = {}) {
    const route = this.getRoute(name, true);

    if (!route) {
      return null;
    }

    const compiledRoute = this.getCompiledRoute(route);
    const path = compiledRoute.generate(params);

    const query = {};

    const keys = Object.keys(params);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (compiledRoute.keyNames.indexOf(key) === -1) {
        query[key] = params[key];
      }
    }

    if (Object.keys(query).length > 0) {
      return `${path}?${queryString.stringify(query)}`;
    }

    return path;
  }

  public getParams(route, routeParams) {
    const compiledRoute = this.getCompiledRoute(route);
    const params = {};
    const query = {};

    const keys = Object.keys(routeParams);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (compiledRoute.keyNames.indexOf(key) === -1) {
        query[key] = routeParams[key];
      } else {
        params[key] = routeParams[key];
      }
    }

    return { params, query };
  }

  public getRoute(nameOrPath, strict = false) {
    const route = this.routes.find(route => route.name === nameOrPath || route.path === nameOrPath);
    if (strict && !route) {
      console.log(`Could not find route ${nameOrPath} in router configuration`);
      return null;
    }

    return route;
  }

  public getCompiledRoute(route) {
    let compiledRoute = this.compiledRouteCache.get(route.path);

    if (!compiledRoute) {
      const keys = [];
      compiledRoute = {
        keys,
        pattern: new RegExp(
          route.path.replace(/:[a-zA-Z0-9]+/g, (match) => {
            keys.push({ name: match.slice(1), repeat: false, delimiter: '/' });
            return '([^/]+)';
          })
        ),
        keyNames: keys.map(key => key.name),
        generate: compile(route.path),
      };

      this.compiledRouteCache.set(route.path, compiledRoute);
    }

    return compiledRoute;
  }
}

export default Router
