import { describe, expect, test, vi } from "vitest";
import {
  type I18nContext,
  useI18nContext,
} from "~/modules/i18n/context/I18nContext";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import type { LanguageTag } from "~/modules/i18n/i18n";
import type { Locale } from "~/modules/i18n/utils/locales";

vi.mock("~/modules/i18n/context/I18nContext");

describe("useTranslations", () => {
  test.each<{
    test: string;
    languageTag: LanguageTag | string;
    translations?: string | Record<Locale, string> | null;
    expected?: string;
  }>([
    {
      test: "it returns a string if the input is a string",
      languageTag: "en",
      translations: "simple-string",
      expected: "simple-string",
    },
    {
      test: "it returns an empty string if the input is an empty string",
      languageTag: "en",
      translations: "",
      expected: "",
    },
    {
      test: "it returns undefined if the input is null",
      languageTag: "en",
      translations: null,
      expected: undefined,
    },
    {
      test: "it returns undefined if the input is undefined",
      languageTag: "en",
      translations: undefined,
      expected: undefined,
    },
    {
      test: "it returns the translation for the current language tag",
      languageTag: "en",
      translations: {
        de: "german",
        en: "english",
      },
      expected: "english",
    },
    {
      test: "it also work with a language tag with a region",
      languageTag: "de-DE",
      translations: {
        "de-DE": "german",
        en: "english",
      },
      expected: "german",
    },
    {
      test: "it also checks the locale of the given language tag",
      languageTag: "de-DE",
      translations: {
        de_DE: "german",
        en: "english",
      },
      expected: "german",
    },
    {
      test: "it also checks the language of the given language tag",
      languageTag: "de-DE",
      translations: {
        de: "german",
        en: "english",
      },
      expected: "german",
    },
    {
      test: "if nothing was found it returns the translation for the fallback language tag",
      languageTag: "es",
      translations: {
        de: "german",
        en: "fallback",
      },
      expected: "fallback",
    },
    {
      test: "it uses an expanded language tag for the fallback language tag",
      languageTag: "es",
      translations: {
        de: "german",
        "en-US": "english",
      },
      expected: "english",
    },
    {
      test: "it uses expanded locale for the fallback language tag",
      languageTag: "es",
      translations: {
        de: "german",
        en_US: "english",
      },
      expected: "english",
    },
    {
      test: "it uses the language as well to find a suitable translation",
      languageTag: "es-ES",
      translations: {
        es: "spanish",
        en: "english",
      },
      expected: "spanish",
    },
  ])("$test", ({ languageTag, translations, expected }) => {
    vi.mocked(useI18nContext).mockReturnValue({ languageTag } as I18nContext);
    expect(useTranslations(translations)).toEqual(expected);
  });
});
