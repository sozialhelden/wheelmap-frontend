// @flow

import { Dots } from 'react-activity';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';
import { t } from 'c-3po';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import SearchIcon from './SearchIcon';
import colors from '../../lib/colors';
import CategoryMenu from './CategoryMenu';
import SearchResults from './SearchResults';
import { isFiltered } from '../../lib/Feature';
import SearchInputField from './SearchInputField';
import searchPlaces from '../../lib/searchPlaces';
import type { SearchResultCollection } from '../../lib/searchPlaces';
import AccessibilityFilterMenu from './AccessibilityFilterMenu';
import type { PlaceFilter } from './AccessibilityFilterModel';


export type Props = PlaceFilter & {
  history: RouterHistory,
  hidden: boolean,
  inert: boolean,
  category: ?string,
  searchQuery: ?string,
  lat: ?number,
  lon: ?number,
  onSelectCoordinate: ((coords: { lat: number, lon: number, zoom: number }) => void),
  onChangeSearchQuery: ((newSearchQuery: string) => void),
  onFilterChanged: ((filter: PlaceFilter) => void),
  onClose: ?(() => void),
  onClick: (() => void),
  onResetCategory: ?(() => void),
  isExpanded: boolean,
};


type State = {
  searchResults: ?SearchResultCollection,
  searchFieldIsFocused: boolean,
  isCategoryFocused: boolean,
  isLoading: boolean;
};


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
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    border-bottom: 1px ${colors.borderColor} solid;
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
    padding-right: max(constant(safe-area-inset-right), 15px);
    padding-left: max(constant(safe-area-inset-left), 15px);
    padding-right: max(env(safe-area-inset-right), 15px);
    padding-left: max(env(safe-area-inset-left), 15px);
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
    isLoading: false,
  };

  toolbar: ?React.Element<typeof Toolbar>;
  input: ?React.ElementRef<'input'>;
  searchInputField: ?React.ElementRef<'input'>;
  closeLink: ?React.ElementRef<typeof CloseLink>;


  handleSearchInputChange = debounce(() => {
    if (!(this.input instanceof HTMLInputElement)) return;
    const query = this.input.value;
    this.sendSearchRequest(query);
  },
  1000,
  { leading: false, trailing: true, maxWait: 1000 },
  );


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
  }

  ensureFullVisibility() {
    if (this.toolbar instanceof Toolbar) {
      this.toolbar.ensureFullVisibility();
    }
  }

  sendSearchRequest(query: string): void {
    if (!query || query.length < 3) {
      this.setState({ searchResults: null, isLoading: false });
      return;
    }

    this.setState({ isLoading: true });

    searchPlaces(query, this.props).then((featureCollection) => {
      this.setState({ searchResults: featureCollection, isLoading: false });
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
    if (!this.searchInputField) return;
    this.searchInputField.focus();
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
    return <SearchInputField
      innerRef={searchInputField => this.searchInputField = searchInputField}
      searchQuery={this.props.category ? '' : this.props.searchQuery}
      hidden={this.props.hidden}
      onClick={() => {
        if (this.props.category) {
          this.resetSearch();
        }
        this.setState({ searchFieldIsFocused: true });
        window.scrollTo(0, 0);
        this.props.onClick();
      }}
      onFocus={(event) => {
        this.input = event.target;
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
      onChange={(event) => {
        const input = event.target;
        this.input = input;
        this.props.onChangeSearchQuery(input.value);
        if (input.value && !this.state.searchResults) {
          this.setState({ isLoading: true });
        }
        this.handleSearchInputChange(event);
      }}
      ariaRole="searchbox"
    />;
  }


  renderSearchResults(searchResults: SearchResultCollection) {
    return <div aria-live="assertive">
      <SearchResults
        searchResults={searchResults}
        onSelectCoordinate={this.props.onSelectCoordinate}
        hidden={this.props.hidden}
        history={this.props.history}
        onSelect={() => this.clearSearch()}
      />
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

    return <CategoryMenu
      hidden={this.props.hidden}
      history={this.props.history}
      onFocus={() => this.setState({ isCategoryFocused: true })}
      onBlur={() => { setTimeout(() => this.setState({ isCategoryFocused: false })) }}
      category={this.props.category}
      accessibilityFilter={this.props.accessibilityFilter}
    />
  }


  renderAccessibilityFilterToolbar() {
    if (!isFiltered(this.props.accessibilityFilter) && !this.props.isExpanded) return null;

    return <div className="filter-selector">
      <AccessibilityFilterMenu
        accessibilityFilter={this.props.accessibilityFilter}
        toiletFilter={this.props.toiletFilter}
        onFilterChanged={this.props.onFilterChanged}
        category={this.props.category}
        history={this.props.history}
        onBlur={() => { setTimeout(() => this.setState({ isCategoryFocused: false })) }}
      />
    </div>;
  }


  renderFilters() {
    return <React.Fragment>
      {this.renderCategoryMenu()}
      {this.renderAccessibilityFilterToolbar()}
    </React.Fragment>;
  }


  renderCloseLink() {
    return <CloseLink
      history={this.props.history}
      className='close-link'
      ariaLabel={t`Clear Search`}
      onClick={() => {
        this.resetSearch();
        if (this.props.onClose) this.props.onClose();
      }}
      innerRef={closeLink => this.closeLink = closeLink}
    />;
  }


  render() {
    const {
      isLoading,
      searchResults,
      searchFieldIsFocused,
    } = this.state;

    let contentBelowSearchField = null;

    if (isLoading) {
      contentBelowSearchField = this.renderLoadingIndicator();
    } else if (searchResults) {
      contentBelowSearchField = this.renderSearchResults(searchResults);
    } else {
      contentBelowSearchField = this.renderFilters();
    }

    const className = [
      'search-toolbar',
      this.props.isExpanded && 'is-expanded',
    ].filter(Boolean).join(' ');

    return (
      <StyledToolbar
        className={className}
        hidden={this.props.hidden}
        inert={this.props.inert}
        minimalHeight={75}
        innerRef={(toolbar) => { this.toolbar = toolbar; }}
        isSwipeable={false}
        enableTransitions={false}
        role="search"
      >
        <header>
          <SearchIcon />

          {this.renderSearchInputField()}

          {(this.props.searchQuery || searchFieldIsFocused) && this.renderCloseLink()}
        </header>
        <section>
          { contentBelowSearchField }
        </section>
      </StyledToolbar>
    );
  }
}
