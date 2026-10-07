// Updated to next-transpile-modules v9.x API for webpack 5 support
const withTM = require('next-transpile-modules')([
  '@sozialhelden/twelve-factor-dotenv',
  'dotenv',
]);
//const webpack = require('webpack');
const { loadGlobalEnvironment } = require('@sozialhelden/twelve-factor-dotenv');
const env = loadGlobalEnvironment();

let configuration = withTM({
  webpack: config => {
    // Fixes npm packages that depend on Node.js built-in modules (webpack 5 syntax)
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      dgram: false,
      net: false,
      tls: false,
      child_process: false,
      async_hooks: false,
    };

    return config;
  },
});

// these options would be ignored above, so they needs to be extended manually
configuration = {
  ...configuration,
  productionBrowserSourceMaps: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  // Disabling file-system routing to always use custom server.
  // useFileSystemPublicRoutes: false,
};

module.exports = configuration;
