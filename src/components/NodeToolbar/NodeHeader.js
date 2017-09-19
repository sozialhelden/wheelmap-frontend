// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import Icon from '../Icon';
import PlaceName from '../PlaceName';
import type {
  Feature,
  NodeProperties,
  WheelmapProperties,
  AccessibilityCloudProperties,
} from '../../lib/Feature';
import BreadCrumbs from './BreadCrumbs';
import SourceLink from './SourceLink';
import getAddressString from '../../lib/getAddressString';
import type { Category } from '../../lib/Categories';


const StyledNodeHeader = styled.header`
  color: rgba(0, 0, 0, 0.8);

  a.place-website-url {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .description {
    word-break: break-word;
  }

  address {
    margin-bottom: 0.5em;
  }
`;


const StyledBreadCrumbs = styled(BreadCrumbs)`
  margin-bottom: 0.5em;
`;


type Props = {
  feature: Feature,
  category: ?Category,
  parentCategory: ?Category,
  showOnlyBasics: boolean,
};


function PhoneNumberLink({ phoneNumber }: { phoneNumber: string }) {
  if (window.navigator.userAgent.match(/iPhone/)) {
    return (<span className="phone-number">
      {phoneNumber}
    </span>);
  }
  return (<a className="phone-number link-button" href={`tel:${phoneNumber}`}>
    Call {phoneNumber}
  </a>);
}

export default class NodeHeader extends Component<Props, void> {
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
    const feature = this.props.feature;
    if (!feature) return null;
    const properties = feature.properties;
    if (!properties) return null;
    const address = this.constructor.getAddressForProperties(properties);
    const addressString = address ? address.replace(/,$/, '').replace(/^,/, '') : null;

    const placeWebsiteUrl = properties.placeWebsiteUrl || properties.website;
    const phoneNumber: ?string = properties.phoneNumber || properties.phone;
    const description: ?string = properties.wheelchair_description;
    const categoryOrParentCategory = this.props.category || this.props.parentCategory;
    const categoryName = categoryOrParentCategory ? categoryOrParentCategory._id : null;
    const placeName = (<PlaceName>
      {categoryOrParentCategory ?
        <Icon properties={properties} category={categoryOrParentCategory} />
        : null
      }
      {(properties.name || categoryName || 'place').replace(/(\w)\/(\w)/g, '$1 / $2')}
    </PlaceName>);

    if (this.props.showOnlyBasics) {
      return <StyledNodeHeader>{placeName}</StyledNodeHeader>;
    }

    return (
      <StyledNodeHeader>
        {placeName}

        <StyledBreadCrumbs
          properties={properties}
          category={this.props.category}
          parentCategory={this.props.parentCategory}
        />

        {addressString ? <address>{addressString}</address> : null }

        <SourceLink properties={properties} />

        {phoneNumber ? <PhoneNumberLink phoneNumber={phoneNumber} /> : null}

        {description ? <p className="description">“{description}”</p> : null}

        {typeof placeWebsiteUrl === 'string' ?
          <a className="place-website-url link-button" href={placeWebsiteUrl}>{placeWebsiteUrl}</a>
          : null
        }
      </StyledNodeHeader>
    );
  }
}
