// @flow
import { globalFetchManager } from '../FetchManager';
import { t } from 'ttag';

import ResponseError from '../ResponseError';
import TTLCache, { type TTLCacheOptions } from './TTLCache';

// Provides a WhatWG-fetch-like API to make HTTP requests.
// Caches response promises and returns an old promise if one is existing for the same URL.

type URL = string;

export default class URLDataCache<T> {
  cache: TTLCache<URL, Promise<T>>;

  constructor(options?: TTLCacheOptions) {
    this.cache = new TTLCache<URL, Promise<T>>(options);
  }

  fetch(url: URL): Promise<T> {
    return this.constructor.fetch(url, { cordova: true }).then((response: Response) => {
      if (response.status === 200) {
        return this.constructor.getDataFromResponse(response);
      }

      throw new new ResponseError(response.statusText, response)();
    });
  }

  /**
   * Gets a feature from cache or fetches it from the web.
   * @param {string} url
   */
  getData(url: URL, options?: { useCache: boolean } = { useCache: true }): Promise<T> {
    if (!url) {
      return Promise.reject(null);
    }

    let promise = this.cache.get(url);

    if (promise) {
      return promise;
    }

    promise = this.fetch(url);

    if (!options || options.useCache) {
      this.cache.set(url, promise);
    }

    return promise;
  }

  inject(url: string, result: T) {
    this.cache.set(url, Promise.resolve(result));
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
