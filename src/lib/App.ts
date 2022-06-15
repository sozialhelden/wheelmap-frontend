import { ClientSideConfiguration } from './ClientSideConfiguration';
import { LocalizedString } from './i18n';

export type AppLink = {
  _id: string;
  appId: string;
  label: LocalizedString;
  badgeLabel?: LocalizedString;
  url: LocalizedString;
  order?: number;
  tags?: string[];
};

export type App = {
  _id: string;
  organizationId: string;
  name: string;
  clientSideConfiguration: ClientSideConfiguration;
  tokenString: string;
  defaultSourceIdForAddedPlaces?: string;
  description?: string;
  related?: {
    appLinks?: {
      [key: string]: AppLink;
    };
  };
};
