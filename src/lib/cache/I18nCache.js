// @flow

import URLDataCache from './URLDataCache';

export default class I18nCache extends URLDataCache<?{}> {
  getLocalization(locale: string): Promise<?{}> {
    const url = `/i18n/${locale.replace('-', '_')}.po`;
    return this.getData(url);
  }

  static getDataFromResponse(response: Response): Promise<T> {
    return response.text();
  }
}

export const i18nCache = new I18nCache();
