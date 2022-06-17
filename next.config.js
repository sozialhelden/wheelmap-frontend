const withTranspileModules = require("next-transpile-modules");
//const webpack = require('webpack');
const {
  loadGlobalEnvironment,
  getFilteredClientEnvironment,
} = require("@sozialhelden/twelve-factor-dotenv");
const env = getFilteredClientEnvironment(loadGlobalEnvironment());

let configuration = withTranspileModules({
  // Next.js doesn't transpile node_modules content by default.
  // We have to do this manually to make IE 11 users happy.
  transpileModules: [
    "@sozialhelden/twelve-factor-dotenv",
    "@elastic/apm-rum-core",
    "@elastic/apm-rum",
    "dotenv",
  ],
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: "empty",
      dgram: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
      async_hooks: "mock",
    };

    return config;
  },
});

// these options would be ignored above, so they needs to be extended manually
configuration = {
  ...configuration,
  productionBrowserSourceMaps: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
    ignoreDevErrors: true,
  },
  // Disabling file-system routing to always use custom server.
  // useFileSystemPublicRoutes: false,
  env,
};

module.exports = configuration;
