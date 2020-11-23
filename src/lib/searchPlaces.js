// @flow

import includes from 'lodash/includes';
import type { Point } from 'geojson-flow';

import { currentLocales } from './i18n';
import { globalFetchManager } from './FetchManager';
import { type WheelmapFeature } from '../lib/Feature';
import debouncePromise from '../lib/debouncePromise';

export type SearchResultProperties = {
  city?: ?any,
  country?: ?any,
  name?: ?any,
  osm_id?: ?any,
  osm_key?: ?any,
  osm_type?: ?any,
  osm_value?: ?any,
  postcode?: ?any,
  state?: ?any,
  housenumber?: ?any,
  street?: ?any,
  extent: ?[number, number, number, number],
};

export type SearchResultFeature = {
  type: 'Feature',
  geometry: Point,
  properties: SearchResultProperties,
};

export type SearchResultCollection = {
  features: SearchResultFeature[],
  error?: Error,
  wheelmapFeatures?: (?WheelmapFeature)[] | Promise<?WheelmapFeature>[],
};

export function getOsmIdFromSearchResultProperties(
  searchResultProperties?: SearchResultProperties
) {
  let osmId: ?number = searchResultProperties ? searchResultProperties.osm_id : null;

  if (!osmId) {
    return null;
  }

  // Only nodes with type 'N' and 'W' can be on Wheelmap.
  if (searchResultProperties.osm_type !== 'N' && searchResultProperties.osm_type !== 'W') {
    return null;
  }

  // Wheelmap stores features with osm type 'W' with negativ ids.
  // @TODO Do this in some kind of util function. (Maybe wheelmap feature cache?)
  if (searchResultProperties.osm_type === 'W') {
    osmId = -osmId;
  }

  return osmId;
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

export const searchPlacesDebounced: (
  query: string,
  coords: { lat?: ?number, lon?: ?number }
) => Promise<SearchResultCollection> = debouncePromise(searchPlaces, 500);

export default function searchPlaces(
  query: string,
  { lat, lon }: { lat?: ?number, lon?: ?number }
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

  // For now, no location bias anymore: It seems to sort irrelevant results to the top
  // so you are not able to find New York anymore when entering 'New York', for example
  // let locationBiasedUrl = url;
  // if (typeof lat === 'number' && typeof lon === 'number') {
  //   locationBiasedUrl = `${url}&lon=${lon}&lat=${lat}`;
  // }

  return globalFetchManager
    .fetch(url)
    .then(response => {
      return response.json();
    })
    .catch(error => {
      // handle error & forward to results
      return { features: [], error };
    });
}
