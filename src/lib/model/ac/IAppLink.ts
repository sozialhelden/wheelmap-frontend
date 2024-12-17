import type { LocalizedString } from "@sozialhelden/a11yjson";

export type ImportanceValue = 'alwaysVisible' | 'advertisedIfPossible' | 'insignificant';

export default interface IAppLink {
  _id: string;
  appId: string;
  label: LocalizedString;
  badgeLabel?: LocalizedString;
  url: LocalizedString;
  order?: number;
  tags?: string[];
  importance?: ImportanceValue;
}
