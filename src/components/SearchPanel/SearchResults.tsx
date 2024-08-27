import styled from 'styled-components';
import { t } from 'ttag';

import { SearchResultCollection } from '../../lib/fetchers/fetchPlaceSearchResults';
import { CategoryLookupTables } from '../../lib/model/ac/categories/Categories';
import { AnyFeatureCollection } from '../../lib/model/geo/AnyFeature';
import SearchResult from './SearchResult';

type Props = {
  searchResults?: SearchResultCollection | AnyFeatureCollection;
  categories: CategoryLookupTables;
  className?: string;
  hidden: boolean | null;
  error: string | undefined;
};

const StyledSearchResultList = styled.ul`
  list-style-type: none;
  margin: 0;
`;

export default function SearchResults(props: Props) {
  const id = (result) => result && result.properties && result.properties.osm_id;
  const { features } = props.searchResults;

  const failedLoading = !!props.error;
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
            key={featureId}
            hidden={!!props.hidden}
            categories={props.categories}
          />
        );
      })}
    </StyledSearchResultList>
  );
}
