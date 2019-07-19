const server = require('./ServerSide');
const client = require('./ClientSide');
const apm = typeof window === 'undefined' ? server : client;

module.exports = apm;
