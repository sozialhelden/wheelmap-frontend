// @flow
import { type WheelmapCategory } from '../Categories';
import URLDataCache from './URLDataCache';
import { type TTLCacheOptions } from './TTLCache';

type WheelmapNodeTypeData = {
  node_types: WheelmapCategory[],
};

type WheelmapNodeTypeCacheOptions = {
  ttlCache: ?$Shape<TTLCacheOptions>,
  apiKey: string,
  baseUrl: string,
};

class WheelmapNodeTypeCache extends URLDataCache<WheelmapNodeTypeData> {
  options: WheelmapNodeTypeCacheOptions;

  constructor(options: WheelmapNodeTypeCacheOptions) {
    super(options.ttlCache);

    this.options = options;
  }

  getWheelmapNodeTypes(countryCode: string): Promise<WheelmapCategory[]> {
    const url = this.getUrl(countryCode);

    return this.getData(url).then(data => data.node_types);
  }

  getUrl(countryCode: string) {
    return `${this.options.baseUrl}/api/node_types?api_key=${
      this.options.apiKey
    }&locale=${countryCode}`;
  }
}

export default WheelmapNodeTypeCache;
