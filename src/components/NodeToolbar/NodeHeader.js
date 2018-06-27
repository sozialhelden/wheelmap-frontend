// @flow

import { t } from 'c-3po';
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
import SourceLink from './SourceLink';
import BreadCrumbs from './BreadCrumbs';
import PhoneNumberLink from './PhoneNumberLink';
import type { Category } from '../../lib/Categories';
import getAddressString from '../../lib/getAddressString';
import { equipmentInfoNameFor, isEquipmentAccessible } from '../../lib/EquipmentInfo';


const StyledNodeHeader = styled.header`
  color: rgba(0, 0, 0, 0.8);
   
  a.place-website-url {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 2em;
  }
  
  .description {
    word-break: break-word;
  }
  
  address {
    /* margin-bottom: 0.5em; */
    margin-left: 2.6em;
  }
`;


const StyledBreadCrumbs = styled(BreadCrumbs)`
  margin-left: 2.6em;
  margin-bottom: 0.5em;
`;


type Props = {
  feature: Feature,
  equipmentInfoId: ?string,
  equipmentInfo: ?EquipmentInfo,
  category: ?Category,
  parentCategory: ?Category,
  showOnlyBasics: boolean,
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


  render() {
    const isEquipment = !!this.props.equipmentInfoId;
    const feature = this.props.feature;
    if (!feature) return null;
    const properties = feature.properties;
    if (!properties) return null;
    const address = this.constructor.getAddressForProperties(properties);
    const addressString = address ? address.replace(/,$/, '').replace(/^,/, '') : null;

    const placeWebsiteUrl = properties.placeWebsiteUrl || properties.website;
    const phoneNumber: ?string = properties.phoneNumber || properties.phone;
    const description: ?string = properties.wheelchair_description;
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
        <Icon accessibility={accessibility} category={shownCategoryId} size='medium' ariaHidden={true} centered />
        : null
      }
      {placeName}
    </PlaceName>);

    if (this.props.showOnlyBasics) {
      return <StyledNodeHeader>{placeName}</StyledNodeHeader>;
    }

    const captions = {
      // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
      infoPageUrl: (sourceNameString) => t`Open on ${sourceNameString}`,
      // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
      editPageUrl: (sourceNameString) => t`Improve on ${sourceNameString}`,
    };

    const sourceLinks = ['infoPageUrl', 'editPageUrl'].map((propertyName) => {
      return <SourceLink
        key={propertyName}
        properties={properties}
        knownSourceNameCaption={captions[propertyName]}
        propertyName={propertyName}
      />;
    });

    if (properties.infoPageUrl === properties.editPageUrl) {
      sourceLinks.shift();
    }

    const descriptionElement = description ? <p className="description">“{description}”</p> : null;

    const categoryElement = properties.name ? <StyledBreadCrumbs
      properties={properties}
      category={this.props.category}
      parentCategory={this.props.parentCategory}
    /> : null;

    const placeWebsiteLink = (typeof placeWebsiteUrl === 'string') ?
      <a className="place-website-url link-button" href={placeWebsiteUrl}>{placeWebsiteUrl}</a>
      : null;

    if (isEquipment) {
      return (
        <StyledNodeHeader>
          {placeNameElement}
          {categoryElement}
          {descriptionElement}
        </StyledNodeHeader>
      );
    }

    return (
      <StyledNodeHeader>
        {placeNameElement}
        {categoryElement}
        {addressString ? <Address role="none">{addressString}</Address> : null }
        {sourceLinks}
        {phoneNumber ? <PhoneNumberLink phoneNumber={phoneNumber} /> : null}
        {descriptionElement}
        {placeWebsiteLink}
      </StyledNodeHeader>
    );
  }
}
