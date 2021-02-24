import customFetch from '../fetch';
import env from '../env';
import { expandedPreferredLocales, normalizeLanguageCode, localeFromString } from '../i18n';
import useSWRWithPrefetch from './useSWRWithPrefetch';

type ResponseT = { status: number, json: () => Promise<Record<string, unknown>> };

// const cache = new FetchCache<
//   {},
//   ResponseT,
//   typeof customFetch,
//   PromiseLike<any>,
//   (response: ResponseT) => any
// >({
//   transformResult: r => r.json(),
//   fetch: customFetch,
//   ttl: cachedValue => {
//     switch (cachedValue.state) {
//       case 'running':
//         return 30000;
//       case 'resolved':
//         const { response } = cachedValue;
//         if (response && (response.status === 200 || response.status === 404)) {
//           return 10 * 1000;
//         }
//         return 10000;
//       case 'rejected':
//         const { error } = cachedValue;
//         if (typeof error.name !== 'undefined' && error.name === 'AbortError') {
//           return 0;
//         }
//         return 10000;
//     }
//   },
//   cacheOptions: {
//     maximalItemCount: 2000,
//     evictExceedingItemsBy: 'lru', // Valid values: 'lru' or 'age'
//   },
// });

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
  }/accessibility-attributes.json?appToken=${
    env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN
  }&include=${preferredLocales
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
