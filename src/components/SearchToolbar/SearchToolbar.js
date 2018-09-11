// @flow

import { t } from 'ttag';
import * as React from 'react';
import { Dots } from 'react-activity';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import type { RouterHistory } from 'react-router-dom';

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
import { isFiltered } from '../../lib/Feature';
import searchPlaces from '../../lib/searchPlaces';
import type { SearchResultCollection } from '../../lib/searchPlaces';
import type { PlaceFilter } from './AccessibilityFilterModel';
import { isOnSmallViewport } from '../../lib/ViewportSize';
import { newLocationWithReplacedQueryParams } from '../../lib/queryParams';

// You can enter debug commands in the search bar, which are handled here.
function handleInputCommands(history: RouterHistory, commandLine: ?string) {
  // Enter a command like `locale:de_DE` to set a new locale.
  const setLocaleCommandMatch = commandLine && commandLine.match(/^locale:(\w\w(?:_\w\w))/);
  if (setLocaleCommandMatch) {
    let location = newLocationWithReplacedQueryParams(history, {
      q: null,
      locale: setLocaleCommandMatch[1]
    });
    if (window.cordova) {
      window.location.hash = location.search;
    } else {
      history.push(location);
    }
    window.location.reload();
  }
}

export type Props = PlaceFilter & {
  history: RouterHistory;
  hidden: boolean;
  inert: boolean;
  category: ?string;
  searchQuery: ?string;
  lat: ?number;
  lon: ?number;
  onSelectCoordinate: (coords: { lat: number; lon: number; zoom: number; }) => void;
  onChangeSearchQuery: (newSearchQuery: string) => void;
  onFilterChanged: (filter: PlaceFilter) => void;
  onClose: ?() => void;
  onClick: () => void;
  onResetCategory: ?() => void;
  isExpanded: boolean;
  hasGoButton: boolean;
};

type State = {
  searchResults: ?SearchResultCollection;
  searchFieldIsFocused: boolean;
  isCategoryFocused: boolean;
  isLoading: boolean;
};

