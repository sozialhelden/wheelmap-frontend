import styled from 'styled-components';
import { t } from 'ttag';

import { CategoryLookupTables } from '../../lib/Categories';
import { AccessibilityCloudFeature, WheelmapFeature } from '../../lib/Feature';
import { SearchResultCollection, SearchResultFeature } from '../../lib/searchPlaces';
import SearchResult, { UnstyledSearchResult } from './SearchResult';

type Props = {
  searchResults: SearchResultCollection,
  categories: CategoryLookupTables,
  className?: string,
  hidden: boolean | null,
  onSearchResultClick: (
    feature: SearchResultFeature,
    wheelmapFeature: WheelmapFeature | null,
    accessibilityCloudFeature: AccessibilityCloudFeature | null
  ) => void,
  refFirst: (result: UnstyledSearchResult | null) => void | null,
};

const StyledSearchResultList = styled.ul`
  list-style-type: none;
  margin: 0;
`;

export default function SearchResults(props: Props) {
  const id = result => result && result.properties && result.properties.osm_id;
  const { wheelmapFeatures, features, accessibilityCloudFeaturesByURI } = props.searchResults;

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
        const fullOSMType = {
          'N': 'node',
          'W': 'way',
          'R': 'relation',
        }[feature.properties.osm_type];
        const osmURL = `https://openstreetmap.org/${fullOSMType}/${feature.properties.osm_id}`;

        if (renderedFeatureIds.indexOf(featureId) > -1) {
          return null;
        }

        renderedFeatureIds.push(featureId);

        return (
          <SearchResult
            feature={feature}
            wheelmapFeature={wheelmapFeatures && wheelmapFeatures[index]}
            accessibilityCloudFeatures={accessibilityCloudFeaturesByURI?.[osmURL]}
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
