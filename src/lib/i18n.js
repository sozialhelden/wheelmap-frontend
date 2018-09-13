// @flow

import uniq from 'lodash/uniq';
import difference from 'lodash/difference';
import intersection from 'lodash/intersection';
import flatten from 'lodash/flatten';
import gettextParser from 'gettext-parser';
import { useLocales, addLocale } from 'ttag';
import { i18nCache } from './cache/I18nCache';
import { getQueryParams } from './queryParams';

export type LocalizedString =
  | string
  | {
      [key: string]: string,
    };

export const defaultLocale = 'en-US';

export function removeEmptyTranslations(locale) {
  if (!locale.translations) return locale;
  const translations = locale.translations[''];
  if (!translations) return locale;
  const missingKeys = Object.keys(translations).filter(translationKey => {
    const translation = translations[translationKey];
    if (!translation) return true;
    if (!translation.msgstr) return true;
    if (translation.msgstr.length === 0) return true;
    if (translation.msgstr.length === 1 && translation.msgstr[0] === '') return true;
    return false;
  });
  missingKeys.forEach(key => delete translations[key]);
  return locale;
}

export function loadLocalizationFromPOFile(locale, poFile) {
  const localization = gettextParser.po.parse(poFile);
  addLocale(locale, removeEmptyTranslations(localization));
  return localization;
}

// Returns the locale as language code without country code etc. removed
// (for example "en" if given "en-GB").

export function localeWithoutCountry(locale: string): string {
  return locale.substring(0, 2);
}

export let currentLocales = uniq([defaultLocale, localeWithoutCountry(defaultLocale)]).filter(
  Boolean
);

// Returns an expanded list of preferred locales.
export function expandedPreferredLocales() {
  // Note that some browsers don't support navigator.languages
  const overriddenLocale = getQueryParams().locale;
  let localesPreferredByUser = [];

  if (typeof window !== 'undefined' && window.navigator && window.navigator.languages) {
    localesPreferredByUser = [].concat(window.navigator.languages);
  }

  if (overriddenLocale) {
    localesPreferredByUser.unshift(overriddenLocale);
  }

  const locales = localesPreferredByUser
    .concat([typeof window !== 'undefined' && window.navigator.language, defaultLocale])
    // Filter empty or undefined locales. Android 4.4 seems to have
    // an undefined window.navigator.language in WebView.
    .filter(Boolean);

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

export function loadExistingLocalizationByPreference(
  locales: string[] = expandedPreferredLocales()
): Promise<*> {
  if (locales.length === 0) return Promise.resolve(null);

  const loadedLocales = [];

  return Promise.all(
    locales.map(locale => {
      return i18nCache.getLocalization(locale).then(
        result => {
          loadLocalizationFromPOFile(locale, result);
          // console.log('Loaded translation', locale);
          loadedLocales.push(locale);
        },
        response => {
          if (response.status !== 404) {
            console.log('Error loading translation:', response);
          }
        }
      );
    })
  )
    .then(() => {
      const missingLocales = difference(locales, loadedLocales);
      return Promise.all(
        missingLocales
          .map(missingLocale => {
            if (missingLocale.length === 2) {
              // missing locale might be loaded with a country suffix, find out and duplicate if possible
              const replacementLocale = loadedLocales.find(
                loadedLocale => localeWithoutCountry(loadedLocale) === missingLocale
              );
              if (replacementLocale) {
                // console.log('Replaced requested', missingLocale, 'locale with data from', replacementLocale);
                return i18nCache.getLocalization(replacementLocale).then(result => {
                  loadLocalizationFromPOFile(missingLocale, result);
                  loadedLocales.push(missingLocale);
                });
              }
            }
            return null;
          })
          .filter(Boolean)
      );
    })
    .then(() => {
      const localesToUse = intersection(locales, loadedLocales);
      currentLocales = localesToUse.filter(Boolean);
      useLocales(localesToUse);
    });
}
