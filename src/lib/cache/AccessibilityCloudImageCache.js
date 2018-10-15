// @flow

import readAndCompressImage from 'browser-image-resizer';

import URLDataCache from './URLDataCache';
import type { AccessibilityCloudImages } from '../Feature';
import env from '../env';

export const InvalidCaptchaReason = 'invalid-captcha';
export const UnknownReason = 'unknown';

const imageResizeConfig = {
  quality: 0.7,
  maxWidth: 1024,
  maxHeight: 1024,
  autoRotate: true,
  debug: true,
};

export default class AccessibilityCloudImageCache extends URLDataCache<AccessibilityCloudImages> {
  getPhotosForFeature(
    featureId: string | number,
    options: { useCache: boolean } = { useCache: true }
  ): Promise<?AccessibilityCloudImages> {
    return this.getImage('place', String(featureId), options);
  }

  getImage(
    context: string,
    objectId: string,
    options: { useCache: boolean } = { useCache: true }
  ): Promise<?AccessibilityCloudImages> {
    return this.getData(
      `${
        env.public.accessibilityCloud.baseUrl.cached
      }/images.json?context=${context}&objectId=${objectId}&appToken=${
        env.public.accessibilityCloud.appToken
      }`,
      options
    );
  }

  async uploadPhotoForFeature(
    featureId: string,
    images: FileList,
    captchaSolution: string
  ): Promise<any> {
    const image = images[0];
    const url = `${
      env.public.accessibilityCloud.baseUrl.uncached
    }/image-upload?placeId=${featureId}&captcha=${captchaSolution}&appToken=${
      env.public.accessibilityCloud.appToken
    }`;
    const resizedImage = await readAndCompressImage(image, imageResizeConfig);
    const response = await this.constructor.fetch(url, {
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

  reportPhoto(photoId: string, reason: string): Promise<boolean> {
    const uploadPromise = new Promise((resolve, reject) => {
      this.constructor
        .fetch(
          `${
            env.public.accessibilityCloud.baseUrl.uncached
          }/images/report?imageId=${photoId}&reason=${reason}&appToken=${
            env.public.accessibilityCloud.appToken
          }`,
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

    return uploadPromise;
  }

  getCaptcha(fetchParams?: any): Promise<string> {
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
        const url = `${
          env.public.accessibilityCloud.baseUrl.cached
        }/captcha.svg?${cacheBuster}&appToken=${env.public.accessibilityCloud.appToken}`;
        console.log('Requesting new captcha');
        return this.constructor
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

  resetCaptcha() {
    if (!this.captchaRequest) {
      this.lastCaptcha = null;
      this.captchaSolution = null;
    }
    return this.getCaptcha({
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

export const accessibilityCloudImageCache = new AccessibilityCloudImageCache();
