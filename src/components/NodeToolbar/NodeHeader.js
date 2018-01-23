// @flow

import * as React from 'react';
import styled from 'styled-components';

import type {
  Feature,
  NodeProperties,
  WheelmapProperties,
  AccessibilityCloudProperties,
} from '../../lib/Feature';
import { isWheelchairAccessible, categoryNameFor, placeNameFor } from '../../lib/Feature';
import Icon from '../Icon';
import PlaceName from '../PlaceName';
import SourceLink from './SourceLink';
import BreadCrumbs from './BreadCrumbs';
import type { Category } from '../../lib/Categories';
import getAddressString from '../../lib/getAddressString';
import { t } from '../../lib/i18n';


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
    {t`Call ${phoneNumber}`}
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
    const { category, parentCategory } = this.props;
    let categoryName = categoryNameFor(category || parentCategory);
    const placeName = placeNameFor(properties, category || parentCategory);
    const ariaLabel = placeName ? `${placeName}, ${categoryName}` : categoryName;
    const accessibility = isWheelchairAccessible(properties);
    const placeNameElement = (<PlaceName aria-label={ariaLabel}>
      {categoryName ?
        <Icon accessibility={accessibility} category={category || parentCategory} size='medium' ariaHidden={true}/>
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

    return (
      <StyledNodeHeader>
        {placeNameElement}

        {properties.name ? <StyledBreadCrumbs
          properties={properties}
          category={this.props.category}
          parentCategory={this.props.parentCategory}
        /> : null}

        {addressString ? <address>{addressString}</address> : null }

        {sourceLinks}

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
