import * as EJSON from 'ejson';
import { t } from 'ttag';
import { globalFetchManager } from '../FetchManager';

import ResponseError from '../util/ResponseError';
import TTLCache, { TTLCacheOptions } from './TTLCache';

export type URLDataCacheOptions = {
  reloadInBackground: boolean,
  // time in milliseconds
  maxAllowedCacheAgeBeforeReload: number,
};

// Provides a WhatWG-fetch-like API to make HTTP requests.
// Caches response promises and returns an old promise if one is existing for the same URL.

export default class URLDataCache<T> {
  cache: TTLCache<string, Promise<T>>;

  options: URLDataCacheOptions;

  constructor(options?: Partial<TTLCacheOptions & URLDataCacheOptions>) {
    this.options = {
      maxAllowedCacheAgeBeforeReload: 15000,
      reloadInBackground: false,
      ...options,
    };

    this.cache = new TTLCache<string, Promise<T>>(options);
  }

  fetch(url: string): Promise<T> {
    // @ts-ignore
    return this.constructor.fetch(url).then((response: Response) => {
      if (response.status === 200) {
        // @ts-ignore
        return this.constructor.getDataFromResponse(response);
      }

      throw new ResponseError(response.statusText, response);
    });
  }

  /**
   * Gets a feature from cache or fetches it from the web.
   * @param {string} url
   */
  getData(url: string, options: { useCache: boolean } = { useCache: true }): Promise<T> {
    if (!url) {
      return Promise.reject(null);
    }

    let promise = this.options.reloadInBackground ? this.cache.get(url) : this.cache.touch(url);

    if (promise) {
      if ((!options || options.useCache) && this.options.reloadInBackground) {
        this.reloadInBackground(url);
      }
      return promise;
    }

    promise = this.fetch(url);
    if (!options || options.useCache) {
      this.cache.set(url, promise);
    }

    return promise;
  }

  /**
   * Updates a valid entry in the ttl cache. Leaves resolved promise in the cache as
   * long as possible to prevent slow responses in between.
   *
   * This introduces a potential resource waste/timing issue
   *  T0: req1 - cache still valid, background reloading triggers
   *  T1: req2 - cache invalid, new request started, not reusing the promise of req1
   *  T2: res2 - updates cache
   *  T3: res1 - updates cache again (with potentially older result)
   *
   * A solution could be storing the reload promise with the ttl-cache entry and using it
   * when the ttl entry is expired. This would increase the complexity too much for
   * an edge case that no one will care about.
   */
  reloadInBackground(url: string) {
    const now = Date.now();
    const cacheEntry = this.cache.getCacheItem(url);

    if (!cacheEntry) {
      // something went wrong, this should not happen
      return;
    }

    if (cacheEntry.isReloading) {
      return;
    }

    const elapsed = now - cacheEntry.storageTimestamp;

    if (elapsed > this.options.maxAllowedCacheAgeBeforeReload) {
      cacheEntry.isReloading = true;
      // download data
      const promise = this.fetch(url);
      // only update the cache when the promise resolves
      promise
        .then(() => {
          cacheEntry.isReloading = false;
          this.cache.set(url, promise);
        })
        .catch((e) => {
          cacheEntry.isReloading = false;
        });
    }
  }

  inject(url: string, result: T) {
    this.cache.set(url, Promise.resolve(result));
  }

  static getDataFromResponse(response: Response): Promise<any> {
    if (!response.ok) {
      // translator: Shown when there was an error while loading a place.
      const errorText = t`Error while loading data.`;
      throw new ResponseError(errorText, response);
    }

    // We need to use the EJSON parser instead of plain JSON parser since our
    // backend stores data in EJSON format
    return response.text().then(EJSON.parse);
  }

  /**
   * Fetches a non-cached feature from its store, using WhatWG `fetch`.
   * @param {string} url
   */
  /** @protected */ static fetch(url: string, options?: {}): Promise<Response> {
    return globalFetchManager.fetch(url, options);
  }
}
