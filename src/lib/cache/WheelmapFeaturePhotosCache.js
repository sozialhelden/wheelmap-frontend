// @flow

import URLDataCache from './URLDataCache';
import type { WheelmapFeaturePhotos } from '../Feature';
import config from '../config';

export default class WheelmapFeaturePhotosCache extends URLDataCache<?WheelmapFeaturePhotos> {
  getPhotosForFeature(featureId: string): Promise<?WheelmapFeaturePhotos> {
    return this.getData(
      `${config.wheelmapApiBaseUrl}/api/nodes/${featureId}/photos?api_key=${config.wheelmapApiKey}`
    );
  }
}

export const wheelmapFeaturePhotosCache = new WheelmapFeaturePhotosCache();
