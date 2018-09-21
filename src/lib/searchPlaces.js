// @flow

import includes from 'lodash/includes';
import type { GeometryObject } from 'geojson-flow';

import { currentLocales } from './i18n';
import { globalFetchManager } from './FetchManager';
import { type WheelmapFeature } from '../lib/Feature';

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
};

export type SearchResultFeature = {
  geometry: GeometryObject,
  properties: SearchResultProperties,
};

export type SearchResultCollection = {
  features: SearchResultFeature[],
  error?: Error,
  wheelmapFeatures?: (?WheelmapFeature)[] | Promise<?WheelmapFeature>[],
};

// Search komoot photon (an OSM search provider, https://github.com/komoot/photon) for a given
// place by name (and optionally latitude / longitude).

export default function searchPlaces(
  query: string,
  { lat, lon }: { lat?: ?number, lon?: ?number }
): Promise<SearchResultCollection> {
  const locale = currentLocales[0];
  const languageCode = locale && locale.substr(0, 2);
  const supportedLanguageCodes = ['en', 'de', 'fr', 'it']; // See Photon documentation
  let localeSuffix = '';
  if (includes(supportedLanguageCodes, languageCode)) {
    localeSuffix = `&lang=${languageCode}`;
  }

  const encodedQuery = encodeURIComponent(query);

  const url = `https://photon.komoot.de/api/?q=${encodedQuery}&limit=30${localeSuffix}`;

  // For now, no location bias anymore: It seems to sort irrelevant results to the top
  // so you are not able to find New York anymore when entering 'New York', for example
  // let locationBiasedUrl = url;
  // if (typeof lat === 'number' && typeof lon === 'number') {
  //   locationBiasedUrl = `${url}&lon=${lon}&lat=${lat}`;
  // }

  return globalFetchManager
    .fetch(url, { cordova: true })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      // handle error & forward to results
      return { features: [], error };
    });
}
