// @flow

import URLDataCache from './URLDataCache';
import config from '../config';

export type DataSource = { _id: string, licenseId: ?string };

export default class DataSourceCache extends URLDataCache<DataSource> {
  getDataSourceWithId(
    id: string,
    options?: { useCache: boolean } = { useCache: true }
  ): Promise<DataSource> {
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
