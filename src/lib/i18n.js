// @flow

import uniqBy from 'lodash/uniqBy';
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

export type LocalesToTranslations = { [string]: Translations };

export type Locale = {
  languageCode: ?string,
  countryCode: ?string,
  string: string,
  underscoredString: string,
  isEqual: (otherLocale: Locale) => boolean,
};

export function localeFromString(localeString: string): Locale {
  const lowercaseLocale = localeString.toLowerCase().replace(/_/, '-');
  const [languageCode, countryCode] = localeString.split(/[-_]/);
  return {
    languageCode,
    countryCode,
    // e.g. en or en-uk
    string: lowercaseLocale,
    // e.g. en or en_UK
    underscoredString: `${languageCode}${countryCode ? `_${countryCode.toUpperCase()}` : ''}`,
    isEqual(otherLocale) {
      return otherLocale.string === lowercaseLocale;
    },
  };
}

const defaultLocale = localeFromString('en-us');
export const currentLocales: Locale[] = ['en-us', 'en'].map(localeFromString);

// Returns the locale as language code without country code etc. removed (for
// example "en" if given "en-GB").

export function localeWithoutCountry(locale: Locale): Locale {
  return localeFromString(locale.string.substring(0, 2));
}

export function addTranslationsToTTag(translations: Translations[]) {
  const localesToUse: Locale[] = [];

  // register with ttag
  for (const t of translations) {
    const locale = localeFromString(t.headers.language);
    addLocale(locale.string, t);
    localesToUse.push(locale);
  }

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

// Returns an expanded list of preferred locales.
export function expandedPreferredLocales(locales: Locale[], overriddenLocale?: ?Locale): Locale[] {
  const overridden = [overriddenLocale, ...locales, defaultLocale].filter(Boolean);
  const overriddenWithCountryCombinations = flatten(
    overridden.map(l => [l, localeWithoutCountry(l)])
  );
  // Try all locales without country code, too
  return uniqBy(overriddenWithCountryCombinations, locale => locale.string);
}

export function translatedStringFromObject(localizedString: ?LocalizedString): ?string {
  if (!localizedString) return null;
  if (typeof localizedString === 'string') {
    return localizedString;
  }

  if (typeof localizedString === 'object') {
    const expandedLocalizedString: { [string]: string } = { ...localizedString };
    // add locales without country
    for (const localeString in localizedString) {
      const withoutCountry = localeWithoutCountry(localeFromString(localeString));
      expandedLocalizedString[withoutCountry.string] = expandedLocalizedString[localeString];
    }

    const locales = currentLocales;
    for (let i = 0; i < locales.length; i++) {
      const translatedString = expandedLocalizedString[locales[i].string];
      if (translatedString) return translatedString;
    }

    const firstAvailableLocaleString = Object.keys(expandedLocalizedString)[0];
    // return the untranslated string as last option
    return expandedLocalizedString[firstAvailableLocaleString];
  }
  return null;
}

function getTranslationsForLocale(
  translations: LocalesToTranslations,
  locale: Locale
): ?Translations {
  // In our translations JSON, we might have underscores, not dashes. Support both variants.
  return translations[locale.string] || translations[locale.underscoredString];
}

export function getAvailableTranslationsByPreference(
  allTranslations: LocalesToTranslations,
  preferredLocaleStrings: string[],
  overriddenLocaleString: ?string
): Translations[] {
  const preferredLocales = expandedPreferredLocales(
    preferredLocaleStrings.map(localeFromString),
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

  if (missingLocales.length === 0) {
    return [];
  }

  // If the missing locale has no country suffix, maybe we find a loaded variant with a country
  // suffix that we can use instead.
  missingLocales.forEach(missingLocale => {
    if (missingLocale.countryCode) {
      return;
    }
    const replacementLocale = availableLocales.find(loadedLocale =>
      localeWithoutCountry(loadedLocale).isEqual(missingLocale)
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
