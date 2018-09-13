import { getQueryParams } from './queryParams';
import getConfig from 'next/config';

let sourceIdParams = 'excludeSourceIds=LiBTS67TjmBcXdEmX';
const queryParams = getQueryParams();
if (queryParams.includeSourceIds) {
  sourceIdParams = `includeSourceIds=${queryParams.includeSourceIds}`;
}

const { publicRuntimeConfig } = getConfig();

const config = {
  locateTimeout: 60 * 60 * 1000,
  // If no location is known, start at the Cologne cathedral landmark
  defaultStartCenter: [50.94133042185295, 6.957112947082502],
  maxZoom: 20,
  minZoomWithSetCategory: queryParams.includeSourceIds ? 8 : 13,
  minZoomWithoutSetCategory: 16,
  mapboxTileUrl: `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${
    publicRuntimeConfig.REACT_APP_MAPBOX_ACCESS_TOKEN
  }`,
  wheelmapApiKey: queryParams.includeSourceIds
    ? null
    : publicRuntimeConfig.REACT_APP_WHEELMAP_API_KEY,
  accessibilityCloudAppToken: publicRuntimeConfig.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN,
  accessibilityCloudBaseUrl: publicRuntimeConfig.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL,
  accessibilityCloudUncachedBaseUrl:
    publicRuntimeConfig.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL,
  accessibilityCloudTileUrl: locale =>
    `${
      publicRuntimeConfig.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL
    }/place-infos.json?${sourceIdParams}&x={x}&y={y}&z={z}&appToken=${
      publicRuntimeConfig.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN
    }&locale=${locale}&includePlacesWithoutAccessibility=1`,
  // set this to '' for development - use relative urls, make request to server that hosts the page
  wheelmapApiBaseUrl: publicRuntimeConfig.REACT_APP_WHEELMAP_API_BASE_URL || '',
};

export default config;
