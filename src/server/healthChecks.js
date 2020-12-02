"use strict";
exports.__esModule = true;
function registerHealthChecks(app) {
    app.get('/healthy', function (req, res) {
        res.status(200).send('OK!');
    });
    app.get('/ready', function (req, res) {
        // TODO: Add logic for overload here
        res.status(200).send('OK!');
    });
}
exports["default"] = registerHealthChecks;
