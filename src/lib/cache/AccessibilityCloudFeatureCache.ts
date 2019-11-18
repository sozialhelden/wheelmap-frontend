import { AccessibilityCloudFeature, AccessibilityCloudFeatureCollection } from '../Feature';
import FeatureCache from './FeatureCache';
import { equipmentInfoCache } from './EquipmentInfoCache';
import { currentLocales } from '../i18n';
import env from '../env';

type CacheMap = {
  [key: string]: FeatureCache<any, any>,
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
    return self.fetch(
      `${baseUrl}/place-infos/${id}.json?appToken=${appToken}&locale=${acLocaleString}&includePlacesWithoutAccessibility=1`
    );
  }

  static getIdForFeature(feature: AccessibilityCloudFeature): string {
    // @ts-ignore
    return String(feature._id || (feature.properties && feature.properties._id));
  }

  cacheFeature(feature: AccessibilityCloudFeature, response: any): void {
    // Cache and index related objects in their respective caches
    Object.keys(caches).forEach(collectionName => {
      const cache = caches[collectionName];
      const idsToDocuments = feature.properties && feature.properties[collectionName];
      if (idsToDocuments) {
        const ids = Object.keys(idsToDocuments || {});
        // @ts-ignore
        ids.forEach(_id => cache.cacheFeature(idsToDocuments[_id]));
      }
    });

    super.cacheFeature(feature, response);
  }

  reportPlace(
    placeId: string,
    reason: string,
    message: string,
    appToken: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      self.fetch(
        `${env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL ||
          ''}/place-infos/report?id=${placeId}&reason=${reason}&message=${message}&appToken=${appToken}`,
        {
          method: 'POST',
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
  }
}

export const accessibilityCloudFeatureCache = new AccessibilityCloudFeatureCache();
