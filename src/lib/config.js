const config = {
  locateTimeout: 60 * 60 * 1000,
  defaultStartCenter: [51.505, -0.09],
  maxZoom: 19,
  minimalZoom: {
    withSetCategory: 13,
    withoutSetCategory: 16,
  },
  mapboxAccessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  wheelmapApiKey: process.env.REACT_APP_WHEELMAP_API_KEY,
  accessibilityCloudAppToken: process.env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN,
};

export default config;
