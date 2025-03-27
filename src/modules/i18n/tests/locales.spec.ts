import { describe, expect, test } from "vitest";
import type { LanguageTag } from "~/modules/i18n/i18n";
import {
  type Locale,
  getFuzzilyExtendedLocales,
  getLocale,
} from "~/modules/i18n/utils/locales";

describe("getLocale", () => {
  test("it gets a locale from a language tag", () => {
    expect(getLocale("fa")).toBe("fa");
    expect(getLocale("pt-PT")).toBe("pt_PT");
  });

  test("it formats locales from script language tags correctly", () => {
    expect(getLocale("zh-Hant")).toBe("zh-Hant");
    expect(getLocale("zh-Hans")).toBe("zh-Hans");
  });
});

describe("getFuzzilyExtendedLocales", () => {
  test.each<{ languageTag: LanguageTag; expected: Locale[] }>([
    {
      languageTag: "de",
      expected: ["de", "de_DE", "de-DE"],
    },
    {
      languageTag: "en",
      expected: ["en", "en_US", "en-US"],
    },
    {
      languageTag: "pt-PT",
      expected: ["pt", "pt-PT", "pt_PT"],
    },
    {
      languageTag: "zh-Hant",
      expected: ["zh-Hant", "zh"],
    },
    {
      languageTag: "es",
      expected: ["es"],
    },
  ])(
    "it extends $languageTag fuzzily to include $expected",
    ({ languageTag, expected }) => {
      expect(getFuzzilyExtendedLocales(languageTag).sort()).toEqual(
        expected.sort(),
      );
    },
  );
});
