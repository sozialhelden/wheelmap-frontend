// @flow

import URLDataCache from './URLDataCache';
import config from '../config';

export default class DataSourceCache extends URLDataCache<{}> {
  getDataSourceWithId(
    id: string,
    options?: { useCache: boolean } = { useCache: true }
  ): Promise<{}> {
    const url = this.urlFromId(id);
    return this.getData(url, options);
  }

  urlFromId(id: string) {
    return `${config.accessibilityCloudBaseUrl}/sources/${id}.json?appToken=${
      config.accessibilityCloudAppToken
    }`;
  }
}

export const dataSourceCache = new DataSourceCache();
