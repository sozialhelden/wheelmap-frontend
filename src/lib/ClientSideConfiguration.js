import env from './env';
import fetch from './fetch';

export type TwitterConfiguration = {
  siteHandle?: string,
  creatorHandle?: string,
  imageURL?: string,
};

export type FacebookConfiguration = {
  appId?: string,
  admins?: string,
  imageURL?: string,
};

export type GoogleAnalyticsConfiguration = {
  trackingId?: string,
  siteVerificationToken?: string,
};

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
      description: string,
    },
  },
  meta: {
    twitter?: TwitterConfiguration,
    facebook?: FacebookConfiguration,
    googleAnalytics?: GoogleAnalyticsConfiguration,
  },
  customMainMenuLinks: Array<Link>,
  addPlaceURL: string,
};

export async function fetchClientSideConfiguration(
  hostName: string
): Promise<ClientSideConfiguration> {
  const baseUrl = env.public.accessibilityCloud.baseUrl.cached;
  const token = env.public.accessibilityCloud.appToken;
  // Allow test deployments on zeit
  const cleanedHostName = hostName.replace(/-[a-z0-9]+\.now\.sh$/, '.now.sh');
  const url = `${baseUrl}/apps/${cleanedHostName}.json?appToken=${token}`;

  const response = await fetch(url);
  const appJSON = await response.json();
  return appJSON.clientSideConfiguration;
}

export function getProductTitle(
  clientSideConfiguration: ClientSideConfiguration,
  title: ?string
): string {
  const { product } = clientSideConfiguration.textContent;

  if (!title) {
    return `${product.name} – ${product.claim}`;
  }

  return `${title} – ${product.name}`;
}
