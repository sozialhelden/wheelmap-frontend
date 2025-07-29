import {
  type LanguageTag,
  type Locale,
  fallbackLanguageTag,
  getFuzzilyExtendedLocales,
} from "@sozialhelden/core";
import { useI18n } from "~/modules/i18n/context/I18nContext";

export type Translations = Record<Locale, string>;

function findSuitableTranslation(
  translations: Record<Locale, string>,
  languageTag: LanguageTag,
): string | undefined {
  return translations[
    getFuzzilyExtendedLocales(languageTag).find(
      (locale) => translations[locale],
    ) ?? ""
  ];
}

export function useTranslations(
  input: Translations | string | null | undefined,
): string | undefined {
  if (typeof input === "undefined" || input === null) {
    return undefined;
  }
  if (typeof input === "string") {
    return input;
  }
  if (typeof input !== "object") {
    return undefined;
  }

  const { languageTag } = useI18n();

  const result =
    findSuitableTranslation(input, languageTag) ||
    findSuitableTranslation(input, fallbackLanguageTag);

  // if (!result) {
  //   console.warn(
  //     `There is no suitable translation for "${String(languageTag)}" or "${String(fallbackLanguageTag)}" (fallback) in "${JSON.stringify(input)}"`,
  //   );
  // }

  return result;
}
