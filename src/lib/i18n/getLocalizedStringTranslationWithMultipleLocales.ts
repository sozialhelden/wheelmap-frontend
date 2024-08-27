import { getLocalizedStringTranslation } from './getLocalizedStringTranslation'
import { LocalizedString } from './LocalizedString'

export function getLocalizedStringTranslationWithMultipleLocales(
  string: LocalizedString,
  requestedLanguageTags: string[],
): string | undefined {
  if (!requestedLanguageTags) {
    return undefined
  }
  if (typeof string === 'string') return string
  for (const languageTag of requestedLanguageTags) {
    const result = getLocalizedStringTranslation(string, languageTag)
    if (result) {
      return result
    }
  }
  return undefined
}
