import { AccessibilityCloudImages, Feature, accessibilityCloudFeatureFrom, getFeatureId, wheelmapFeatureFrom } from '../Feature';
import env from '../env';
import FeatureCache from './FeatureCache';
import URLDataCache from './URLDataCache';

export const UnknownReason = 'unknown';

const uncachedBaseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || '';
const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';

export default class AccessibilityCloudImageCache extends URLDataCache<AccessibilityCloudImages> {
  getImage(
    context: string,
    objectId: string,
    appToken: string,
    useCache: boolean = true
  ): Promise<AccessibilityCloudImages | undefined> {
    return this.getData(
      `${
        useCache ? baseUrl : uncachedBaseUrl
      }/images.json?context=${context}&objectId=${objectId}&appToken=${appToken}`,
      { useCache }
    );
  }

  async uploadPhotoForFeature(feature: Feature, images: FileList, appToken: string): Promise<void> {
    const image = images[0];
    const acFeature = accessibilityCloudFeatureFrom(feature);
    const osmFeature = wheelmapFeatureFrom(feature);
    if (!acFeature && !osmFeature) throw new Error('Feature has unknown kind.');

    let url;
    if (acFeature) {
      const id = getFeatureId(acFeature);
      url = `${uncachedBaseUrl}/image-upload?placeId=${id}&appToken=${appToken}`;
    } else {
      const uri = `osm:${osmFeature.properties.osm_type}/${osmFeature.id}`;
      url = `${uncachedBaseUrl}/image-upload/osm-geometry/photo?uri=${uri}&appToken=${appToken}`;
    }

    // const resizedImage = await readAndCompressImage(image, imageResizeConfig);
    const response = await FeatureCache.fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'image/jpeg',
      },
      body: image,
    });

    if (!response.ok) {
      const json = await response.json();
      throw new Error(json?.error?.reason);
    }
  }

  reportPhoto(photoId: string, reason: string, appToken: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      FeatureCache.fetch(
        `${uncachedBaseUrl}/images/report?imageId=${photoId}&reason=${reason}&appToken=${appToken}`,
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
                reject(UnknownReason);
              })
              .catch(reject);
          }
        })
        .catch(reject)
        .catch(console.error);
    });
  }
}

export const accessibilityCloudImageCache = new AccessibilityCloudImageCache({
  ttl: 1000 * 60 * 5, // 5 minutes
});
