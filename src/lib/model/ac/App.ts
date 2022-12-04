import { LocalizedString } from "@sozialhelden/a11yjson";
import { ClientSideConfiguration } from "./ClientSideConfiguration";

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
