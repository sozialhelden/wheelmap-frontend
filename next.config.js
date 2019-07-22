const ElasticAPMSourceMapPlugin = require('elastic-apm-sourcemap-webpack-plugin').default;
const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
const webpack = require('webpack');
const env = require('./src/lib/env');
const withSourceMaps = require('@zeit/next-source-maps');

module.exports = withSourceMaps(
  withCss(
    withSass({
      webpack: config => {
        // Fixes npm packages that depend on `fs` module
        config.node = {
          fs: 'empty',
          dgram: 'empty',
          net: 'empty',
          tls: 'empty',
          child_process: 'empty',
          async_hooks: 'mock',
          'elastic-apm-node': 'empty',
        };

        if (process.env.NODE_ENV === 'production') {
          config.plugins.unshift(new ElasticAPMSourceMapPlugin({
            serviceName: 'wheelmap-react-frontend',
            serviceVersion: env.npm_package_version,
            serverURL: env.REACT_APP_ELASTIC_APM_SERVER_URL,
            publicPath: `${env.PUBLIC_URL}/_next/static/chunks`,
            secret: env.ELASTIC_APM_SECRET_TOKEN,
            logLevel: 'debug'
          }));
        }

        return config;
      },
      // Disabling file-system routing to always use custom server.
      useFileSystemPublicRoutes: false,
    })
  )
);