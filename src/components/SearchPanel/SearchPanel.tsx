import * as React from 'react'
import { t } from 'ttag'

import AccessibilityFilterMenu from './AccessibilityFilterMenu'
import CategoryMenu from './CategoryMenu'
import SearchIcon from './SearchIcon'
import SearchInputField from './SearchInputField'
import SearchResults from './SearchResults'

import { CategoryLookupTables } from '../../lib/model/ac/categories/Categories'
import {
  isAccessibilityFiltered,
} from '../../lib/model/ac/filterAccessibility'
import { AnyFeatureCollection } from '../../lib/model/geo/AnyFeature'
import Spinner from '../ActivityIndicator/Spinner'
import CloseLink from '../shared/CloseLink'
import ErrorBoundary from '../shared/ErrorBoundary'
import { PlaceFilter } from './AccessibilityFilterModel'
import { StyledToolbar } from './StyledToolbar'
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import { cx } from '../../lib/util/cx'
import { SearchResultCollection } from '../../lib/fetchers/fetchPlacesOnKomootPhoton'

export type Props = PlaceFilter & {
  className?: string;
  categories: CategoryLookupTables;
  hidden?: boolean;
  inert?: boolean;
  category?: null | string;
  showCategoryMenu?: boolean;
  searchQuery?: null | string;
  onChangeSearchQuery?: (newSearchQuery: string) => void;
  onSubmit?: (searchQuery: string) => void;
  onAccessibilityFilterButtonClick?: (filter: PlaceFilter) => void;
  onClose?: () => void | null;
  onClick?: () => void;
  isExpanded?: boolean;
  searchResults?: null | SearchResultCollection | AnyFeatureCollection;
  isSearching?: boolean;
  searchError?: string;
  minimalTopPosition?: number;
}

export default function SearchPanel({
  className,
  categories,
  hidden,
  inert,
  category,
  showCategoryMenu,
  searchQuery,
  onChangeSearchQuery,
  onSubmit,
  onClose,
  onClick,
  isExpanded,
  searchResults,
  minimalTopPosition,
  isSearching,
  searchError,
}: Props) {
  const { accessibilityFilter, toiletFilter } = useAppStateAwareRouter()
  const searchInputFieldRef = React.createRef<HTMLInputElement>()

  const blur = React.useCallback(() => {
    if (!searchInputFieldRef.current) return
    searchInputFieldRef.current.blur()
  }, [searchInputFieldRef])

  const clearSearch = React.useCallback(() => {
    onChangeSearchQuery?.('')
  }, [onChangeSearchQuery])

  const clearSearchAndFocusSearchField = React.useCallback(() => {
    clearSearch()
    searchInputFieldRef.current?.focus()
  }, [searchInputFieldRef, clearSearch])

  const searchInputField = (
    <SearchInputField
      ref={searchInputFieldRef}
      searchQuery={searchQuery || ''}
      hidden={hidden}
      autoFocus={!inert}
      onClick={() => {
        window.scrollTo(0, 0)
        onClick?.()
      }}
      onFocus={(event) => {
        window.scrollTo(0, 0)
      }}
      onChange={onChangeSearchQuery}
      onSubmit={(event: React.SyntheticEvent<HTMLInputElement>) => {
        blur()
        console.log('onSubmit', event.currentTarget.value)
        onSubmit?.(event.currentTarget.value)
      }}
      ariaRole="searchbox"
    />
  )

  const categoryMenuOrNothing = (category || isExpanded || showCategoryMenu) && (
    <CategoryMenu
      category={category}
      accessibilityFilter={accessibilityFilter}
    />
  )

  const accessibilityFilterMenu = (isExpanded || isAccessibilityFiltered(
    accessibilityFilter,
  )) && (
    <AccessibilityFilterMenu
      accessibilityFilter={accessibilityFilter}
      toiletFilter={toiletFilter}
      category={category}
    />
  )

  const closeLink = (
    <CloseLink
      ariaLabel={t`Clear search`}
      onClick={() => {
        clearSearchAndFocusSearchField()
        if (onClose) onClose()
      }}
    />
  )

  let contentBelowSearchField: React.ReactElement | null = null
  if (!searchResults && isSearching) {
    contentBelowSearchField = (
      <div>
        <span className="sr-only" aria-live="assertive">
          {t`Searching`}
        </span>
        <Spinner size={20} />
      </div>
    )
  } else if (searchResults && searchQuery) {
    contentBelowSearchField = (
      <div aria-live="assertive">
        <SearchResults
          searchResults={searchResults}
          hidden={hidden}
          categories={categories}
          error={searchError}
        />
      </div>
    )
  } else {
    contentBelowSearchField = (
      <>
        {categoryMenuOrNothing}
        {accessibilityFilterMenu}
      </>
    )
  }

  return (
    <StyledToolbar
      hidden={hidden}
      inert={inert}
      minimalHeight={75}
      isSwipeable={false}
      enableTransitions={false}
      minimalTopPosition={minimalTopPosition}
      role="search"
      className={cx(className, isExpanded && 'isExpanded')}
    >
      <ErrorBoundary>
        <header>
          <form
            onSubmit={(ev) => {
              ev.preventDefault()
            }}
          >
            <SearchIcon />
            {searchInputField}
            {searchQuery && closeLink}
          </form>
        </header>
        <section onTouchStart={() => blur()}>{contentBelowSearchField}</section>
      </ErrorBoundary>
    </StyledToolbar>
  )
}
