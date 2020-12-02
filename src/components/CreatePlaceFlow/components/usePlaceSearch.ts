import * as React from 'react';
import { searchPlacesDebounced } from '../../../lib/searchPlaces';
import type { SearchResultCollection } from '../../../lib/searchPlaces';
import { Dispatch, SetStateAction } from "react";
import { WheelmapResolvedSearchResultFeature } from "./usePlaceSearchWithWheelmapResolution";

export type SearchState = 'TypeMore' | 'Loading' | 'Error' | 'Results';

function usePlaceSearch(minimalRequiredLetterCount: number = 2) {
  const [searchString, setSearchString] = React.useState<string>('');
  const [searchState, setSearchState] = React.useState<SearchState>('TypeMore');
  const [searchResults, setSearchResults] = React.useState<SearchResultCollection | null>(null);
  const request = React.useRef<Promise<SearchResultCollection> | null>(null);

  React.useEffect(() => {
    if (searchString.length >= minimalRequiredLetterCount) {
      setSearchState('Loading');
      // intentinally use empty coords
      // see discussion at https://github.com/sozialhelden/wheelmap-frontend/pull/245#discussion_r398698050
      const searchResultPromise = searchPlacesDebounced(searchString, {});
      searchResultPromise
        .then(results => {
          if (searchResultPromise === request.current) {
            setSearchResults(results);
            setSearchState('Results');
            request.current = null;
          }
        })
        .catch(() => {
          if (searchResultPromise === request.current) {
            setSearchState('Error');
            request.current = null;
          }
        });
      request.current = searchResultPromise;
      setSearchResults(null);
    } else {
      setSearchState('TypeMore');
      setSearchResults(null);
      request.current = null;
    }

    return () => {
      request.current = null;
    };
  }, [searchString, setSearchState, setSearchResults, minimalRequiredLetterCount]);

  return [searchState, searchResults, searchString, setSearchString] as
    [SearchState, SearchResultCollection | null, string, Dispatch<SetStateAction<string>>];
}

export default usePlaceSearch;
