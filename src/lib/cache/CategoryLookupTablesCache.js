// @flow

import env from '../env';
import config from '../config';
import TTLCache, { type TTLCacheOptions } from './TTLCache';
import Categories, { type RawCategoryLists } from '../Categories';
import ACCategoryCache from './ACCategoryCache';
import WheelmapCategoryCache from './WheelmapCategoryCache';
import WheelmapNodeTypeCache from './WheelmapNodeTypeCache';

export type CategoryLookupTablesCacheOptions = {
  reloadInBackground: boolean,
  // time in milliseconds
  maxAllowedCacheAgeBeforeReload: number,
};

const defaultLocales = ['de', 'en'];

export default class CategoryLookupTablesCache {
  lookupTablesCache: TTLCache<string, Promise<RawCategoryLists>>;
  acCategoryCache: ?ACCategoryCache;
  wheelmapCategoryCache: ?WheelmapCategoryCache;
  wheelmapNodeTypeCache: ?WheelmapNodeTypeCache;
  options: CategoryLookupTablesCacheOptions;

  constructor(options: $Shape<TTLCacheOptions & CategoryLookupTablesCacheOptions>) {
    this.options = {
      maxAllowedCacheAgeBeforeReload: 15000,
      reloadInBackground: true,
      ...options,
    };

    this.lookupTablesCache = new TTLCache<string, Promise<RawCategoryLists>>();

    if (env.public.accessibilityCloud.appToken && env.public.accessibilityCloud.baseUrl.cached) {
      this.acCategoryCache = new ACCategoryCache({
        ttlCache: options,
        appToken: env.public.accessibilityCloud.appToken,
        baseUrl: env.public.accessibilityCloud.baseUrl.cached,
      });
    }

    if (config.wheelmapApiKey && typeof config.wheelmapApiBaseUrl === 'string') {
      this.wheelmapCategoryCache = new WheelmapCategoryCache({
        ttlCache: options,
        apiKey: config.wheelmapApiKey,
        baseUrl: config.wheelmapApiBaseUrl,
      });

      this.wheelmapNodeTypeCache = new WheelmapNodeTypeCache({
        ttlCache: options,
        apiKey: config.wheelmapApiKey,
        baseUrl: config.wheelmapApiBaseUrl,
      });
    }

    // preload some of the locales already
    for (const locale of defaultLocales) {
      console.log('Preloading categories for', locale);
      this.getRawCategoryLists({ locale });
    }
  }

  getRawCategoryLists(options: {
    locale: string,
    disableWheelmapSource?: boolean,
  }): Promise<RawCategoryLists> {
    const countryCode = options.locale.substr(0, 2);

    const storedPromise = this.lookupTablesCache.get(countryCode);
    if (storedPromise) {
      if (this.options.reloadInBackground) {
        this.reloadInBackground(countryCode);
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
  reloadInBackground(countryCode: string) {
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
      const promise = this.getRawCategoryLists({ locale: countryCode });
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

export const categoriesCache = new CategoryLookupTablesCache({
  reloadInBackground: true,
  maxAllowedCacheAgeBeforeReload: 1000 * 60 * 60, // 1 hour
});
