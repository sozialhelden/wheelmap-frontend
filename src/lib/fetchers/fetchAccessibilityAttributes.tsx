import { localeFromString } from "../i18n/localeFromString";
import { expandedPreferredLocales } from "../i18n/expandedPreferredLocales";
import { normalizeLanguageCode } from "../i18n/normalizeLanguageCode";
import useSWR from "swr";
import IAccessibilityAttribute from "../model/ac/IAccessibilityAttribute";
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

export default function fetchAccessibilityAttributeIdMap(
  preferredLocaleStrings: string[],
  overriddenLocaleString?: string
): Promise<Map<string, IAccessibilityAttribute>> {
  const url = getAccessibilityAttributesURL(preferredLocaleStrings, overriddenLocaleString);
  console.log('fetchAccessibilityAttributeIdMap', url);
  return fetch(url)
    .then(r => r.json())
    .then(json => {
      const map = new Map<string, IAccessibilityAttribute>(json?.results.map(r => [r._id, r]));
      return map;
    });
}


export const useAccessibilityAttributesIdMap = (appToken?: string) =>
  useSWR([appToken], fetchAccessibilityAttributeIdMap);