const StyledChevronRight = styled(ChevronRight)`
  height: 1rem;
  vertical-align: bottom;
  opacity: 0.5;
  g, polygon, rect, circle, path {
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

export default class SearchToolbar extends React.Component<Props, State> {
  props: Props;

  state = {
    searchFieldIsFocused: false,
    searchResults: null,
    isCategoryFocused: false,
    isLoading: false
  };

  toolbar: ?React.ElementRef<typeof Toolbar> = null;
  input: ?React.ElementRef<'input'> = null;
  searchInputField: ?React.ElementRef<'input'> = null;
  closeLink: ?React.ElementRef<typeof CloseLink> = null;
  goButton: ?React.ElementRef<'button'> = null;
  firstResult: ?React.ElementRef<typeof SearchResult> = null;

  handleSearchInputChange = debounce(() => {
    if (!(this.input instanceof HTMLInputElement)) {
      return;
    }
    const query = this.input.value;
    if (query.match(/^locale:/)) {
      return;
    }
    this.sendSearchRequest(query);
  }, 1000, { leading: false, trailing: true, maxWait: 3000 });

  componentDidMount() {
    if (this.props.searchQuery) {
      this.sendSearchRequest(this.props.searchQuery);
    }

    if (!this.props.hidden) {
      this.focus();
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const searchFieldShouldBecomeFocused = !prevState.searchFieldIsFocused && this.state.searchFieldIsFocused;
    if (searchFieldShouldBecomeFocused) {
      this.focus();
    }

    if (prevProps.searchQuery !== this.props.searchQuery) {
      this.sendSearchRequest(this.props.searchQuery);
    }
  }

  ensureFullVisibility() {
    if (this.toolbar instanceof Toolbar) {
      this.toolbar.ensureFullVisibility();
    }
  }

  sendSearchRequest(query: ?string): void {
    if (!query || query.length < 2) {
      this.setState({ searchResults: null, isLoading: false });
      return;
    }

    this.setState({ isLoading: true });

    searchPlaces(query, this.props).then(featureCollection => {
      this.setState({ searchResults: featureCollection || this.state.searchResults, isLoading: false });
    });
  }

  clearSearch() {
    this.setState({ searchResults: null });
    if (this.input instanceof HTMLInputElement) {
      this.input.value = '';
      this.input.blur();
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
    this.setState({ searchResults: null, searchFieldIsFocused: true, isCategoryFocused: false }, () => {
      if (this.input instanceof HTMLInputElement) {
        this.input.value = '';
      }
    });
  }

  renderSearchInputField() {
    return <SearchInputField innerRef={searchInputField => this.searchInputField = searchInputField} searchQuery={this.props.category ? '' : this.props.searchQuery} hidden={this.props.hidden} onClick={() => {
      if (this.props.category) {
        this.resetSearch();
      }
      this.setState({ searchFieldIsFocused: true });
      window.scrollTo(0, 0);
      this.props.onClick();
    }} onFocus={event => {
      this.input = event.target;
      this.setState({ searchFieldIsFocused: true });
      window.scrollTo(0, 0);
    }} onBlur={() => {
      this.ensureFullVisibility();
      setTimeout(() => {
        this.setState({ searchFieldIsFocused: false });
        this.ensureFullVisibility();
      }, 300);
    }} onChange={event => {
      const input = event.target;
      this.input = input;
      this.props.onChangeSearchQuery(input.value);
      if (input.value && !this.state.searchResults) {
        this.setState({ isLoading: true });
      }
      this.handleSearchInputChange(event);
    }} onSubmit={() => {
      this.setState({ searchFieldIsFocused: false }, () => {
        this.blur();
        if (this.firstResult) {
          this.firstResult.focus();
        }
      });
      handleInputCommands(this.props.history, this.input && this.input.value);
    }} ariaRole="searchbox" />;
  }

  renderSearchResults(searchResults: SearchResultCollection) {
    return <div aria-live="assertive">
      <SearchResults searchResults={searchResults} onSelectCoordinate={this.props.onSelectCoordinate} hidden={this.props.hidden} history={this.props.history} onSelect={() => this.clearSearch()} refFirst={ref => {
        this.firstResult = ref;
      }} />
    </div>;
  }

  renderLoadingIndicator() {
    return <div>
      <span className="sr-only" aria-live="assertive">
        Searching
      </span>
      <Dots size={20} />
    </div>;
  }

  renderCategoryMenu() {
    if (!this.props.category && !this.props.isExpanded) return null;

    return <CategoryMenu hidden={this.props.hidden} history={this.props.history} onFocus={() => this.setState({ isCategoryFocused: true })} onBlur={() => {
      setTimeout(() => this.setState({ isCategoryFocused: false }));
    }} category={this.props.category} accessibilityFilter={this.props.accessibilityFilter} />;
  }

  renderAccessibilityFilterToolbar() {
    if (!isFiltered(this.props.accessibilityFilter) && !this.props.isExpanded) return null;

    return <div className="filter-selector">
      <AccessibilityFilterMenu accessibilityFilter={this.props.accessibilityFilter} toiletFilter={this.props.toiletFilter} onFilterChanged={this.props.onFilterChanged} category={this.props.category} history={this.props.history} onBlur={() => {
        setTimeout(() => this.setState({ isCategoryFocused: false }));
      }} />
    </div>;
  }

  renderFilters() {
    return <React.Fragment>
      {this.renderCategoryMenu()}
      {this.renderAccessibilityFilterToolbar()}
    </React.Fragment>;
  }

  renderCloseLink() {
    return <CloseLink history={this.props.history} ariaLabel={t`Clear search`} onClick={() => {
      this.resetSearch();
      if (this.props.onClose) this.props.onClose();
    }} innerRef={closeLink => this.closeLink = closeLink} />;
  }

  renderGoButton() {
    // translator: button shown next to the search bar
    const caption = t`Go`;
    return <GoButton innerRef={button => this.goButton = button} onClick={this.props.onClose}>
      {caption} <StyledChevronRight />
    </GoButton>;
  }

  render() {
    const {
      isLoading,
      searchResults
    } = this.state;

    let contentBelowSearchField = null;

    if (!searchResults && isLoading) {
      contentBelowSearchField = this.renderLoadingIndicator();
    } else if (searchResults) {
      contentBelowSearchField = this.renderSearchResults(searchResults);
    } else {
      contentBelowSearchField = this.renderFilters();
    }

    const className = ['search-toolbar', this.props.isExpanded && 'is-expanded'].filter(Boolean).join(' ');

    return <StyledToolbar className={className} hidden={this.props.hidden} inert={this.props.inert} minimalHeight={75} innerRef={toolbar => {
      this.toolbar = toolbar;
    }} isSwipeable={false} enableTransitions={false} role="search">
        <header>
          <form action="#" method="post" onSubmit={ev => {
          ev.preventDefault();
        }}>
            <SearchIcon />
            {this.renderSearchInputField()}
            {this.props.searchQuery && this.renderCloseLink()}
            {!this.props.searchQuery && this.props.hasGoButton && this.renderGoButton()}
          </form>
        </header>
        <section onTouchStart={() => this.blur()}>
          {contentBelowSearchField}
        </section>
      </StyledToolbar>;
  }
}
