import env from './env';

// use base url on server, otherwise use the proxy running on the hosting server
const useAbsoluteWheelmapBaseUrl = typeof window === 'undefined';

export default {
  locateTimeout: 60 * 60 * 1000,
  // If no location is known, start at the Cologne cathedral landmark
  defaultStartCenter: [50.94133042185295, 6.957112947082502],
  maxZoom: 20,
  minZoomWithSetCategory: 13,
  minZoomWithoutSetCategory: 16,
  mapboxTileUrl: `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${env.REACT_APP_MAPBOX_ACCESS_TOKEN}`,
  wheelmapApiKey: env.REACT_APP_WHEELMAP_API_KEY,
  wheelmapApiBaseUrl: useAbsoluteWheelmapBaseUrl ? env.REACT_APP_LEGACY_API_BASE_URL : '',
};
