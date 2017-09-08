// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

import 'accessibility-cloud-widget/src/app.css';

import Categories from '../../lib/Categories';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import NodeHeader from './NodeHeader';
import NodeFooter from './NodeFooter';
import LicenseHint from './LicenseHint';
import BasicAccessibility from './BasicAccessibility';
import AccessibilityDetails from './AccessibilityDetails';
import AccessibilityExtraInfo from './AccessibilityExtraInfo';
import BasicAccessibilityEditor from './BasicAccessibilityEditor';
import type { Feature } from '../../lib/Feature';


const PositionedCloseLink = styled(CloseLink)`
  top: 9px;
  right: 0;
`;

type Props = {
  className: string,
  feature: Feature,
  featureId: string | number,
  hidden: boolean,
  isEditMode: boolean,
};


type State = {
  category: ?Category,
  parentCategory: ?Category,
};


const StyledToolbar = styled(Toolbar)`
  hyphens: auto;
`;


class NodeToolbar extends Component<void, Props, State> {
  props: Props;
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

    const categoryId =
      (properties.node_type && properties.node_type.identifier) || properties.category;

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
    const properties = this.props.feature && this.props.feature.properties;
    const accessibility = properties && properties.accessibility;

    return (
      <StyledToolbar className={this.props.className} hidden={this.props.hidden}>
        <PositionedCloseLink history={this.props.history} />
        <NodeHeader
          feature={this.props.feature}
          category={this.state.category}
          parentCategory={this.state.parentCategory}
        />
        <BasicAccessibility properties={properties} />
        <BasicAccessibilityEditor feature={this.props.feature} />
        <AccessibilityDetails details={accessibility} />
        <AccessibilityExtraInfo properties={properties} />
        <NodeFooter
          feature={this.props.feature}
          featureId={this.props.featureId}
          category={this.state.category}
          parentCategory={this.state.parentCategory}
        />
        <LicenseHint properties={properties} />
      </StyledToolbar>
    );
  }
}

export default NodeToolbar;
