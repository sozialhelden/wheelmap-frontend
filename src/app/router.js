"use strict";
exports.__esModule = true;
var Router_1 = require("../lib/Router");
var routes = [
    {
        name: 'placeDetail',
        path: '/nodes/:id'
    },
    {
        name: 'equipment',
        path: '/nodes/:id/equipment/:eid'
    },
    {
        name: 'search',
        path: '/search'
    },
    {
        name: 'categories',
        path: '/categories/:category'
    },
    {
        name: 'createPlace',
        path: '/add-place'
    },
    {
        name: 'contributionThanks',
        path: '/contribution-thanks'
    },
    {
        name: 'mappingEvents',
        path: '/events'
    },
    {
        name: 'mappingEventDetail',
        path: '/events/:id'
    },
    {
        name: 'mappingEventJoin',
        path: '/events/:id/join'
    },
    {
        name: 'map',
        path: '/'
    },
];
exports["default"] = new Router_1["default"](routes);
