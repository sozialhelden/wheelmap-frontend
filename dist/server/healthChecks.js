"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerHealthChecks;
function registerHealthChecks(app) {
    app.get('/healthy', function (req, res) {
        res.status(200).send('OK!');
    });
    app.get('/healthz', function (req, res) {
        res.status(200).send('OK!');
    });
    app.get('/ping', function (req, res) {
        res.status(200).send('OK!');
    });
    app.get('/ready', function (req, res) {
        // TODO: Add logic for overload here
        res.status(200).send('OK!');
    });
}
