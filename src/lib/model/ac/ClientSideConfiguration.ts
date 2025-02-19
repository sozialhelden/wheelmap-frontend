import type { LocalizedString } from "@sozialhelden/a11yjson";
import { useTranslatedStringFromObject } from "../../i18n/useTranslatedStringFromObject";
import type { IBranding } from "./IBranding";

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
  addPlaceURL?: string;
}

export function getProductTitle(
  clientSideConfiguration: ClientSideConfiguration,
  title?: string,
): string {
  const { product } = clientSideConfiguration.textContent || {
    product: {
      name: "Wheelmap",
      claim: "Find wheelchair accessible places",
    },
  };
  const { name, claim } = product;

  if (!title) {
    return `${useTranslatedStringFromObject(name)} – ${useTranslatedStringFromObject(
      claim,
    )}`;
  }

  return `${title} – ${useTranslatedStringFromObject(name)}`;
}
