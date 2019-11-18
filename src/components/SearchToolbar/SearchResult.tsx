import { t } from 'ttag';
import * as React from 'react';

import getAddressString from '../../lib/getAddressString';
import Categories, {
  getCategoryId,
  Category,
  CategoryLookupTables,
} from '../../lib/Categories';
import { isWheelchairAccessible, WheelmapFeature } from '../../lib/Feature';
import { SearchResultFeature } from '../../lib/searchPlaces';

import Icon from '../Icon';
import Address from '../NodeToolbar/Address';
import PlaceName from '../PlaceName';

type Props = {
  feature: SearchResultFeature,
  categories: CategoryLookupTables,
  onClick: (feature: SearchResultFeature, wheelmapFeature: WheelmapFeature | null) => void,
  hidden: boolean,
  wheelmapFeature: WheelmapFeature | Promise<WheelmapFeature | null> | null,
};

type State = {
  category: Category | null,
  parentCategory: Category | null,
  wheelmapFeature: WheelmapFeature | null,
  wheelmapFeaturePromise: Promise<WheelmapFeature | null> | null,
};

export default class SearchResult extends React.Component<Props, State> {
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
    if (wheelmapFeature === state.wheelmapFeaturePromise) {
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

    const wheelmapCategoryData = Categories.getCategoriesForFeature(categories, feature);
    return {
      wheelmapFeature: wheelmapFeature,
      wheelmapFeaturePromise: null,
      ...wheelmapCategoryData,
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
    if (this.root.current) {
      this.root.current.focus();
    }
  }

  render() {
    const { feature } = this.props;
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
        ref={this.root}
        className={`osm-category-${feature.properties.osm_key || 'unknown'}-${feature.properties
          .osm_value || 'unknown'}`}
      >
        <button
          onClick={() => {
            this.props.onClick(feature, wheelmapFeature);
          }}
          className="link-button"
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
