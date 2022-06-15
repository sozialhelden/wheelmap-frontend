import { LocalizedString, translatedStringFromObject } from './i18n';
import { LinkData } from '../components/App';
import { IBranding } from './IBranding';

export interface TwitterConfiguration {
  siteHandle?: string;
  creatorHandle?: string;
  imageURL?: string;
}

export interface FacebookConfiguration {
  appId?: string;
  admins?: string;
  imageURL?: string;
}

export interface LinkDescription {
  label?: LocalizedString;
  url?: LocalizedString;
  order?: number;
  type?: string;
  tags?: string[];
}

export interface EmbedToken {
  token: string;
  expiresOn: string;
}

export interface ClientSideConfiguration {
  branding?: IBranding;
  allowedBaseUrls?: Array<string>;
  embedTokens?: EmbedToken[];
  includeSourceIds?: Array<string>;
  excludeSourceIds?: Array<string>;
  disableWheelmapSource?: boolean;
  textContent?: {
    onboarding?: {
      headerMarkdown?: LocalizedString;
    };
    product?: {
      name?: LocalizedString;
      claim?: LocalizedString;
      description?: LocalizedString;
    };
  };
  meta: {
    twitter?: TwitterConfiguration;
    facebook?: FacebookConfiguration;
  };
  customMainMenuLinks?: LinkData[];
  addPlaceURL?: string;
}

export function getProductTitle(
  clientSideConfiguration: ClientSideConfiguration,
  title?: string
): string {
  const { product } = clientSideConfiguration.textContent || {
    product: {
      name: 'Wheelmap',
      claim: 'Find wheelchair accessible places',
    },
  };
  const { name, claim } = product;

  if (!title) {
    return `${translatedStringFromObject(name)} – ${translatedStringFromObject(claim)}`;
  }

  return `${title} – ${translatedStringFromObject(name)}`;
}
