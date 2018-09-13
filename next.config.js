const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');

module.exports = withCss(withSass({
  webpack: config => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty',
    };
    return config;
  },
}));
