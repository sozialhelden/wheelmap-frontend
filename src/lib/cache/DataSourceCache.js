// @flow

import URLDataCache from './URLDataCache';
import env from '../env';

export type DataSource = { _id: string, licenseId: ?string };

export default class DataSourceCache extends URLDataCache<DataSource> {
  getDataSourceWithId(id: string): Promise<DataSource> {
    const url = this.urlFromId(id);

    return this.getData(url);
  }

  urlFromId(id: string) {
    return `${env.public.accessibilityCloud.baseUrl.cached}/sources/${id}.json?appToken=${
      env.public.accessibilityCloud.appToken
    }`;
  }

  injectDataSource(source: DataSource) {
    const url = this.urlFromId(source._id);

    this.inject(url, source);
  }
}

export const dataSourceCache = new DataSourceCache({
  ttl: 1000 * 60 * 60,
});
