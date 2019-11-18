import { LocalizedString, translatedStringFromObject } from './i18n';
import { LinkData } from '../App';

export interface TwitterConfiguration {
  siteHandle?: string,
  creatorHandle?: string,
  imageURL?: string,
};

export interface FacebookConfiguration {
  appId?: string,
  admins?: string,
  imageURL?: string,
};

export interface GoogleAnalyticsConfiguration {
  trackingId?: string,
  siteVerificationToken?: string,
  siteVerification?: any
};

export interface LinkDescription {
  label?: LocalizedString,
  url?: LocalizedString,
  order?: number,
  type?: string,
  tags?: string[],
};

export interface EmbedToken {
  token: string,
  expiresOn: string,
};

export interface ClientSideConfiguration {
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
  customMainMenuLinks?: LinkData[],
  addPlaceURL: string,
};

export function getProductTitle(
  clientSideConfiguration: ClientSideConfiguration,
  title?: string
): string {
  const { product } = clientSideConfiguration.textContent;
  const { name, claim } = product;

  if (!title) {
    return `${translatedStringFromObject(name)} – ${translatedStringFromObject(claim)}`;
  }

  return `${title} – ${translatedStringFromObject(name)}`;
}
