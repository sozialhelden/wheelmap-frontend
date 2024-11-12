import styled from 'styled-components'
import { t } from 'ttag'

import SearchResult from './SearchResult'
import { EnrichedSearchResult } from './useEnrichedSearchResults'
import { cx } from '../../lib/util/cx'

type Props = {
  searchResults?: EnrichedSearchResult[];
  className?: string;
  hidden?: boolean;
  error: string | undefined;
}

const StyledSearchResultList = styled.ul`
  list-style-type: none;
  margin: 0;
`

export default function SearchResults({
  searchResults, error, className, hidden,
}: Props) {
  const features = searchResults
  const failedLoading = !!error
  const hasNoResults = !failedLoading && features?.length === 0

  // translator: Text in search results when nothing was found
  const noResultsFoundCaption = t`No results found`

  // translator: Text in search results when an error occurred
  const searchErrorCaption = t`No results available. Please try again later!`

  return (
    <StyledSearchResultList
      className={cx('search-results', className)}
      aria-label={t`Search results`}
    >
      {failedLoading && <li className="error-result">{searchErrorCaption}</li>}
      {hasNoResults && <li className="no-result">{noResultsFoundCaption}</li>}
      {features?.map((feature) => {
        const featureId = `${feature.photonResult.properties.osm_key}:${feature.photonResult.properties.osm_id}`

        return (
          <SearchResult
            key={featureId}
            feature={feature}
            hidden={!!hidden}
          />
        )
      })}
    </StyledSearchResultList>
  )
}
