import {
  type LanguageTag,
  type Locale,
  fallbackLanguageTag,
  getFuzzilyExtendedLocales,
} from "@sozialhelden/core";

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

export function getTranslations(
  input: Translations | string | null | undefined,
  languageTag: LanguageTag,
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
