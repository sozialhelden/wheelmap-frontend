// @flow

import URLDataCache from './URLDataCache';
import type { AccessibilityCloudImages } from '../Feature';
import config from '../config';

export default class AccessibilityCloudImageCache extends URLDataCache<?AccessibilityCloudImages> {
  
  getPhotosForFeature(featureId: string): Promise<?AccessibilityCloudImages> {
    return this.getData(`${config.accessibilityCloudBaseUrl}/images?context=place&objectId=${featureId}&appToken=${config.accessibilityCloudAppToken}`);
  }
  
  getCaptcha() : Promise<string> {
    let promise = this.captchaRequest;
    if (promise) return promise;

    const url = `${config.accessibilityCloudBaseUrl}/captcha.svg?appToken=${config.accessibilityCloudAppToken}`
    promise = new Promise((resolve, reject) => {
      if (this.hasValidCaptcha() && this.lastCaptcha) {
        resolve(this.lastCaptcha);
      } else {
        console.log("requesting new captcha");
        this.lastCaptcha = null;
        return this.constructor.fetch(url).then((response: Response) => {
          if (response.ok) {
            const expires = response.headers.get('expires');
            if (expires) {
              this.captchaExpirationTime = new Date(expires).getTime();
            }
            response.text().then((captcha) => {
              this.lastCaptcha = captcha;
              resolve(this.lastCaptcha);
            }).catch(reject);
          } else {
            reject();
          }
        }).catch(reject);
      }
    })

    const resetCaptcha = () => {
      this.captchaRequest = null;
    };
    promise.then(resetCaptcha, resetCaptcha);

    return promise;
  }

  hasValidCaptcha() {
    const isCaptchaExpired = Date.now() >= (this.captchaExpirationTime - 60 * 100); // add 60 seconds captcha grace period
    return !isCaptchaExpired && this.lastCaptcha;
  }

  lastCaptcha: string | null = null;
  captchaExpirationTime: number = 0;
  captchaRequest: Promise<string> | null;
}

export const accessibilityCloudImageCache = new AccessibilityCloudImageCache();
