// @flow

import { t } from 'ttag';
import * as React from 'react';

import config from '../../lib/config';
import Categories from '../../lib/Categories';
import getAddressString from '../../lib/getAddressString';
import type { Category } from '../../lib/Categories';
import type { RouterHistory } from 'react-router-dom';
import type { WheelmapFeature } from '../../lib/Feature';
import { isWheelchairAccessible } from '../../lib/Feature';
import { normalizeCoordinates } from '../../lib/normalizeCoordinates';
import { wheelmapFeatureCache } from '../../lib/cache/WheelmapFeatureCache';
import type { SearchResultFeature } from '../../lib/searchPlaces';

import Icon from '../Icon';
import Address from '../NodeToolbar/Address';
import PlaceName from '../PlaceName';
import ToolbarLink from '../ToolbarLink';

type Props = {
  result: SearchResultFeature,
  history: RouterHistory,
  onSelect: () => void,
  hidden: boolean,
  onSelectCoordinate: (coords: { lat: number, lon: number, zoom: number }) => void,
};

type State = {
  category: ?Category,
  parentCategory: ?Category,
  fetchNodeTimeout: ?number,
  lastFetchedOsmId: ?number,
  wheelmapFeature: ?WheelmapFeature,
};

function getZoomLevel(hasWheelmapId: boolean, category: ?Category) {
  // is a wheelmap place or a known POI category
  if (hasWheelmapId || category) {
    return 18;
  }

  return 16;
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
  onClick: (event: UIEvent) => void,
  to: ?string,
};

function HashLinkOrRouterLink(props: HashLinkOrRouterLinkProps) {
  if (props.isHashLink) {
    return (
      <a
        onClick={props.onClick}
        href={props.to}
        className={props.className}
        tabIndex={props.hidden ? -1 : 0}
      >
        {props.children}
      </a>
    );
  }

  return (
    <ToolbarLink
      onClick={props.onClick}
      to={props.to}
      className={props.className}
      tabIndex={props.hidden ? -1 : 0}
    >
      {props.children}
    </ToolbarLink>
  );
}

export default class SearchResult extends React.Component<Props, State> {
  props: Props;

  state: State = {
    parentCategory: null,
    category: null,
    fetchNodeTimeout: null,
    lastFetchedOsmId: null,
    wheelmapFeature: null,
  };

  root: ?React.ElementRef<'a'> = null;

  componentDidMount() {
    this.startFetchNodeTimeout();
  }

  componentDidUpdate() {
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

  fetchWheelmapNode(props: Props = this.props) {
    if (!config.wheelmapApiKey) {
      return;
    }

    const { properties: searchResultProperties } = props.result;
    let osmId: ?number = searchResultProperties ? searchResultProperties.osm_id : null;

    if (!osmId) {
      return;
    }

    // Only nodes with type 'N' and 'W' can be on Wheelmap.
    if (searchResultProperties.osm_type !== 'N' && searchResultProperties.osm_type !== 'W') {
      return;
    }

    // Wheelmap stores features with osm type 'W' with negativ ids.
    // @TODO Do this in some kind of util function. (Maybe wheelmap feature cache?)
    if (searchResultProperties.osm_type === 'W') {
      osmId = -osmId;
    }

    // Store last fetched osm id to make sure the response fits to the current request.
    this.setState({
      lastFetchedOsmId: osmId,
    });

    wheelmapFeatureCache.getFeature(String(osmId)).then(
      feature => {
        if (feature == null || feature.properties == null) {
          return;
        }

        if (feature.properties.id !== this.state.lastFetchedOsmId) {
          return;
        }

        this.setState({ wheelmapFeature: feature });
      },
      errorOrResponse => {
        if (errorOrResponse instanceof Error) console.log(errorOrResponse);
      }
    );
  }

  getFeature() {
    return this.state.wheelmapFeature || this.props.result;
  }

  getCategory() {
    return this.state.category || this.state.parentCategory;
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
    const zoom = getZoomLevel(hasWheelmapId, this.getCategory());
    const search = coordinates ? `zoom=${zoom}&lat=${coordinates[1]}&lon=${coordinates[0]}` : '';
    return this.props.history.createHref({ pathname, search });
  }

  focus() {
    if (this.root) {
      this.root.focus();
    }
  }

  render() {
    const result = this.props.result;
    const properties = result && result.properties;
    // translator: Place name shown in search results for places with unknown name / category.
    const placeName = properties ? properties.name : t`Unnamed`;
    const address =
      properties &&
      getAddressString({
        country: properties.country,
        street: properties.street,
        housenumber: properties.housenumber,
        postcode: properties.postcode,
        city: properties.city,
      });
    const category = properties && (properties.osm_value || properties.osm_key);
    const wheelmapFeature = this.state.wheelmapFeature;
    const wheelmapFeatureProperties = wheelmapFeature ? wheelmapFeature.properties : null;
    const accessibility =
      wheelmapFeatureProperties && isWheelchairAccessible(wheelmapFeatureProperties);
    const href = this.getHref();
    const hasWheelmapId = Boolean(wheelmapFeature);
    const isHashLink = false;

    return (
      <li
        ref={r => {
          this.root = r;
        }}
        className={`osm-category-${result.properties.osm_key || 'unknown'}-${result.properties
          .osm_value || 'unknown'}`}
      >
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
                zoom: getZoomLevel(hasWheelmapId, category),
              });
            }
            this.props.onSelect();
          }}
        >
          <PlaceName>
            {category ? (
              <Icon
                accessibility={accessibility || null}
                category={category}
                size="medium"
                centered
                ariaHidden={true}
              />
            ) : null}
            {placeName}
          </PlaceName>
          {address ? <Address role="none">{address}</Address> : null}
        </HashLinkOrRouterLink>
      </li>
    );
  }
}
