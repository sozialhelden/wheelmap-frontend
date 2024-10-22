import { ILanguageSubtag, parseLanguageTag } from "@sozialhelden/ietf-language-tags";
import { compact, uniq } from "lodash";
import * as React from "react";
import { getBrowserLanguageTags } from "../i18n/getBrowserLanguageTags";
import { normalizeLanguageCode } from "../i18n/normalizeLanguageCode";

type LanguageTagContext = {
  languageTags: ILanguageSubtag[];
};

export const DefaultLanguageTagString = "en-US";

export function getCurrentLanguageTagsIsometric(): string[] {
  if (typeof window === "undefined") {
    return [DefaultLanguageTagString];
  }
  return uniq(getBrowserLanguageTags());
}

export function initialize(languageTags?: string[]) {
  return compact(
    (
      languageTags?.map(normalizeLanguageCode) ||
      getCurrentLanguageTagsIsometric()
    ).map((t) => parseLanguageTag(t, true))
  );
}

export const LanguageTagContext = React.createContext<LanguageTagContext>({
  languageTags: initialize(),
});

LanguageTagContext.displayName = "LanguageTagContext";

export function useCurrentLanguageTagStrings(): string[] {
  const ctx = React.useContext(LanguageTagContext);
  return compact(ctx.languageTags.map((l) => l.langtag || l.language));
}

export function useCurrentLanguageTags(): ILanguageSubtag[] {
  const ctx = React.useContext(LanguageTagContext);
  return compact(ctx.languageTags);
}
