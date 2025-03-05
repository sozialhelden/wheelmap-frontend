import {
  type ILanguageSubtag,
  parseLanguageTag,
} from "@sozialhelden/ietf-language-tags";
import { tx } from "@transifex/native";
import { compact, uniq } from "lodash";
import * as React from "react";
import { useEnvContext } from "~/lib/context/EnvContext";
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
    ).map((t) => parseLanguageTag(t, true)),
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

export function useCurrentLanguageTags(): string[] {
  const ctx = React.useContext(LanguageTagContext);
  return compact(ctx.languageTags);
}

// Strips off any region and variant suffixes but keeps the script suffix
// https://en.wikipedia.org/wiki/IETF_language_tag
export function normalizeLanguageTag(languageTag: string): string {
  const substrings = languageTag.split("-");
  const regex = /^\d/;
  return substrings[1]?.length === 4 && !regex.test(substrings[1])
    ? [substrings[0], substrings[1]].join("-")
    : substrings[0];
}

export function LanguageCodeContextProvider({ children, languageTags }) {
  const env = useEnvContext();

  if (!env.NEXT_PUBLIC_TRANSIFEX_API_TOKEN) {
    throw new Error(
      "Environment variable NEXT_PUBLIC_TRANSIFEX_API_TOKEN not set!",
    );
  }

  tx.init({
    token: env.NEXT_PUBLIC_TRANSIFEX_API_TOKEN,
    filterStatus: "finalized",
  });
  tx.setCurrentLocale(
    normalizeLanguageTag(languageTags[0].langtag || languageTags[0].language),
  );

  return (
    <LanguageTagContext.Provider value={{ languageTags }}>
      {children}
    </LanguageTagContext.Provider>
  );
}
