// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import Categories from '../../lib/Categories';
import type { Category } from '../../lib/Categories';
import type { Feature, WheelmapProperties, AccessibilityCloudProperties, NodeProperties } from '../../lib/Feature';
import colors, { getColorForWheelchairAccessiblity } from '../../lib/colors';
import BreadCrumbs from './BreadCrumbs';
import ToolbarLink from './ToolbarLink';
import ChevronRight from './ChevronRight';


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


const PlaceName = styled.h1`
  margin: 0.25em 30px 0.5em 0;
  font-size: 20px;
  line-height: 1;
  font-weight: 400;
  display: flex;
  flex-direction: row;
  align-items: center;
`;


const SourceLink = ({ to, className } : { to: string, className?: string }) => {
  return <ToolbarLink to={to} className={`${className} link-button`}>
    on Jaccede <ChevronRight color={colors.linkColor} />
  </ToolbarLink>;
};

const StyledSourceLink = styled(SourceLink)`
  margin-top: .5em;
  text-align: right;
  .chevron-right {
    vertical-align: bottom;
    height: 18px;
    width: 7px;
    min-width: 7px;
    margin: 0;
  }
`;

const StyledIconImage = styled('figure')`
  display: inline-block;
  height: 1.5em;
  width: 1.5em;
  margin: 0;
  padding: 0;
  border-radius: 1em;
  vertical-align: middle;
  margin-right: 0.5em;
  img {
    width: 1em;
    height: 1em;
    margin: 0.25em;
    vertical-align: middle;
  }
`;

function Icon({ properties, category }: { properties: NodeProperties, category: Category }) {
  const src = `/icons/categories/${category._id}.svg`;
  const color = getColorForWheelchairAccessiblity(properties);
  return <StyledIconImage className={`ac-marker-${color}`}><img src={src} alt="" /></StyledIconImage>;
}

type Props = {
  node: Feature,
};

type State = {
  category: ?Category,
  parentCategory: ?Category,
};


function PhoneNumberLink({ phoneNumber }: { phoneNumber: string }) {
  return (<a className="phone-number link-button" href={`tel:${phoneNumber}`}>
    Call {phoneNumber}
  </a>);
}

export default class NodeHeader extends Component<void, Props, State> {
  static getAddressForWheelmapProperties(properties: WheelmapProperties): ?string {
    return [
      [properties.street, properties.housenumber].filter(Boolean).join(' '),
      [properties.postcode, properties.city].filter(Boolean).join(' '),
    ].filter(Boolean).join(', ');
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
    const node = props.node;
    if (!node) {
      this.setState({ category: null });
      return;
    }
    const properties = node.properties;
    if (!properties) {
      this.setState({ category: null });
      return;
    }
    const categoryId = (properties.type && properties.type.identifier) || properties.category;
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
    const node = this.props.node;
    if (!node) return null;
    const properties = node.properties;
    if (!properties) return null;
    const address = this.constructor.getAddressForProperties(properties);
    const addressString = address ? address.replace(/,$/, '').replace(/^,/, '') : null;
    const externalInfoPageUrl = properties.infoPageUrl;
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

        {externalInfoPageUrl ? <StyledSourceLink to={externalInfoPageUrl} /> : null}

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
