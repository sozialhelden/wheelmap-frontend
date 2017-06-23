import type { Feature } from 'geojson-flow';
import FeatureCache from './FeatureCache';

export default class AccessibilityCloudFeatureCache extends FeatureCache {
  static sourceId = 'accessibility.cloud';

  fetchFeature(id): Promise<Feature> {
    return fetch(`http://www.accessibility.cloud/place-infos/${id}`, { headers: { Accept: 'application/json', 'X-App-Token': ''} });
  }
}

export const accessibilityCloudFeatureCache = new AccessibilityCloudFeatureCache();