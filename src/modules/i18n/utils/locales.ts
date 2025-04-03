import { type LanguageTag, languageTags } from "~/modules/i18n/i18n";
import { getLanguage } from "~/modules/i18n/utils/language-tags";

export type Locale = string;

/**
 * Transifex as well as a11ycloud, OSM and others can use locales with underscores
 * instead of IETF language tags with dashes.
 */
export function getLocale(languageTag: LanguageTag): Locale {
  return languageTags[languageTag]?.script
    ? languageTag
    : languageTag.replace(/-/g, "_");
}

function getSimilarLocalesWithMatchingTranslations(
  languageTag: LanguageTag,
): Locale[] {
  if (languageTag === "de") {
    return ["de-DE", "de_DE"];
  }
  if (languageTag === "en") {
    return ["en-US", "en_US"];
  }
  return [];
}

/**
 * This returns an array of locales based on the given language tag. It will include
 * the ietf language tag as well as a matching locale, the actual language and similar
 * locales that usually provide matching translations as especially a11ycloud, but also OSM
 * has sometimes translations for en_US or en-US but not en, or de_DE or de-DE but not de.
 */
export function getFuzzilyExtendedLocales(languageTag: LanguageTag): Locale[] {
  return Array.from(
    new Set([
      // direct matches first with the language tag, locale and language
      // e.g. languageTag is "de-DE", then also check "de_DE" (locale) and "de" (language)
      languageTag,
      getLocale(languageTag),
      getLanguage(languageTag),
      // afterward similar locales that usually provide matching translations
      // e.g. selected languageTag is de, then it includes "de-DE" and "de_DE" as well
      ...getSimilarLocalesWithMatchingTranslations(languageTag),
    ]),
  ).filter(Boolean) as Locale[];
}
