import env from '../env';
import URLDataCache from './URLDataCache';
import { AccessibilityCloudImages } from '../Feature';
import FeatureCache from './FeatureCache';

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

  async uploadPhotoForFeature(featureId: string, images: FileList, appToken: string): Promise<any> {
    const image = images[0];
    const url = `${uncachedBaseUrl}/image-upload?placeId=${featureId}&appToken=${appToken}`;
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
