// @flow

import uniq from 'lodash/uniq';
import difference from 'lodash/difference';
import flatten from 'lodash/flatten';
import gettextParser from 'gettext-parser';
import { useLocales, addLocale } from 'c-3po';
import { i18nCache } from './cache/I18nCache';

export type LocalizedString = string | {
  [string]: string,
};

export const defaultLocale = 'en-US';


function removeEmptyTranslations(locale) {
  if (!locale.translations) return locale;
  const translations = locale.translations[""];
  if (!translations) return locale;
  const missingKeys = Object.keys(translations).filter(translationKey => {
    const translation = translations[translationKey];
    if (!translation) return true;
    if (!translation.msgstr) return true;
    if (translation.msgstr.length === 0) return true;
    if (translation.msgstr.length === 1 && translation.msgstr[0] === "") return true;
  });
  missingKeys.forEach(key => delete translations[key]);
  return locale;
}


function loadLocalizationFromPOFile(locale, poFile) {
  const localization = gettextParser.po.parse(poFile);
  console.log('Loaded locale', locale, localization);
  addLocale(locale, removeEmptyTranslations(localization));
  return localization;
}

// Returns the locale as language code without country code etc. removed
// (for example "en" if given "en-GB").

function localeWithoutCountry(locale: string): string {
  return locale.substring(0, 2);
}

export let currentLocales = uniq([defaultLocale, localeWithoutCountry(defaultLocale)]);


// Returns an expanded list of preferred locales.
export function expandedPreferredLocales() {
  // Note that some browsers don't support navigator.languages
  const localesPreferredByUser = window.navigator.languages || [];
  const locales = localesPreferredByUser.concat([window.navigator.language, defaultLocale]);

  // Try all locales without country code, too
  return uniq(flatten(locales.map(l => [l, localeWithoutCountry(l)])));
}


export function translatedStringFromObject(string: ?LocalizedString): ?string {
  if (!string) return null;
  if (typeof string === 'string') {
    return string;
  }
  if (typeof string === 'object') {
    const locales = expandedPreferredLocales();
    for (let i = 0; i < locales.length; i++) {
      const translatedString = string[locales[i]];
      if (translatedString) return translatedString;
    }
    const firstAvailableLocale = Object.keys(string)[0];
    return string[firstAvailableLocale]; // return the untranslated string as last option
  }
  return null;
}


export function loadExistingLocalizationByPreference(locales = expandedPreferredLocales()): Promise<*> {
  if (locales.length === 0) return Promise.resolve(null);

  const loadedLocales = [];

  return Promise.all(locales.map(locale => {
    return i18nCache.getLocalization(locale).then(result => {
      loadLocalizationFromPOFile(locale, result);
      loadedLocales.push(locale);
    },
    (response) => {
      console.log('Error while loading translation:', response);
      if (response.status !== 404) {
        throw new Error('Error while loading translation');
      }
    }
  );
  }))
  .then(() => {
    const missingLocales = difference(locales, loadedLocales);
    return Promise.all(missingLocales.map(missingLocale => {
      if (missingLocale.length === 2) {
        // missing locale might be loaded with a country suffix, find out and duplicate if possible
        const replacementLocale = loadedLocales
          .find(loadedLocale => localeWithoutCountry(loadedLocale) === missingLocale);
        if (replacementLocale) {
          console.log('Replaced requested', missingLocale, 'locale with data from ', replacementLocale);
          return i18nCache.getLocalization(replacementLocale).then(result => {
            loadLocalizationFromPOFile(missingLocale, result);
          });
        }
      }
      return null;
    })
    .filter(Boolean));
  })
  .then(() => {
    console.log('Using locales', locales);
    currentLocales = locales;
    useLocales(locales);
  });
}
