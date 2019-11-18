// @flow

import uniqBy from 'lodash/uniqBy';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';
import upperFirst from 'lodash/upperFirst';
import differenceBy from 'lodash/differenceBy';
import intersectionBy from 'lodash/intersectionBy';
import flatten from 'lodash/flatten';
import { addLocale, useLocales } from 'ttag';

export type LocalizedString =
  | string
  | {
      [key: string]: string,
    };

export type Translations = {
  charset: string,
  headers: {
    language: string,
  },
  translations: any,
};

export type LocalesToTranslations = { [k: string]: Translations };

export type Locale = {
  languageCode: string | null,
  countryCodeOrScript: string | null,
  string: string,
  /**
   * In this string, an underscore separates language and country code subtag (e.g. pt_BR)/
   * A dash separates language and script subtag (e.g. zh-Hans)
   */
  transifexLanguageIdentifier: string,
  isEqual: (otherLocale: Locale) => boolean,
};

function isScript(countryCodeOrScript: string): boolean {
  return ['Hans', 'Hant'].includes(countryCodeOrScript);
}
export function localeFromString(localeString: string): Locale {
  const lowercaseLocale = localeString.toLowerCase().replace(/_/, '-');
  const [languageCode, countryCodeOrScript] = localeString.split(/[-_]/);
  // Transifex uses `-` to separate subtags if the second subtag is a script, and '_' otherwise
  const transifexLanguageIdentifier = isScript(countryCodeOrScript)
    ? `${languageCode}${
        countryCodeOrScript ? `-${upperFirst(countryCodeOrScript.toLowerCase())}` : ''
      }`
    : `${languageCode}${countryCodeOrScript ? `_${countryCodeOrScript.toUpperCase()}` : ''}`;
  return {
    languageCode,
    countryCodeOrScript,
    // e.g. en or en-uk
    string: lowercaseLocale,
    // e.g. en or en_UK
    transifexLanguageIdentifier,
    isEqual(otherLocale) {
      return otherLocale.string === lowercaseLocale;
    },
  };
}

const defaultLocale = localeFromString('en-us');
export const currentLocales: Locale[] = ['en-us', 'en'].map(localeFromString);

/**
 * Currently, we support `zh-Hans` (Chinese Simplified) and zh-Hant (Chinese Traditional) language
 * codes. This function returns the right script variant for the given language tag if it contains
 * a region code.
 */

export function normalizeChineseLanguageCode(languageTag: string): string {
  const [languageCode, countryCodeOrScript] = languageTag.split(/[-_]/);
  // Hardwire old-style chinese locale codes to new-style script subtags
  if (languageCode === 'zh') {
    if (!countryCodeOrScript) {
      // The string contains no country code or script -
      // 90% of our readers will prefer Simplified Chinese so we fall back to it
      return 'zh-Hans';
    }
    if (!['Hans', 'Hant'].includes(countryCodeOrScript)) {
      switch (countryCodeOrScript) {
        // Countries using Simplified script
        case 'CN': // Mainland China
        case 'SG': // Singapure
        case 'MY': // Malaysia
          return 'zh-Hans';
        // Countries using Traditional script
        case 'TW': // Taiwan
        case 'MO': // Macau
        case 'HK': // Hong Kong
        default:
          // overseas Chinese uses Traditional script in most cases
          return 'zh-Hant';
      }
    }
  }
  return languageTag;
}

// Returns a fallback locale for the given locale. Might use a language code without country code
// etc. removed (for example "en" if given "en-GB"). This is preliminary, a 'real' mechanism should
// use a more complex locale matching approach.
//
// If you want to implement this, be careful. In Sebastian's tests, neither Unicode's two proposed
// matching algorithms from TR-35 nor IETF language tag matching have worked as intended with
// locales like `zh-Hans` across all platforms -- talk to Sebastian about this :)
//
// Go has an implementation that seems to do the trick and solves many issues with aforementioned
// specs/proposals: https://blog.golang.org/matchlang
//
// Maybe we can implement this algorithm as a library using WebAssembly.

export function nextFallbackLocale(locale: Locale): Locale {
  return localeFromString(locale.string.substring(0, 2));
}

export function addTranslationsToTTag(translations: Translations[]) {
  const localesToUse: Locale[] = [];

  // register with ttag
  for (const t of translations) {
    const locale = localeFromString(t.headers.language);
    // @ts-ignore
    addLocale(locale.string, t);
    localesToUse.push(locale);
  }

  console.log('Available locales:', localesToUse.map(l => l.string));

  // set locale in ttag
  useLocales(localesToUse.map(locale => locale.string));

  // update active locales
  // we need to modify the actual array content, so that all imported references get the changes
  currentLocales.splice(0, currentLocales.length);
  currentLocales.push(...localesToUse);
}

