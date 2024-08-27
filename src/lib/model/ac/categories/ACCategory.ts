import { LocalizedString } from '../../../i18n/LocalizedString';

export type ACCategory = {
  _id: string;
  translations?: {
    _id: LocalizedString;
  };
  synonyms: string[];
  icon: string;
  parentIds: string[];
};
