// @flow

import env from '../env';
import config from '../config';
import TTLCache, { type TTLCacheOptions } from './TTLCache';
import Categories, { type RawCategoryLists } from '../Categories';
import ACCategoryCache from './ACCategoryCache';
import WheelmapCategoryCache from './WheelmapCategoryCache';
import WheelmapNodeTypeCache from './WheelmapNodeTypeCache';

export default class CategoryLookupTablesCache {
  lookupTablesCache: TTLCache<string, Promise<RawCategoryLists>>;
  acCategoryCache: ?ACCategoryCache;
  wheelmapCategoryCache: ?WheelmapCategoryCache;
  wheelmapNodeTypeCache: ?WheelmapNodeTypeCache;

  constructor(options: $Shape<TTLCacheOptions>) {
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
  }

  getRawCategoryLists(options: {
    locale: string,
    disableWheelmapSource?: boolean,
  }): Promise<RawCategoryLists> {
    const countryCode = options.locale.substr(0, 2);

    const storedPromise = this.lookupTablesCache.get(countryCode);
    if (storedPromise) {
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
}

export const categoriesCache = new CategoryLookupTablesCache({
  ttl: 1000 * 60 * 60,
});
