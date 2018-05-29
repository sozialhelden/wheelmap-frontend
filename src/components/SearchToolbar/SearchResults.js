// @flow

import { t } from 'c-3po';
import * as React from 'react';
import uniq from 'lodash/uniq';
import styled from 'styled-components';

import type { RouterHistory } from 'react-router-dom';
import type { SearchResultCollection } from '../../lib/searchPlaces';

import SearchResult from './SearchResult';


type Props = {
  searchResults: SearchResultCollection,
  history: RouterHistory,
  className: string,
  hidden: ?boolean,
  onSelect: (() => void),
  onSelectCoordinate: ((coords: { lat: number, lon: number, zoom: number }) => void),
};


function SearchResults(props: Props) {
  const id = result => result && result.properties && result.properties.osm_id;
  const features = uniq(props.searchResults.features, id);
  return (<ul className={`search-results ${props.className}`} aria-label={t`Search results`}>
    {features.map(result => (<SearchResult
      result={result}
      key={id(result)}
      onSelect={props.onSelect}
      onSelectCoordinate={props.onSelectCoordinate}
      hidden={!!props.hidden}
      history={props.history}
    />))}
  </ul>);
}


const StyledSearchResults = styled(SearchResults)`
  list-style-type: none;
  margin: 0;

  li {
    padding: 0;
  }

  li > a {
    overflow: hidden;
    color: rgba(0, 0, 0, 0.8) !important;

    &:hover {
      color: rgba(0, 0, 0, 0.8) !important;
    }

    address {
      font-size: 16px !important;
    }
  }

  .osm-category-place-borough,
  .osm-category-place-suburb,
  .osm-category-place-village,
  .osm-category-place-hamlet,
  .osm-category-place-town,
  .osm-category-place-city,
  .osm-category-place-county,
  .osm-category-place-state,
  .osm-category-place-country,
  .osm-category-boundary-administrative {
    h1 {
      font-weight: 600;
    }
  }
`;


export default StyledSearchResults;
