const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
const webpack = require('webpack');
const withBabelMinify = require('next-babel-minify')()
module.exports = withBabelMinify(
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
        return config;
      },
      // Disabling file-system routing to always use custom server.
      useFileSystemPublicRoutes: false,
    })
  )
);
