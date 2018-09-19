// @flow
import { globalFetchManager } from '../FetchManager';
import { t } from 'ttag';
import ResponseError from '../ResponseError';

// Provides a WhatWG-fetch-like API to make HTTP requests.
// Caches response promises and returns an old promise if one is existing for the same URL.

export default class URLDataCache<T> {
  cache: { [key: string]: Promise<T> } = {};

  fetch(url: string, resolve: (data: T) => void, reject: (response: any) => void) {
    this.constructor.fetch(url, { cordova: true }).then((response: Response) => {
      if (response.status === 200) {
        return this.constructor.getDataFromResponse(response).then(fetchedData => {
          resolve(fetchedData);
        }, reject);
      }
      const error = new Error(response.statusText);
      error.response = response;
      return reject(response);
    }, reject);
  }

  /**
   * Gets a feature from cache or fetches it from the web.
   * @param {string} url
   */
  getData(url: string): Promise<T> {
    if (!url) {
      return new Promise((resolve, reject) => {
        reject(null);
      });
    }

    let promise = this.cache[url];
    if (promise) return promise;
    promise = new Promise((resolve, reject) => {
      this.fetch(url, resolve, reject);
    });
    this.cache[url] = promise;
    return promise;
  }

  /** @private */ getCachedPromise(url: string): Promise<?T> {
    return this.cache[url];
  }

  static getDataFromResponse(response: Response): Promise<T> {
    if (!response.ok) {
      // translator: Shown when there was an error while loading a place.
      const errorText = t`Error while loading data.`;
      throw new ResponseError(errorText, response);
    }
    return response.json();
  }

  /**
   * Fetches a non-cached feature from its store, using WhatWG `fetch`.
   * @param {string} url
   */
  /** @protected */ static fetch(url: string, options?: {}): Promise<Response> {
    return globalFetchManager.fetch(url, options);
  }
}
