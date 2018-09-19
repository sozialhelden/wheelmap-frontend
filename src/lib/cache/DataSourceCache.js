// @flow

import URLDataCache from './URLDataCache';
import config from '../config';

export default class DataSourceCache extends URLDataCache<{}> {
  getDataSourceWithId(
    id: string,
    options?: { useCache: boolean } = { useCache: true }
  ): Promise<{}> {
    const url = `${config.accessibilityCloudBaseUrl}/sources/${id}.json?appToken=${
      config.accessibilityCloudAppToken
    }`;
    return this.getData(url, options);
  }
}

export const dataSourceCache = new DataSourceCache();
