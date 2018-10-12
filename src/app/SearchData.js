// @flow

import React from 'react';
import { t } from 'ttag';

import searchPlaces, {
  type SearchResultCollection,
  type SearchResultProperties,
} from '../lib/searchPlaces';
import { type DataTableEntry } from './getInitialProps';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import env from '../lib/env';
import { type WheelmapFeature } from '../lib/Feature';
import { getProductTitle } from '../lib/ClientSideConfiguration';

type SearchProps = {
  searchResults: SearchResultCollection | Promise<SearchResultCollection>,
  searchQuery: ?string,
};

async function fetchWheelmapNode(
  searchResultProperties: SearchResultProperties,
  useCache: boolean
): Promise<?WheelmapFeature> {
  if (!env.public.wheelmap.apiKey) {
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

  try {
    const feature = await wheelmapFeatureCache.getFeature(String(osmId), { useCache });

    if (feature == null || feature.properties == null) {
      return null;
    }

    return feature;
  } catch (error) {
    if (error.status !== 404) {
      console.error(error);
    }

    return null;
  }
}

const SearchData: DataTableEntry<SearchProps> = {
  async getInitialProps(query, isServer) {
    // TODO error handling for await

    const searchQuery = query.q;
    let trimmedSearchQuery;
    let searchResults = Promise.resolve({ features: [] });

    if (searchQuery && (trimmedSearchQuery = searchQuery.trim())) {
      searchResults = searchPlaces(trimmedSearchQuery, {
        lat: parseFloat(query.lat),
        lon: parseFloat(query.lon),
      });
    }

    // Fetch search results when on server. Otherwise pass (nested) promises as props into app.
    searchResults = isServer ? await searchResults : searchResults;

    return {
      searchResults,
      searchQuery,
    };
  },

  getRenderProps(props, isServer) {
    if (isServer) {
      return props;
    }

    let { searchResults } = props;

    searchResults = Promise.resolve(searchResults).then(async results => {
      const useCache = !isServer;
      let wheelmapFeatures: Promise<?WheelmapFeature>[] = results.features.map(feature =>
        fetchWheelmapNode(feature.properties, useCache)
      );

      // Fetch all wheelmap features when on server.
      if (isServer) {
        wheelmapFeatures = await Promise.all(wheelmapFeatures);
      }

      return {
        ...results,
        wheelmapFeatures,
      };
    });

    return { ...props, searchResults };
  },

  getHead(props) {
    const { clientSideConfiguration } = props;

    // translator: Search results window title
    const searchResults = t`Search results`;

    return <title key="title">{getProductTitle(clientSideConfiguration, searchResults)}</title>;
  },
};

export default SearchData;
