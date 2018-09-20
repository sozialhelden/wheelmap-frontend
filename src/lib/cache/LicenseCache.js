// @flow

import URLDataCache from './URLDataCache';
import config from '../config';

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
    return `${config.accessibilityCloudBaseUrl}/licenses/${id}.json?appToken=${
      config.accessibilityCloudAppToken
    }`;
  }
}

export const licenseCache = new LicenseCache();
