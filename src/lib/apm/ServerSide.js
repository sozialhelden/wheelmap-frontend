const apmNode = require('elastic-apm-node');
const env = require('../env');

console.log('Starting server side APM.');
const apm = apmNode.start({
  serviceName: 'wheelmap-react-frontend',
  serviceVersion: env.npm_package_version, // Used on the APM Server to find the right sourcemap
  serverUrl: env.ELASTIC_APM_SERVER_URL,
  secretToken: env.ELASTIC_APM_SECRET_TOKEN,
});

module.exports = apm;
