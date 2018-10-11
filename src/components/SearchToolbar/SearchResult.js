// @flow

import { t } from 'ttag';
import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';

import getAddressString from '../../lib/getAddressString';
import type { Category } from '../../lib/Categories';
import type { WheelmapFeature } from '../../lib/Feature';
import { isWheelchairAccessible } from '../../lib/Feature';
import type { SearchResultFeature } from '../../lib/searchPlaces';

import Icon from '../Icon';
import Address from '../NodeToolbar/Address';
import PlaceName from '../PlaceName';

type Props = {
  feature: SearchResultFeature,
  history: RouterHistory,
  onClick: (feature: SearchResultFeature, wheelmapFeature: ?WheelmapFeature) => void,
  hidden: boolean,
  wheelmapFeature: ?WheelmapFeature | Promise<?WheelmapFeature>,
};

type State = {
  category: ?Category,
  parentCategory: ?Category,
  fetchNodeTimeout: ?number,
  lastFetchedOsmId: ?number,
  wheelmapFeature: ?WheelmapFeature,
  wheelmapFeaturePromise: ?Promise<?WheelmapFeature>,
};

/*function getZoomLevel(hasWheelmapId: boolean, category: ?Category) {
  // is a wheelmap place or a known POI category
  if (hasWheelmapId || category) {
    return 18;
  }

  return 16;
}*/

export default class SearchResult extends React.Component<Props, State> {
  props: Props;

  state: State = {
    parentCategory: null,
    category: null,
    fetchNodeTimeout: null,
    lastFetchedOsmId: null,
    wheelmapFeature: null,
    wheelmapFeaturePromise: null,
  };

  root: ?React.ElementRef<'a'> = null;

  static getDerivedStateFromProps(props: Props, state: State): $Shape<State> {
    const { wheelmapFeature } = props;

    // Do not update anything when the wheelmap feature promise is already in use.
    if (wheelmapFeature === state.wheelmapFeaturePromise) {
      return null;
    }

    if (wheelmapFeature instanceof Promise) {
      return { wheelmapFeature: null, wheelmapFeaturePromise: wheelmapFeature };
    }

    return { wheelmapFeature: wheelmapFeature, wheelmapFeaturePromise: null };
  }

  componentDidMount() {
    const { wheelmapFeaturePromise } = this.state;

    if (wheelmapFeaturePromise) {
      wheelmapFeaturePromise.then(wheelmapFeature =>
        this.handleWheelmapFeatureFetched(wheelmapFeaturePromise, wheelmapFeature)
      );
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { wheelmapFeaturePromise } = this.state;

    if (wheelmapFeaturePromise && prevState.wheelmapFeaturePromise !== wheelmapFeaturePromise) {
      wheelmapFeaturePromise.then(wheelmapFeature =>
        this.handleWheelmapFeatureFetched(wheelmapFeaturePromise, wheelmapFeature)
      );
    }
  }

  handleWheelmapFeatureFetched = (
    prevWheelmapFeaturePromise: Promise<?WheelmapFeature>,
    wheelmapFeature: ?WheelmapFeature
  ) => {
    if (this.state.wheelmapFeaturePromise !== prevWheelmapFeaturePromise) {
      return;
    }

    this.setState({
      wheelmapFeature,
    });
  };

  /*getFeature() {
    return this.state.wheelmapFeature || this.props.feature;
  }*/

  /*getCategory() {
    return this.state.category || this.state.parentCategory;
  }*/

  /*getCoordinates(): ?[number, number] {
    const feature = this.getFeature();
    return normalizedCoordinatesForFeature(feature);
  }*/

  /*getHref(): ?string {
    const feature = this.getFeature();
    const coordinates = normalizedCoordinatesForFeature(feature);
    const wheelmapId = feature && feature.properties && feature.properties.id;
    const pathname = wheelmapId ? `/beta/nodes/${feature.properties.id}` : '';
    const hasWheelmapId = Boolean(wheelmapId);
    const zoom = getZoomLevel(hasWheelmapId, this.getCategory());
    const search = coordinates ? `zoom=${zoom}&lat=${coordinates[1]}&lon=${coordinates[0]}` : '';

    return this.props.history.createHref({ pathname, search });
  }*/

  focus() {
    if (this.root) {
      this.root.focus();
    }
  }

  render() {
    const { feature } = this.props;
    const { wheelmapFeature } = this.state;
    const properties = feature && feature.properties;
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
    const wheelmapFeatureProperties = wheelmapFeature ? wheelmapFeature.properties : null;
    const accessibility =
      wheelmapFeatureProperties && isWheelchairAccessible(wheelmapFeatureProperties);

    return (
      <li
        ref={r => {
          this.root = r;
        }}
        className={`osm-category-${feature.properties.osm_key || 'unknown'}-${feature.properties
          .osm_value || 'unknown'}`}
      >
        <button
          onClick={() => {
            this.props.onClick(feature, wheelmapFeature);
            /*const coordinates = this.getCoordinates();
            if (coordinates) {
              this.props.onSelectCoordinate({
                lat: coordinates[1],
                lon: coordinates[0],
                zoom: getZoomLevel(hasWheelmapId, category),
              });
            }
            this.props.onSelect();*/
          }}
          className="link-button"
          tabIndex={this.props.hidden ? -1 : 0}
        >
          <PlaceName>
            {wheelmapFeature && category ? (
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
        </button>
      </li>
    );
  }
}
