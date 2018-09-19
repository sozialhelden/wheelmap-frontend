// @flow

import searchPlaces, {
  type SearchResultCollection,
  type SearchResultProperties,
} from '../lib/searchPlaces';

import { type DataTableEntry } from './getInitialProps';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import config from '../lib/config';
import { type WheelmapFeature } from '../lib/Feature';

type SearchProps = {
  searchResults: SearchResultCollection | Promise<SearchResultCollection>,
  additionalSearchResultData: WheelmapFeature[] | Promise<WheelmapFeature[]>,
  searchQuery: ?string,
};

function fetchWheelmapNode(searchResultProperties: SearchResultProperties, useCache: boolean) {
  if (!config.wheelmapApiKey) {
    return null;
  }

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

  return wheelmapFeatureCache.getFeature(String(osmId), { useCache }).then(
    feature => {
      if (feature == null || feature.properties == null) {
        return null;
      }

      return feature;
    },
    errorOrResponse => {
      if (errorOrResponse.status !== 404) console.error(errorOrResponse);
    }
  );
}

const SearchData: DataTableEntry<SearchProps> = {
  async getInitialProps(query, isServer) {
    // TODO error handling for await

    const searchQuery = query.q;
    const searchPlacesPromise = searchPlaces(searchQuery, { lat: query.lat, lon: query.lon });

    const additionalSearchDataPromise = searchPlacesPromise.then(results => {
      Promise.all(results.features.map(f => fetchWheelmapNode(f.properties, isServer)));
    });

    const searchResults = isServer ? await searchPlacesPromise : searchPlacesPromise;
    const additionalSearchResultData = isServer
      ? await additionalSearchDataPromise
      : additionalSearchDataPromise;

    return {
      searchResults,
      additionalSearchResultData,
      searchQuery: query.q,
    };
  },
};

export default SearchData;
