import type { Feature } from 'geojson-flow';
import FeatureCache from './FeatureCache';

export default class AccessibilityCloudFeatureCache extends FeatureCache {
  static fetchFeature(id): Promise<Feature> {
    return this.fetch(`https://www.accessibility.cloud/place-infos/${id}.json?appToken=27be4b5216aced82122d7cf8f69e4a07`);
  }
}

export const accessibilityCloudFeatureCache = new AccessibilityCloudFeatureCache();