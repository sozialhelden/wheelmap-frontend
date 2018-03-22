// @flow

import URLDataCache from './URLDataCache';
import config from '../config';

export default class I18nCache extends URLDataCache<?{}> {
  getLocalization(locale: string): Promise<?{}> {
    const url = `${process.env.PUBLIC_URL}/i18n/${locale.replace('-', '_')}.txt`;
    return this.getData(url);
  }

  static getDataFromResponse(response: Response): Promise<T> {
    return response.text();
  }
}

export const i18nCache = new I18nCache();
