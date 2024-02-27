import * as React from 'react';
import env from '../../../lib/env';

import usePlaceSearch from './usePlaceSearch';
import { wheelmapFeatureCache } from '../../../lib/cache/WheelmapFeatureCache';
import { WheelmapFeature } from "../../../lib/Feature";
import { SearchResultFeature, getOsmIdFromSearchResultProperties } from '../../../lib/searchPlaces';
import { Dispatch, SetStateAction } from "react";

export type SearchState = 'TypeMore' | 'Loading' | 'Error' | 'Results';

export type WheelmapResolvedSearchResultFeature = {
  searchResult: SearchResultFeature,
  wheelmapFeature: WheelmapFeature | null,
};

function usePlaceSearchWithWheelmapResolution(minimalRequiredLetterCount: number = 2) {
  const [rawSearchState, rawSearchResults, searchString, setSearchString] = usePlaceSearch(
    minimalRequiredLetterCount
  );

  const [searchResults, setSearchResults] = React.useState<
    WheelmapResolvedSearchResultFeature[] | null
  >(null);
  const [searchState, setSearchState] = React.useState<SearchState>('TypeMore');

  const request = React.useRef<Promise<any>[] | null>(null);

  React.useEffect(() => {
    if (rawSearchState !== 'Results') {
      setSearchState(rawSearchState);
    }
  }, [rawSearchState, setSearchState]);

  React.useEffect(() => {
    if (rawSearchResults) {
      const results: WheelmapResolvedSearchResultFeature[] = [];
      const requests: Promise<any>[] = [];

      for (let index = 0; index < rawSearchResults.features.length; index++) {
        const searchResult = rawSearchResults.features[index];
        results.push({
          searchResult,
          wheelmapFeature: null,
        });

        const osmId = getOsmIdFromSearchResultProperties(searchResult.properties);

        if (osmId !== null) {
          const boundIndex = index;
          const appToken = env.REACT_APP_WHEELMAP_API_KEY;
          const promise = wheelmapFeatureCache.getFeature(String(osmId), appToken);
          promise
            .then(result => {
              if (result) {
                results[boundIndex].wheelmapFeature = result;
              }
            })
            // do nothing on error
            .catch(() => {});
          requests.push(promise);
        }
      }
      if (requests.length > 0) {
        Promise.all(requests)
          .catch(console.error)
          .finally(() => {
            // ignore outdated requests
            if (requests === request.current) {
              request.current = null;
              setSearchResults(results);
              setSearchState('Results');
            }
          });
        request.current = requests;
      } else {
        request.current = null;
        setSearchResults(results);
        setSearchState('Results');
      }
    } else {
      request.current = null;
      setSearchResults(null);
    }

    return () => {
      request.current = null;
    };
  }, [rawSearchResults, setSearchResults, setSearchState]);

  return [searchState, searchResults, searchString, setSearchString] as
    [SearchState, WheelmapResolvedSearchResultFeature[] | null, string, Dispatch<SetStateAction<string>>];
}

export default usePlaceSearchWithWheelmapResolution;
