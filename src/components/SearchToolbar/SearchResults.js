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
import { normalizeCoordinates } from '../../lib/normalizeCoordinates';

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
  onSelect: (() => void),
  onSelectCoordinate: ((coords: { lat: number, lon: number, zoom: number }) => void),
};

type State = {
  category: ?Category,
  parentCategory: ?Category,
  fetchNodeTimeout: ?number,
  lastFetchedOsmId: ?number,
  wheelmapFeature: ?WheelmapFeature
};


function normalizedCoordinatesForFeature(feature): ?[number, number] {
  const geometry = feature ? feature.geometry : null;
  if (!(geometry instanceof Object)) return null;
  const coordinates = geometry ? geometry.coordinates : null;
  if (!(coordinates instanceof Array) || coordinates.length !== 2) return null;
  return normalizeCoordinates(coordinates);
}


function HashLinkOrRouterLink(props) {
  if (props.isHashLink) {
    return <a onClick={props.onClick} href={props.to} className={props.className}>{props.children}</a>;
  }
  return <ToolbarLink onClick={props.onClick} to={props.to} className={props.className}>{props.children}</ToolbarLink>;
}


class SearchResult extends Component<SearchResultProps, State> {
  props: SearchResultProps;

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

    // Only nodes with type 'N' can be on Wheelmap.
    if (searchResultProperties.osm_type !== 'N') return;

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

  getFeature() {
    return this.state.wheelmapFeature || this.props.result;
  }


  getCoordinates(): ?[number, number] {
    const feature = this.getFeature();
    return normalizedCoordinatesForFeature(feature);
  }

  getZoomLevel(hasWheelmapId: boolean) {
    return hasWheelmapId ? 18 : 16;
  }

  getHref(): ?string {
    const feature = this.getFeature();
    const coordinates = normalizedCoordinatesForFeature(feature);
    const wheelmapId = feature && feature.properties && feature.properties.id;
    const prefix = wheelmapId ? `/beta/nodes/${feature.properties.id}` : '';
    const hasWheelmapId = Boolean(wheelmapId);
    const zoom = this.getZoomLevel(hasWheelmapId);
    const suffix = coordinates ? `#?zoom=${zoom}&lat=${coordinates[1]}&lon=${coordinates[0]}` : '';
    return `${prefix}${suffix}`;
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
    const hasWheelmapId = Boolean(wheelmapFeature);
    const isHashLink = !hasWheelmapId;
    return (<li>
      <HashLinkOrRouterLink
        to={href}
        className="link-button"
        isHashLink={isHashLink}
        onClick={(event: Event) => {
          const coordinates = this.getCoordinates();
          if (coordinates) {
            this.props.onSelectCoordinate({ lat: coordinates[1], lon: coordinates[0], zoom: this.getZoomLevel(hasWheelmapId) });
          }
          this.props.onSelect();
        }}
      >
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
  onSelect: (() => void),
  onSelectCoordinate: ((coords: { lat: number, lon: number, zoom: number }) => void),
};


function SearchResults(props: Props) {
  const id = result => result && result.properties && result.properties.osm_id;
  const features = uniq(props.searchResults.features, id);
  return (<ul className={`search-results ${props.className}`}>
    {features.map(result => <SearchResult
      result={result}
      key={id(result)}
      onSelect={props.onSelect}
      onSelectCoordinate={props.onSelectCoordinate}
    />)}
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
    overflow: hidden;
    color: rgba(0, 0, 0, 0.8) !important;

    &:hover {
      color: rgba(0, 0, 0, 0.8) !important;
    }

    address {
      font-size: 16px !important;
    }
  }
`;


export default StyledSearchResults;
