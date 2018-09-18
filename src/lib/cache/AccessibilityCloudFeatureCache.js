// @flow

import type { AccessibilityCloudFeature, AccessibilityCloudFeatureCollection } from '../Feature';
import config from '../config';
import FeatureCache from './FeatureCache';
import { equipmentInfoCache } from './EquipmentInfoCache';
import { currentLocales, loadExistingLocalizationByPreference } from '../i18n';

type CacheMap = {
  [key: string]: FeatureCache<*, *>,
};

const caches: CacheMap = {
  equipmentInfos: equipmentInfoCache,
};

export default class AccessibilityCloudFeatureCache extends FeatureCache<
  AccessibilityCloudFeature,
  AccessibilityCloudFeatureCollection
> {
  static fetchFeature(
    id: number | string,
    options: { useCache: boolean } = { useCache: true }
  ): Promise<Response> {
    return this.fetch(
      `${config.accessibilityCloudBaseUrl}/place-infos/${id}.json?appToken=${
        config.accessibilityCloudAppToken
      }&locale=${currentLocales[0]}&includePlacesWithoutAccessibility=1`,
      { cordova: true }
    );
  }

  static getIdForFeature(feature: AccessibilityCloudFeature): string {
    return String(feature._id || (feature.properties && feature.properties._id));
  }

  cacheFeature(feature: AccessibilityCloudFeature, response: any): void {
    // Cache and index related objects in their respective caches
    Object.keys(caches).forEach(collectionName => {
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
