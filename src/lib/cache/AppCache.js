// @flow
import values from 'lodash/values';
import keyBy from 'lodash/keyBy';
import get from 'lodash/get';

import URLDataCache from './URLDataCache';
import { type ClientSideConfiguration, type LinkDescription } from '../ClientSideConfiguration';

import { type App } from '../App';
import env from '../env';

type AppApiData = {
  _id: string,
  organizationId: string,
  name: string,
  description?: String,
  clientSideConfiguration?: ClientSideConfiguration,
  tokenString: string,
  related?: {
    appLinks?: {
      [key: string]: LinkDescription,
    },
  },
};

export default class AppCache extends URLDataCache<AppApiData> {
  getApp(hostName: string): Promise<App> {
    const url = this.getUrl(hostName);

    return this.getData(url).then(appData => {
      // extract the appLinks from the related property and put them under
      // clientSideConfiguration.customMainMenuLinks
      const { related, ...appDataWithoutRelatedProp } = appData;
      const customMainMenuLinks: LinkDescription[] = values(get(related, 'appLinks') || {});

      return {
        ...appDataWithoutRelatedProp,
        clientSideConfiguration: {
          ...appDataWithoutRelatedProp.clientSideConfiguration,
          customMainMenuLinks,
        },
      };
    });
  }

  injectApp(hostName: string, app: App) {
    const url = this.getUrl(hostName);

    const { customMainMenuLinks, ...configWithoutLinks } = app.clientSideConfiguration;

    const appWithoutLinks = {
      ...app,
      clientSideConfiguration: configWithoutLinks,
    };

    this.inject(url, {
      ...appWithoutLinks,
      related: {
        appLinks: keyBy(customMainMenuLinks, '_id'),
      },
    });
  }

  getUrl(hostName: string): string {
    const baseUrl = env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL;
    const token = env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN;
    // Allow test deployments on zeit
    const cleanedHostName = hostName.replace(/-[a-z0-9]+\.now\.sh$/, '.now.sh');
    return `${baseUrl}/apps/${cleanedHostName}.json?appToken=${token}`;
  }
}

export const appCache = new AppCache({
  reloadInBackground: true,
  maxAllowedCacheAgeBeforeReload: 1000 * 60 * 5, // 5 minutes
});
