import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { t } from 'ttag'

import { useRouter } from 'next/router'
import AccessibilityFilterMenu from './AccessibilityFilterMenu'
import CategoryMenu from './CategoryMenu'
import SearchIcon from './SearchIcon'
import SearchInputField from './SearchInputField'
import SearchResults from './SearchResults'

import { SearchResultCollection } from '../../lib/fetchers/fetchPlaceSearchResults'
import { CategoryLookupTables } from '../../lib/model/ac/categories/Categories'
import {
  getAccessibilityFilterFrom,
  isAccessibilityFiltered,
} from '../../lib/model/ac/filterAccessibility'
import { AnyFeatureCollection } from '../../lib/model/geo/AnyFeature'
import { isOnSmallViewport } from '../../lib/util/ViewportSize'
import Spinner from '../ActivityIndicator/Spinner'
import CloseLink from '../shared/CloseLink'
import ErrorBoundary from '../shared/ErrorBoundary'
import { PlaceFilter } from './AccessibilityFilterModel'
import { GoButton } from './GoButton'
import { StyledChevronRight } from './StyledChevronRight'
import { StyledToolbar } from './StyledToolbar'

export type Props = PlaceFilter & {
  categories: CategoryLookupTables;
  hidden: boolean;
  inert: boolean;
  category: null | string;
  showCategoryMenu?: boolean;
  searchQuery: null | string;
  onChangeSearchQuery: (newSearchQuery: string) => void;
  onSubmit: (searchQuery: string) => void;
  onAccessibilityFilterButtonClick: (filter: PlaceFilter) => void;
  onClose: () => void | null;
  onClick: () => void;
  isExpanded: boolean;
  hasGoButton: boolean;
  searchResults: null | SearchResultCollection | AnyFeatureCollection;
  isSearching: boolean;
  searchError: string;
  minimalTopPosition: number;
};

export default function SearchPanel(props: Props) {
  const {
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
    hasGoButton,
    searchResults,
    minimalTopPosition,
    isSearching,
    searchError,
  } = props

  const router = useRouter()
  const accessibilityFilter = getAccessibilityFilterFrom(
    router.query.wheelchair,
  )
  const toiletFilter = getAccessibilityFilterFrom(router.query.toilet)
  const searchInputFieldRef = React.createRef<HTMLInputElement>()
  const goButtonRef = React.createRef<HTMLButtonElement>()

  React.useEffect(() => {
    if (!hidden) {
      focus()
    }
  }, [hidden])

  const focus = React.useCallback(() => {
    if (
      window.document.activeElement
        === ReactDOM.findDOMNode(goButtonRef.current)
      || window.document.activeElement
        === ReactDOM.findDOMNode(searchInputFieldRef.current)
    ) {
      return
    }
    if (isOnSmallViewport()) {
      if (!goButtonRef.current) return
      goButtonRef.current.focus()
    } else {
      if (!searchInputFieldRef.current) return
      searchInputFieldRef.current.focus()
    }
  }, [goButtonRef, searchInputFieldRef])

  const blur = React.useCallback(() => {
    if (!searchInputFieldRef.current) return
    searchInputFieldRef.current.blur()
  }, [])

  const clearSearch = React.useCallback(() => {
    onChangeSearchQuery('')
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
      onClick={() => {
        if (category) {
          clearSearchAndFocusSearchField()
        }
        window.scrollTo(0, 0)
        onClick()
      }}
      onFocus={(event) => {
        window.scrollTo(0, 0)
      }}
      onChange={onChangeSearchQuery}
      onSubmit={(event: React.SyntheticEvent<HTMLInputElement>) => {
        blur()
        onSubmit(event.currentTarget.value)
      }}
      ariaRole="searchbox"
    />
  )

  // translator: button shown next to the search bar
  const goButtonCaption = t`Go`
  const goButton = (
    <GoButton ref={goButtonRef} onClick={onClose}>
      {goButtonCaption}
      {' '}
      <StyledChevronRight />
    </GoButton>
  )

  const categoryMenuOrNothing = (category
    || isExpanded
    || showCategoryMenu) && (
    <CategoryMenu
      category={category}
      accessibilityFilter={accessibilityFilter}
    />
  )

  const accessibilityFilterMenu = (isAccessibilityFiltered(
    accessibilityFilter,
  )
    || isExpanded) && (
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

  let contentBelowSearchField = null
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
      className={isExpanded ? 'isExpanded' : null}
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
            {!searchQuery && hasGoButton && goButton}
          </form>
        </header>
        <section onTouchStart={() => blur()}>{contentBelowSearchField}</section>
      </ErrorBoundary>
    </StyledToolbar>
  )
}
