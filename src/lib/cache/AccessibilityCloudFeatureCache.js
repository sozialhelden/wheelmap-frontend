// @flow

import type { AccessibilityCloudFeature, AccessibilityCloudFeatureCollection } from '../Feature';
import config from '../config';
import FeatureCache from './FeatureCache';
import { equipmentInfoCache } from './EquipmentInfoCache';

type CacheMap = {
  [string]: FeatureCache<*, *>
};

const caches: CacheMap = {
  equipmentInfos: equipmentInfoCache,
}

export default class AccessibilityCloudFeatureCache extends
  FeatureCache<AccessibilityCloudFeature, AccessibilityCloudFeatureCollection> {
  static fetchFeature(id): Promise<Response> {
    const locale = window.navigator.language;
    return this.fetch(`${config.accessibilityCloudBaseUrl}/place-infos/${id}.json?appToken=${config.accessibilityCloudAppToken}&locale=${locale}&includePlacesWithoutAccessibility=1`);
  }

  static getIdForFeature(feature: AccessibilityCloudFeature): string {
    return String(feature._id || (feature.properties && feature.properties._id));
  }

  cacheFeature(feature: AccessibilityCloudFeature, response: any): void {
    // Cache and index related objects in their respective caches
    Object.keys(caches).forEach((collectionName) => {
      const cache = caches[collectionName];
      const idsToDocuments = feature.properties && feature.properties[collectionName];
      if (idsToDocuments) {
        const ids = Object.keys(idsToDocuments || {});
        ids.forEach(_id => cache.cacheFeature(idsToDocuments[_id]));
      }
    });

    super.cacheFeature(feature, response);
  }
}

export const accessibilityCloudFeatureCache = new AccessibilityCloudFeatureCache();
