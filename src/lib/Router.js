"use strict";
exports.__esModule = true;
var path_to_regexp_1 = require("path-to-regexp");
var queryString = require("query-string");
// todo: types
var Router = /** @class */ (function () {
    function Router(routes) {
        this.routes = routes;
        this.compiledRouteCache = new Map();
    }
    Router.prototype.match = function (pathname) {
        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            var compiledRoute = this.getCompiledRoute(route);
            var match = compiledRoute.pattern.exec(pathname);
            if (!match) {
                continue;
            }
            var params = {};
            for (var i_1 = 1; i_1 < match.length; i_1++) {
                var key = compiledRoute.keys[i_1 - 1];
                var value = match[i_1];
                if (value === undefined) {
                    continue;
                }
                params[key.name] = key.repeat ? value.split(key.delimiter) : value;
            }
            return { route: route, params: params };
        }
        return null;
    };
    Router.prototype.generatePath = function (name, params) {
        if (params === void 0) { params = {}; }
        var route = this.getRoute(name, true);
        if (!route) {
            return null;
        }
        var compiledRoute = this.getCompiledRoute(route);
        var path = compiledRoute.generate(params);
        var query = {};
        var keys = Object.keys(params);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (compiledRoute.keyNames.indexOf(key) === -1) {
                query[key] = params[key];
            }
        }
        if (Object.keys(query).length > 0) {
            return path + "?" + queryString.stringify(query);
        }
        return path;
    };
    Router.prototype.getParams = function (route, routeParams) {
        var compiledRoute = this.getCompiledRoute(route);
        var params = {};
        var query = {};
        var keys = Object.keys(routeParams);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (compiledRoute.keyNames.indexOf(key) === -1) {
                query[key] = routeParams[key];
            }
            else {
                params[key] = routeParams[key];
            }
        }
        return { params: params, query: query };
    };
    Router.prototype.getRoute = function (nameOrPath, strict) {
        if (strict === void 0) { strict = false; }
        var route = this.routes.find(function (route) { return route.name === nameOrPath || route.path === nameOrPath; });
        if (strict && !route) {
            console.log("Could not find route " + nameOrPath + " in router configuration");
            return null;
        }
        return route;
    };
    Router.prototype.getCompiledRoute = function (route) {
        var compiledRoute = this.compiledRouteCache.get(route.path);
        if (!compiledRoute) {
            var keys = [];
            compiledRoute = {
                keys: keys,
                pattern: path_to_regexp_1["default"](route.path || '', keys),
                keyNames: keys.map(function (key) { return key.name; }),
                generate: path_to_regexp_1["default"].compile(route.path)
            };
            this.compiledRouteCache.set(route.path, compiledRoute);
        }
        return compiledRoute;
    };
    return Router;
}());
exports["default"] = Router;
