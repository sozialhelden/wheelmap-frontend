import values from 'lodash/values';
import keyBy from 'lodash/keyBy';
import get from 'lodash/get';

import URLDataCache from './URLDataCache';
import { ClientSideConfiguration, LinkDescription } from '../ClientSideConfiguration';

import { App } from '../App';
import env from '../env';
import { LinkData } from '../../App';

type AppApiData = {
  _id: string,
  organizationId: string,
  name: string,
  description?: String,
  clientSideConfiguration?: ClientSideConfiguration,
  tokenString: string,
  related?: {
    appLinks?: {
      [key: string]: LinkData,
    },
  },
};

export default class AppCache extends URLDataCache<AppApiData> {
  getApp(hostName: string): Promise<App> {
    // For bootstrapping, we need to use Wheelmap's token - it can load any app's info.
    const appToken = env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN;
    const url = this.getUrl(hostName, appToken);

    return this.getData(url).then(appData => {
      // extract the appLinks from the related property and put them under
      // clientSideConfiguration.customMainMenuLinks
      const { related, ...appDataWithoutRelatedProp } = appData;
      const customMainMenuLinks: LinkData[] = values(get(related, 'appLinks') || {});

      return {
        ...appDataWithoutRelatedProp,
        clientSideConfiguration: {
          ...appDataWithoutRelatedProp.clientSideConfiguration,
          customMainMenuLinks,
        },
      };
    });
  }

  injectApp(hostName: string, app: App, appToken: string) {
    const url = this.getUrl(hostName, appToken);

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

  getUrl(hostName: string, appToken: string): string {
    const baseUrl = env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL;
    // Allow test deployments on zeit
    const cleanedHostName = hostName.replace(/-[a-z0-9]+\.now\.sh$/, '.now.sh');
    return `${baseUrl}/apps/${cleanedHostName}.json?appToken=${appToken}`;
  }
}

export const appCache = new AppCache({
  reloadInBackground: true,
  maxAllowedCacheAgeBeforeReload: 1000 * 60 * 5, // 5 minutes
});
