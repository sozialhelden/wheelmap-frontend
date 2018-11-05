// @flow

import get from 'lodash/get';
import * as React from 'react';
import styled from 'styled-components';
import type { Feature } from '../../lib/Feature';
import { isWheelchairAccessible, placeNameFor } from '../../lib/Feature';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';

import { categoryNameFor, type CategoryLookupTables } from '../../lib/Categories';
import Icon from '../Icon';
import PlaceName from '../PlaceName';
import BreadCrumbs from './BreadCrumbs';
import type { Category } from '../../lib/Categories';
import { equipmentInfoNameFor, isEquipmentAccessible } from '../../lib/EquipmentInfo';
import colors from '../../lib/colors';

const StyledNodeHeader = styled.header`
  color: rgba(0, 0, 0, 0.8);
  position: sticky;
  top: 0px;
  z-index: 1;
  background-color: ${colors.colorizedBackgroundColor};
  margin: 0 -1rem;
  padding: 0.5rem 1rem 0.1rem;
  transition: box-shadow 0.3s ease-out;
  box-shadow: ${props =>
    props.hasShadow ? '0 0 33px rgba(0, 0, 0, 0.1)' : '0 0 33px rgba(0, 0, 0, 0)'};
`;

const StyledBreadCrumbs = styled(BreadCrumbs)`
  margin-left: ${props => (props.hasPadding ? '42' : '0')}px;
  margin-bottom: 0.5rem;
`;

type Props = {
  feature: ?Feature,
  equipmentInfoId: ?string,
  equipmentInfo: ?EquipmentInfo,
  category: ?Category,
  categories: CategoryLookupTables,
  parentCategory: ?Category,
  hasIcon: boolean,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
  hasShadow: boolean,
};

export default class NodeHeader extends React.Component<Props> {
  onClickCurrentMarkerIcon = () => {
    const feature = this.props.feature;
    if (feature && this.props.onClickCurrentMarkerIcon) {
      this.props.onClickCurrentMarkerIcon(feature);
    }
  };

  render() {
    const isEquipment = !!this.props.equipmentInfoId;
    const feature = this.props.feature;
    if (!feature) return null;
    const properties = feature.properties;
    if (!properties) return null;

    const { category, parentCategory } = this.props;
    const shownCategory = category || parentCategory;
    let categoryName = shownCategory && categoryNameFor(shownCategory);
    const shownCategoryId = shownCategory && shownCategory._id;

    let placeName = placeNameFor(properties, category || parentCategory);
    let ariaLabel = placeName ? `${placeName}, ${categoryName}` : categoryName;
    if (isEquipment) {
      placeName = equipmentInfoNameFor(get(this.props, ['equipmentInfo', 'properties']), false);
      ariaLabel = equipmentInfoNameFor(get(this.props, ['equipmentInfo', 'properties']), true);
    }

    const accessibility = isEquipment
      ? isEquipmentAccessible(get(this.props, ['equipmentInfo', 'properties']))
      : isWheelchairAccessible(properties);
    const hasLongName = placeName && placeName.length > 50;
    const icon = (
      <Icon
        accessibility={accessibility}
        category={categoryName ? shownCategoryId : 'undefined'}
        size="medium"
        ariaHidden={true}
        centered
        onClick={this.onClickCurrentMarkerIcon}
      />
    );
    const placeNameElement = (
      <PlaceName isSmall={hasLongName} aria-label={ariaLabel}>
        {this.props.hasIcon && icon}
        {placeName}
      </PlaceName>
    );

    const categoryElement = properties.name ? (
      <StyledBreadCrumbs
        properties={properties}
        category={this.props.category}
        categories={this.props.categories}
        parentCategory={this.props.parentCategory}
        hasPadding={this.props.hasIcon}
      />
    ) : null;

    return (
      <StyledNodeHeader hasShadow={this.props.hasShadow}>
        {placeNameElement}
        {categoryElement}
      </StyledNodeHeader>
    );
  }
}
