// @flow

import URLDataCache from './URLDataCache';
import env from '../env';

export type License = { _id: string };

export default class LicenseCache extends URLDataCache<License> {
  getLicenseWithId(
    id: string,
    options?: { useCache: boolean } = { useCache: true }
  ): Promise<License> {
    const url = this.urlFromId(id);
    return this.getData(url, options);
  }

  urlFromId(id: string) {
    return `${env.public.accessibilityCloud.baseUrl.cached}/licenses/${id}.json?appToken=${
      env.public.accessibilityCloud.appToken
    }`;
  }
}

export const licenseCache = new LicenseCache();
