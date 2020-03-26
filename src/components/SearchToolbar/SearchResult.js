// @flow

import { t } from 'ttag';
import * as React from 'react';

import getAddressString from '../../lib/getAddressString';
import Categories, {
  getCategoryId,
  type Category,
  type CategoryLookupTables,
} from '../../lib/Categories';
import { isWheelchairAccessible, type WheelmapFeature } from '../../lib/Feature';
import type { SearchResultFeature } from '../../lib/searchPlaces';

import Icon from '../Icon';
import Address from '../NodeToolbar/Address';
import PlaceName from '../PlaceName';
import styled from 'styled-components';
import colors from '../../lib/colors';

type Props = {
  className?: string,
  feature: SearchResultFeature,
  categories: CategoryLookupTables,
  onClick: (feature: SearchResultFeature, wheelmapFeature: ?WheelmapFeature) => void,
  hidden: boolean,
  wheelmapFeature: ?WheelmapFeature | Promise<?WheelmapFeature>,
};

type State = {
  category: ?Category,
  parentCategory: ?Category,
  wheelmapFeature: ?WheelmapFeature,
  wheelmapFeaturePromise: ?Promise<?WheelmapFeature>,
};

class SearchResult extends React.Component<Props, State> {
  props: Props;

  state: State = {
    category: null,
    parentCategory: null,
    wheelmapFeature: null,
    wheelmapFeaturePromise: null,
  };

  root: ?React.ElementRef<'li'> = null;

  static getDerivedStateFromProps(props: Props, state: State): $Shape<State> {
    const { categories, feature, wheelmapFeature } = props;

    // Do not update anything when the wheelmap feature promise is already in use.
    if (wheelmapFeature != null && wheelmapFeature === state.wheelmapFeaturePromise) {
      return null;
    }

    if (wheelmapFeature instanceof Promise) {
      const rawCategoryLists = Categories.getCategoriesForFeature(categories, feature);
      return {
        wheelmapFeature: null,
        wheelmapFeaturePromise: wheelmapFeature,
        ...rawCategoryLists,
      };
    }

    const rawCategoryLists = Categories.getCategoriesForFeature(
      categories,
      wheelmapFeature || feature
    );
    return {
      wheelmapFeature: wheelmapFeature,
      wheelmapFeaturePromise: null,
      ...rawCategoryLists,
    };
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

    const { categories, feature } = this.props;
    const wheelmapCategoryData = Categories.getCategoriesForFeature(
      categories,
      wheelmapFeature || feature
    );
    this.setState({
      wheelmapFeature,
      category: wheelmapCategoryData.category || this.state.category,
      parentCategory: wheelmapCategoryData.parentCategory || this.state.parentCategory,
    });
  };

  focus() {
    if (this.root) {
      this.root.focus();
    }
  }

  render() {
    const { feature, className } = this.props;
    const { wheelmapFeature, category, parentCategory } = this.state;
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

    const shownCategory = category || parentCategory;
    const shownCategoryId = shownCategory && getCategoryId(shownCategory);

    const wheelmapFeatureProperties = wheelmapFeature ? wheelmapFeature.properties : null;
    const accessibility =
      wheelmapFeatureProperties && isWheelchairAccessible(wheelmapFeatureProperties);

    return (
      <li
        ref={r => {
          this.root = r;
        }}
        className={`${className || ''} osm-category-${feature.properties.osm_key ||
          'unknown'}-${feature.properties.osm_value || 'unknown'}`}
      >
        <button
          onClick={() => {
            this.props.onClick(feature, wheelmapFeature);
          }}
          tabIndex={this.props.hidden ? -1 : 0}
        >
          <PlaceName>
            {shownCategoryId ? (
              <Icon
                accessibility={accessibility || null}
                category={shownCategoryId}
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

export default styled(SearchResult)`
  padding: 0;

  > button {
    display: block;
    font-size: 16px;
    padding: 10px;
    text-decoration: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
    color: ${colors.linkColor};
    text-align: left;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.8) !important;
    display: block;
    width: 100%;

    @media (hover), (-moz-touch-enabled: 0) {
      &:hover {
        background-color: ${colors.linkBackgroundColorTransparent};
      }
    }

    &:focus&:not(.primary-button) {
      background-color: ${colors.linkBackgroundColorTransparent};
    }

    &:disabled {
      opacity: 0.15;
    }

    &:hover {
      color: rgba(0, 0, 0, 0.8) !important;
    }

    address {
      font-size: 16px !important;
      color: rgba(0, 0, 0, 0.6);
    }
  }

  &.no-result {
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    padding: 20px;
  }

  &.error-result {
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    padding: 20px;
    font-weight: 400;
    background-color: ${colors.negativeBackgroundColorTransparent};
  }

  &.osm-category-place-borough,
  &.osm-category-place-suburb,
  &.osm-category-place-village,
  &.osm-category-place-hamlet,
  &.osm-category-place-town,
  &.osm-category-place-city,
  &.osm-category-place-county,
  &.osm-category-place-state,
  &.osm-category-place-country,
  &.osm-category-boundary-administrative {
    h1 {
      font-weight: 600;
    }
  }
`;
