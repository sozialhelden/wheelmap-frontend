// @flow
import values from 'lodash/values';
import keyBy from 'lodash/keyBy';
import get from 'lodash/get';

import URLDataCache from './URLDataCache';
import env from '../env';
import { type ClientSideConfiguration } from '../ClientSideConfiguration';
import { type App } from '../App';

export default class AppCache extends URLDataCache<App> {
  getApp(hostName: string): Promise<ClientSideConfiguration> {
    const url = this.getUrl(hostName);

    return this.getData(url).then(app => {
      const customMainMenuLinks = values(get(app, 'related.appLinks') || {});

      return {
        ...app,
        customMainMenuLinks,
      };
    });
  }

  injectApp(hostName: string, app: App) {
    const url = this.getUrl(hostName);
    const { customMainMenuLinks, ...appWithoutLinks } = app;

    this.inject(url, {
      ...appWithoutLinks,
      related: {
        appLinks: keyBy(customMainMenuLinks, '_id'),
      },
    });
  }

  getUrl(hostName: string): string {
    const baseUrl = env.public.accessibilityCloud.baseUrl.cached;
    const token = env.public.accessibilityCloud.appToken;
    // Allow test deployments on zeit
    const cleanedHostName = hostName.replace(/-[a-z0-9]+\.now\.sh$/, '.now.sh');
    return `${baseUrl}/apps/${cleanedHostName}.json?appToken=${token}`;
  }
}

export const appCache = new AppCache({
  ttl: 1000 * 60 * 5,
});
