// @flow

import { t } from 'c-3po';
import * as React from 'react';
import uniq from 'lodash/uniq';
import styled from 'styled-components';

import type { RouterHistory } from 'react-router-dom';
import type { SearchResultCollection } from '../../lib/searchPlaces';
import colors from '../../lib/colors';

import SearchResult from './SearchResult';

type Props = {
  searchResults: SearchResultCollection;
  history: RouterHistory;
  className: string;
  hidden: ?boolean;
  onSelect: () => void;
  onSelectCoordinate: (coords: { lat: number; lon: number; zoom: number; }) => void;
  refFirst: ?(result: ?SearchResult) => void;
};

function SearchResults(props: Props) {
  const id = result => result && result.properties && result.properties.osm_id;
  const features = uniq(props.searchResults.features, id);

  const failedLoading = !!props.searchResults.error;
  const hasNoResults = !failedLoading && features.length === 0;

  // translator: Text in search results when nothing was found
  const noResultsFoundCaption = t`Keine Ergebnisse gefunden.`;

  // translator: Text in search results when an error occurred
  const searchErrorCaption = t`Konnte Ergebnisse nicht laden. Probier es später nochmal!`;

  return <ul className={`search-results ${props.className}`} aria-label={t`Suchergebnisse`}>
    {failedLoading && <li className="error-result">{searchErrorCaption}</li>} 
    {hasNoResults && <li className="no-result">{noResultsFoundCaption}</li>} 
    {features.map((result, index) => <SearchResult result={result} key={id(result)} onSelect={props.onSelect} onSelectCoordinate={props.onSelectCoordinate} hidden={!!props.hidden} history={props.history} ref={ref => {
      if (props.refFirst && index === 0) props.refFirst(ref);
    }} />)}
  </ul>;
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
      color: rgba(0, 0, 0, 0.6);
    }
  }

  li.no-result {
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    padding: 20px;
  }

  li.error-result {
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    padding: 20px;
    font-weight: 400;
    background-color: ${colors.negativeBackgroundColorTransparent};
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