import { Point } from 'geojson';
import includes from 'lodash/includes';

import { Dictionary } from 'lodash';
import debouncePromise from '../lib/debouncePromise';
import { AccessibilityCloudFeature, WheelmapFeature } from './Feature';
import { globalFetchManager } from './FetchManager';
import { currentLocales } from './i18n';

export type SearchResultProperties = {
  city?: any,
  country?: any,
  name?: any,
  osm_id?: any,
  osm_key?: any,
  osm_type?: any,
  osm_value?: any,
  postcode?: any,
  state?: any,
  housenumber?: any,
  street?: any,
  extent: [number, number, number, number] | undefined,
  type: string,
};

export type SearchResultFeature = {
  type: 'Feature',
  geometry: Point,
  properties: SearchResultProperties,
};

export type SearchResultCollection = {
  features: SearchResultFeature[],
  error?: Error,
  wheelmapFeatures?: (WheelmapFeature | undefined)[] | Promise<WheelmapFeature | undefined>[],
  accessibilityCloudFeaturesByURI?: Dictionary<AccessibilityCloudFeature[]>,
};

export function getOsmIdFromSearchResultProperties(
  searchResultProperties?: SearchResultProperties
) {
  let osmId: number | null = searchResultProperties ? searchResultProperties.osm_id : null;

  if (!osmId) {
    return null;
  }

  // Only nodes with type 'N' and 'W' can be on Wheelmap.
  if (searchResultProperties.osm_type !== 'N' && searchResultProperties.osm_type !== 'W') {
    return null;
  }

  return {
    N: 'node',
    W: 'way',
  }[searchResultProperties.osm_type] + '/' + osmId;
}

export function buildOriginalOsmId(searchResultProperties?: SearchResultProperties) {
  if (!searchResultProperties) {
    return undefined;
  }
  return `osm://${searchResultProperties.osm_type || 'unknown'}/${searchResultProperties.osm_id ||
    'unknown'}`;
}

// Search komoot photon (an OSM search provider, https://github.com/komoot/photon) for a given
// place by name (and optionally latitude / longitude).

// todo: unused: coords
export const searchPlacesDebounced: (
  query: string,
  coords: { lat?: number | undefined, lon?: number | undefined }
) => Promise<SearchResultCollection> = debouncePromise(searchPlaces, 500);

export default function searchPlaces(
  query: string,
  coords?: { lat?: number | undefined, lon?: number | undefined }
): Promise<SearchResultCollection> {

  const locale = currentLocales[0];
  const languageCode = locale && locale.languageCode;
  const supportedLanguageCodes = ['en', 'de', 'fr', 'it']; // See Photon documentation
  let localeSuffix = '';
  if (includes(supportedLanguageCodes, languageCode)) {
    localeSuffix = `&lang=${languageCode}`;
  }

  const encodedQuery = encodeURIComponent(query);

  const url = `https://photon.komoot.io/api/?q=${encodedQuery}&limit=30${localeSuffix}`;


  // location bias for apps with location bias e.g. Olpe
  let locationBiasedUrl = url;
  if (typeof coords !== 'undefined') {
    const { lat, lon } = coords;
    if (typeof lat === 'number' && typeof lon === 'number') {
      locationBiasedUrl = `${url}&lon=${lon}&lat=${lat}`;
    }
  }

  return globalFetchManager
    .fetch(locationBiasedUrl || url)
    .then(response => {
      return response.json();
    })
    .catch(error => {
      // handle error & forward to results
      return { features: [], error };
    });
}
