// @flow

import { Dots } from 'react-activity';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import SearchIcon from './SearchIcon';
import CategoryMenu from './CategoryMenu';
import SearchResults from './SearchResults';
import Categories from '../../lib/Categories';
import SearchInputField from './SearchInputField';
import searchPlaces from '../../lib/searchPlaces';
import type { SearchResultCollection } from '../../lib/searchPlaces';


type Props = {
  history: RouterHistory,
  hidden: boolean,
  inert: boolean,
  category: ?string,
  searchQuery: ?string,
  lat: ?number,
  lon: ?number,
  onSelectCoordinate: ((coords: { lat: number, lon: number, zoom: number }) => void),
  onChangeSearchQuery: ((newSearchQuery: string) => void),
  onClose: ?(() => void),
};

type State = {
  searchResults: ?SearchResultCollection,
  searchFieldIsFocused: boolean,
  isCategoryFocused: boolean,
  isLoading: boolean;
};


function isOnSmallViewport() {
  return window.innerWidth < 512;
}

function hasBigViewport() {
  return window.innerHeight > 512 && window.innerWidth > 512;
}

const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.15s ease-out, width: 0.15s ease-out, height: 0.15s ease-out;
  display: flex;
  flex-direction: column;
  padding: 0;

  > header, .search-results {
    padding: 12px 15px 5px 15px;
  }
  .search-results {
    padding-top: 0;
  }

  > header {
    position: relative;
  }

  .search-icon {
    position: absolute;
    top: 20px;
    left: 22px;
    pointer-events: none;
  }

  .close-link {
    top: 5px;
    right: 8px;
    position: absolute;
    background-color: transparent;
    display: flex;
    flex-direction: row-reverse;
    &.has-open-category {
      left: 8px;
    }
  }

  @media (max-width: 512px), (max-height: 512px) {
    &.search-field-is-focused {
      position: fixed;
      top: 0;
      padding-top: constant(safe-area-inset-top);
      padding-top: env(safe-area-inset-top);
      width: 100%;
      max-height: 100%;
      right: 0;
      left: 0;
      margin: 0;
      padding: 12px 15px;
      transform: translate3d(0, 0, 0) !important;
      z-index: 1000000000;
      border-radius: 0;
      > header, .search-results, .category-menu {
        padding: 0
      }
      .search-icon {
        top: 8px;
        left: 8px;
      }
      .close-link {
        top: -6px;
        right: -5px;
      }
      @media (max-height: 400px) {
        .category-button {
          flex-basis: 16.666666% !important;
        }
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
  input: HTMLInputElement;

  handleSearchInputChange = debounce(() => {
    if (!(this.input instanceof HTMLInputElement)) return;
    const query = this.input.value;
    this.sendSearchRequest(query);
  },
  500,
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

  componentDidUpdate(prevProps, prevState) {
    const searchFieldShouldBecomeFocused = !prevState.searchFieldIsFocused && this.state.searchFieldIsFocused;
    if (searchFieldShouldBecomeFocused) {
      this.focus();
    }
  }

  componentWillReceiveProps(newProps: Props) {
    if (newProps.category !== this.props.category) {
      const hasCategory = Boolean(newProps.category);
      if (hasCategory) {
        if (isOnSmallViewport()) {
          this.setState({ categoryMenuIsVisible: false, searchFieldIsFocused: false });
          if (this.input) this.input.blur();
        }
        this.ensureFullVisibility();
      } else {
        this.setState({ categoryMenuIsVisible: false });
      }
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


  clearSearchOnSmallViewports() {
    if (isOnSmallViewport()) {
      this.setState({ categoryMenuIsVisible: false, searchResults: null });
      if (this.input instanceof HTMLInputElement) {
        this.input.value = '';
      }
    }
  }

  focus() {
    if (hasBigViewport()) {
      this.searchInputField.focus();
    }
  }

  render() {
    const { searchQuery } = this.props;

    const {
      isLoading,
      searchResults,
      searchFieldIsFocused,
      isCategoryFocused,
    } = this.state;

    const isSearchFieldFocusedAndEmpty = searchFieldIsFocused && !searchQuery

    const categoryNotSelected = !Boolean(this.props.category);

    const categoryMenuIsVisible = isSearchFieldFocusedAndEmpty || (categoryNotSelected && isCategoryFocused);

    let contentBelowSearchField = null;

    if (isLoading) {
      contentBelowSearchField =
        <div>
          <span className="sr-only" aria-live="assertive">
            Searching
          </span>
          <Dots size={20} />
        </div>;
    } else if (searchResults) {
      contentBelowSearchField =
        <div aria-live="assertive">
          <SearchResults
            searchResults={searchResults}
            onSelectCoordinate={this.props.onSelectCoordinate}
            hidden={this.props.hidden}
            onSelect={() => this.clearSearchOnSmallViewports()}
          />
        </div>;
    } else if (categoryMenuIsVisible) {
      contentBelowSearchField = (<CategoryMenu
        hidden={this.props.hidden}
        onFocus={() => this.setState({ isCategoryFocused: true })}
        onBlur={() => setTimeout(() => this.setState({ isCategoryFocused: false }))}
      />);
    }

    const placeholder = this.props.category ? Categories.translatedWheelmapRootCategoryName(this.props.category) : '';

    const className = [
      'search-toolbar',
      searchFieldIsFocused ? 'search-field-is-focused' : null,
    ].filter(Boolean).join(' ');

    return (
      <StyledToolbar
        className={className}
        hidden={this.props.hidden}
        inert={this.props.inert}
        minimalHeight={75}
        innerRef={(toolbar) => { this.toolbar = toolbar; }}
        isSwipeable={false}
        role="search"
      >
        <header>
          <SearchIcon className="search-icon" />

          <SearchInputField
            innerRef={searchInputField => this.searchInputField = searchInputField}
            searchQuery={this.props.category ? '' : this.props.searchQuery}
            placeholder={placeholder}
            disabled={Boolean(this.props.category)}
            hidden={this.props.hidden}
            onClick={() => {
              if (this.props.category) {
                this.setState({ categoryMenuIsVisible: true });
              }
            }}
            onFocus={(event) => {
              this.input = event.target;
              setTimeout(() => {
                this.setState({ searchFieldIsFocused: true });
                window.scrollTo(0, 0);
                this.setState({ categoryMenuIsVisible: true });
                setTimeout(() => {
                }, 100);
              }, 300);
            }}
            onBlur={() => {
              this.ensureFullVisibility();
              setTimeout(() => this.setState({ searchFieldIsFocused: false }), 300);
            }}
            onChange={(event) => {
              this.input = event.target;
              this.props.onChangeSearchQuery(event.target.value);
              this.handleSearchInputChange(event);
            }}
            ariaRole="searchbox"
          />

          {(this.props.searchQuery || this.props.category) ? <CloseLink
            history={this.props.history}
            className='close-link'
            onClick={() => {
              this.setState({ searchResults: null, searchFieldIsFocused: true, isCategoryFocused: false });
              if (this.input instanceof HTMLInputElement) {
                this.input.value = '';
                if (!this.props.category) {
                  this.searchInputField.blur();
                }
              }
              setTimeout(() => this.ensureFullVisibility(), 100);
              if (this.props.onClose) this.props.onClose();
            }}
            innerRef={closeLink => this.closeLink = closeLink}
          /> : null}
        </header>

        { contentBelowSearchField }
      </StyledToolbar>
    );
  }
}
