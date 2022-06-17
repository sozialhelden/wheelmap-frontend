import { expandedPreferredLocales, normalizeLanguageCode, localeFromString } from '../i18n';

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
    process.env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL
  }/accessibility-attributes.json?appToken=${
    process.env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN
  }&include=${preferredLocales
    .map(l => `label.${l.string.replace(/-/, '_')}`)
    .sort()
    .join(',')}`;
  return url;
}

export default function fetchAccessibilityAttributes(
  preferredLocaleStrings: string[],
  overriddenLocaleString?: string
) {
  const url = getAccessibilityAttributesURL(preferredLocaleStrings, overriddenLocaleString);
  return fetch(url)
    .then(r => r.json())
    .then(json => {
      const map = new Map<string, Record<string, string>>(json?.results.map(r => [r._id, r.label]));
      return map;
    });
}
