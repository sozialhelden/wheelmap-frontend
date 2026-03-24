"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Router_1 = __importDefault(require("../lib/Router"));
var routes = [
    {
        name: 'equipment',
        path: '/nodes/:id/equipment/:eid',
    },
    {
        name: 'placeDetail',
        path: '/nodes/:id',
    },
    {
        name: 'way',
        path: '/way/:id',
    },
    {
        name: 'node',
        path: '/node/:id',
    },
    {
        name: 'relation',
        path: '/relation/:id',
    },
    {
        name: 'search',
        path: '/search',
    },
    {
        name: 'categories',
        path: '/categories/:category',
    },
    {
        name: 'createPlace',
        path: '/add-place',
    },
    {
        name: 'contributionThanksDetail',
        path: '/contribution-thanks/:id',
    },
    {
        name: 'contributionThanks',
        path: '/contribution-thanks',
    },
    {
        name: 'mappingEventJoin',
        path: '/events/:id/join',
    },
    {
        name: 'mappingEventDetail',
        path: '/events/:id',
    },
    {
        name: 'mappingEvents',
        path: '/events',
    },
    {
        name: 'map',
        path: '/',
    },
];
exports.default = new Router_1.default(routes);
