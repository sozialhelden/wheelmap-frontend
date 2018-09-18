// @flow
import URLDataCache from './URLDataCache';
import { globalFetchManager } from '../FetchManager';
import isCordova from '../isCordova';
import config from '../config';

export default class I18nCache extends URLDataCache<?{}> {
  getLocalization(locale: string): Promise<?{}> {
    const baseUrl = isCordova() ? 'https://wheelmap.org/beta' : config.publicUrl || '';
    const url = `${baseUrl}/static/i18n/${locale.replace('-', '_')}.txt`;

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
