import { getQueryParams } from './queryParams';

let sourceIdParams = 'excludeSourceIds=LiBTS67TjmBcXdEmX';
const queryParams = getQueryParams();
if (queryParams.includeSourceIds) {
  sourceIdParams = `includeSourceIds=${queryParams.includeSourceIds}`;
}
const config = {
  locateTimeout: 60 * 60 * 1000,
  defaultStartCenter: [51.505, -0.09],
  maxZoom: 19,
  minZoomWithSetCategory: queryParams.includeSourceIds ? 8 : 13,
  minZoomWithoutSetCategory: 16,
  mapboxTileUrl: `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`,
  wheelmapApiKey: queryParams.includeSourceIds ? null : process.env.REACT_APP_WHEELMAP_API_KEY,
  accessibilityCloudAppToken: process.env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN,
  accessibilityCloudBaseUrl: process.env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL,
  accessibilityCloudTileUrl: (locale) => `${process.env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL}/place-infos.json?${sourceIdParams}&x={x}&y={y}&z={z}&appToken=${process.env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN}&locale=${locale}&includePlacesWithoutAccessibility=1`,
  // set this to '' for development - use relative urls, make request to server that hosts the page
  wheelmapApiBaseUrl: process.env.REACT_APP_WHEELMAP_API_BASE_URL || '',
};

export default config;
