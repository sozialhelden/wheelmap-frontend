import { compact } from 'lodash';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import { WheelmapFeature } from '../lib/Feature';
import {
  getOsmIdFromSearchResultProperties, SearchResultCollection,
  SearchResultProperties,
} from '../lib/searchPlaces';
import { DataTableEntry } from './getInitialProps';

type SearchProps = {
  searchResults: SearchResultCollection | Promise<SearchResultCollection>;
  searchQuery: string | undefined;
  disableWheelmapSource?: boolean;
};

async function fetchWheelmapNode(
  searchResultProperties: SearchResultProperties,
  appToken: string,
  useCache: boolean,
): Promise<WheelmapFeature | undefined> {
  const osmId = getOsmIdFromSearchResultProperties(searchResultProperties);
  if (osmId === null) {
    return null;
  }

  try {
    const feature = await wheelmapFeatureCache.getFeature(
      String(osmId),
      appToken,
      useCache,
    );

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
  getAdditionalPageComponentProps(props, isServer) {
    if (isServer) {
      return props;
    }

    let { searchResults, disableWheelmapSource } = props;

    searchResults = Promise.resolve(searchResults).then(async (results) => {
      const useCache = !isServer;

      if (disableWheelmapSource) {
        return {
          ...results,
          wheelmapFeatures: [],
        };
      }

      let wheelmapFeatures: Promise<WheelmapFeature | undefined>[] = compact(
        results.features.map((feature) => {
          const { type, osm_key } = feature.properties;
          if (
            type !== 'street'
            && osm_key !== 'landuse'
            && osm_key !== 'place'
          ) {
            return fetchWheelmapNode(
              feature.properties,
              props.app.tokenString,
              useCache,
            );
          }
        }),
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
};

export default SearchData;
