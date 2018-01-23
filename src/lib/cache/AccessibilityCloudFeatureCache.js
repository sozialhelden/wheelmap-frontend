// @flow

import type { AccessibilityCloudFeature, AccessibilityCloudFeatureCollection } from '../Feature';
import config from '../config';
import FeatureCache from './FeatureCache';
import { equipmentInfoCache } from './EquipmentInfoCache';
import { disruptionCache } from './DisruptionCache';

type CacheMap = {
  [string]: FeatureCache<*, *>
};

const caches: CacheMap = {
  equipmentInfos: equipmentInfoCache,
  disruptions: disruptionCache,
}

export default class AccessibilityCloudFeatureCache extends
  FeatureCache<AccessibilityCloudFeature, AccessibilityCloudFeatureCollection> {
  static fetchFeature(id): Promise<Response> {
    const locale = window.navigator.language;
    return this.fetch(`https://www.accessibility.cloud/place-infos/${id}.json?includeRelated=equipmentInfos,equipmentInfos.disruptions,disruptions&appToken=${config.accessibilityCloudAppToken}&locale=${locale}`);
  }

  static getIdForFeature(feature: AccessibilityCloudFeature): string {
    return String(feature._id || (feature.properties && feature.properties._id));
  }

  cacheFeature(feature: AccessibilityCloudFeature, response: any): void {
    if (response.related) {
      // Cache and index related objects in their respective caches
      Object.keys(caches).forEach((collectionName) => {
        const cache = caches[collectionName];
        const idsToDocuments = response.related[collectionName];
        const ids = Object.keys(idsToDocuments || {});
        ids.forEach(_id => cache.cacheFeature(idsToDocuments[_id]));
      });
    }

    super.cacheFeature(feature, response);
  }
}

export const accessibilityCloudFeatureCache = new AccessibilityCloudFeatureCache();
