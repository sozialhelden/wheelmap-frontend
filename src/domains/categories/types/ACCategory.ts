import type { Translations } from "~/modules/i18n/hooks/useTranslations";

export type ACCategory = {
  _id: string;
  translations?: {
    _id: Translations;
  };
  synonyms: string[];
  icon: string;
  parentIds: string[];
};
