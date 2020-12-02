"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var env_1 = require("../lib/env");
var twelve_factor_dotenv_1 = require("@sozialhelden/twelve-factor-dotenv");
// import apm from '../lib/apm/ServerSide';
var next_1 = require("next");
var path = require("path");
var express_1 = require("express");
var http_proxy_middleware_1 = require("http-proxy-middleware");
var express_cache_headers_1 = require("express-cache-headers");
var compression_1 = require("compression");
var querystring = require("querystring");
var router_1 = require("../app/router");
var healthChecks_1 = require("./healthChecks");
console.log('Node version:', process.version);
var port = parseInt(process.env.PORT, 10) || 3000;
var dev = process.env.NODE_ENV !== 'production';
var app = next_1["default"]({ dir: path.join(__dirname, '..'), dev: dev });
var handle = app.getRequestHandler();
app.prepare().then(function () {
    var server = express_1["default"]();
    server.use(express_cache_headers_1["default"](3600));
    server.use(compression_1["default"]());
    // TODO: Deploy new native apps that bring their own localizations and remove this redirect
    server.use(['/beta/i18n/*'], http_proxy_middleware_1["default"]({
        target: 'http://classic.wheelmap.org',
        changeOrigin: true
    }));
    server.get(/\/beta/, function (req, res) {
        res.redirect("" + req.originalUrl.replace(/\/beta\/?/, '/'));
    });
    // Old urls from the classic rails app
    // First capturing group represents optional locale
    server.get([
        /(\/[a-zA-Z_-]+)?\/map\/.+/,
        /(\/[a-zA-Z_-]+)?\/community_support\/new.*/,
        /(\/[a-zA-Z_-]+)?\/api\/docs.*/,
    ], function (req, res) {
        res.redirect("http://classic.wheelmap.org" + req.originalUrl);
    });
    server.get([/(\/[a-zA-Z_-]+)?\/embed.*/], function (req, res) {
        var extendedQueryString = querystring.stringify(__assign(__assign({}, req.query), { embedded: true }));
        res.redirect("/?" + extendedQueryString);
    });
    server.get('/:lang?/map', function (req, res) {
        var lang = req.param('lang');
        res.redirect("/" + (lang ? "?locale=" + lang : ''));
    });
    // Provides access to a filtered set of environment variables on the client.
    // Read https://github.com/sozialhelden/twelve-factor-dotenv for more infos.
    server.get('/clientEnv.js', twelve_factor_dotenv_1.createEnvironmentJSResponseHandler(env_1["default"]));
    server.get('*', function (req, res, next) {
        var match = router_1["default"].match(req.path);
        if (!match) {
            return next();
        }
        app.render(req, res, '/main', __assign(__assign(__assign({}, match.params), req.query), { routeName: match.route.name }));
    });
    // changeOrigin: overwrite host with target host (needed to proxy to cloudflare)
    server.use(['/api/*', '/nodes/*'], http_proxy_middleware_1["default"]({
        target: process.env.REACT_APP_LEGACY_API_BASE_URL,
        changeOrigin: true
    }));
    healthChecks_1["default"](server);
    // Fallback for routes not found.
    server.get('*', function (req, res) {
        handle(req, res);
    });
    // Start server.
    server.listen(port, function () {
        console.log("> Ready on http://localhost:" + port);
    });
});
