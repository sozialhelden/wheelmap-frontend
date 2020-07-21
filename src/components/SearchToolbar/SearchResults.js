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

const StyledSearchResultList = styled.ul`
  list-style-type: none;
  margin: 0;

  li {
    padding: 0;
  }

  li > button {
    text-align: left;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.8) !important;
    display: block;
    width: 100%;
    box-sizing: content-box;

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

export default function SearchResults(props: Props) {
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
    <StyledSearchResultList
      className={`search-results ${props.className || ''}`}
      aria-label={t`Search results`}
    >
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
    </StyledSearchResultList>
  );
}