export function getBrowserLocaleStrings(): string[] {
  // Filter empty or undefined locales. Android 4.4 seems to have an undefined
  // window.navigator.language in WebView.
  return [window.navigator.language].concat(window.navigator.languages || []).filter(Boolean);
}

export function expandedPreferredLocales(locales: Locale[], overriddenLocale?: Locale): Locale[] {
  const overridden = [overriddenLocale, ...locales, defaultLocale]
    // .map(hardcodedLocaleReplacement)
    .filter(Boolean);
  const overriddenWithCountryCombinations = flatten(
    overridden.map(l => [l, nextFallbackLocale(l)])
  );
  // Try all locales without country code, too
  return uniqBy(overriddenWithCountryCombinations, locale => locale.string);
}

export function translatedStringFromObject(string: LocalizedString): string | null {
  if (typeof string === 'undefined' || string === null) {
    return null;
  }

  if (typeof string === 'string') return string;
  if (typeof string === 'object') {
    const firstAvailableLocale = Object.keys(string)[0];

    const normalizedRequestedLanguageTags = currentLocales.map(
      locale => locale.transifexLanguageIdentifier
    );

    const normalizedChineseLanguageTags = normalizedRequestedLanguageTags.map(
      normalizeChineseLanguageCode
    );
    const languageTagsWithoutCountryCodes = normalizedRequestedLanguageTags.map(l => l.slice(0, 2));

    const localesToTry = compact(
      uniq([
        ...normalizedRequestedLanguageTags,
        ...normalizedChineseLanguageTags,
        ...languageTagsWithoutCountryCodes,
        'en_US',
        'en',
        firstAvailableLocale,
      ])
    );

    const foundLocale = localesToTry.find(
      languageTag =>
        typeof string === 'object' && string !== null && typeof string[languageTag] === 'string'
    );

    if (foundLocale) return string[foundLocale];
  }

  return null;
}

function getTranslationsForLocale(
  translations: LocalesToTranslations,
  locale: Locale
): Translations | undefined {
  // In our translations JSON, we might have underscores, not dashes. Support both variants.
  return translations[locale.string] || translations[locale.transifexLanguageIdentifier];
}

export function getAvailableTranslationsByPreference(
  allTranslations: LocalesToTranslations,
  preferredLocaleStrings: string[],
  overriddenLocaleString: string | null
): Translations[] {
  const preferredLocales = expandedPreferredLocales(
    preferredLocaleStrings.map(normalizeChineseLanguageCode).map(localeFromString),
    overriddenLocaleString ? localeFromString(overriddenLocaleString) : null
  );

  if (Object.keys(allTranslations).length === 0) {
    throw new Error('No translations specified');
  }

  if (preferredLocales.length === 0) {
    throw new Error('No locales specified');
  }

  const availableTranslations: Translations[] = preferredLocales
    .map(locale => getTranslationsForLocale(allTranslations, locale))
    .filter(Boolean);
  const availableLocales: Locale[] = availableTranslations
    .map(t => t.headers.language)
    .map(localeFromString);
  // console.log('Currently available locales:', availableLocales);
  const missingLocales: Locale[] = differenceBy(
    preferredLocales,
    availableLocales,
    locale => locale.string
  );
  // console.log('Missing locales:', missingLocales);

  // If the missing locale has no country suffix, maybe we find a loaded variant with a country
  // suffix that we can use instead.
  missingLocales.forEach(missingLocale => {
    if (missingLocale.countryCodeOrScript) {
      return;
    }
    const replacementLocale = availableLocales.find(loadedLocale =>
      nextFallbackLocale(loadedLocale).isEqual(missingLocale)
    );
    if (replacementLocale) {
      // console.log('Replaced requested', missingLocale, 'locale with data from', replacementLocale);
      const translation = getTranslationsForLocale(allTranslations, replacementLocale);
      if (!translation) throw new Error('Could not find a translation that should be loaded. Wat?');
      const replacement: Translations = {
        ...translation,
        headers: { ...translation.headers, language: missingLocale.string },
      };
      availableTranslations.push(replacement);
      availableLocales.push(missingLocale);
    }
  });

  const localesToUse = intersectionBy(preferredLocales, availableLocales, l => l.string).filter(
    Boolean
  );

  if (localesToUse.length === 0) {
    console.warn(
      'Warning: No locales to use available after loading translations.',
      preferredLocales,
      availableLocales
    );
  }

  return localesToUse.map(l => getTranslationsForLocale(allTranslations, l)).filter(Boolean);
}

export function parseAcceptLanguageString(acceptLanguage: string): string[] {
  return acceptLanguage
    .split(',')
    .map(item => {
      const [locale, q] = item.split(';');

      return {
        locale: locale.trim(),
        score: q ? parseFloat(q.slice(2)) || 0 : 1,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map(item => item.locale);
}
