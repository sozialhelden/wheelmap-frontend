import useSWR from 'swr';
import { expandedPreferredLocales } from '../i18n/expandedPreferredLocales';
import { localeFromString } from '../i18n/localeFromString';
import { normalizeLanguageCode } from '../i18n/normalizeLanguageCode';
import IAccessibilityAttribute from '../model/ac/IAccessibilityAttribute';

export type AccessibilityAttributesMap = Map<string, Record<string, string>>;

export function getAccessibilityAttributesURL(
  languageTags: string[],
  appToken?: string,
) {
  // either fetches a response over the network,
  // or returns a cached promise with the same URL (if available)
  const preferredLocales = expandedPreferredLocales(
    languageTags.map(normalizeLanguageCode).map(localeFromString),
    // overriddenLocaleString ? localeFromString(overriddenLocaleString) : null
  );
  const url = `${
    process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL
  }/accessibility-attributes.json?limit=10000&appToken=${
    appToken
  }&surrogateKeys=false&include=effects,${preferredLocales
    .map((l) => l.string.replace(/-/, '_'))
    .flatMap((l) => [`label.${l}`, `shortLabel.${l}`, `summary.${l}`, `details.${l}`])
    .sort()
    .join(',')}`;
  return url;
}

export default function fetchAccessibilityAttributeIdMap(
  languageTags: string[],
  appToken?: string,
): Promise<Map<string, IAccessibilityAttribute>> {
  const url = getAccessibilityAttributesURL(languageTags, appToken);
  console.log('fetchAccessibilityAttributeIdMap', url);
  return fetch(url)
    .then((r) => r.json())
    .then((json) => {
      const map = new Map<string, IAccessibilityAttribute>(json?.results.map((r) => [r._id, r]));
      return map;
    });
}

export const useAccessibilityAttributesIdMap = (languageTags: string[], appToken: string) => useSWR([languageTags, appToken], fetchAccessibilityAttributeIdMap);
