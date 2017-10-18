// @flow

import { t } from '../../lib/i18n';
import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Dots } from 'react-activity';

import 'accessibility-cloud-widget/src/app.css';

import Categories from '../../lib/Categories';
import type { Category } from '../../lib/Categories';

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
  feature: Feature,
  featureId: string | number,
  hidden: boolean,
  isEditMode: boolean,
  onReportModeToggle: ?((isReportMode: boolean) => void),
  history: RouterHistory,
  onClose?: ?(() => void),
};


type State = {
  category: ?Category,
  parentCategory: ?Category,
  isReportMode: boolean,
};


const StyledToolbar = styled(Toolbar)`
  hyphens: auto;
`;


class NodeToolbar extends React.Component<Props, State> {
  props: Props;
  state = { category: null, parentCategory: null, isReportMode: false };
  toolbar: ?React.Element<typeof Toolbar>;

  componentDidMount() {
    this.fetchCategory(this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    // This variable temporarily indicates that the app wants the node toolbar to be focused, but the to be focused
    // element (the node toolbar's close link) was not rendered yet. See this.focus().
    if (this.shouldBeFocused) {
      this.focus();
    }

    this.manageFocus(prevProps, prevState);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.fetchCategory(nextProps);
    if (nextProps.featureId !== this.props.featureId) {
      this.toggleReportMode(false);
    }
  }


  toggleReportMode(isReportMode: boolean) {
    this.setState({ isReportMode });
    if (this.props.onReportModeToggle) this.props.onReportModeToggle(isReportMode);
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

  focus() {
    if (this.closeLink) {
      this.closeLink.focus();
      this.shouldBeFocused = false;
    } else {
      this.shouldBeFocused = true;
    }
  }

  manageFocus(prevProps, prevState) {
    if (this.props.isEditMode && !prevProps.isEditMode) {
      this.lastFocusedElement = document.activeElement;
      this.accessibilityEditor.focus();
    }

    if (prevProps.isEditMode && !this.props.isEditMode) {
      this.lastFocusedElement.focus();
      this.lastFocusedElement = null;
    }
  }

  render() {
    const properties = this.props.feature && this.props.feature.properties;
    const accessibility = properties ? properties.accessibility : null;

    // translator: Button caption shown in the place toolbar
    const reportButtonCaption = t`Report an Issue`;

    if (!properties) {
      return (<StyledToolbar
        hidden={this.props.hidden}
        isSwipeable={false}
      >
        <Dots size={20} />
      </StyledToolbar>);
    }

    return (
      <StyledToolbar
        hidden={this.props.hidden}
        isModal={this.props.isEditMode || this.state.isReportMode}
        innerRef={(toolbar) => { this.toolbar = toolbar; }}
      >
        {this.props.isEditMode ? null : <PositionedCloseLink
          innerRef={closeLink => this.closeLink = closeLink}
          history={this.props.history}
          onClick={() => {
            this.toggleReportMode(false);
            if (this.props.onClose) this.props.onClose();
          }}
        />}

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
              onClose={() => {
                this.toggleReportMode(false);
              }}
            />);
          }

          if (this.props.isEditMode) {
            return (<AccessibilityEditor
              innerRef={accessibilityEditor => this.accessibilityEditor = accessibilityEditor}
              feature={this.props.feature}
              featureId={this.props.featureId}
              onClose={() => {
                this.props.history.push(`/nodes/${this.props.featureId}`);
              }}
            />);
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
              onToggle={() => {
                if (this.toolbar) this.toolbar.ensureFullVisibility();
              }}
            />
            <button
              className="link-button full-width-button"
              onClick={() => {
                this.toggleReportMode(true);
              }}
            >
              {reportButtonCaption}
            </button>
            <LicenseHint properties={properties} />
          </div>);
        })()}
      </StyledToolbar>
    );
  }
}

export default NodeToolbar;
