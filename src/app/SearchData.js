// @flow

import React from 'react';
import Head from 'next/head';

import searchPlaces, {
  type SearchResultCollection,
  type SearchResultProperties,
} from '../lib/searchPlaces';
import { type DataTableEntry } from './getInitialProps';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import config from '../lib/config';
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
    let searchResults = searchPlaces(searchQuery, {
      lat: parseFloat(query.lat),
      lon: parseFloat(query.lon),
    });

    // Fetch search results when on server. Otherwise pass (nested) promises as props into app.
    searchResults = isServer ? await searchResults : searchResults;

    return {
      searchResults,
      searchQuery: query.q,
    };
  },

  getRenderProps(props, isServer) {
    if (isServer) {
      return props;
    }

    let { searchResults } = props;

    searchResults = Promise.resolve(searchResults).then(async results => {
      let wheelmapFeatures: Promise<?WheelmapFeature>[] = results.features.map(feature =>
        fetchWheelmapNode(feature.properties, isServer)
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
    const { searchQuery, clientSideConfiguration } = props;

    return (
      <Head>
        <title>
          {getProductTitle(
            clientSideConfiguration,
            `Search results${searchQuery ? ` for “${searchQuery}”` : ''}`
          )}
        </title>
      </Head>
    );
  },
};

export default SearchData;
