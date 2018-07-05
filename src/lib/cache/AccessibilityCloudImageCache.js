// @flow

import URLDataCache from './URLDataCache';
import type { AccessibilityCloudImages } from '../Feature';
import config from '../config';

export const InvalidCaptchaReason = "invalid-captcha";
export const UnknownReason = "unknown";

export default class AccessibilityCloudImageCache extends URLDataCache<AccessibilityCloudImages> {
  
  getPhotosForFeature(featureId: string): Promise<AccessibilityCloudImages | null> {
    return this.getImage("place", featureId);
  }

  getImage(context: string, objectId: string): Promise<AccessibilityCloudImages | null> {
    return this.getData(`${config.accessibilityCloudBaseUrl}/images.json?context=${context}&objectId=${objectId}&appToken=${config.accessibilityCloudAppToken}`);
  }

  uploadPhotoForFeature(featureId: string, images: FileList, captchaSolution: string): Promise<boolean> {
    const image = images[0];

    const uploadPromise = new Promise((resolve, reject) => {
      this.constructor.fetch(
        `${config.accessibilityCloudBaseUrl}/image-upload?placeId=${featureId}&captcha=${captchaSolution}&appToken=${config.accessibilityCloudAppToken}`, 
        {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': image.type,
          },
          body: image,
        }
      ).then((response: Response) => {
        if (response.ok) {
          resolve(true);
        } else {
          response.json()
            .then((json) => {
              const reason = json.error.reason;
              if (reason === "No captcha found.") {
                reject(InvalidCaptchaReason);
              } else {
                reject(UnknownReason);
              }
            }).catch(reject);
        }
      }).catch(reject);
    });

    return uploadPromise;
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
            console.error("Failed loading captcha");
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
