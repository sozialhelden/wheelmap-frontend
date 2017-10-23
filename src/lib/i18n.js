import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import gettextParser from 'gettext-parser';
import { tWithLocale, addLocale } from 'c-3po';
import { i18nCache } from './cache/I18nCache';


export const defaultLocale = 'en_US';
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
  for (const locale in expandedPreferredLocales()) {
    const translatedString = tWithLocale(locale, ...args);
    if (translatedString) return translatedString;
  }
  return args[0]; // return the untranslated string as last option
}


// Tries to find a localization using the user's preferred languages.
//
// Falls back to languages without countries if a bundle for the given language exists.
//
// If none of the user's preferred languages exist as localization, it falls back to the default locale.

export function loadExistingPOFileByPreference(locales = expandedPreferredLocales()): Promise<*> {
  if (locales.length === 0)
    return Promise.resolve(null);

  return new Promise((resolve, reject) => {
    const locale = locales[0];
    return i18nCache.getLocalization(locale).then(
      (result) => resolve([locale, result]),
      (response) => {
        if (response.status === 404) {
          return loadExistingPOFileByPreference(locales.slice(1)).then(result => resolve([locale, result]));
        }
        reject(response);
      });
    });
}


export function loadExistingLocalizationByPreference(locales = expandedPreferredLocales()): Promise<*> {
  return loadExistingPOFileByPreference(locales)
    .then(([locale, result]) => loadLocalizationFromPOFile(locale, result));
}
