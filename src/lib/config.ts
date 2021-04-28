import env from './env';

// use base url on server, otherwise use the proxy running on the hosting server
const useAbsoluteWheelmapBaseUrl = typeof window === 'undefined';

export default {
  locateTimeout: 60 * 60 * 1000,
  // If no location is known, start at the Cologne cathedral landmark
  defaultStartCenter: [50.94133042185295, 6.957112947082502] as [number, number],
  maxZoom: 20,
  minZoomWithSetCategory: 13,
  minZoomWithoutSetCategory: 16,
  wheelmapApiKey: env.REACT_APP_WHEELMAP_API_KEY,
  wheelmapApiBaseUrl: useAbsoluteWheelmapBaseUrl ? env.REACT_APP_LEGACY_API_BASE_URL : '',
};
