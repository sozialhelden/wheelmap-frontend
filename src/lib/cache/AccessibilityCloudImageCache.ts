import readAndCompressImage from 'browser-image-resizer';
import env from '../env';
import URLDataCache from './URLDataCache';
import { AccessibilityCloudImages } from '../Feature';

export const InvalidCaptchaReason = 'invalid-captcha';
export const UnknownReason = 'unknown';

const imageResizeConfig = {
  quality: 0.7,
  maxWidth: 1024,
  maxHeight: 1024,
  autoRotate: true,
  debug: true,
};

const uncachedBaseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || '';
const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';

export default class AccessibilityCloudImageCache extends URLDataCache<AccessibilityCloudImages> {
  getPhotosForFeature(
    featureId: string | number,
    appToken: string,
    useCache: boolean = true
  ): Promise<AccessibilityCloudImages | undefined> {
    return this.getImage('place', String(featureId), appToken, useCache);
  }

  getImage(
    context: string,
    objectId: string,
    appToken: string,
    useCache: boolean = true
  ): Promise<AccessibilityCloudImages | undefined> {
    return this.getData(
      `${baseUrl}/images.json?context=${context}&objectId=${objectId}&appToken=${appToken}`,
      { useCache }
    );
  }

  async uploadPhotoForFeature(
    featureId: string,
    images: FileList,
    appToken: string,
    captchaSolution: string
  ): Promise<any> {
    const image = images[0];
    const url = `${baseUrl}/image-upload?placeId=${featureId}&captcha=${captchaSolution}&appToken=${appToken}`;
    const resizedImage = await readAndCompressImage(image, imageResizeConfig);
    const response = await self.fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'image/jpeg',
      },
      body: resizedImage,
    });

    if (!response.ok) {
      const json = await response.json();
      const reason = json.error.reason;
      if (reason === 'No captcha found.') {
        throw new Error(InvalidCaptchaReason);
      } else {
        throw new Error(json.error.reason);
      }
    }

    if (this.lastCaptcha) {
      this.captchaSolution = captchaSolution;
    }
  }

  reportPhoto(photoId: string, reason: string, appToken: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      self.fetch(
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

  getCaptcha(appToken: string, fetchParams?: any): Promise<string> {
    let promise = this.captchaRequest;
    if (promise) return promise;

    let cacheBuster = '';
    if (fetchParams && fetchParams.cache === 'reload') {
      cacheBuster = `random=${Math.random()}${this.captchaExpirationTime}`;
    }

    promise = new Promise((resolve, reject) => {
      if (this.hasValidCaptcha() && this.lastCaptcha) {
        resolve(this.lastCaptcha);
      } else {
        this.lastCaptcha = null;
        const url = `${baseUrl}/captcha.svg?${cacheBuster}&appToken=${appToken}`;
        console.log('Requesting new captcha');
        return self
          .fetch(url)
          .then((response: Response) => {
            if (response.ok) {
              const expires = response.headers.get('expires');
              if (expires) {
                this.captchaExpirationTime = new Date(expires).getTime();
              }
              response
                .text()
                .then(captcha => {
                  this.lastCaptcha = captcha;
                  this.captchaSolution = null;
                  resolve(this.lastCaptcha);
                })
                .catch(reject);
            } else {
              reject();
            }
          })
          .catch(reject)
          .catch(console.error);
      }
    });

    const resetCaptchaRequest = () => {
      this.captchaRequest = null;
    };
    promise.then(resetCaptchaRequest, resetCaptchaRequest);
    this.captchaRequest = promise;

    return promise;
  }

  resetCaptcha(appToken: string) {
    if (!this.captchaRequest) {
      this.lastCaptcha = null;
      this.captchaSolution = null;
    }
    return this.getCaptcha(appToken, {
      headers: { pragma: 'no-cache', 'cache-control': 'no-cache' },
      cache: 'reload',
    });
  }

  hasValidCaptcha() {
    const isCaptchaExpired = Date.now() >= this.captchaExpirationTime - 60 * 100; // add 60 seconds captcha grace period
    return !isCaptchaExpired && this.lastCaptcha;
  }

  hasSolvedCaptcha() {
    return this.hasValidCaptcha() && this.captchaSolution;
  }

  lastCaptcha: string | null = null;
  captchaExpirationTime: number = 0;
  captchaRequest: Promise<string> | null = null;
  captchaSolution: string | null = null;
}

export const accessibilityCloudImageCache = new AccessibilityCloudImageCache({
  ttl: 1000 * 60 * 5, // 5 minutes
});
