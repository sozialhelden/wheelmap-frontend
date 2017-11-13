// @flow

import { t } from '../../lib/i18n';
import get from 'lodash/get';
import * as React from 'react';
import styled from 'styled-components';

import type {
  Feature,
  NodeProperties,
  WheelmapProperties,
  AccessibilityCloudProperties,
} from '../../lib/Feature';
import { isWheelchairAccessible } from '../../lib/Feature';
import NewIcon from '../NewIcon';
import PlaceName from '../PlaceName';
import SourceLink from './SourceLink';
import BreadCrumbs from './BreadCrumbs';
import type { Category } from '../../lib/Categories';
import getAddressString from '../../lib/getAddressString';
import { currentLocale, defaultLocale } from '../../lib/i18n';


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
    let categoryName = get(categoryOrParentCategory, `translations._id.${currentLocale}`) ||
      get(categoryOrParentCategory, `translations._id.${currentLocale.slice(0, 2)}`) ||
      get(categoryOrParentCategory, `translations._id.${defaultLocale}`);

    const ariaLabel = properties.name ? `${properties.name}, ${categoryName}` : categoryName;

    const accessibility = isWheelchairAccessible(properties);
    const placeName = (<PlaceName aria-label={ariaLabel}>
      {categoryOrParentCategory ?
        <NewIcon accessibility={accessibility} category={categoryOrParentCategory} isMiddle={true} ariaHidden={true}/>
        : null
      }
      {(properties.name || categoryName || t`Unnamed place`).replace(/(\w)\/(\w)/g, '$1 / $2')}
    </PlaceName>);

    if (this.props.showOnlyBasics) {
      return <StyledNodeHeader>{placeName}</StyledNodeHeader>;
    }

    return (
      <StyledNodeHeader>
        {placeName}

        {properties.name ? <StyledBreadCrumbs
          properties={properties}
          category={this.props.category}
          parentCategory={this.props.parentCategory}
        /> : null}

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
