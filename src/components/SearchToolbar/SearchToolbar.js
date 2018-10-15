// @flow

import { t } from 'ttag';
import * as React from 'react';
import { Dots } from 'react-activity';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import SearchIcon from './SearchIcon';
import ChevronRight from '../ChevronRight';
import CategoryMenu from './CategoryMenu';
import SearchResults from './SearchResults';
import SearchResult from './SearchResults';
import SearchInputField from './SearchInputField';
import AccessibilityFilterMenu from './AccessibilityFilterMenu';

import colors from '../../lib/colors';
import isCordova from '../../lib/isCordova';
import { isAccessibilityFiltered } from '../../lib/Feature';
//import searchPlaces from '../../lib/searchPlaces';
import type { SearchResultCollection } from '../../lib/searchPlaces';
import type { PlaceFilter } from './AccessibilityFilterModel';
import { isOnSmallViewport } from '../../lib/ViewportSize';
import type { SearchResultFeature } from '../../lib/searchPlaces';
import type { WheelmapFeature } from '../../lib/Feature';
import { type CategoryLookupTables } from '../../lib/Categories';

export type Props = PlaceFilter & {
  categories: CategoryLookupTables,
  hidden: boolean,
  inert: boolean,
  category: ?string,
  searchQuery: ?string,
  onSearchResultClick: (feature: SearchResultFeature, wheelmapFeature: ?WheelmapFeature) => void,
  onChangeSearchQuery: (newSearchQuery: string) => void,
  onSubmit: (searchQuery: string) => void,
  onAccessibilityFilterButtonClick: (filter: PlaceFilter) => void,
  onClose: ?() => void,
  onClick: () => void,
  onCategorySelect: () => void,
  onCategoryReset: () => void,
  isExpanded: boolean,
  hasGoButton: boolean,
  searchResults: ?SearchResultCollection | ?Promise<SearchResultCollection>,
};

type State = {
  searchFieldIsFocused: boolean,
  isCategoryFocused: boolean,
  isLoading: boolean,
  searchResults: ?SearchResultCollection,
  searchResultsPromise: ?Promise<SearchResultCollection>,
};

const StyledChevronRight = styled(ChevronRight)`
  height: 1rem;
  vertical-align: bottom;
  opacity: 0.5;
  g,
  polygon,
  rect,
  circle,
  path {
    fill: white;
  }
`;

const GoButton = styled.button`
  min-width: 4rem;
  outline: none;
  border: none;
  font-size: 1rem;
  line-height: 1rem;

  color: white;
  background-color: ${colors.linkColor};
  &:hover {
    background-color: ${colors.linkColorDarker};
  }
  &:active {
    background-color: ${colors.darkLinkColor};
  }

  @media (max-width: 320px) {
    padding: 0 0.5rem;
  }
`;

