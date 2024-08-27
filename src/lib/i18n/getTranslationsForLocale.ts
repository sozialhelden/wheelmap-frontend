import { LocalesToTranslations } from './LocalesToTranslations'
import { Translations } from './Translations'
import { Locale } from './Locale'

export function getTranslationsForLocale(
  translations: LocalesToTranslations,
  locale: Locale,
): Translations | undefined {
  // In our translations JSON, we might have underscores, not dashes. Support both variants.
  return (
    translations[locale.string]
    || translations[locale.transifexLanguageIdentifier]
  )
}
