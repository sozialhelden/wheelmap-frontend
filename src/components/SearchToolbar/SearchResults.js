// @flow

import { t } from 'c-3po';
import styled from 'styled-components';
import uniq from 'lodash/uniq';
import * as React from 'react';
import config from '../../lib/config';
import Categories from '../../lib/Categories';
import type { Category } from '../../lib/Categories';
import getAddressString from '../../lib/getAddressString';
import { wheelmapFeatureCache } from '../../lib/cache/WheelmapFeatureCache';
import type { WheelmapFeature } from '../../lib/Feature';
import { isWheelchairAccessible } from '../../lib/Feature';
import ToolbarLink from '../ToolbarLink';
import PlaceName from '../PlaceName';
import Icon from '../Icon';
import { normalizeCoordinates } from '../../lib/normalizeCoordinates';

import type { SearchResultFeature, SearchResultCollection } from '../../lib/searchPlaces';


type SearchResultProps = {
  result: SearchResultFeature,
  history: RouterHistory,
  onSelect: (() => void),
  hidden: boolean,
  onSelectCoordinate: ((coords: { lat: number, lon: number, zoom: number }) => void),
};


type State = {
  category: ?Category,
  parentCategory: ?Category,
  fetchNodeTimeout: ?number,
  lastFetchedOsmId: ?number,
  wheelmapFeature: ?WheelmapFeature
};


function getZoomLevel(hasWheelmapId: boolean) {
  return hasWheelmapId ? 18 : 16;
}


function normalizedCoordinatesForFeature(feature): ?[number, number] {
  const geometry = feature ? feature.geometry : null;
  if (!(geometry instanceof Object)) return null;
  const coordinates = geometry ? geometry.coordinates : null;
  if (!(coordinates instanceof Array) || coordinates.length !== 2) return null;
  return normalizeCoordinates(coordinates);
}


type HashLinkOrRouterLinkProps = {
  isHashLink: boolean,
  className: string,
  children: React.Node,
  onClick: ((event: UIEvent) => void),
  to: ?string,
};

function HashLinkOrRouterLink(props: HashLinkOrRouterLinkProps) {
  if (props.isHashLink) {
    return (<a
      onClick={props.onClick}
      href={props.to}
      className={props.className}
      tabIndex={props.hidden ? -1 : 0}
    >
      {props.children}
    </a>);
  }

  return (<ToolbarLink
    onClick={props.onClick}
    to={props.to}
    className={props.className}
    tabIndex={props.hidden ? -1 : 0}
  >
    {props.children}
  </ToolbarLink>);
}


class SearchResult extends React.Component<SearchResultProps, State> {
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
    if (!config.wheelmapApiKey) return;

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

    wheelmapFeatureCache.getFeature(String(osmId)).then((feature) => {
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

  getHref(): ?string {
    const feature = this.getFeature();
    const coordinates = normalizedCoordinatesForFeature(feature);
    const wheelmapId = feature && feature.properties && feature.properties.id;
    const pathname = wheelmapId ? `/beta/nodes/${feature.properties.id}` : '';
    const hasWheelmapId = Boolean(wheelmapId);
    const zoom = getZoomLevel(hasWheelmapId);
    const search = coordinates ? `zoom=${zoom}&lat=${coordinates[1]}&lon=${coordinates[0]}` : '';
    return this.props.history.createHref({ pathname, search });
  }


  render() {
    const result = this.props.result;
    const properties = result && result.properties;
    // translator: Place name shown in search results for places with unknown name / category.
    const placeName = properties ? properties.name : t`Unnamed`;
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
    const accessibility = isWheelchairAccessible(wheelmapFeatureProperties);
    const href = this.getHref();
    const hasWheelmapId = Boolean(wheelmapFeature);
    const isHashLink = false;


    return (<li className={`osm-category-${result.properties.osm_key || 'unknown'}-${result.properties.osm_value || 'unknown'}`}>
      <HashLinkOrRouterLink
        to={href}
        className="link-button"
        hidden={this.props.hidden}
        isHashLink={isHashLink}
        onClick={() => {
          const coordinates = this.getCoordinates();
          if (coordinates) {
            this.props.onSelectCoordinate({
              lat: coordinates[1],
              lon: coordinates[0],
              zoom: getZoomLevel(hasWheelmapId),
            });
          }
          this.props.onSelect();
        }}
      >
        <PlaceName>
          {categoryOrParentCategory ?
            <Icon accessibility={wheelmapFeature ? accessibility : null} properties={wheelmapFeatureProperties} category={categoryOrParentCategory} size='medium' ariaHidden={true}/>
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
  history: RouterHistory,
  className: string,
  hidden: ?boolean,
  onSelect: (() => void),
  onSelectCoordinate: ((coords: { lat: number, lon: number, zoom: number }) => void),
};


function SearchResults(props: Props) {
  const id = result => result && result.properties && result.properties.osm_id;
  const features = uniq(props.searchResults.features, id);
  return (<ul className={`search-results ${props.className}`} aria-label={t`Search results`}>
    {features.map(result => (<SearchResult
      result={result}
      key={id(result)}
      onSelect={props.onSelect}
      onSelectCoordinate={props.onSelectCoordinate}
      hidden={!!props.hidden}
      history={props.history}
    />))}
  </ul>);
}


const StyledSearchResults = styled(SearchResults)`
  list-style-type: none;
  margin: 0;

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

  .osm-category-place-borough,
  .osm-category-place-suburb,
  .osm-category-place-village,
  .osm-category-place-hamlet,
  .osm-category-place-town,
  .osm-category-place-city,
  .osm-category-place-county,
  .osm-category-place-state,
  .osm-category-place-country,
  .osm-category-boundary-administrative {
    h1 {
      font-weight: 600;
    }
  }
`;


export default StyledSearchResults;
