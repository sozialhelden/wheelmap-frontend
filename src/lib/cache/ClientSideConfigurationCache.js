// @flow
import values from 'lodash/values';
import keyBy from 'lodash/keyBy';
import get from 'lodash/get';

import URLDataCache from './URLDataCache';
import env from '../env';
import { type ClientSideConfiguration } from '../ClientSideConfiguration';

type ClientSideConfigurationData = {
  clientSideConfiguration: ClientSideConfiguration,
};

export function insertPlaceholdersToAddPlaceUrl(url: ?string) {
  const replacements = { returnUrl: `${env.public.baseUrl}/contribution-thanks` };

  let replacedUrl = url;
  if (typeof replacedUrl === 'string') {
    for (const key in replacements) {
      if (replacements.hasOwnProperty(key)) {
        const fieldRegexp = new RegExp(`{${key}}`, 'g');
        replacedUrl = replacedUrl.replace(fieldRegexp, replacements[key]);
      }
    }
  }
  return replacedUrl;
}

export default class ClientSideConfigurationCache extends URLDataCache<
  ClientSideConfigurationData
> {
  getClientSideConfiguration(hostName: string): Promise<ClientSideConfiguration> {
    const url = this.getUrl(hostName);

    return this.getData(url).then(app => {
      const customMainMenuLinks = values(get(app, 'related.appLinks') || {});

      return {
        ...app.clientSideConfiguration,
        customMainMenuLinks,
      };
    });
  }

  injectClientSideConfiguration(
    hostName: string,
    clientSideConfiguration: ClientSideConfiguration
  ) {
    const url = this.getUrl(hostName);
    const { customMainMenuLinks, ...clientSideConfigurationWithoutLinks } = clientSideConfiguration;

    this.inject(url, {
      clientSideConfiguration: clientSideConfigurationWithoutLinks,
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

export const clientSideConfigurationCache = new ClientSideConfigurationCache({
  ttl: 1000 * 60 * 5,
});
