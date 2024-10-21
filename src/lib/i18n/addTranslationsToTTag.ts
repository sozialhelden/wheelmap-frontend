import { addLocale, useLocales } from "ttag";
import { Translations } from "./Translations";
import { Locale } from "./Locale";
import { localeFromString } from "./localeFromString";
import {useCurrentLanguageTagStrings} from "../context/LanguageTagContext";

export function addTranslationsToTTag(translations: Translations[]) {
  const localesToUse: Locale[] = [];

  // register with ttag
  for (const t of translations) {
    const locale = localeFromString(t.headers.language);
    // @ts-ignore
    addLocale(locale.string, t);
    localesToUse.push(locale);
  }

  // console.log('Available locales:', localesToUse.map(l => l.string));
  // set locale in ttag
  useLocales(localesToUse.map((locale) => locale.string));

  // update active locales
  // we need to modify the actual array content, so that all imported references get the changes
  const languageTags = useCurrentLanguageTagStrings();
  const currentLocales = languageTags.map(localeFromString);

  currentLocales.splice(0, currentLocales.length);
  currentLocales.push(...localesToUse);
}
