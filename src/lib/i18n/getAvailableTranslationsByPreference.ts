import differenceBy from 'lodash/differenceBy'
import intersectionBy from 'lodash/intersectionBy'
import { normalizeLanguageCode } from './normalizeLanguageCode'
import { nextFallbackLocale } from './nextFallbackLocale'
import { expandedPreferredLocales } from './expandedPreferredLocales'
import { getTranslationsForLocale } from './getTranslationsForLocale'
import { LocalesToTranslations } from './LocalesToTranslations'
import { Translations } from './Translations'
import { Locale } from './Locale'
import { localeFromString } from './localeFromString'
import { log } from '../util/logger'

export function getAvailableTranslationsByPreference(
  allTranslations: LocalesToTranslations,
  preferredLocaleStrings: string[],
  overriddenLocaleString: string | null,
): Translations[] {
  const preferredLocales = expandedPreferredLocales(
    preferredLocaleStrings.map(normalizeLanguageCode).map(localeFromString),
    overriddenLocaleString ? localeFromString(overriddenLocaleString) : null,
  )

  if (Object.keys(allTranslations).length === 0) {
    throw new Error('No translations specified')
  }

  if (preferredLocales.length === 0) {
    throw new Error('No locales specified')
  }

  const availableTranslations: Translations[] = preferredLocales
    .map((locale) => getTranslationsForLocale(allTranslations, locale))
    .filter(Boolean)
  const availableLocales: Locale[] = availableTranslations
    .map((t) => t.headers.language)
    .map(localeFromString)
  // log.log('Currently available locales:', availableLocales);
  const missingLocales: Locale[] = differenceBy(
    preferredLocales,
    availableLocales,
    (locale) => locale.string,
  )
  // log.log('Missing locales:', missingLocales);
  // If the missing locale has no country suffix, maybe we find a loaded variant with a country
  // suffix that we can use instead.
  missingLocales.forEach((missingLocale) => {
    if (missingLocale.countryCodeOrScript) {
      return
    }
    const replacementLocale = availableLocales.find((loadedLocale) => nextFallbackLocale(loadedLocale).isEqual(missingLocale))
    if (replacementLocale) {
      // log.log('Replaced requested', missingLocale, 'locale with data from', replacementLocale);
      const translation = getTranslationsForLocale(
        allTranslations,
        replacementLocale,
      )
      if (!translation) {
        throw new Error(
          'Could not find a translation that should be loaded. Wat?',
        )
      }
      const replacement: Translations = {
        ...translation,
        headers: { ...translation.headers, language: missingLocale.string },
      }
      availableTranslations.push(replacement)
      availableLocales.push(missingLocale)
    }
  })

  const localesToUse = intersectionBy(
    preferredLocales,
    availableLocales,
    (l) => l.string,
  ).filter(Boolean)

  if (localesToUse.length === 0) {
    log.warn(
      'Warning: No locales to use available after loading translations.',
      preferredLocales,
      availableLocales,
    )
  }

  return localesToUse
    .map((l) => getTranslationsForLocale(allTranslations, l))
    .filter(Boolean)
}
