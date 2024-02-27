import env from '../env';
import { expandedPreferredLocales, normalizeLanguageCode, localeFromString } from '../i18n';
import useSWRWithPrefetch from './useSWRWithPrefetch';

export type AccessibilityAttributesMap = Map<string, Record<string, string>>;

export function getAccessibilityAttributesURL(
  preferredLocaleStrings: string[],
  overriddenLocaleString?: string
) {
  // either fetches a response over the network,
  // or returns a cached promise with the same URL (if available)
  const preferredLocales = expandedPreferredLocales(
    preferredLocaleStrings.map(normalizeLanguageCode).map(localeFromString),
    overriddenLocaleString ? localeFromString(overriddenLocaleString) : null
  );
  const url = `${
    env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL
  }/accessibility-attributes.json?limit=10000&appToken=${
    env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN
  }&surrogateKeys=false&include=${preferredLocales
    .map(l => `label.${l.string.replace(/-/, '_')}`)
    .sort()
    .join(',')}`;
  return url;
}

const fetcher = (url: string) =>
  fetch(url)
    .then(r => r.json())
    .then(json => {
      const map = new Map<string, Record<string, string>>(json?.results.map(r => [r._id, r.label]));
      return map;
    });

export function useAccessibilityAttributes(
  preferredLocaleStrings: string[],
  overriddenLocaleString?: string
) {
  const url = getAccessibilityAttributesURL(preferredLocaleStrings, overriddenLocaleString);
  return useSWRWithPrefetch(url, fetcher);
}
