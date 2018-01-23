// @flow

import { t } from '../../lib/i18n';
import * as React from 'react';
import omit from 'lodash/omit';
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
import EquipmentOverview from './Equipment/EquipmentOverview';
import AccessibilityEditor from './AccessibilityEditor/AccessibilityEditor';
import type { Feature, MinimalAccessibility } from '../../lib/Feature';
import { placeNameFor, isWheelmapFeatureId, removeNullAndUndefinedFields } from '../../lib/Feature';

function filterAccessibility(properties: MinimalAccessibility): ?MinimalAccessibility {
  // These attributes have a better representation in the UI than the basic tree structure would provide.
  const paths = [
    'partiallyAccessibleWith.wheelchair',
    'accessibleWith.wheelchair',
    'areas.0.restrooms.0.isAccessibleWithWheelchair',
    'areas.0.entrances.0.isLevel',
  ];
  return removeNullAndUndefinedFields(removeNullAndUndefinedFields(omit(properties, paths)));
}

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
  toolbar: ?React.ElementRef<typeof Toolbar>;
  nodeFooter: ?React.ElementRef<typeof NodeFooter>;
  reportDialog: ?React.ElementRef<typeof ReportDialog>;
  accessibilityEditor: ?React.ElementRef<typeof AccessibilityEditor>;
  shareButton: ?React.ElementRef<'button'>;
  reportModeButton: ?React.ElementRef<'button'>;

  shouldBeFocused: ?boolean;

  componentDidMount() {
    this.fetchCategory(this.props);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
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
    if (this.nodeFooter) {
      this.nodeFooter.focus();
      this.shouldBeFocused = false;
    } else if (this.shareButton) {
      this.shareButton.focus();
      this.shouldBeFocused = false;
    } else {
      this.shouldBeFocused = true;
    }
  }

  manageFocus(prevProps: Props, prevState: State) {
    if (prevProps.isEditMode && !this.props.isEditMode) {
      if (this.nodeFooter) {
        this.nodeFooter.focus();
      } else if (this.shareButton) {
        this.shareButton.focus();
      }
    }

    if (prevState.isReportMode && !this.state.isReportMode) {
      if (this.reportModeButton) {
        this.reportModeButton.focus();
      }
    }
  }

  render() {
    const properties = this.props.feature && this.props.feature.properties;
    const accessibility = properties ? properties.accessibility : null;
    const filteredAccessibility = accessibility ? filterAccessibility(accessibility): null;

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
        role="dialog"
        ariaLabel={placeNameFor(this.props.feature.properties)}
      >
        {this.props.isEditMode ? null : <PositionedCloseLink
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
              innerRef={reportDialog => this.reportDialog = reportDialog}
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

          const isWheelmapFeature = isWheelmapFeatureId(this.props.featureId);

          return (<div>
            <BasicAccessibility properties={properties} />
            <AccessibilityDetails details={filteredAccessibility} locale={window.navigator.language} />
            <AccessibilityExtraInfo properties={properties} />
            {isWheelmapFeature ? null : <EquipmentOverview feature={this.props.feature} />}
            {
              (this.props.featureId && isWheelmapFeature) ? (
                <NodeFooter
                  ref={nodeFooter => (this.nodeFooter = nodeFooter)}
                  feature={this.props.feature}
                  featureId={this.props.featureId}
                  category={this.state.category}
                  parentCategory={this.state.parentCategory}
                />
              ) : null
            }
            <ShareButtons
              innerRef={shareButton => this.shareButton = shareButton}
              feature={this.props.feature}
              featureId={this.props.featureId}
              category={this.state.category}
              parentCategory={this.state.parentCategory}
              onToggle={() => {
                if (this.toolbar) this.toolbar.ensureFullVisibility();
              }}
            />
            <button
              ref={reportModeButton => this.reportModeButton = reportModeButton}
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
