import { t } from 'ttag';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Dots } from 'react-activity';
import styled, { css } from 'styled-components';

import Toolbar, { Toolbar as ToolbarClass } from '../Toolbar';
import Button from '../Button';
import CloseLink from '../CloseLink';
import SearchIcon from './SearchIcon';
import ChevronRight from '../ChevronRight';
import CategoryMenu from './CategoryMenu';
import SearchResults from './SearchResults';
import SearchResult from './SearchResult';
import SearchInputField from './SearchInputField';
import AccessibilityFilterMenu from './AccessibilityFilterMenu';

import colors from '../../lib/colors';
import { isAccessibilityFiltered } from '../../lib/Feature';
import { SearchResultCollection } from '../../lib/searchPlaces';
import { PlaceFilter } from './AccessibilityFilterModel';
import { isOnSmallViewport } from '../../lib/ViewportSize';
import { SearchResultFeature } from '../../lib/searchPlaces';
import { WheelmapFeature } from '../../lib/Feature';
import { CategoryLookupTables } from '../../lib/Categories';
import ErrorBoundary from '../ErrorBoundary';

export type Props = PlaceFilter & {
  categories: CategoryLookupTables,
  hidden: boolean,
  inert: boolean,
  category: string | null,
  showCategoryMenu?: boolean,
  searchQuery: string | null,
  onSearchResultClick: (feature: SearchResultFeature, wheelmapFeature: WheelmapFeature | null) => void,
  onChangeSearchQuery: (newSearchQuery: string) => void,
  onSubmit: (searchQuery: string) => void,
  onAccessibilityFilterButtonClick: (filter: PlaceFilter) => void,
  onClose: () => void | null,
  onClick: () => void,
  isExpanded: boolean,
  hasGoButton: boolean,
  searchResults: SearchResultCollection | Promise<SearchResultCollection> | null,
};

type State = {
  searchFieldIsFocused: boolean,
  isCategoryFocused: boolean,
  isLoading: boolean,
  searchResults: SearchResultCollection | null,
  searchResultsPromise: Promise<SearchResultCollection> | null,
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

const GoButton = styled(Button)`
  min-width: 4rem;
  outline: none;
  border: none;
  font-size: 1rem;
  line-height: 1rem;
  padding: 0 7px;
  color: white;
  background-color: ${colors.linkColor};
  width: auto;

  &.focus-visible {
    border-radius: 0;
  }

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

const StyledToolbar = styled(Toolbar).attrs({ isExpanded: false })`
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

    border-top: 0;
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

    ${props =>
      !props.isExpanded &&
      css`
        top: 60px;
        left: 10px;
        width: calc(100% - 80px);
        max-height: 100%;
        max-width: 320px;
        margin: 0;
      `}

    > header, .search-results, ${CategoryMenu} {
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

  toolbar = React.createRef<ToolbarClass>();
  searchInputField = React.createRef<any>();
  closeLink = React.createRef<any>();
  goButton = React.createRef<any>();
  firstResult: SearchResult | null = null;

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
    prevSearchResultsPromise: Promise<SearchResultCollection>,
    searchResults: SearchResultCollection
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
    if (this.toolbar.current && this.toolbar.current.ensureFullVisibility) {
      this.toolbar.current.ensureFullVisibility();
    }
  }

  clearSearch() {
    if (this.searchInputField.current) {
      this.searchInputField.current.value = '';
      this.searchInputField.current.blur();
    }
  }

  focus() {
    if (
      window.document.activeElement === this.goButton.current ||
      window.document.activeElement === this.searchInputField.current
    ) {
      return;
    }
    if (isOnSmallViewport()) {
      if (this.goButton.current) {
        this.goButton.current.focus();
      }
    } else {
      if (this.searchInputField.current) {
        this.searchInputField.current.focus();
      }
    }
  }

  blur() {
    if (this.searchInputField.current) {
      this.searchInputField.current.blur();
    }
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
        ref={this.searchInputField}
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
        onChange={this.props.onChangeSearchQuery}
        onSubmit={(event: React.FormEvent<HTMLInputElement>) => {
          this.setState({ searchFieldIsFocused: false }, () => {
            this.blur();
            if (this.firstResult) {
              this.firstResult.focus();
            }
          });

          this.props.onSubmit(event.currentTarget.value);
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
          refFirst={(ref: SearchResult) => this.firstResult = ref}
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
    if (!this.props.showCategoryMenu) return null;

    return (
      <CategoryMenu
        onFocus={() => this.setState({ isCategoryFocused: true })}
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
      <AccessibilityFilterMenu
        accessibilityFilter={accessibilityFilter}
        toiletFilter={toiletFilter}
        category={category}
        onButtonClick={onAccessibilityFilterButtonClick}
        onBlur={() => {
          setTimeout(() => this.setState({ isCategoryFocused: false }));
        }}
      />
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
      <GoButton ref={this.goButton} onClick={this.props.onClose}>
        {caption} <StyledChevronRight />
      </GoButton>
    );
  }

  render() {
    const { isLoading, searchResults } = this.state;
    const { searchQuery, hidden, inert, isExpanded } = this.props;

    let contentBelowSearchField = null;

    if (!searchResults && isLoading) {
      contentBelowSearchField = this.renderLoadingIndicator();
    } else if (searchResults && searchQuery) {
      contentBelowSearchField = this.renderSearchResults(searchResults);
    } else {
      contentBelowSearchField = this.renderFilters();
    }

    return (
      <StyledToolbar
        hidden={hidden}
        inert={inert}
        minimalHeight={75}
        ref={this.toolbar}
        isSwipeable={false}
        enableTransitions={false}
        role="search"
        isExpanded={isExpanded}
      >
        <ErrorBoundary>
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
        </ErrorBoundary>
      </StyledToolbar>
    );
  }
}
