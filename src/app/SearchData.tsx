import React from 'react';
import { t } from 'ttag';

import searchPlaces, {
  searchPlacesDebounced,
  SearchResultCollection,
  SearchResultProperties,
} from '../lib/searchPlaces';
import { DataTableEntry } from './getInitialProps';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import { WheelmapFeature } from '../lib/Feature';
import { getProductTitle } from '../lib/ClientSideConfiguration';
import env from '../lib/env';

type SearchProps = {
  searchResults: SearchResultCollection | Promise<SearchResultCollection>,
  searchQuery: string | undefined,
  disableWheelmapSource?: boolean,
};

async function fetchWheelmapNode(
  searchResultProperties: SearchResultProperties,
  appToken: string,
  useCache: boolean
): Promise<WheelmapFeature | undefined> {
  if (!env.REACT_APP_WHEELMAP_API_KEY) {
    console.log('Warning: REACT_APP_WHEELMAP_API_KEY not set, cannot fetch place.');
    return null;
  }

  let osmId: number | null = searchResultProperties ? searchResultProperties.osm_id : null;

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
    const feature = await wheelmapFeatureCache.getFeature(String(osmId), appToken, useCache);

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
  async getInitialRouteProps(query, renderContext, isServer) {
    const searchQuery = query.q;

    let trimmedSearchQuery;
    let searchResults: Promise<SearchResultCollection> | SearchResultCollection = {
      features: [],
    };

    if (searchQuery && (trimmedSearchQuery = searchQuery.trim())) {
      searchResults = (isServer ? searchPlaces : searchPlacesDebounced)(trimmedSearchQuery, {
        lat: parseFloat(query.lat),
        lon: parseFloat(query.lon),
      });

      // Fetch search results when on server. Otherwise pass (nested) promises as props into app.
      searchResults = isServer ? await searchResults : searchResults;
    }

    return {
      searchResults,
      searchQuery,
    };
  },

  getAdditionalPageComponentProps(props: any, isServer) {
    if (isServer) {
      return props;
    }

    let { searchResults, disableWheelmapSource } = props;

    searchResults = Promise.resolve(searchResults).then(async results => {
      const useCache = !isServer;

      if (disableWheelmapSource) {
        return {
          ...results,
          wheelmapFeatures: [],
        };
      }

      let wheelmapFeatures: Promise<WheelmapFeature | undefined>[] = results.features.map(feature =>
        fetchWheelmapNode(feature.properties, props.app.tokenString, useCache)
      );

      // Fetch all wheelmap features when on server.
      if (isServer) {
        // @ts-ignore
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
    const { app, searchQuery } = props;
    let searchTitle;

    if (searchQuery) {
      // translator: Search results window title
      searchTitle = t`Search results`;
    }

    return <title key="title">{getProductTitle(app.clientSideConfiguration, searchTitle)}</title>;
  },
};

export default SearchData;