const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.15s ease-out, width: 0.15s ease-out, height: 0.15s ease-out;
  display: flex;
  flex-direction: column;
  padding: 0;
  border-top: none;
  border-radius: 3px;

  .search-results {
    padding: 0 10px 5px 10px;
  }

  > header {
    // Add relative positioning for browsers not supporting position sticky.
    position: relative;
    position: sticky;
    display: flex;
    top: 0;
    height: 50px;
    min-height: 50px;
    z-index: 1;
    border-bottom: 1px ${colors.borderColor} solid;
    background: white;

    > form {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
    }
  }

  > section {
    overflow: auto;
  }

  .search-icon {
    position: absolute;
    /* center vertically */
    top: 50%;
    transform: translate(0, -50%);
    left: 1em;
    pointer-events: none;
    width: 1em;
    height: 1em;
    opacity: 0.5;
  }

  .close-link {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translate(0, -50%);
    background-color: transparent;
    display: flex;
    flex-direction: row-reverse;
    &.has-open-category {
      left: 8px;
    }
  }

  @media (max-width: 512px), (max-height: 512px) {
    &.toolbar-iphone-x {
      input, input:focus {
        background-color: white;
      }
    }

    position: fixed;
    top: 0;
    width: 100%;
    max-height: 100%;
    right: 0;
    left: 0;
    margin: 0;
    padding-right: max(constant(safe-area-inset-right), 0px);
    padding-left: max(constant(safe-area-inset-left), 0px);
    padding-right: max(env(safe-area-inset-right), 0px);
    padding-left: max(env(safe-area-inset-left), 0px);
    margin-top: constant(safe-area-inset-top);
    margin-top: env(safe-area-inset-top);
    transform: translate3d(0, 0, 0) !important;
    z-index: 1000000000;
    border-radius: 0;

    &:not(.is-expanded) {
      top: 60px;
      left: 10px;
      width: calc(100% - 80px);
      max-height: 100%;
      max-width: 320px;
      margin: 0;
    }

    > header, .search-results, .category-menu {
      padding: 0
    }

    .search-results .link-button {
      margin: 0;
    }

    @media (max-height: 400px) {
      .category-button {
        flex-basis: 16.666666% !important;
      }
    }
  }

  .search-results {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .rai-activity-indicator {
    display: flex !important;
    justify-content: center;
    height: 4em;
    align-items: center;
  }
`;

export default class SearchToolbar extends React.PureComponent<Props, State> {
  props: Props;

  state = {
    searchFieldIsFocused: false,
    isCategoryFocused: false,
    isLoading: false,
    searchResults: null,
    searchResultsPromise: null,
  };

  toolbar: ?React.ElementRef<typeof Toolbar> = null;
  searchInputField: ?React.ElementRef<'input'> = null;
  closeLink: ?React.ElementRef<typeof CloseLink> = null;
  goButton: ?React.ElementRef<'button'> = null;
  firstResult: ?React.ElementRef<typeof SearchResult> = null;

  onChangeSearchQuery = (event: SyntheticEvent<HTMLInputElement>) => {
    this.props.onChangeSearchQuery(event.target.value);
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const { searchResults } = props;

    // Do not update anything when the search results promise is already used.
    if (searchResults === state.searchResultsPromise) {
      return null;
    }

    if (searchResults instanceof Promise) {
      return { isLoading: true, searchResults: null, searchResultsPromise: searchResults };
    }

    return { isLoading: false, searchResults: searchResults, searchResultsPromise: null };
  }

  componentDidMount() {
    const { hidden } = this.props;
    const { searchResultsPromise } = this.state;

    if (!hidden) {
      this.focus();
    }

    if (searchResultsPromise) {
      searchResultsPromise.then(this.handleSearchResultsFetched.bind(this, searchResultsPromise));
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { searchResultsPromise } = this.state;

    const searchFieldShouldBecomeFocused =
      !prevState.searchFieldIsFocused && this.state.searchFieldIsFocused;
    if (searchFieldShouldBecomeFocused) {
      this.focus();
    }

    if (searchResultsPromise && prevState.searchResultsPromise !== searchResultsPromise) {
      searchResultsPromise.then(this.handleSearchResultsFetched.bind(this, searchResultsPromise));
    }
  }

  handleSearchResultsFetched = (
    prevSearchResultsPromise: Promise<SearchResults>,
    searchResults: SearchResults
  ) => {
    if (this.state.searchResultsPromise !== prevSearchResultsPromise) {
      return;
    }

    this.setState({
      isLoading: false,
      searchResults,
    });
  };

  ensureFullVisibility() {
    if (this.toolbar instanceof Toolbar) {
      this.toolbar.ensureFullVisibility();
    }
  }

  clearSearch() {
    if (this.searchInputField) {
      this.searchInputField.value = '';
      this.searchInputField.blur();
    }
  }

  focus() {
    if (isOnSmallViewport()) {
      if (!this.goButton) return;
      this.goButton.focus();
    } else {
      if (!this.searchInputField) return;
      this.searchInputField.focus();
    }
  }

  blur() {
    if (!this.searchInputField) return;
    this.searchInputField.blur();
  }

  resetSearch() {
    this.setState({ searchFieldIsFocused: true, isCategoryFocused: false }, () => {
      if (this.searchInputField instanceof HTMLInputElement) {
        this.searchInputField.value = '';
      }
    });
  }

  renderSearchInputField() {
    return (
      <SearchInputField
        ref={searchInputField => (this.searchInputField = searchInputField)}
        searchQuery={this.props.searchQuery}
        hidden={this.props.hidden}
        onClick={() => {
          if (this.props.category) {
            this.resetSearch();
          }
          this.setState({ searchFieldIsFocused: true });
          window.scrollTo(0, 0);
          this.props.onClick();
        }}
        onFocus={event => {
          this.setState({ searchFieldIsFocused: true });
          window.scrollTo(0, 0);
        }}
        onBlur={() => {
          this.ensureFullVisibility();
          setTimeout(() => {
            this.setState({ searchFieldIsFocused: false });
            this.ensureFullVisibility();
          }, 300);
        }}
        onChange={this.onChangeSearchQuery}
        onSubmit={event => {
          this.setState({ searchFieldIsFocused: false }, () => {
            this.blur();
            if (this.firstResult) {
              this.firstResult.focus();
            }
          });

          this.props.onSubmit(event.target.value);
        }}
        ariaRole="searchbox"
      />
    );
  }

  renderSearchResults(searchResults: SearchResultCollection) {
    return (
      <div aria-live="assertive">
        <SearchResults
          searchResults={searchResults}
          onSearchResultClick={this.props.onSearchResultClick}
          hidden={this.props.hidden}
          categories={this.props.categories}
          onSelect={() => this.clearSearch()}
          refFirst={ref => {
            this.firstResult = ref;
          }}
        />
      </div>
    );
  }

  renderLoadingIndicator() {
    return (
      <div>
        <span className="sr-only" aria-live="assertive">
          Searching
        </span>
        <Dots size={20} />
      </div>
    );
  }

  renderCategoryMenu() {
    if (!this.props.category && !this.props.isExpanded) return null;

    return (
      <CategoryMenu
        onCategorySelect={this.props.onCategorySelect}
        onCategoryReset={this.props.onCategoryReset}
        onFocus={() => this.setState({ isCategoryFocused: true })}
        onBlur={() => {
          setTimeout(() => this.setState({ isCategoryFocused: false }));
        }}
        category={this.props.category}
        accessibilityFilter={this.props.accessibilityFilter}
      />
    );
  }

  renderAccessibilityFilterToolbar() {
    const {
      accessibilityFilter,
      isExpanded,
      toiletFilter,
      onAccessibilityFilterButtonClick,
      category,
    } = this.props;

    if (!isAccessibilityFiltered(accessibilityFilter) && !isExpanded) return null;

    return (
      <div className="filter-selector">
        <AccessibilityFilterMenu
          accessibilityFilter={accessibilityFilter}
          toiletFilter={toiletFilter}
          category={category}
          onButtonClick={onAccessibilityFilterButtonClick}
          onBlur={() => {
            setTimeout(() => this.setState({ isCategoryFocused: false }));
          }}
        />
      </div>
    );
  }

  renderFilters() {
    return (
      <React.Fragment>
        {this.renderCategoryMenu()}
        {this.renderAccessibilityFilterToolbar()}
      </React.Fragment>
    );
  }

  renderCloseLink() {
    return (
      <CloseLink
        ariaLabel={t`Clear search`}
        onClick={() => {
          this.resetSearch();
          if (this.props.onClose) this.props.onClose();
        }}
      />
    );
  }

  renderGoButton() {
    // translator: button shown next to the search bar
    const caption = t`Go`;
    return (
      <GoButton ref={button => (this.goButton = button)} onClick={this.props.onClose}>
        {caption} <StyledChevronRight />
      </GoButton>
    );
  }

  render() {
    const { isLoading, searchResults } = this.state;
    const { searchQuery } = this.props;

    let contentBelowSearchField = null;

    if (!searchResults && isLoading) {
      contentBelowSearchField = this.renderLoadingIndicator();
    } else if (searchResults && searchQuery) {
      contentBelowSearchField = this.renderSearchResults(searchResults);
    } else {
      contentBelowSearchField = this.renderFilters();
    }

    const className = ['search-toolbar', this.props.isExpanded && 'is-expanded']
      .filter(Boolean)
      .join(' ');

    return (
      <StyledToolbar
        className={className}
        hidden={this.props.hidden}
        inert={this.props.inert}
        minimalHeight={75}
        ref={toolbar => (this.toolbar = toolbar)}
        isSwipeable={false}
        enableTransitions={false}
        role="search"
      >
        <header>
          <form
            action="#"
            method="post"
            onSubmit={ev => {
              ev.preventDefault();
            }}
          >
            <SearchIcon />
            {this.renderSearchInputField()}
            {this.props.searchQuery && this.renderCloseLink()}
            {!this.props.searchQuery && this.props.hasGoButton && this.renderGoButton()}
          </form>
        </header>
        <section onTouchStart={() => this.blur()}>{contentBelowSearchField}</section>
      </StyledToolbar>
    );
  }
}
