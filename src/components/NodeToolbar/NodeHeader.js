// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import Categories from '../../lib/Categories';
import Icon from '../Icon';
import PlaceName from '../PlaceName';
import type { Category } from '../../lib/Categories';
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
`;


const StyledBreadCrumbs = styled(BreadCrumbs)`
  margin-bottom: 0.5em;
`;


type Props = {
  feature: Feature,
};

type State = {
  category: ?Category,
  parentCategory: ?Category,
};


function PhoneNumberLink({ phoneNumber }: { phoneNumber: string }) {
  if (window.navigator.userAgent.match(/iPhone/)) {
    return (<div className="phone-number">
      {phoneNumber}
    </div>);
  }
  return (<a className="phone-number link-button" href={`tel:${phoneNumber}`}>
    Call {phoneNumber}
  </a>);
}

export default class NodeHeader extends Component<void, Props, State> {
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


  state = { category: null, parentCategory: null };


  componentDidMount() {
    this.fetchCategory(this.props);
  }


  componentWillReceiveProps(nextProps: Props) {
    this.fetchCategory(nextProps);
  }


  fetchCategory(props: Props = this.props) {
    const feature = props.feature;
    if (!feature) {
      this.setState({ category: null });
      return;
    }
    const properties = feature.properties;
    if (!properties) {
      this.setState({ category: null });
      return;
    }
    const categoryId = (properties.node_type && properties.node_type.identifier) || properties.category;
    if (!categoryId) {
      this.setState({ category: null });
      return;
    }
    Categories.getCategory(categoryId).then(
      (category) => { this.setState({ category }); return category; },
      () => this.setState({ category: null }),
    )
    .then(category => category && Categories.getCategory(category.parentIds[0]))
    .then(parentCategory => this.setState({ parentCategory }));
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
    const categoryOrParentCategory = this.state.category || this.state.parentCategory;
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
          category={this.state.category}
          parentCategory={this.state.parentCategory}
          />

        <address>{addressString}</address>

        <SourceLink properties={properties} />

        {phoneNumber ? <p><PhoneNumberLink phoneNumber={phoneNumber} /></p> : null}

        {description ? <p>“{description}”</p> : null}

        {placeWebsiteUrl ?
          <a className="place-website-url link-button" href={placeWebsiteUrl}>{placeWebsiteUrl}</a>
          : null
        }
      </StyledNodeHeader>
    );
  }
}
