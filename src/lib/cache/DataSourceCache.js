// @flow

import URLDataCache from './URLDataCache';
import env from '../env';

export type DataSource = {
  _id: string,
  organizationId: string,
  licenseId: ?string,
  shortName: ?string,
  name: ?string,
  originWebsiteURL: ?string,
};

export default class DataSourceCache extends URLDataCache<DataSource> {
  getDataSourceWithId(id: string): Promise<DataSource> {
    const url = this.urlFromId(id);

    return this.getData(url);
  }

  urlFromId(id: string) {
    const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
    const appToken = env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN || '';
    return `${baseUrl}/sources/${id}.json?appToken=${appToken}`;
  }

  injectDataSource(source: DataSource) {
    const url = this.urlFromId(source._id);

    this.inject(url, source);
  }
}

export const dataSourceCache = new DataSourceCache({
  ttl: 1000 * 60 * 60,
});
