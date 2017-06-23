import type { Feature } from 'geojson-flow';
import FeatureCache from './FeatureCache';

export default class WheelmapFeatureCache extends FeatureCache {
  static sourceId = 'wheelmap';

  fetchFeature(id): Promise<Feature> {
    return fetch(`http://localhost:5000/nodes/${id}.json`);
  }
}

export const wheelmapFeatureCache = new WheelmapFeatureCache();