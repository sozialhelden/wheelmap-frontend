import compact from "lodash/compact";
import uniq from "lodash/uniq";
import { useCurrentLanguageTagStrings } from "~/lib/context/LanguageTagContext";
import type { LocalizedString } from "./LocalizedString";
import { normalizeLanguageCode } from "./normalizeLanguageCode";

export function useTranslatedStringFromObject(
  string: LocalizedString | null | undefined,
): string | undefined {
  if (typeof string === "undefined" || string === null) {
    return undefined;
  }

  if (typeof string === "string") return string;
  if (typeof string === "object") {
    const firstAvailableLocale = Object.keys(string)[0];

    const normalizedRequestedLanguageTags = useCurrentLanguageTagStrings();

    const normalizedLanguageTags = normalizedRequestedLanguageTags.map(
      normalizeLanguageCode,
    );
    const languageTagsWithoutCountryCodes = normalizedRequestedLanguageTags.map(
      (l) => l.slice(0, 2),
    );

    const localesToTry = compact(
      uniq([
        ...normalizedRequestedLanguageTags,
        ...normalizedLanguageTags,
        ...languageTagsWithoutCountryCodes,
        "en_US",
        "en",
        firstAvailableLocale,
      ]),
    );

    const foundLocale = localesToTry.find(
      (languageTag) =>
        typeof string === "object" &&
        string !== null &&
        typeof string[languageTag] === "string",
    );

    if (foundLocale) return string[foundLocale];
  }

  return undefined;
}
