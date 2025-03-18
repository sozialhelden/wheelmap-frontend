import {
  type ILanguageSubtag,
  parseLanguageTag,
} from "@sozialhelden/ietf-language-tags";
import { describe, expect, test } from "vitest";
import { getMostPreferableLanguageTag } from "~/modules/i18n/utils/language-tags";

function getLanguageSubtag(languageTags: string[]): ILanguageSubtag[] {
  return languageTags.map((languageTag) =>
    parseLanguageTag(languageTag),
  ) as ILanguageSubtag[];
}

describe("getMostPreferableLanguageTag", () => {
  test.each<{ test: string; languageTags: string[]; expected: string }>([
    {
      test: "it gets the first direct match",
      languageTags: ["fa", "en"],
      expected: "fa",
    },
    {
      test: "it gets the first direct match",
      languageTags: ["fa-NOPE", "en"],
      expected: "en",
    },
    {
      test: "it falls back to the language if the whole tag is not supported",
      languageTags: ["fa-NOPE"],
      expected: "fa",
    },
    {
      test: "it falls back to the language if the whole tag is not supported",
      languageTags: ["en-US"],
      expected: "en",
    },
    {
      test: "it falls back to the language if the whole tag is not supported",
      languageTags: ["de-DE"],
      expected: "de",
    },
    {
      test: "it uses the fallback language tag if no language is supported",
      languageTags: [],
      expected: "en",
    },
    {
      test: "it uses the fallback language tag if an invalid language is provided",
      languageTags: ["NOPE"],
      expected: "en",
    },
    {
      test: "it uses zh-Hans if Chinese without region is provided",
      languageTags: ["zh-VARIANT"],
      expected: "zh-Hans",
    },
    {
      test: "it uses zh-Hans for Mainland China",
      languageTags: ["zh-CN"],
      expected: "zh-Hans",
    },
    {
      test: "it uses zh-Hans for Singapore",
      languageTags: ["zh-SG"],
      expected: "zh-Hans",
    },
    {
      test: "it uses zh-Hans for Malaysia",
      languageTags: ["zh-MY"],
      expected: "zh-Hans",
    },
    {
      test: "it uses zh-Hant for everything else",
      languageTags: ["zh-US"],
      expected: "zh-Hant",
    },
  ])("$test", ({ languageTags, expected }) => {
    expect(getMostPreferableLanguageTag(getLanguageSubtag(languageTags))).toBe(
      expected,
    );
  });
});
