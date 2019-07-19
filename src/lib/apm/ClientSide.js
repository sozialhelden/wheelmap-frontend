const { init } = require('@elastic/apm-rum');
const env = require('../env');

console.log('Starting client side APM.');
var apm = init({
  serviceName: 'wheelmap-react-frontend',
  serviceVersion: env.npm_package_version, // Used on the APM Server to find the right sourcemap
  serverUrl: env.REACT_APP_ELASTIC_APM_SERVER_URL,
  secretToken: env.REACT_APP_ELASTIC_APM_SECRET_TOKEN,
  // Other APM monitored services
  distributedTracingOrigins: [
    env.REACT_APP_LEGACY_API_BASE_URL,
    env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL,
    env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL,
  ].filter(Boolean),
});

module.exports = apm;
