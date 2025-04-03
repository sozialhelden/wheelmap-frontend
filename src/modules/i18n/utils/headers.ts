import {
  type ILanguageSubtag,
  parseLanguageTag,
} from "@sozialhelden/ietf-language-tags";

export function parseAcceptLanguageString(acceptLanguage: string): string[] {
  return acceptLanguage
    .split(",")
    .map((item) => {
      const [locale, q] = item.split(";");

      return {
        locale: locale.trim(),
        score: q ? Number.parseFloat(q.slice(2)) || 0 : 1,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.locale);
}

export function getILanguageTagsFromAcceptLanguageHeader(
  acceptLanguage: string,
): ILanguageSubtag[] {
  return parseAcceptLanguageString(acceptLanguage)
    .map((tag) => parseLanguageTag(tag))
    .filter(Boolean) as ILanguageSubtag[];
}
