import URLDataCache from './URLDataCache';
import { WheelmapFeaturePhotos } from '../Feature';
import config from '../config';

export default class WheelmapFeaturePhotosCache extends URLDataCache<WheelmapFeaturePhotos | undefined> {
  getPhotosForFeature(
    featureId: string | number,
    appToken: string,
    useCache: boolean = true
  ): Promise<WheelmapFeaturePhotos | undefined> {
    return this.getData(
      `${config.wheelmapApiBaseUrl}/api/nodes/${featureId}/photos?api_key=${config.wheelmapApiKey}`,
      { useCache }
    );
  }
}

export const wheelmapFeaturePhotosCache = new WheelmapFeaturePhotosCache({
  ttl: 1000 * 60 * 5, // 5 minutes
});
