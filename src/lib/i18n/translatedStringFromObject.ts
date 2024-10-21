import compact from "lodash/compact";
import uniq from "lodash/uniq";
import { normalizeLanguageCode } from "./normalizeLanguageCode";
import { LocalizedString } from "./LocalizedString";
import {localeFromString} from "./localeFromString";
import {useCurrentLanguageTagStrings} from "../context/LanguageTagContext";

export function translatedStringFromObject(
  string: LocalizedString
): string | null {
  if (typeof string === "undefined" || string === null) {
    return null;
  }

  if (typeof string === "string") return string;
  if (typeof string === "object") {
    const firstAvailableLocale = Object.keys(string)[0];

    const languageTags = useCurrentLanguageTagStrings();
    const currentLocales = languageTags.map(localeFromString);
    const normalizedRequestedLanguageTags = currentLocales.map(
      (locale) => locale.transifexLanguageIdentifier
    );

    const normalizedLanguageTags = normalizedRequestedLanguageTags.map(
      normalizeLanguageCode
    );
    const languageTagsWithoutCountryCodes = normalizedRequestedLanguageTags.map(
      (l) => l.slice(0, 2)
    );

    const localesToTry = compact(
      uniq([
        ...normalizedRequestedLanguageTags,
        ...normalizedLanguageTags,
        ...languageTagsWithoutCountryCodes,
        "en_US",
        "en",
        firstAvailableLocale,
      ])
    );

    const foundLocale = localesToTry.find(
      (languageTag) =>
        typeof string === "object" &&
        string !== null &&
        typeof string[languageTag] === "string"
    );

    if (foundLocale) return string[foundLocale];
  }

  return null;
}
