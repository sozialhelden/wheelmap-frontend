import env from './env';
import fetch from './fetch';

export type ClientSideConfiguration = {
  logoURL: string,
  allowedBaseURLs: Array<string>,
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  textContent: {
    onboarding: {
      headerMarkdown: string,
    },
    product: {
      name: string,
      claim: string,
    },
  },
  customMainMenuLinks: Array<Link>,
  addPlaceURL: string,
};

export async function getAppConfiguration(hostName: string): Promise<ClientSideConfiguration> {
  const baseUrl = env.public.accessibilityCloud.baseUrl.cached;
  const token = env.public.accessibilityCloud.appToken;
  const url = `${baseUrl}/apps/${hostName}.json?appToken=${token}`;

  const response = await fetch(url);
  const appJSON = await response.json();
  return appJSON.clientSideConfiguration;
}

export function getProductTitle(clientSideConfiguration: ClientSideConfiguration, title: ?string) {
  const { product } = clientSideConfiguration.textContent;

  if (!title) {
    return `${product.name} – ${product.claim}`;
  }

  return `${title} – ${product.name}`;
}
