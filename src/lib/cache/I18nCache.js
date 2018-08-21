// @flow

import URLDataCache from './URLDataCache';
import { globalFetchManager } from '../FetchManager';

export default class I18nCache extends URLDataCache<?{}> {
  getLocalization(locale: string): Promise<?{}> {
    const baseUrl = window.cordova ? 'https://wheelmap.org/beta' : process.env.PUBLIC_URL || '';
    const url = `${baseUrl}/i18n/${locale.replace('-', '_')}.txt`;
    return this.getData(url);
  }

  static getDataFromResponse(response: Response): Promise<T> {
    return response.text();
  }

  static fetch(url: string, options?: {}): Promise<Response> {
    return globalFetchManager.fetch(url, { cordova: true });
  }
}

export const i18nCache = new I18nCache();