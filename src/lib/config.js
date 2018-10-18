import env from './env';

import isCordova from './isCordova';

// use base url on server or in cordova builds, otherwise use the proxy running on the hosting server
const useAbsoluteWheelmapBaseUrl = typeof window === 'undefined' || isCordova();

export default {
  locateTimeout: 60 * 60 * 1000,
  // If no location is known, start at the Cologne cathedral landmark
  defaultStartCenter: [50.94133042185295, 6.957112947082502],
  maxZoom: 20,
  minZoomWithSetCategory: 13,
  minZoomWithoutSetCategory: 16,
  mapboxTileUrl: `https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${
    env.public.mapbox.accessToken
  }`,
  wheelmapApiKey: env.public.wheelmap.apiKey,
  wheelmapApiBaseUrl: useAbsoluteWheelmapBaseUrl ? env.public.wheelmap.baseUrl : '',
};
