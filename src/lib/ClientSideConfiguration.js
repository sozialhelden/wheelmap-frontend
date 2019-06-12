import { LocalizedString, translatedStringFromObject } from './i18n';

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

export type LinkDescription = {
  label?: LocalizedString,
  url?: LocalizedString,
  order?: number,
  type?: string,
  tags?: string[],
};

export type EmbedToken = {
  token: string,
  expiresOn: string,
};

export type ClientSideConfiguration = {
  logoURL: string,
  allowedBaseUrls: Array<string>,
  embedTokens: EmbedToken[],
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  disableWheelmapSource: boolean,
  textContent: {
    onboarding: {
      headerMarkdown: LocalizedString,
    },
    product: {
      name: LocalizedString,
      claim: LocalizedString,
      description: LocalizedString,
    },
  },
  meta: {
    twitter?: TwitterConfiguration,
    facebook?: FacebookConfiguration,
    googleAnalytics?: GoogleAnalyticsConfiguration,
  },
  customMainMenuLinks?: LinkDescription[],
  addPlaceURL: string,
};

export function getProductTitle(
  clientSideConfiguration: ClientSideConfiguration,
  title: ?string
): string {
  const { product } = clientSideConfiguration.textContent;
  const { name, claim } = product;

  if (!title) {
    return `${translatedStringFromObject(name)} – ${translatedStringFromObject(claim)}`;
  }

  return `${title} – ${translatedStringFromObject(name)}`;
}
