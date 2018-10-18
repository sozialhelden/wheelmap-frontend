const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');

module.exports = withCss(
  withSass({
    webpack: config => {
      // Fixes npm packages that depend on `fs` module
      config.node = {
        fs: 'empty',
        dgram: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
      };
      return config;
    },
    // Disabling file-system routing to always use custom server.
    useFileSystemPublicRoutes: false,
    exportPathMap: () => { 
      return {
        '/': { page: '/cordova' },
      };
    }
  })
);
