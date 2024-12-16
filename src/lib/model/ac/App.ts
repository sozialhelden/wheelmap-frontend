import type { ClientSideConfiguration } from './ClientSideConfiguration'
import IAppLink from './IAppLink';

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
