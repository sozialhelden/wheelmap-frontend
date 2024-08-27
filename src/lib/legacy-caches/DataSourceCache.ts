import { LocalizedString } from '../i18n/LocalizedString'
import URLDataCache from './URLDataCache'

export type DataSource = {
  _id: string;
  organizationId: string;
  licenseId: string | undefined;
  shortName: string | undefined;
  name: string | undefined;
  originWebsiteURL: string | undefined;
  additionalAccessibilityInformation: LocalizedString;
  translations?: {
    additionalAccessibilityInformation: LocalizedString;
  };
  isA11yRatingAllowed?: boolean;
  defaultKoboForm?: string;
};

export default class DataSourceCache extends URLDataCache<DataSource> {
  getDataSourceWithId(id: string, appToken: string): Promise<DataSource> {
    const url = this.urlFromId(id, appToken)

    return this.getData(url)
  }

  urlFromId(id: string, appToken: string) {
    const baseUrl = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || ''
    return `${baseUrl}/sources/${id}.json?appToken=${appToken}`
  }

  injectDataSource(source: DataSource, appToken: string) {
    const url = this.urlFromId(source._id, appToken)

    this.inject(url, source)
  }
}

export const dataSourceCache = new DataSourceCache({
  ttl: 1000 * 60 * 60,
})
