// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { Dots } from 'react-activity';

import 'accessibility-cloud-widget/src/app.css';

import Categories from '../../lib/Categories';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import NodeHeader from './NodeHeader';
import NodeFooter from './NodeFooter';
import ShareButtons from './ShareButtons/ShareButtons';
import ReportDialog from './Report/ReportDialog';
import LicenseHint from './LicenseHint';
import BasicAccessibility from './BasicAccessibility';
import AccessibilityDetails from './AccessibilityDetails';
import AccessibilityExtraInfo from './AccessibilityExtraInfo';
import AccessibilityEditor from './AccessibilityEditor/AccessibilityEditor';
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
  isReportMode: boolean,
};


const StyledToolbar = styled(Toolbar)`
  hyphens: auto;
`;


class NodeToolbar extends Component<void, Props, State> {
  props: Props;
  state = { category: null, parentCategory: null, isReportMode: false };

  componentDidMount() {
    this.fetchCategory(this.props);
  }


  componentWillReceiveProps(nextProps: Props) {
    this.fetchCategory(nextProps);
    if (nextProps.featureId !== this.props.featureId) {
      this.setState({ isReportMode: false });
    }
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

    if (!properties) {
      return (<StyledToolbar
        className={this.props.className}
        hidden={this.props.hidden}
        isSwipeable={false}
      >
        <Dots size={20} />
      </StyledToolbar>);
    }
    return (
      <StyledToolbar
        className={this.props.className}
        hidden={this.props.hidden}
        isSwipeable={!this.props.isEditMode}
      >
        {this.props.isEditMode ? null : <PositionedCloseLink history={this.props.history} />}

        <NodeHeader
          feature={this.props.feature}
          category={this.state.category}
          parentCategory={this.state.parentCategory}
          showOnlyBasics={this.props.isEditMode || this.state.isReportMode}
        />

        {(() => {
          if (this.state.isReportMode) {
            return (<ReportDialog
              feature={this.props.feature}
              featureId={this.props.featureId}
              onClose={() => this.setState({ isReportMode: false })}
            />);
          }
          if (this.props.isEditMode) {
            return <AccessibilityEditor feature={this.props.feature} />;
          }
          return (<div>
            <BasicAccessibility properties={properties} />
            <AccessibilityDetails details={accessibility} />
            <AccessibilityExtraInfo properties={properties} />
            <NodeFooter
              feature={this.props.feature}
              featureId={this.props.featureId}
              category={this.state.category}
              parentCategory={this.state.parentCategory}
            />
            <ShareButtons
              feature={this.props.feature}
              featureId={this.props.featureId}
              category={this.state.category}
              parentCategory={this.state.parentCategory}
            />
            <button
              className="link-button full-width-button"
              onClick={() => this.setState({ isReportMode: true })}
            >
              Report an Issue
            </button>
            <LicenseHint properties={properties} />
          </div>);
        })()}
      </StyledToolbar>
    );
  }
}

export default NodeToolbar;
