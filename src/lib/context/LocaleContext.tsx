import { ILanguageSubtag } from "@sozialhelden/ietf-language-tags";
import { parseLanguageTag } from "@sozialhelden/ietf-language-tags";
import { compact, uniq } from "lodash";
import * as React from "react";
import { normalizeLanguageCode } from "../i18n/normalizeLanguageCode";
import { getBrowserLanguageTags } from "../i18n/getBrowserLanguageTags";

type Locale = {
  languages: ILanguageSubtag[];
};

export const DefaultLanguageTagString = "en-US";

export function getCurrentLanguageTagsIsometric(): string[] {
  if (typeof window === "undefined") {
    return [DefaultLanguageTagString];
  }
  return uniq(getBrowserLanguageTags());
}

export function initializeLanguagesForLocaleContext(languageTags?: string[]) {
  return compact(
    (
      languageTags?.map(normalizeLanguageCode) ||
      getCurrentLanguageTagsIsometric()
    ).map((t) => parseLanguageTag(t, true))
  );
}

export const LocaleContext = React.createContext<Locale>({
  languages: initializeLanguagesForLocaleContext(),
});

export function useCurrentLocale() {
  const locale = React.useContext(LocaleContext);
  return locale;
}

export function useCurrentLanguageTagStrings(): string[] {
  const locale = React.useContext(LocaleContext);
  return compact(locale.languages.map((l) => l.langtag || l.language));
}
