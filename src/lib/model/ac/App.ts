import type { LocalizedString } from '@sozialhelden/a11yjson'
import type { ClientSideConfiguration } from './ClientSideConfiguration'

export interface IAppLink {
  _id: string;
  appId: string;
  label: LocalizedString;
  badgeLabel?: LocalizedString;
  url: LocalizedString;
  order?: number;
  tags?: string[];
}

export interface IApp {
  _id: string;
  organizationId: string;
  name: string;
  clientSideConfiguration: ClientSideConfiguration;
  tokenString: string;
  defaultSourceIdForAddedPlaces?: string;
  description?: string;
  related?: {
    appLinks?: {
      [key: string]: IAppLink;
    };
  };
}
