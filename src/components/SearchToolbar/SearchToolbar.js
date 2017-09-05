// @flow

import React, { Component } from 'react';
import { Dots } from 'react-activity';
import styled from 'styled-components';
import debounce from 'lodash/debounce';
import Toolbar from '../Toolbar';
import CategoryMenu from './CategoryMenu';
import SearchResults from './SearchResults';
import type { SearchResultCollection } from './SearchResults';
import SearchInputField from './SearchInputField';
import CloseLink from '../CloseLink';
import SearchIcon from './SearchIcon';


type Props = {
  className: string,
  hidden: boolean,
  category: ?string,
  lat: ?number,
  lon: ?number,
};

type DefaultProps = {};

type State = {
  searchResults: ?SearchResultCollection,
  categoryMenuIsVisible: boolean,
  searchFieldIsFocused: boolean,
  isCategoryFocused: boolean,
};


const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.3s ease-out, width: 0.3s ease-out, height: 0.3s ease-out;
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
  }

  @media (max-width: 512px), (max-height: 512px) {
    &.search-field-is-focused {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      max-height: 100%;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 1000000000;
      margin: 0;
      padding: 12px 15px;
      border-radius: 0;
      transform: translate3d(0, 0, 0) !important;
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


export default class SearchToolbar extends Component<DefaultProps, Props, State> {
  static defaultProps: DefaultProps;

  state = {
    categoryMenuIsVisible: false,
    searchFieldIsFocused: false,
    searchResults: null,
    isCategoryFocused: false,
  };

  queryIndex: number = 0;

  toolbar: AnyReactElement;
  input: HTMLInputElement;

  handleSearchInputChange = debounce((event: UIEvent) => {
    if (!(this.input instanceof HTMLInputElement)) return;
      const query = this.input.value;
      this.sendSearchRequest(query);
    },
    500,
    { leading: false, trailing: true, maxWait: 1000 },
  );

  toggleCategoryMenu(): void {
    this.setState(prevState => ({
      categoryMenuIsVisible: !prevState.categoryMenuIsVisible,
    }));
  }

  sendSearchRequest(query: string): void {
    if (!query || query.length < 3) {
      this.setState({ searchResults: null });
      return;
    }

    const url = `https://photon.komoot.de/api/?q=${query}&limit=30`;
    const { lat, lon } = this.props;
    const hasLocation = lat && lon;
    const locationBiasedUrl = hasLocation ? `${url}&lon=${lon}&lat=${lat}` : url;
    this.queryIndex += 1;
    const queryIndex = this.queryIndex;
    this.setState({ isLoading: true });
    fetch(locationBiasedUrl).then((response) => {
      if (queryIndex !== this.queryIndex) {
        // There was a newer search already. Ignore results. Unfortunately, the fetch API does not
        // allow to cancel a request yet.
        return;
      }
      response.json().then((featureCollection) => {
        this.setState({ searchResults: featureCollection, isLoading: false });
      });
    });
  }


  clearSearchOnSmallViewports() {
    if (window.innerWidth < 512) {
      this.setState({ categoryMenuIsVisible: false, searchResults: null });
      if (this.input instanceof HTMLInputElement) {
        this.input.value = '';
      }
    }
  }

  updateCategoryMenuVisibility = debounce(() => {
    const isCategorySelected = Boolean(this.props.category);
    const isCategoryFocused = this.state.isCategoryFocused;
    this.setState({ categoryMenuIsVisible: isCategorySelected || isCategoryFocused });
    if (this.toolbar) this.toolbar.ensureFullVisibility();
  }, 100);


  render() {
    const searchResults = this.state.searchResults;

    let contentBelowSearchField = null;
    if (this.state.isLoading) {
      contentBelowSearchField = <Dots size={20} />;
    } else if (searchResults) {
      contentBelowSearchField = <SearchResults searchResults={searchResults} onSelect={() => this.clearSearchOnSmallViewports()} />;
    } else if (this.state.categoryMenuIsVisible) {
      contentBelowSearchField = <CategoryMenu
        onFocus={() => {
          this.setState({ categoryMenuIsVisible: true });
          this.setState({ isCategoryFocused: true });
        }}
        onBlur={() => this.setState({ isCategoryFocused: false })}
      />;
    }

    const className = [
      this.props.className,
      'search-toolbar',
      this.state.searchFieldIsFocused ? 'search-field-is-focused' : null,
    ].filter(Boolean).join(' ');

    return (
      <StyledToolbar
        className={className}
        hidden={this.props.hidden}
        minimalHeight={75}
        innerRef={(toolbar) => { this.toolbar = toolbar; }}
        isSwipeable={false}
      >
        <header>
          {contentBelowSearchField ? <CloseLink
            history={this.props.history}
            className="close-link"
            onClick={ () => {
              this.setState({ categoryMenuIsVisible: false, searchResults: null });
              if (this.input instanceof HTMLInputElement) {
                this.input.value = '';
              }
              setTimeout(() => {
                if (this.toolbar) this.toolbar.ensureFullVisibility();
              }, 100);
            }}
          /> : null}

          <SearchInputField
            onFocus={(event) => {
              this.input = event.target;
              this.setState({ categoryMenuIsVisible: true });
              this.setState({ searchFieldIsFocused: true });
              setTimeout(() => {
                if (this.toolbar) this.toolbar.ensureFullVisibility();
              }, 100);
              setTimeout(() => {
                window.scrollTo(0, 0);
              }, 300);
            }}
            onBlur={() => {
              this.updateCategoryMenuVisibility();
              setTimeout(() => {
                this.setState({ searchFieldIsFocused: false });
              }, 300);
            }}
            onChange={(event) => {
              this.input = event.target;
              this.handleSearchInputChange(event);
            }}
          />

          <SearchIcon className="search-icon" />
        </header>

        { contentBelowSearchField }
      </StyledToolbar>
    );
  }
}
