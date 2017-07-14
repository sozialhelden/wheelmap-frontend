// @flow

import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import Toolbar from '../Toolbar';
import CategoryMenu from './CategoryMenu';
import SearchResults from './SearchResults';
import type { SearchResultCollection } from './SearchResults';
import SearchInputField from './SearchInputField';


type Props = {
  className: string,
  hidden: boolean,
};

type DefaultProps = {};

type State = {
  searchResults: ?SearchResultCollection,
  categoryMenuIsVisible: boolean,
};


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
    return (
      <Toolbar className={this.props.className} hidden={this.props.hidden} minimalHeight={75}>
        <SearchInputField
          onChange={(event) => { this.input = event.target; this.handleSearchInputChangeDebounced(event); }}
          showSpinner={showSpinner}
        />
        { searchResults ?
          <SearchResults searchResults={searchResults} /> :
          <CategoryMenu isVisible={this.state.categoryMenuIsVisible} /> }
      </Toolbar>
    );
  }
}
