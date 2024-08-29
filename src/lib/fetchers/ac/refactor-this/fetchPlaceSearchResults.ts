import includes from 'lodash/includes'
import { Point } from 'geojson'

import { currentLocales } from '../i18n/i18n'
import debouncePromise from './legacy/debouncePromise'

export type SearchResultProperties = {
  city?: any;
  country?: any;
  name?: any;
  osm_id?: any;
  osm_key?: any;
  osm_type?: any;
  osm_value?: any;
  postcode?: any;
  state?: any;
  housenumber?: any;
  street?: any;
  extent?: [number, number, number, number] | undefined;
  type?: string;
};

export type SearchResultFeature = {
  type?: 'Feature';
  geometry: Point;
  properties: SearchResultProperties;
};

export type SearchResultCollection = {
  features: SearchResultFeature[];
};

export function getOsmIdFromSearchResultProperties(
  searchResultProperties?: SearchResultProperties,
) {
  if (!searchResultProperties?.osm_id) {
    return null
  }

  let osmId = searchResultProperties.osm_id

  // Only nodes with type 'N' and 'W' can be on Wheelmap.
  if (searchResultProperties.osm_type !== 'N'
    && searchResultProperties.osm_type !== 'W'
  ) {
    return null
  }

  // Wheelmap stores features with osm type 'W' with negativ ids.
  // @TODO Do this in some kind of util function. (Maybe wheelmap feature cache?)
  if (searchResultProperties.osm_type === 'W') {
    osmId = -osmId
  }

  return osmId
}

export function buildOriginalOsmId(
  searchResultProperties?: SearchResultProperties,
) {
  if (!searchResultProperties) {
    return undefined
  }
  return `osm://${searchResultProperties.osm_type
    || 'unknown'}/${searchResultProperties.osm_id || 'unknown'}`
}

// Search komoot photon (an OSM search provider, https://github.com/komoot/photon) for a given
// place by name (and optionally latitude / longitude).

const useLocationBiasedSearch = true

export default function fetchPlaceSearchResults(
  query: string,
  lat: number | undefined,
  lon: number | undefined,
): Promise<SearchResultCollection | null> {
  if (!query) {
    return Promise.resolve(null)
  }
  const locale = currentLocales[0]
  const languageCode = locale && locale.languageCode
  const supportedLanguageCodes = ['en', 'de', 'fr', 'it'] // See Photon documentation
  let localeSuffix = ''
  if (includes(supportedLanguageCodes, languageCode)) {
    localeSuffix = `&lang=${languageCode}`
  }

  const encodedQuery = encodeURIComponent(query)

  const url = `https://photon.komoot.io/api/?q=${encodedQuery}&limit=30${localeSuffix}`

  let locationBiasedUrl = url
  if (useLocationBiasedSearch && typeof lat === 'number' && typeof lon === 'number') {
    locationBiasedUrl = `${url}&lon=${lon}&lat=${lat}`
  }

  return fetch(locationBiasedUrl).then((response) => response.json())
}

export const searchPlacesDebounced: (
  query: string,
  lat: number | undefined,
  lon: number | undefined
) => Promise<SearchResultCollection | null> = debouncePromise(
  (q, lat, lon) => fetchPlaceSearchResults(q, lat, lon),
  350,
)
