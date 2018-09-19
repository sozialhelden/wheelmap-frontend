// @flow

import searchPlaces, { type SearchResultCollection } from '../lib/searchPlaces';

import { type DataTableEntry } from './getInitialProps';

type SearchProps = {
  searchResults: ?SearchResultCollection | Promise<?SearchResultCollection>,
  searchQuery: ?string,
};

const SearchData: DataTableEntry<SearchProps> = {
  async getInitialProps(query, isServer) {
    const searchQuery = query.q;
    const searchPlacesPromise = searchPlaces(searchQuery, { lat: query.lat, lon: query.lon });
    const searchResults = isServer ? await searchPlacesPromise : searchPlacesPromise;

    return {
      searchResults,
      searchQuery: query.q,
    };
  },
};

export default SearchData;
