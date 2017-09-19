import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import gettextParser from 'gettext-parser';
import { addLocale, useLocale } from 'c-3po';
import { i18nCache } from './cache/I18nCache';


export const defaultLocale = 'en-US';
export let currentLocale = defaultLocale;


function loadLocalizationFromPOFile(locale, poFile) {
  const localization = gettextParser.po.parse(poFile);
  addLocale(locale, localization);
  useLocale(locale);
  currentLocale = locale;
  return localization;
}

// Returns the language code with the country code removed (for example "en" if given "en-GB").

function localeWithoutCountry(language: string): string {
  return language.substring(0, 2);
}


export function getPreferredLocales() {
  return uniq(flatten((window.navigator.languages || []).concat([window.navigator.language, defaultLocale]).map(l => [l, localeWithoutCountry(l)])));
}


// Tries to find a localization using the user's preferred languages.
//
// Falls back to languages without countries if a bundle for the given language exists.
//
// If none of the user's preferred languages exist as localization, it falls back to the default
// locale.

export function loadExistingPOFileByPreference(locales = getPreferredLocales()): Promise<*> {
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


export function loadExistingLocalizationByPreference(locales = getPreferredLocales()): Promise<*> {
  return loadExistingPOFileByPreference(locales)
    .then(([locale, result]) => loadLocalizationFromPOFile(locale, result));
}
