import React from 'react';
import { t } from 'ttag';

import searchPlaces, {
  searchPlacesDebounced,
  SearchResultCollection,
  SearchResultProperties,
  getOsmIdFromSearchResultProperties,
} from '../lib/searchPlaces';
import { DataTableEntry } from './getInitialProps';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import { WheelmapFeature } from '../lib/Feature';
import { getProductTitle } from '../lib/ClientSideConfiguration';
import env from '../lib/env';
import { compact } from 'lodash';

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

  const osmId = getOsmIdFromSearchResultProperties(searchResultProperties);
  if (osmId === null) {
    return null;
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
      
      
      const { app } = await renderContext; 
      const centerPoint = app?.clientSideConfiguration?.associatedGeometries?.centerPoint;
      const locationFromApp = centerPoint && {
        lat: centerPoint.coordinates[1],
        lon: centerPoint.coordinates[0],
      };

      searchResults = (isServer ? searchPlaces : searchPlacesDebounced)(trimmedSearchQuery, locationFromApp);

      // Fetch search results when on server. Otherwise pass (nested) promises as props into app.
      searchResults = isServer ? await searchResults : searchResults;
    }

    return {
      searchResults,
      searchQuery,
    };
  },

  getAdditionalPageComponentProps(props, isServer) {
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

      let wheelmapFeatures: Promise<WheelmapFeature | undefined>[] =
        results.features.map(feature => {
          const { type, osm_key } = feature.properties;
          if (type !== 'street' && osm_key !== 'landuse' && osm_key !== 'place') {
            return fetchWheelmapNode(feature.properties, props.app.tokenString, useCache);
          }
        });

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
