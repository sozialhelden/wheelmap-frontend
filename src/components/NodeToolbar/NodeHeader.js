// @flow

import get from 'lodash/get';
import * as React from 'react';
import styled from 'styled-components';
import type {
  Feature,
  NodeProperties,
  WheelmapProperties,
  AccessibilityCloudProperties,
} from '../../lib/Feature';
import { isWheelchairAccessible, placeNameFor } from '../../lib/Feature';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';

import { categoryNameFor } from '../../lib/Categories';
import Icon from '../Icon';
import Address from './Address';
import PlaceName from '../PlaceName';
import BreadCrumbs from './BreadCrumbs';
import type { Category } from '../../lib/Categories';
import getAddressString from '../../lib/getAddressString';
import { equipmentInfoNameFor, isEquipmentAccessible } from '../../lib/EquipmentInfo';


const StyledNodeHeader = styled.header`
  color: rgba(0, 0, 0, 0.8);

  a.place-website-url,
  a.phone-number.link-button,
  address {
    margin-left: 42px;
  }
   
  a.place-website-url {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-bottom: 0;
  }

  a.place-website-url, a.phone-number {
    padding-left: 0;
  }

  
  .description {
    word-break: break-word;
  }
`;


const StyledBreadCrumbs = styled(BreadCrumbs)`
  margin-left: 42px;
  margin-bottom: 0.5rem;
`;


type Props = {
  feature: ?Feature,
  equipmentInfoId: ?string,
  equipmentInfo: ?EquipmentInfo,
  category: ?Category,
  parentCategory: ?Category,
  showOnlyBasics: boolean,
  onClickCurrentMarkerIcon?: ((Feature) => void),
};


export default class NodeHeader extends React.Component<Props, void> {
  static getAddressForWheelmapProperties(properties: WheelmapProperties): ?string {
    return getAddressString(properties);
  }

  static getAddressForACProperties(properties: AccessibilityCloudProperties): ?string {
    if (typeof properties.address === 'string') return properties.address;
    if (typeof properties.address === 'object') {
      if (typeof properties.address.full === 'string') return properties.address.full;
    }
    return null;
  }

  static getAddressForProperties(properties: NodeProperties): ?string {
    if (properties.address) {
      return this.getAddressForACProperties(((properties: any): AccessibilityCloudProperties));
    }
    return this.getAddressForWheelmapProperties(((properties: any): WheelmapProperties));
  }

  onClickCurrentMarkerIcon = () => {
    const feature = this.props.feature;
    if (!feature) return;
    this.props.onClickCurrentMarkerIcon(feature);
  }

  render() {
    const isEquipment = !!this.props.equipmentInfoId;
    const feature = this.props.feature;
    if (!feature) return null;
    const properties = feature.properties;
    if (!properties) return null;
    const address = this.constructor.getAddressForProperties(properties);
    const addressString = address ? address.replace(/,$/, '').replace(/^,/, '') : null;

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

    const accessibility = isEquipment ? isEquipmentAccessible(get(this.props, ['equipmentInfo', 'properties'])) : isWheelchairAccessible(properties);
    const hasLongName = placeName && placeName.length > 50;
    const placeNameElement = (<PlaceName isSmall={hasLongName} aria-label={ariaLabel}>
      {categoryName ?
        <Icon accessibility={accessibility} category={shownCategoryId} size='medium' ariaHidden={true} centered onClick={this.onClickCurrentMarkerIcon} />
        : null
      }
      {placeName}
    </PlaceName>);

    if (this.props.showOnlyBasics) {
      return <StyledNodeHeader>{placeName}</StyledNodeHeader>;
    }

    const categoryElement = properties.name ? <StyledBreadCrumbs
      properties={properties}
      category={this.props.category}
      parentCategory={this.props.parentCategory}
    /> : null;

    if (isEquipment) {
      return (
        <StyledNodeHeader>
          {placeNameElement}
          {categoryElement}
        </StyledNodeHeader>
      );
    }

    return (
      <StyledNodeHeader>
        {placeNameElement}
        {categoryElement}
        {addressString ? <Address role="none">{addressString}</Address> : null }
      </StyledNodeHeader>
    );
  }
}
