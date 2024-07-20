import classNames from 'classnames';
import * as React from 'react';
import { t } from 'ttag';

import Categories, { Category, CategoryLookupTables, getCategoryId } from '../../lib/Categories';
import { AccessibilityCloudFeature, WheelmapFeature, isWheelchairAccessible } from '../../lib/Feature';
import getAddressString from '../../lib/getAddressString';
import { SearchResultFeature } from '../../lib/searchPlaces';

import styled from 'styled-components';
import { PotentialPromise } from '../../app/PlaceDetailsProps';
import colors from '../../lib/colors';
import CategoryIcon from '../Icon';
import Address from '../NodeToolbar/Address';
import { PlaceNameHeader } from '../PlaceName';

type Props = {
  className?: string,
  feature: SearchResultFeature,
  categories: CategoryLookupTables,
  onClick: (feature: SearchResultFeature, wheelmapFeature: WheelmapFeature | null, accessibilityCloudFeature: AccessibilityCloudFeature | null) => void,
  hidden: boolean,
  wheelmapFeature: PotentialPromise<WheelmapFeature | null>,
  accessibilityCloudFeatures?: PotentialPromise<AccessibilityCloudFeature[]>,
};

type State = {
  category: Category | null,
  parentCategory: Category | null,
  wheelmapFeature: WheelmapFeature | null,
  wheelmapFeaturePromise: Promise<WheelmapFeature | null> | null,
};

export class UnstyledSearchResult extends React.Component<Props, State> {
  props: Props;

  state: State = {
    category: null,
    parentCategory: null,
    wheelmapFeature: null,
    wheelmapFeaturePromise: null,
  };

  root = React.createRef<HTMLLIElement>();

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> {
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
    prevWheelmapFeaturePromise: Promise<WheelmapFeature | null>,
    wheelmapFeature: WheelmapFeature | null
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
    this.root.current?.focus();
  }

  render() {
    const { feature, accessibilityCloudFeatures } = this.props;
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

    const className = classNames(
      this.props.className,
      'search-result',
      wheelmapFeatureProperties && 'is-on-wheelmap',
      `osm-category-${feature.properties.osm_key || 'unknown'}-${feature.properties.osm_value ||
        'unknown'}`
    );
    return (
      <li ref={this.root} className={className}>
        <button
          onClick={async () => {
            const resolvedAccessibilityCloudFeatures = accessibilityCloudFeatures instanceof Promise ? await accessibilityCloudFeatures : accessibilityCloudFeatures;
            this.props.onClick(feature, wheelmapFeature, resolvedAccessibilityCloudFeatures?.[0]);
          }}
          tabIndex={this.props.hidden ? -1 : 0}
        >
          <PlaceNameHeader className={wheelmapFeatureProperties ? 'is-on-wheelmap' : undefined}>
            {shownCategoryId ? (
              <CategoryIcon
                accessibility={accessibility || null}
                category={shownCategoryId}
                size="medium"
                centered
                ariaHidden={true}
              />
            ) : null}
            {placeName}
          </PlaceNameHeader>
          {address ? <Address role="none">{address}</Address> : null}
        </button>
      </li>
    );
  }
}

export default styled(UnstyledSearchResult)`
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
