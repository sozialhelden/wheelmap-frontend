// @flow

import styled from 'styled-components';
import uniq from 'lodash/uniq';
import React, { Component } from 'react';
import type { GeometryObject } from 'geojson-flow';
import Categories from '../../lib/Categories';
import type { Category } from '../../lib/Categories';
import getAddressString from '../../lib/getAddressString';
import { wheelmapFeatureCache } from '../../lib/cache/WheelmapFeatureCache';
import type { WheelmapFeature } from '../../lib/Feature';
import ToolbarLink from '../ToolbarLink';
import PlaceName from '../PlaceName';
import Icon from '../Icon';

export type SearchResultProperties = {
  city?: ?any,
  country?: ?any,
  name?: ?any,
  osm_id?: ?any,
  osm_key?: ?any,
  osm_type?: ?any,
  osm_value?: ?any,
  postcode?: ?any,
  state?: ?any,
  housenumber?: ?any,
  street?: ?any,
};


export type SearchResultFeature = {
  geometry: GeometryObject,
  properties: SearchResultProperties,
};


export type SearchResultCollection = {
  features: SearchResultFeature[],
};


type SearchResultProps = {
  result: SearchResultFeature,
};

type State = {
  category: ?Category,
  parentCategory: ?Category,
  fetchNodeTimeout: ?number,
  lastFetchedOsmId: ?number,
  wheelmapFeature: ?WheelmapFeature
};


function HashLinkOrRouterLink(props) {
  if (props.isHashLink) {
    return <a href={props.to} className={props.className}>{props.children}</a>;
  }
  return <ToolbarLink to={props.to} className={props.className}>{props.children}</ToolbarLink>;
}


class SearchResult extends Component<void, SearchResultProps, State> {
  state: State = {
    parentCategory: null,
    category: null,
    fetchNodeTimeout: null,
    lastFetchedOsmId: null,
    wheelmapFeature: null,
  };


  componentDidMount() {
    this.fetchCategory();
    this.startFetchNodeTimeout();
  }


  componentWillReceiveProps(nextProps: SearchResultProps) {
    this.fetchCategory(nextProps);
    this.startFetchNodeTimeout();
  }


  componentWillUnmount() {
    this.stopFetchNodeTimeout();
  }


  startFetchNodeTimeout() {
    this.stopFetchNodeTimeout();
    this.setState({
      fetchNodeTimeout: setTimeout(() => {
        this.fetchWheelmapNode();
        this.setState({ fetchNodeTimeout: null });
      }, 1000),
    });
  }


  stopFetchNodeTimeout() {
    if (this.state.fetchNodeTimeout) {
      clearTimeout(this.state.fetchNodeTimeout);
      this.setState({ fetchNodeTimeout: null });
    }
  }

  props: SearchResultProps;


  fetchCategory(props: SearchResultProps = this.props) {
    const feature = props.result;
    const properties = feature && feature.properties;
    const categoryId = [properties.osm_key, properties.osm_value].filter(Boolean).join('=');
    this.fetchCategoryId(categoryId);
  }


  fetchCategoryId(categoryId: string) {
    if (this.state.category) return;
    Categories.getCategory(categoryId).then(
      (category) => { this.setState({ category }); return category; },
      () => this.setState({ category: null }),
    )
    .then(category => category && Categories.getCategory(category.parentIds[0]))
    .then(parentCategory => this.setState({ parentCategory }));
  }


  fetchWheelmapNode(props: SearchResultProps = this.props) {
    const searchResultProperties = props.result.properties;
    const osmId: ?number = searchResultProperties ? searchResultProperties.osm_id : null;
    this.setState({
      lastFetchedOsmId: osmId,
    });
    if (!osmId) {
      return;
    }
    wheelmapFeatureCache.getFeature(osmId).then((feature) => {
      if (!feature) return;
      if (feature.properties.id !== this.state.lastFetchedOsmId) return;
      this.setState({ wheelmapFeature: feature });
      const properties = feature.properties;
      if (!properties) return;
      const categoryId = (properties.type && properties.type.identifier) || properties.category;
      if (!categoryId) return;
      this.fetchCategoryId(categoryId);
    }, (errorOrResponse) => {
      if (errorOrResponse instanceof Error) console.log(errorOrResponse);
    });
  }


  getHref(): ?string {
    const wheelmapFeature = this.state.wheelmapFeature;
    if (wheelmapFeature && wheelmapFeature.properties && wheelmapFeature.properties.id) {
      return `/beta/nodes/${wheelmapFeature.properties.id}`;
    }
    const result = this.props.result;
    const geometry = result ? result.geometry : null;
    if (!(geometry instanceof Object)) return null;
    const coordinates = geometry ? geometry.coordinates : null;
    if (!(coordinates instanceof Array)) return null;
    return `#/?lat=${coordinates[1]}&lon=${coordinates[0]}`;
  }


  render() {
    const result = this.props.result;
    const properties = result && result.properties;
    const placeName = properties ? properties.name : 'Unnamed';
    const address = properties && getAddressString({
      country: properties.country,
      street: properties.street,
      housenumber: properties.housenumber,
      postcode: properties.postcode,
      city: properties.city,
    });
    const categoryOrParentCategory = this.state.category || this.state.parentCategory;
    const wheelmapFeature = this.state.wheelmapFeature;
    const wheelmapFeatureProperties = wheelmapFeature ? wheelmapFeature.properties : null;
    const href = this.getHref();
    const isHashLink = !Boolean(wheelmapFeature);
    return (<li>
      <HashLinkOrRouterLink to={href} className="link-button" isHashLink={isHashLink}>
        <PlaceName>
          {categoryOrParentCategory ?
            <Icon properties={wheelmapFeatureProperties} category={categoryOrParentCategory} />
            : null
          }
          {placeName}
        </PlaceName>
        {address ? <address>{address}</address> : null}
      </HashLinkOrRouterLink>
    </li>);
  }
}


type Props = {
  searchResults: SearchResultCollection,
  className: string,
};


function SearchResults(props: Props) {
  const id = result => result && result.properties && result.properties.osm_id;
  const features = uniq(props.searchResults.features, id);
  return (<ul className={`search-results ${props.className}`}>
    {features.map(result => <SearchResult result={result} key={id(result)} />)}
  </ul>);
}


const StyledSearchResults = styled(SearchResults)`
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    padding: 0;
  }

  li > a {
    color: rgba(0, 0, 0, 0.8);

    &:hover {
      color: rgba(0, 0, 0, 0.8);
    }
  }
`;


export default StyledSearchResults;
