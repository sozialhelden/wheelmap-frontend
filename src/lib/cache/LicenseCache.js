// @flow

import URLDataCache from './URLDataCache';
import config from '../config';

export default class LicenseCache extends URLDataCache<?{}> {
  getLicenseWithId(id: string, options?: { useCache: boolean } = { useCache: true }): Promise<?{}> {
    const url = `${config.accessibilityCloudBaseUrl}/licenses/${id}.json?appToken=${
      config.accessibilityCloudAppToken
    }`;
    return this.getData(url, options);
  }
}

export const licenseCache = new LicenseCache();
