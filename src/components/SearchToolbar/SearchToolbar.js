// @flow

import React, { Component } from 'react';
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
};

type DefaultProps = {};

type State = {
  searchResults: ?SearchResultCollection,
  categoryMenuIsVisible: boolean,
  searchFieldIsFocused: boolean,
};


const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.3s ease-out, width: 0.3s ease-out, height: 0.3s ease-out;
  display: flex;
  flex-direction: column;
  padding: 0;

  > header, .search-results, .category-menu {
    padding: 12px 15px 5px 15px;
  }
  .search-results {
    padding-top: 0;
  }

  > header {
    position: relative;
  }

  .search-icon, .close-link {
    transition: top 0.3s ease-out, left 0.3s ease-out;
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
      width: 100%;
      height: 100%;
      max-height: 100%;
      right: 0;
      left: 0;
      bottom: 0;
      margin: 0;
      padding: 12px 15px;
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
    }
  }

  .search-results {
    overflow: auto;
  }
`;


export default class SearchToolbar extends Component<DefaultProps, Props, State> {
  static defaultProps: DefaultProps;

  constructor(props: Props) {
    super(props);
    this.state = {
      categoryMenuIsVisible: false,
      searchFieldIsFocused: false,
      searchResults: null,
    };

    this.handleSearchInputChangeDebounced = debounce(
      this.handleSearchInputChange,
      500,
      { leading: false, trailing: true, maxWait: 1000 }
    );
  }

  queryIndex: number = 0;
  toolbar: AnyReactElement;
  handleSearchInputChangeDebounced: ((event: UIEvent) => void);


  toggleCategoryMenu(): void {
    this.setState(prevState => ({
      categoryMenuIsVisible: !prevState.categoryMenuIsVisible,
    }));
  }


  handleSearchInputChange(event: UIEvent): void {
    if (!(this.input instanceof HTMLInputElement)) return;
    const query = this.input.value;
    this.sendSearchRequest(query);
  }


  sendSearchRequest(query: string): void {
    if (!query || query.length < 3) {
      this.setState({ searchResults: null });
      return;
    }
    const url = `https://photon.komoot.de/api/?q=${query}&limit=30`;
    this.queryIndex += 1;
    const queryIndex = this.queryIndex;
    fetch(url).then((response) => {
      if (queryIndex !== this.queryIndex) {
        // There was a newer search already. Ignore results. Unfortunately, the fetch API does not
        // allow to cancel a request yet.
        return;
      }
      response.json().then((featureCollection) => {
        this.setState({ searchResults: featureCollection });
      });
    });
  }


  render() {
    const searchResults = this.state.searchResults;
    const showSpinner = false;

    let contentBelowSearchField = null;
    if (searchResults) {
      contentBelowSearchField = <SearchResults searchResults={searchResults} />;
    } else if (this.state.categoryMenuIsVisible) {
      contentBelowSearchField = <CategoryMenu />;
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
        isSwipeable={!this.state.searchFieldIsFocused && !this.state.searchResults}
      >
        <header>
          <CloseLink
            history={this.props.history}
            className="close-link"
            onClick={ () => {
              this.setState({ categoryMenuIsVisible: false, searchResults: null });
              const input = this.input;
              if (input instanceof HTMLInputElement) {
                input.value = '';
                setTimeout(() => input.focus(), 50);
              }
              setTimeout(() => {
                if (this.toolbar) this.toolbar.ensureFullVisibility();
              }, 100);
            }}
          />

          <SearchInputField
            onFocus={() => {
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
              setTimeout(() => {
                this.setState({ categoryMenuIsVisible: this.props.category });
                this.setState({ searchFieldIsFocused: false });
                if (this.toolbar) this.toolbar.ensureFullVisibility();
              }, 50);
            }}
            onChange={(event) => {
              this.input = event.target;
              this.handleSearchInputChangeDebounced(event);
            }}
            showSpinner={showSpinner}
          />

          <SearchIcon className="search-icon" />
        </header>

        { contentBelowSearchField }
      </StyledToolbar>
    );
  }
}
