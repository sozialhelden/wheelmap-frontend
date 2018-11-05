// @flow

import URLDataCache from './URLDataCache';
import env from '../env';

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
    return `${env.public.accessibilityCloud.baseUrl.cached}/sources/${id}.json?appToken=${
      env.public.accessibilityCloud.appToken
    }`;
  }
}

export const dataSourceCache = new DataSourceCache();
