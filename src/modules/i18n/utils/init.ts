import { type LanguageTag, getLocale, setTranslator } from "@sozialhelden/core";
import { t, tx } from "@transifex/native";

export async function setTransifexLocale(languageTag: LanguageTag) {
  const locale = getLocale(languageTag);
  try {
    await tx.setCurrentLocale(locale);
  } catch (error) {
    // we don't want transifex to crash the entire app, so we gracefully
    // handle errors here
    console.error(`Error setting Transifex locale to "${locale}"`, error);
  }
}

export function initTransifex(token?: string) {
  tx.init({
    token,
    // filterStatus: "reviewed",
  });
  setTranslator(t);
}
