import URLDataCache from './URLDataCache';
import env from '../env';
export type License = { _id: string };

export default class LicenseCache extends URLDataCache<License> {
  getLicenseWithId(id: string, appToken: string): Promise<License> {
    const url = this.urlFromId(id, appToken);

    return this.getData(url);
  }

  urlFromId(id: string, appToken: string) {
    const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
    return `${baseUrl}/licenses/${id}.json?appToken=${appToken}`;
  }

  injectLicense(license: License, appToken: string) {
    const url = this.urlFromId(license._id, appToken);

    this.inject(url, license);
  }
}

export const licenseCache = new LicenseCache({
  ttl: 1000 * 60 * 60,
});
