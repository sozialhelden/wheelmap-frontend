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
