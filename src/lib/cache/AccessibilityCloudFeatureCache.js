// @flow

import type { AccessibilityCloudFeature, AccessibilityCloudFeatureCollection } from '../Feature';
import FeatureCache from './FeatureCache';
import { equipmentInfoCache } from './EquipmentInfoCache';
import { currentLocales } from '../i18n';
import env from '../env';

type CacheMap = {
  [key: string]: FeatureCache<*, *>,
};

export type CreatePlaceData = {
  properties: {
    name: string,
    category: string,
    address?: any,
  },
  geometry: {
    type: 'Point',
    coordinates: [number, number],
  },
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
    appToken: string,
    useCache: boolean = true
  ): Promise<Response> {
    const acLocaleString = currentLocales[0].transifexLanguageIdentifier;
    const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
    return this.fetch(
      `${baseUrl}/place-infos/${id}.json?appToken=${appToken}&locale=${acLocaleString}&includePlacesWithoutAccessibility=1`
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

  createPlace(place: CreatePlaceData, appToken: string): Promise<string> {
    const uploadPromise = new Promise((resolve, reject) => {
      this.constructor
        .fetch(
          `${env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL || ''}/place-infos/?appToken=${appToken}`,
          {
            method: 'POST',
            cache: 'no-cache',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(place),
          }
        )
        .then((response: Response) => {
          if (response.ok) {
            response
              .json()
              .then(json => {
                resolve(json._id);
              })
              .catch(reject);
          } else if (response.json) {
            response
              .json()
              .then(json => {
                reject(json.error || 'unknown');
              })
              .catch(reject);
          } else {
            reject(response);
          }
        })
        .catch(reject)
        .catch(console.error);
    });

    return uploadPromise;
  }

  reportPlace(
    placeId: string,
    reason: string,
    message: string,
    appToken: string
  ): Promise<boolean> {
    const uploadPromise = new Promise((resolve, reject) => {
      this.constructor
        .fetch(
          `${env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL ||
            ''}/place-infos/report?id=${placeId}&reason=${reason}&message=${message}&appToken=${appToken}`,
          {
            method: 'POST',
            cache: 'no-cache',
            headers: {
              Accept: 'application/json',
            },
          }
        )
        .then((response: Response) => {
          if (response.ok) {
            resolve(true);
          } else {
            response
              .json()
              .then(json => {
                reject('unknown');
              })
              .catch(reject);
          }
        })
        .catch(reject)
        .catch(console.error);
    });

    return uploadPromise;
  }
}

export const accessibilityCloudFeatureCache = new AccessibilityCloudFeatureCache();
