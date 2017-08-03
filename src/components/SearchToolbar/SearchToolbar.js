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
import { removeCurrentHighlightedMarker } from '../../lib/highlightMarker';


type Props = {
  className: string,
  hidden: boolean,
  category: ?string,
};

type DefaultProps = {};

type State = {
  searchResults: ?SearchResultCollection,
  categoryMenuIsVisible: boolean,
};


const PositionedCloseLink = styled(CloseLink)`
  top: 5px;
  right: 8px;
`;

const StyledSearchIcon = styled(SearchIcon)`
  position: absolute;
  top: 20px;
  left: 22px;
  pointer-events: none;
`;

export default class SearchToolbar extends Component<DefaultProps, Props, State> {
  static defaultProps: DefaultProps;

  constructor(props: Props) {
    super(props);
    this.state = {
      categoryMenuIsVisible: false,
      searchResults: null,
    };

    this.handleSearchInputChangeDebounced = debounce(
      this.handleSearchInputChange,
      500,
      { leading: false, trailing: true, maxWait: 1000 }
    );
  }

  queryIndex: number = 0;

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

    return (
      <Toolbar className={this.props.className} hidden={this.props.hidden} minimalHeight={75}>
        <PositionedCloseLink
          onClick={ () => {
            this.setState({ categoryMenuIsVisible: true, searchResults: null });
            const input = this.input;
            if (input instanceof HTMLInputElement) {
              input.value = '';
              setTimeout(() => input.focus(), 50);
            }
          }}
        />

        <SearchInputField
          onFocus={() => { this.setState({ categoryMenuIsVisible: true }); }}
          onBlur={() => {
            setTimeout(() => {
              this.setState({ categoryMenuIsVisible: this.props.category });
            }, 50);
          }}
          onChange={(event) => {
            this.input = event.target;
            this.handleSearchInputChangeDebounced(event);
          }}
          showSpinner={showSpinner}
        />

        <StyledSearchIcon />

        { contentBelowSearchField }
      </Toolbar>
    );
  }
}
