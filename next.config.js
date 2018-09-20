const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');
const nextRuntimeDotEnv = require('next-runtime-dotenv');

const withConfig = nextRuntimeDotEnv({
  path: '.env.' + (process.env.NODE_ENV || 'development'),
  public: [
    'PUBLIC_URL',
    'REACT_APP_WHEELMAP_API_BASE_URL',
    'REACT_APP_WHEELMAP_API_KEY',
    'REACT_APP_MAPBOX_ACCESS_TOKEN',
    'REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN',
    'REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL',
    'REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL',
    'REACT_APP_ALLOW_ADDITIONAL_DATA_URLS',
    'REACT_APP_ALLOW_ADDITIONAL_IMAGE_URLS',
  ],
  server: [],
});

module.exports = withConfig(
  withCss(
    withSass({
      webpack: config => {
        // Fixes npm packages that depend on `fs` module
        config.node = {
          fs: 'empty',
        };
        return config;
      },
      // Disabling file-system routing to always use custom server.
      useFileSystemPublicRoutes: false,
    })
  )
);
