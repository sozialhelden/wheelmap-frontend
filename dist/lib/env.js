"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEnv = checkEnv;
var twelve_factor_dotenv_1 = require("@sozialhelden/twelve-factor-dotenv");
var envKeys = {
    REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN: true,
    REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL: true,
    REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL: true,
    REACT_APP_ALLOW_ADDITIONAL_DATA_URLS: true,
    REACT_APP_ALLOW_ADDITIONAL_IMAGE_URLS: true,
    REACT_APP_AWS_S3_BUCKET_NAME: true,
    REACT_APP_MAPBOX_GL_ACCESS_TOKEN: true,
    REACT_APP_OSM_API_LEGACY_BASE_URL: true,
    REACT_APP_OSM_API_TILE_BACKEND_URL_LEGACY: true,
    REACT_APP_WHEELMAP_API_KEY: true,
};
function checkEnv() {
    var e_1, _a;
    try {
        for (var _b = __values(Object.keys(envKeys)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var key = _c.value;
            if (!process.env[key]) {
                console.error("Warning: ".concat(key, " not set, cannot run app."));
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
var env = (0, twelve_factor_dotenv_1.loadGlobalEnvironment)();
exports.default = env;
