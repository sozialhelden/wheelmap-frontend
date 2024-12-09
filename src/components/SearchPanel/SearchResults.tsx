import styled from 'styled-components'
import { t } from 'ttag'

import { KeyboardEventHandler } from 'react'
import SearchResult from './SearchResult'
import { cx } from '../../lib/util/cx'
import { EnrichedSearchResult, makeFeatureId } from './EnrichedSearchResult'

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

// crude key handler to keep tab-navigation intact and allowing for navigating search results with arrow keys
const onKeyDown: KeyboardEventHandler<HTMLUListElement> = (e) => {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') { return }
  e.preventDefault()
  e.stopPropagation()
  const parent = document.activeElement?.parentNode
  if (!parent) {
    return
  }

  let index = -1
  for (let i = 0; i < e.currentTarget.children.length; i += 1) {
    const child = e.currentTarget.children[i]
    if (child === parent) {
      index = i
      break
    }
  }
  const indexDelta = e.key === 'ArrowDown' ? 1 : -1
  const newIndex = Math.min(e.currentTarget.children.length - 1, Math.max(0, index + indexDelta))
  const hopefullyLink = e.currentTarget.childNodes[newIndex]?.firstChild as HTMLElement
  if (!hopefullyLink || hopefullyLink.nodeType !== 1) {
    return
  }
  hopefullyLink.focus()
}

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
      onKeyDown={onKeyDown}
    >
      {failedLoading && <li className="error-result">{searchErrorCaption}</li>}
      {hasNoResults && <li className="no-result">{noResultsFoundCaption}</li>}
      {features?.map((feature) => {
        const featureId = makeFeatureId(feature)

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
