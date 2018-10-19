// @flow

import URLDataCache from './URLDataCache';
import env from '../env';
import ClientSideConfiguration from '../ClientSideConfiguration';

export default class ClientSideConfigurationCache extends URLDataCache<ClientSideConfiguration> {
  getData(hostName: string): Promise<ClientSideConfiguration> {
    const url = this.getUrl(hostName);

    return super.getData(url).then(app => app.clientSideConfiguration);
  }

  inject(hostName: string, clientSideConfiguration: ClientSideConfiguration) {
    const url = this.getUrl(hostName);

    super.inject(url, { clientSideConfiguration });
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
