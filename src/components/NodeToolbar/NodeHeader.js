// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import Icon from '../Icon';
import PlaceName from '../PlaceName';
import type { Feature, WheelmapProperties, AccessibilityCloudProperties } from '../../lib/Feature';
import BreadCrumbs from './BreadCrumbs';
import SourceLink from './SourceLink';
import getAddressString from '../../lib/getAddressString';


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
`;


const StyledBreadCrumbs = styled(BreadCrumbs)`
  margin-bottom: 0.5em;
`;


type Props = {
  feature: Feature,
  category: ?Category,
  parentCategory: ?Category,
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

export default class NodeHeader extends Component<void, Props, void> {
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

  static getAddressForProperties(properties: AccessibilityCloudProperties | WheelmapProperties): ?string {
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
    const placeName = (properties.name || categoryName || 'place')
      .replace(/(\w)\/(\w)/g, '$1 / $2');
    return (
      <StyledNodeHeader>
        <PlaceName>
          {categoryOrParentCategory ?
            <Icon properties={properties} category={categoryOrParentCategory} />
            : null
          }
          {placeName}
        </PlaceName>

        <StyledBreadCrumbs
          properties={properties}
          category={this.props.category}
          parentCategory={this.props.parentCategory}
          />

        <address>{addressString}</address>

        <SourceLink properties={properties} />

        {phoneNumber ? <p><PhoneNumberLink phoneNumber={phoneNumber} /></p> : null}

        {description ? <p className="description">“{description}”</p> : null}

        {placeWebsiteUrl ?
          <a className="place-website-url link-button" href={placeWebsiteUrl}>{placeWebsiteUrl}</a>
          : null
        }
      </StyledNodeHeader>
    );
  }
}
