// @flow
import { type ACCategory } from '../Categories';
import URLDataCache from './URLDataCache';
import { type TTLCacheOptions } from './TTLCache';

type ACCategoryData = {
  results: ACCategory[],
};

type ACCategoryCacheOptions = {
  ttlCache: ?$Shape<TTLCacheOptions>,
  appToken: string,
  baseUrl: string,
};

class ACCategoryCache extends URLDataCache<ACCategoryData> {
  options: ACCategoryCacheOptions;

  constructor(options: ACCategoryCacheOptions) {
    super(options.ttlCache);

    this.options = options;
  }

  getACCategories(): Promise<ACCategory[]> {
    const url = this.getUrl();

    return this.getData(url).then(data => data.results);
  }

  getUrl() {
    return `${this.options.baseUrl}/categories.json?appToken=${this.options.appToken}`;
  }
}

export default ACCategoryCache;
