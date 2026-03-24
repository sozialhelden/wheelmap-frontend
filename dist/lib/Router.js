"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_to_regexp_1 = require("path-to-regexp");
var queryString = __importStar(require("query-string"));
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
            return "".concat(path, "?").concat(queryString.stringify(query));
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
            console.log("Could not find route ".concat(nameOrPath, " in router configuration"));
            return null;
        }
        return route;
    };
    Router.prototype.getCompiledRoute = function (route) {
        var compiledRoute = this.compiledRouteCache.get(route.path);
        if (!compiledRoute) {
            var keys_1 = [];
            compiledRoute = {
                keys: keys_1,
                pattern: new RegExp(route.path.replace(/:[a-zA-Z0-9]+/g, function (match) {
                    keys_1.push({ name: match.slice(1), repeat: false, delimiter: '/' });
                    return '([^/]+)';
                })),
                keyNames: keys_1.map(function (key) { return key.name; }),
                generate: (0, path_to_regexp_1.compile)(route.path),
            };
            this.compiledRouteCache.set(route.path, compiledRoute);
        }
        return compiledRoute;
    };
    return Router;
}());
exports.default = Router;
