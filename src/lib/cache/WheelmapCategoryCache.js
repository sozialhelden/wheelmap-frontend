// @flow
import { type WheelmapCategory } from '../Categories';
import URLDataCache from './URLDataCache';
import { type TTLCacheOptions } from './TTLCache';

type WheelmapCategoryData = {
  categories: WheelmapCategory[],
};

type WheelmapCategoryCacheOptions = {
  ttlCache: ?$Shape<TTLCacheOptions>,
  apiKey: string,
  baseUrl: string,
};

class WheelmapCategoryCache extends URLDataCache<WheelmapCategoryData> {
  options: WheelmapCategoryCacheOptions;

  constructor(options: WheelmapCategoryCacheOptions) {
    super(options.ttlCache);

    this.options = options;
  }

  getWheelmapCategories(countryCode: string): Promise<WheelmapCategory[]> {
    const url = this.getUrl(countryCode);

    return this.getData(url).then(data => data.categories);
  }

  getUrl(countryCode: string) {
    return `${this.options.baseUrl}/api/categories?api_key=${
      this.options.apiKey
    }&locale=${countryCode}`;
  }
}

export default WheelmapCategoryCache;
