import { findMostUsableLanguageTag } from './findMostUsableLanguageTag'
import { LocalizedString } from './LocalizedString'

export function getLocalizedStringTranslation(
  string?: LocalizedString,
  requestedLanguageTag?: string,
): string | undefined {
  if (!string) {
    return undefined
  }
  if (typeof string === 'string') return string
  if (requestedLanguageTag && !(typeof requestedLanguageTag === 'string')) throw new Error('Locale must be undefined or a string.')
  if (typeof string === 'string') return string
  if (typeof string === 'object') {
    const availableLanguageTags = Object.keys(string).filter(
      (k) => typeof string[k] === 'string',
    )
    const foundLanguageTag = findMostUsableLanguageTag(
      availableLanguageTags,
      requestedLanguageTag,
    )
    if (foundLanguageTag) return string[foundLanguageTag]
  }
}
