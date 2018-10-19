// @flow

import URLDataCache from './URLDataCache';
import env from '../env';

export type License = { _id: string };

export default class LicenseCache extends URLDataCache<License> {
  getLicenseWithId(id: string): Promise<License> {
    const url = this.urlFromId(id);

    return this.getData(url);
  }

  urlFromId(id: string) {
    return `${env.public.accessibilityCloud.baseUrl.cached}/licenses/${id}.json?appToken=${
      env.public.accessibilityCloud.appToken
    }`;
  }

  injectLicense(license: License) {
    const url = this.urlFromId(license._id);

    this.inject(url, license);
  }
}

export const licenseCache = new LicenseCache({
  ttl: 1000 * 60 * 60,
});
