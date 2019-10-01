// @flow

import TTLCache, { type TTLCacheOptions } from './TTLCache';
import Categories, { type RawCategoryLists } from '../Categories';

export type CategoryLookupTablesCacheOptions = {
  reloadInBackground: boolean,
  // time in milliseconds
  maxAllowedCacheAgeBeforeReload: number,
  appToken: string,
};

export default class CategoryLookupTablesCache {
  lookupTablesCache: TTLCache<string, Promise<RawCategoryLists>>;
  options: CategoryLookupTablesCacheOptions;

  constructor(options: $Shape<TTLCacheOptions & CategoryLookupTablesCacheOptions>) {
    this.options = {
      maxAllowedCacheAgeBeforeReload: 15000,
      reloadInBackground: true,
      ...options,
    };

    this.lookupTablesCache = new TTLCache<string, Promise<RawCategoryLists>>();
  }

  getRawCategoryLists(options: {
    locale: string,
    disableWheelmapSource?: boolean,
    appToken: string,
  }): Promise<RawCategoryLists> {
    const countryCode = options.locale.substr(0, 2);

    const storedPromise = this.lookupTablesCache.get(countryCode);
    if (storedPromise) {
      if (this.options.reloadInBackground) {
        this.reloadInBackground(countryCode, options.appToken);
      }

      return storedPromise;
    }

    const promise = Categories.fetchCategoryData(options);
    this.lookupTablesCache.set(countryCode, promise);
    return promise;
  }

  injectLookupTables(localeString: string, rawCategoryLists: RawCategoryLists) {
    const countryCode = localeString.substr(0, 2);
    this.lookupTablesCache.set(countryCode, Promise.resolve(rawCategoryLists));
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
  reloadInBackground(countryCode: string, appToken: string) {
    const now = Date.now();
    const cacheEntry = this.lookupTablesCache.getCacheItem(countryCode);

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
      const promise = this.getRawCategoryLists({ locale: countryCode, appToken });
      // only update the cache when the promise resolves
      promise
        .then(() => {
          cacheEntry.isReloading = false;
          this.lookupTablesCache.set(countryCode, promise);
        })
        .catch(e => {
          cacheEntry.isReloading = false;
        });
    }
  }
}
