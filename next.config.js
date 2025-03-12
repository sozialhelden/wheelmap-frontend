const withTranspileModules = require("next-transpile-modules");

/**
 * @type {import('next').NextConfig}
 * */
const configuration = {
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        // assert: require.resolve('assert'),
        // buffer: require.resolve('buffer'),
        // console: require.resolve('console-browserify'),
        // constants: require.resolve('constants-browserify'),
        // crypto: require.resolve('crypto-browserify'),
        // domain: require.resolve('domain-browser'),
        // events: require.resolve('events'),
        // http: require.resolve('stream-http'),
        // https: require.resolve('https-browserify'),
        // os: require.resolve('os-browserify/browser'),
        // path: require.resolve('path-browserify'),
        // punycode: require.resolve('punycode'),
        // process: require.resolve('process/browser'),
        // querystring: require.resolve('querystring-es3'),
        // stream: require.resolve('stream-browserify'),
        // string_decoder: require.resolve('string_decoder'),
        // sys: require.resolve('util'),
        // timers: require.resolve('timers-browserify'),
        // tty: require.resolve('tty-browserify'),
        // url: require.resolve('url'),
        // util: require.resolve('util'),
        // vm: require.resolve('vm-browserify'),
        // zlib: require.resolve('browserify-zlib'),
        fs: "empty",
        dgram: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty",
        async_hooks: "mock",
      },
    };
    return config;
  },
  productionBrowserSourceMaps: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    deviceSizes: [375, 480, 640, 750, 828, 1080, 1200, 1920],
  },
};

module.exports = configuration;
