// @flow

import URLDataCache from './URLDataCache';
import type { AccessibilityCloudImages } from '../Feature';
import config from '../config';

export const InvalidCaptchaReason = "invalid-captcha";
export const UnknownReason = "unknown";

export default class AccessibilityCloudImageCache extends URLDataCache<AccessibilityCloudImages> {

  getPhotosForFeature(featureId: string): Promise<?AccessibilityCloudImages> {
    return this.getImage("place", featureId);
  }

  getImage(context: string, objectId: string): Promise<?AccessibilityCloudImages> {
    return this.getData(`${config.accessibilityCloudBaseUrl}/images.json?context=${context}&objectId=${objectId}&appToken=${config.accessibilityCloudAppToken}`);
  }

  uploadPhotoForFeature(featureId: string, images: FileList, captchaSolution: string): Promise<boolean> {
    const image = images[0];

    const uploadPromise = new Promise((resolve, reject) => {
      this.constructor.fetch(`${config.accessibilityCloudUncachedBaseUrl}/image-upload?placeId=${featureId}&captcha=${captchaSolution}&appToken=${config.accessibilityCloudAppToken}`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': image.type
        },
        body: image
      }).then((response: Response) => {
        if (response.ok) {
          if (this.lastCaptcha) {
            this.captchaSolution = captchaSolution;
          }
          resolve(true);
        } else {
          response.json().then(json => {
            const reason = json.error.reason;
            if (reason === "No captcha found.") {
              reject(InvalidCaptchaReason);
            } else {
              reject(UnknownReason);
            }
          }).catch(reject);
        }
      }).catch(reject).catch(console.error);
    });

    return uploadPromise;
  }

  reportPhoto(photoId: string, reason: string): Promise<boolean> {
    const uploadPromise = new Promise((resolve, reject) => {
      this.constructor.fetch(`${config.accessibilityCloudUncachedBaseUrl}/images/report?imageId=${photoId}&reason=${reason}&appToken=${config.accessibilityCloudAppToken}`, {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        }
      }).then((response: Response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response.json().then(json => {
            reject(UnknownReason);
          }).catch(reject);
        }
      }).catch(reject).catch(console.error);
    });

    return uploadPromise;
  }

  getCaptcha(fetchParams?: any): Promise<string> {
    let promise = this.captchaRequest;
    if (promise) return promise;

    let cacheBuster = '';
    if (fetchParams && fetchParams.cache === "reload") {
      cacheBuster = `random=${Math.random()}${this.captchaExpirationTime}`;
    }

    promise = new Promise((resolve, reject) => {
      if (this.hasValidCaptcha() && this.lastCaptcha) {
        resolve(this.lastCaptcha);
      } else {
        this.lastCaptcha = null;
        const url = `${config.accessibilityCloudBaseUrl}/captcha.svg?${cacheBuster}&appToken=${config.accessibilityCloudAppToken}`;
        console.log("Requesting new captcha");
        return this.constructor.fetch(url).then((response: Response) => {
          if (response.ok) {
            const expires = response.headers.get('expires');
            if (expires) {
              this.captchaExpirationTime = new Date(expires).getTime();
            }
            response.text().then(captcha => {
              this.lastCaptcha = captcha;
              this.captchaSolution = null;
              resolve(this.lastCaptcha);
            }).catch(reject);
          } else {
            reject();
          }
        }).catch(reject).catch(console.error);
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
    return this.getCaptcha({ headers: { 'pragma': 'no-cache', 'cache-control': 'no-cache' }, cache: "reload" });
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