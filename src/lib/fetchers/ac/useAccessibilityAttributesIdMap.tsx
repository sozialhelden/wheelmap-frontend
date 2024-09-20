import { useMemo } from 'react'
import { expandedPreferredLocales } from '../../i18n/expandedPreferredLocales'
import { localeFromString } from '../../i18n/localeFromString'
import { normalizeLanguageCode } from '../../i18n/normalizeLanguageCode'
import IAccessibilityAttribute from '../../model/ac/IAccessibilityAttribute'
import useCollectionSWR from './useCollectionSWR'

export type AccessibilityAttributesMap = Map<string, Record<string, string>>

export function generateSearchParams(
  languageTags: string[],
) {
  // either fetches a response over the network,
  // or returns a cached promise with the same URL (if available)
  const preferredLocales = expandedPreferredLocales(
    languageTags.map(normalizeLanguageCode).map(localeFromString),
    // overriddenLocaleString ? localeFromString(overriddenLocaleString) : null
  )
  const localizedFields = preferredLocales
    .map((l) => l.string.replace(/-/, '_'))
    .flatMap((l) => [`label.${l}`, `shortLabel.${l}`, `summary.${l}`, `details.${l}`])

  const params = {
    limit: '10000',
    surrogateKeys: 'false',
    include: `effects,${localizedFields.sort().join(',')}`,
  }

  return new URLSearchParams(params)
}

export default function useAccessibilityAttributesIdMap(languageTags: string[]) {
  const params = generateSearchParams(languageTags)
  const response = useCollectionSWR({
    type: 'ac:AccessibilityAttribute',
    params,
  })

  const { data } = response

  const map = useMemo(() => data && new Map<string, IAccessibilityAttribute>(data?.results?.map((r) => [r._id, r])), [data])

  const responseWithMap = useMemo(() => ({ ...response, map }), [response, map])
  return responseWithMap
}
