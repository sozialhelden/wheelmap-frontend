// @flow

import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import gettextParser from 'gettext-parser';
import { tWithLocale, addLocale } from 'c-3po';
import { i18nCache } from './cache/I18nCache';

export type LocalizedString = string | {
  [string]: string,
};

export const defaultLocale = 'en-US';
export let currentLocale = defaultLocale;


function loadLocalizationFromPOFile(locale, poFile) {
  const localization = gettextParser.po.parse(poFile);
  addLocale(locale, localization);
  // useLocale(locale);
  currentLocale = locale;
  return localization;
}

// Returns the locale as language code without country code etc. removed
// (for example "en" if given "en-GB").

function localeWithoutCountry(locale: string): string {
  return locale.substring(0, 2);
}


// Returns an expanded list of preferred locales.
export function expandedPreferredLocales() {
  // Note that some browsers don't support navigator.languages
  const localesPreferredByUser = window.navigator.languages || [];
  const locales = localesPreferredByUser.concat([window.navigator.language, defaultLocale]);

  // Try all locales without country code, too
  return uniq(flatten(locales.map(l => [l, localeWithoutCountry(l)])));
}

// Wraps c-3po's translation function using a fallback strategy for missing strings
export function t(...args) {
  const locales = expandedPreferredLocales();
  for (let i = 0; i < locales.length; i++) {
    const translatedString = tWithLocale(locales[i], ...args);
    if (translatedString) return translatedString;
  }
  return args[0]; // return the untranslated string as last option
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

  return Promise.all(locales.map(locale => {
    return i18nCache.getLocalization(locale).then(result => {
      loadLocalizationFromPOFile(locale, result);
    },
    (response) => {
      console.log('Error while loading translation:', response);
      if (response.status !== 404) {
        throw new Error('Error while loading translation');
      }
    }
  );
  }));
}
