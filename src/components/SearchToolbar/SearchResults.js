// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';

import type { SearchResultCollection } from '../../lib/searchPlaces';
import colors from '../../lib/colors';
import type { SearchResultFeature } from '../../lib/searchPlaces';
import type { WheelmapFeature } from '../../lib/Feature';
import SearchResult from './SearchResult';
import { type CategoryLookupTables } from '../../lib/Categories';

type Props = {
  searchResults: SearchResultCollection,
  categories: CategoryLookupTables,
  className?: string,
  hidden: ?boolean,
  onSearchResultClick: (feature: SearchResultFeature, wheelmapFeature: ?WheelmapFeature) => void,
  refFirst: ?(result: ?SearchResult) => void,
};

function SearchResults(props: Props) {
  const id = result => result && result.properties && result.properties.osm_id;
  const { wheelmapFeatures, features } = props.searchResults;

  const failedLoading = !!props.searchResults.error;
  const hasNoResults = !failedLoading && features.length === 0;

  // translator: Text in search results when nothing was found
  const noResultsFoundCaption = t`No results found`;

  // translator: Text in search results when an error occurred
  const searchErrorCaption = t`No results available. Please try again later!`;

  const renderedFeatureIds = [];

  return (
    <ul className={`search-results ${props.className || ''}`} aria-label={t`Search results`}>
      {failedLoading && <li className="error-result">{searchErrorCaption}</li>}
      {hasNoResults && <li className="no-result">{noResultsFoundCaption}</li>}
      {features.map((feature, index) => {
        const featureId = id(feature);

        if (renderedFeatureIds.indexOf(featureId) > -1) {
          return null;
        }

        renderedFeatureIds.push(featureId);

        return (
          <SearchResult
            feature={feature}
            wheelmapFeature={wheelmapFeatures && wheelmapFeatures[index]}
            key={featureId}
            onClick={props.onSearchResultClick}
            hidden={!!props.hidden}
            categories={props.categories}
            ref={ref => {
              if (props.refFirst && index === 0) props.refFirst(ref);
            }}
          />
        );
      })}
    </ul>
  );
}

const StyledSearchResults = styled(SearchResults)`
  list-style-type: none;
  margin: 0;
`;

export default StyledSearchResults;
