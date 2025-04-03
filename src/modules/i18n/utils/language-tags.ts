import {
  type ILanguageSubtag,
  parseLanguageTag,
} from "@sozialhelden/ietf-language-tags";
import {
  type LanguageTag,
  fallbackLanguageTag,
  languageTags,
  supportedLanguageTags,
} from "~/modules/i18n/i18n";

export function getMostPreferableLanguageTag(
  languageTags: ILanguageSubtag[],
): LanguageTag {
  for (const languageTag of languageTags) {
    // check for a direct match
    if (supportedLanguageTags.includes(languageTag.langtag as LanguageTag)) {
      return languageTag.language as LanguageTag;
    }
  }

  for (const languageTag of languageTags) {
    // match chinese script variants
    if (languageTag.language === "zh") {
      // The string contains no country code and script - 90% of our readers will
      // prefer Simplified Chinese so we fall back to it
      if (!languageTag.script && !languageTag.region) {
        return "zh-Hans";
      }
      // Countries using simplified script: Mainland China, Singapore, Malaysia
      if (["CN", "SG", "MY"].includes(String(languageTag.region))) {
        return "zh-Hans";
      }
      // Rest and overseas Chinese uses traditional script in most cases
      return "zh-Hant";
    }

    // match language
    if (supportedLanguageTags.includes(languageTag.language as LanguageTag)) {
      return languageTag.language as LanguageTag;
    }
  }

  return fallbackLanguageTag;
}

export function getLanguage(languageTag: LanguageTag): string | undefined {
  return parseLanguageTag(String(languageTag))?.language;
}

export function getRegion(languageTag: LanguageTag): string | undefined {
  return parseLanguageTag(String(languageTag))?.region;
}

export function getLabel(languageTag: LanguageTag): string {
  return languageTags[languageTag]?.label;
}
