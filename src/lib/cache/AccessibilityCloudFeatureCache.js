// @flow

import type { AccessibilityCloudFeature, AccessibilityCloudFeatureCollection } from '../Feature';
import FeatureCache from './FeatureCache';

export default class AccessibilityCloudFeatureCache extends
  FeatureCache<AccessibilityCloudFeature, AccessibilityCloudFeatureCollection> {
  static fetchFeature(id): Promise<Response> {
    return this.fetch(`https://www.accessibility.cloud/place-infos/${id}.json?appToken=27be4b5216aced82122d7cf8f69e4a07`);
  }

  static getIdForFeature(feature: AccessibilityCloudFeature): string {
    return String(feature._id || (feature.properties && feature.properties._id));
  }
}

export const accessibilityCloudFeatureCache = new AccessibilityCloudFeatureCache();
