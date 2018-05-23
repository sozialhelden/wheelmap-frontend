// @flow

import { Dots } from 'react-activity';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';
import { t } from 'c-3po';

import colors from '../../lib/colors';
import { isOnSmallViewport, hasBigViewport } from '../../lib/ViewportSize';
import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import SearchIcon from './SearchIcon';
import CategoryMenu from './CategoryMenu';
import SearchResults from './SearchResults';
import Categories from '../../lib/Categories';
import SearchInputField from './SearchInputField';
import searchPlaces from '../../lib/searchPlaces';
import type { SearchResultCollection } from '../../lib/searchPlaces';


export type Props = {
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

const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.15s ease-out, width: 0.15s ease-out, height: 0.15s ease-out;
  display: flex;
  flex-direction: column;
  padding: 0;
  border-top: none;
  border-radius: 3px;

  > header {
    padding: 5px;
  }

  .search-results {
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
    top: 1em;
    left: 1em;
    pointer-events: none;
    width: 1em;
    height: 1em;
    opacity: 0.5;
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
    padding: 12px 15px;
    padding-right: max(constant(safe-area-inset-right), 15px);
    padding-left: max(constant(safe-area-inset-left), 15px);
    padding-right: max(env(safe-area-inset-right), 15px);
    padding-left: max(env(safe-area-inset-left), 15px);
    margin-top: constant(safe-area-inset-top);
    margin-top: env(safe-area-inset-top);
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
  input: ?HTMLInputElement;
  searchInputField: ?HTMLInputElement;


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


  clearSearch() {
    this.setState({ categoryMenuIsVisible: false, searchResults: null });
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
            history={this.props.history}
            onSelect={() => this.clearSearch()}
          />
        </div>;
    } else if (categoryMenuIsVisible) {
      contentBelowSearchField = (<CategoryMenu
        hidden={this.props.hidden}
        history={this.props.history}
        onFocus={() => this.setState({ isCategoryFocused: true })}
        onBlur={() => { setTimeout(() => this.setState({ isCategoryFocused: false })) }}
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
        enableTransitions={false}
        role="search"
      >
        <header>
          <SearchIcon />

          <SearchInputField
            innerRef={searchInputField => this.searchInputField = searchInputField}
            searchQuery={this.props.category ? '' : this.props.searchQuery}
            placeholder={placeholder}
            disabled={Boolean(this.props.category)}
            hidden={this.props.hidden}
            onClick={() => {
              if (this.props.category) {
                this.setState({ searchFieldIsFocused: true });
                window.scrollTo(0, 0);
                this.setState({ categoryMenuIsVisible: true });
              }
            }}
            onFocus={(event) => {
              this.input = event.target;
              this.setState({ searchFieldIsFocused: true });
              window.scrollTo(0, 0);
              this.setState({ categoryMenuIsVisible: true });
            }}
            onBlur={() => {
              this.ensureFullVisibility();
              setTimeout(() => {
                this.setState({ searchFieldIsFocused: false });
                this.ensureFullVisibility();
              }, 300);
            }}
            onChange={(event) => {
              this.input = event.target;
              this.props.onChangeSearchQuery(event.target.value);
              this.handleSearchInputChange(event);
            }}
            ariaRole="searchbox"
          />

          {(this.props.searchQuery || this.props.category || searchFieldIsFocused) ? <CloseLink
            history={this.props.history}
            className='close-link'
            ariaLabel={t`Clear Search`}
            onClick={() => {
              this.setState({ searchResults: null, searchFieldIsFocused: true, isCategoryFocused: false });
              if (this.input instanceof HTMLInputElement) {
                this.input.value = '';
                if (!this.props.category) {
                  this.input.blur();
                }
              }
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
