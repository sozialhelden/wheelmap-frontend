import type { LocalizedString } from "@sozialhelden/a11yjson";
import type ISVGOResult from "~/needs-refactoring/lib/model/ac/ISVGOResult";

export type WhitelabelBranding = {
  colors?: {
    primary: string;
  };
  vectorLogoSVG?: ISVGOResult;
  vectorIconSVG?: ISVGOResult;
};

export type WhitelabelEmbedToken = {
  token: string;
  expiresOn: string;
};

export type WhitelabelTwitterConfig = {
  siteHandle?: string;
  creatorHandle?: string;
  imageURL?: string;
};

export type WhitelabelFacebookConfig = {
  appId?: string;
  admins?: string;
  imageURL?: string;
};

export type WhitelabelNavLinkImportance =
  | "alwaysVisible"
  | "advertisedIfPossible"
  | "insignificant";

export type WhitelabelNavLink = {
  _id: string;
  appId: string;
  label: LocalizedString;
  badgeLabel?: LocalizedString;
  url: LocalizedString;
  order?: number;
  tags?: string[];
  importance?: WhitelabelNavLinkImportance;
};

export type WhitelabelClientConfig = {
  branding?: WhitelabelBranding;
  allowedBaseUrls?: Array<string>;
  embedTokens?: WhitelabelEmbedToken[];
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
    twitter?: WhitelabelTwitterConfig;
    facebook?: WhitelabelFacebookConfig;
  };
  addPlaceURL?: string;
};

export type WhitelabelApp = {
  _id: string;
  organizationId: string;
  name: string;
  clientSideConfiguration: WhitelabelClientConfig;
  tokenString: string;
  defaultSourceIdForAddedPlaces?: string;
  description?: string;
  related?: {
    appLinks?: {
      [key: string]: WhitelabelNavLink;
    };
  };
};
