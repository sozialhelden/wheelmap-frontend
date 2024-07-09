import env from './env';

const config = {
  locateTimeout: 60 * 60 * 1000,
  // If no location is known, start at the Cologne cathedral landmark
  defaultStartCenter: [50.94133042185295, 6.957112947082502] as number[],
  maxZoom: 20,
  minZoomWithSetCategory: 13,
  minZoomWithoutSetCategory: 16,
  minZoomForEquipmentInfos: 18,
  wheelmapApiKey: env.REACT_APP_WHEELMAP_API_KEY,
  wheelmapApiBaseUrl: env.REACT_APP_OSM_API_LEGACY_BASE_URL,
  wheelmapApiBaseUrlForTiles: env.REACT_APP_OSM_API_TILE_BACKEND_URL_LEGACY,
};

export default config;
