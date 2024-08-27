import TTLCache, { TTLCacheOptions } from './TTLCache';
import Categories, {
  RawCategoryLists,
} from '../model/ac/categories/Categories';

export type CategoryLookupTablesCacheOptions = {
  reloadInBackground: boolean;
  // time in milliseconds
  maxAllowedCacheAgeBeforeReload: number;
  appToken: string;
};

export default class CategoryLookupTablesCache {
  lookupTablesCache: TTLCache<string, Promise<RawCategoryLists>>;

  options: Partial<TTLCacheOptions & CategoryLookupTablesCacheOptions>;

  constructor(
    options: Partial<TTLCacheOptions & CategoryLookupTablesCacheOptions>,
  ) {
    this.options = {
      maxAllowedCacheAgeBeforeReload: 15000,
      reloadInBackground: true,
      ...options,
    };

    this.lookupTablesCache = new TTLCache<string, Promise<RawCategoryLists>>();
  }

  getRawCategoryLists(options: {
    locale: string;
    disableWheelmapSource?: boolean;
    appToken: string;
  }): Promise<RawCategoryLists> {
    const languageCode = options.locale.substr(0, 2);

    const storedPromise = this.lookupTablesCache.get(languageCode);
    if (storedPromise) {
      if (this.options.reloadInBackground) {
        this.reloadInBackground(languageCode, options.appToken);
      }

      return storedPromise;
    }

    const promise = Categories.fetchCategoryData(options);
    this.lookupTablesCache.set(languageCode, promise);
    return promise;
  }

  injectLookupTables(localeString: string, rawCategoryLists: RawCategoryLists) {
    const languageCode = localeString.substr(0, 2);
    this.lookupTablesCache.set(languageCode, Promise.resolve(rawCategoryLists));
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
  reloadInBackground(languageCode: string, appToken: string) {
    const now = Date.now();
    const cacheEntry = this.lookupTablesCache.getCacheItem(languageCode);

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
      const promise = this.getRawCategoryLists({
        locale: languageCode,
        appToken,
      });
      // only update the cache when the promise resolves
      promise
        .then(() => {
          cacheEntry.isReloading = false;
          this.lookupTablesCache.set(languageCode, promise);
        })
        .catch((e) => {
          cacheEntry.isReloading = false;
        });
    }
  }
}
