// @flow

import React, { Component } from 'react';
import throttle from 'lodash/throttle';
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

    this.handleSearchInputChangeThrottled = throttle(
      this.handleSearchInputChange,
      500,
      { leading: false },
    );
  }

  queryIndex: number = 0;

  handleSearchInputChangeThrottled: ((event: UIEvent) => void);


  toggleCategoryMenu(): void {
    this.setState(prevState => ({
      categoryMenuIsVisible: !prevState.categoryMenuIsVisible,
    }));
  }


  handleSearchInputChange(event: UIEvent): void {
    if (!(event.target instanceof HTMLInputElement)) return;
    const query = event.target.value;
    this.sendSearchRequest(query);
  }


  sendSearchRequest(query: string): void {
    if (!query || query.length < 3) {
      this.setState({ searchResults: null });
      return;
    }
    const url = `https://photon.komoot.de/api/?q=${query}&limit=10`;
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
        <SearchInputField onChange={event => this.handleSearchInputChange(event)} showSpinner={showSpinner} />
        { searchResults ?
          <SearchResults searchResults={searchResults} /> :
          <CategoryMenu isVisible={this.state.categoryMenuIsVisible} /> }
      </Toolbar>
    );
  }
}
