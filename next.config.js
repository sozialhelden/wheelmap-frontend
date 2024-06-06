const withTranspileModules = require("next-transpile-modules");
const isProd = process.env.NODE_ENV === "production";

let configuration = withTranspileModules({
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

let transifex = {
  i18n: {
    locales: ["en", "fr", "de", "el"],
    defaultLocale: "de",
    localeDetection: true,
  },
  publicRuntimeConfig: {
    TxNativePublicToken: "1/9099afe662e4300641b90026c94b18871c9d0152",
  },
};

// these options would be ignored above, so they needs to be extended manually
configuration = {
  ...configuration,
  ...transifex,
  productionBrowserSourceMaps: true,
  compiler: {
    styledComponents: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Disabling file-system routing to always use custom server.
  // useFileSystemPublicRoutes: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = configuration;
