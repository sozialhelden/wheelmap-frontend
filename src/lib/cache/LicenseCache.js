// @flow

import URLDataCache from './URLDataCache';
import config from '../config';

export default class LicenseCache extends URLDataCache<?{}> {
  getLicenseWithId(id: string): Promise<?{}> {
    const url = `https://www.accessibility.cloud/licenses/${id}.json&appToken=${config.accessibilityCloudAppToken}`;
    return this.getData(url);
  }
}
