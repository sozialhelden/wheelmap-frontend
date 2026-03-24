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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var twelve_factor_dotenv_1 = require("@sozialhelden/twelve-factor-dotenv");
var compression_1 = __importDefault(require("compression"));
var express_1 = __importDefault(require("express"));
var express_cache_headers_1 = __importDefault(require("express-cache-headers"));
var http_proxy_middleware_1 = require("http-proxy-middleware");
var next_1 = __importDefault(require("next"));
var path = __importStar(require("path"));
var querystring = __importStar(require("querystring"));
var env_1 = __importDefault(require("../lib/env"));
var router_1 = __importDefault(require("../app/router"));
var healthChecks_1 = __importDefault(require("./healthChecks"));
console.log('Node version:', process.version);
var port = parseInt(process.env.PORT, 10) || 3000;
var dev = process.env.NODE_ENV !== 'production';
var app = (0, next_1.default)({ dir: path.join(__dirname, '..'), dev: dev });
app.prepare().then(function () {
    var server = (0, express_1.default)();
    server.use((0, express_cache_headers_1.default)(3600));
    server.use((0, compression_1.default)());
    server.use(express_1.default.static('public'));
    server.use(['/t/*'], (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: 'https://service.sozialhelden.de/',
        pathRewrite: {
            '^/t/': '/',
        },
        changeOrigin: true,
        logLevel: 'debug',
    }));
    server.get(/\/beta/, function (req, res) {
        res.redirect("".concat(req.originalUrl.replace(/\/beta\/?/, '/')));
    });
    server.get([/(\/[a-zA-Z_-]+)?\/embed.*/], function (req, res) {
        var extendedQueryString = querystring.stringify(__assign(__assign({}, req.query), { embedded: true }));
        res.redirect("/?".concat(extendedQueryString));
    });
    server.get('/:lang?/map', function (req, res) {
        var lang = req.param('lang');
        res.redirect("/".concat(lang ? "?locale=".concat(lang) : ''));
    });
    // Provides access to a filtered set of environment variables on the client.
    // Read https://github.com/sozialhelden/twelve-factor-dotenv for more infos.
    server.get('/clientEnv.js', (0, twelve_factor_dotenv_1.createEnvironmentJSResponseHandler)(env_1.default));
    server.get('/nodes/:id', function (req, res, next) {
        var id = req.params.id;
        console.log('id', id);
        if (!id.match(/^-?\d+$/)) {
            return next();
        }
        if (id.slice(0, 1) === '-') {
            res.redirect("/way/".concat(id.replace(/-/, '')));
            return;
        }
        res.redirect("/node/".concat(id));
    });
    (0, healthChecks_1.default)(server);
    server.get('*', function (req, res, next) {
        var match = router_1.default.match(req.path);
        if (!match) {
            return next();
        }
        console.log('Match!', match);
        app.render(req, res, '/main', __assign(__assign(__assign({}, match.params), req.query), { routeName: match.route.name }));
    });
    server.use(['/images/*'], (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: process.env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL,
        changeOrigin: true,
    }));
    var handle = app.getRequestHandler();
    // Fallback for routes not found.
    server.get('*', function (req, res) {
        handle(req, res);
    });
    // Start server.
    server.listen(port, function () {
        console.log("> Ready on http://localhost:".concat(port));
    });
});
