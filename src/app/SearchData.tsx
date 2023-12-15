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
import { AccessibilityCloudFeature, WheelmapFeature } from '../lib/Feature';
import { getProductTitle } from '../lib/ClientSideConfiguration';
import env from '../lib/env';
import { Dictionary, compact, keyBy } from 'lodash';
import customFetch from '../lib/fetch';

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

async function fetchAccessibilityCloudPlacesBySameURI(
  appToken: string,
  sameAsURIs: string[],
): Promise<Dictionary<AccessibilityCloudFeature>> {
  if (!sameAsURIs?.length) {
    return {};
  }
  const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
  const url = `${baseUrl}/place-infos.json?appToken=${appToken}&includePlacesWithoutAccessibility=1&sameAs=${sameAsURIs.join(',')}`;
  console.log(url);
  const response = await customFetch(url, {});
  const features = (await response.json()).features;
  console.log(features);
  return keyBy(features as AccessibilityCloudFeature[], 'properties.sameAs.0')
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
      const isLocationBiased = app?.clientSideConfiguration?.associatedGeometries?.usesCenterPointAsSearchBias;
      const locationFromApp = isLocationBiased && 
                              centerPoint && {
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

    let { searchResults, disableWheelmapSource, app: { tokenString } } = props;

    searchResults = Promise.resolve(searchResults).then(async results => {
      const useCache = !isServer;

      let wheelmapFeatures: Promise<WheelmapFeature | undefined>[] = disableWheelmapSource ? [] :
        results.features.map(feature => {
          const { type, osm_key } = feature.properties;
          if (type !== 'street' && osm_key !== 'landuse' && osm_key !== 'place') {
            return fetchWheelmapNode(feature.properties, tokenString, useCache);
          }
        });

      // The komoot API supplies OSM places, but does not know about accessibility.cloud places.
      // We have surveyed places that refer to OSM places, but have additional accessibility
      // information.
      // For displaying this information, we need to fetch the accessibility.cloud places via their
      // OSM ID saved in the `properties.sameAs` attribute.
      let osmURIs =
        compact(results.features.map(feature => {
          const { type, osm_key, osm_id, osm_type } = feature.properties;
          if (type !== 'street' && osm_key !== 'landuse' && osm_key !== 'place') {
            const fullOSMType = {
              N: 'node',
              W: 'way',
              R: 'relation',
            }[osm_type];
            return `https://openstreetmap.org/${fullOSMType}/${osm_id}`;
          }
          return undefined;
        }));


      let accessibilityCloudFeaturesByURI = {}; 
      try {
        accessibilityCloudFeaturesByURI = await fetchAccessibilityCloudPlacesBySameURI(tokenString, osmURIs);
      } catch (error) {
        console.error(error);
      }  

      // Fetch all wheelmap features when on server.
      if (isServer) {
        // @ts-ignore
        wheelmapFeatures = await Promise.all(wheelmapFeatures);
        // @ts-ignore
        // accessibilityCloudFeaturesByURI = await accessibilityCloudFeaturesByURI;
      }

      return {
        ...results,
        wheelmapFeatures,
        accessibilityCloudFeaturesByURI,
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
