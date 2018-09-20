// @flow

import URLDataCache from './URLDataCache';
import config from '../config';

export default class LicenseCache extends URLDataCache<?{}> {
  getLicenseWithId(id: string, options?: { useCache: boolean } = { useCache: true }): Promise<?{}> {
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
