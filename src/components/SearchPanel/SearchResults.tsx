import styled from 'styled-components'
import { t } from 'ttag'

import { Feature } from 'geojson'
import { SearchResultCollection } from '../../lib/fetchers/fetchPlaceSearchResults'
import { CategoryLookupTables } from '../../lib/model/ac/categories/Categories'
import { AnyFeatureCollection } from '../../lib/model/geo/AnyFeature'
import SearchResult from './SearchResult'

type Props = {
  searchResults?: SearchResultCollection | AnyFeatureCollection;
  categories: CategoryLookupTables;
  className?: string;
  hidden?: boolean;
  error: string | undefined;
}

const StyledSearchResultList = styled.ul`
  list-style-type: none;
  margin: 0;
`

const idAccessor = (result: Feature): string => result?.properties?.osm_id

export default function SearchResults(props: Props) {
  const features = props.searchResults?.features
  const failedLoading = !!props.error
  const hasNoResults = !failedLoading && features?.length === 0

  // translator: Text in search results when nothing was found
  const noResultsFoundCaption = t`No results found`

  // translator: Text in search results when an error occurred
  const searchErrorCaption = t`No results available. Please try again later!`

  // only render each feature once
  const renderedFeatureIds = new Set()

  return (
    <StyledSearchResultList
      className={`search-results ${props.className || ''}`}
      aria-label={t`Search results`}
    >
      {failedLoading && <li className="error-result">{searchErrorCaption}</li>}
      {hasNoResults && <li className="no-result">{noResultsFoundCaption}</li>}
      {features?.map((feature) => {
        const featureId = idAccessor(feature)

        if (renderedFeatureIds.has(featureId)) {
          return null
        }

        renderedFeatureIds.add(featureId)

        return (
          <SearchResult
            key={featureId}
            feature={feature}
            hidden={!!props.hidden}
            categories={props.categories}
          />
        )
      })}
    </StyledSearchResultList>
  )
}
