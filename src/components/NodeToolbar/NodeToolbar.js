// @flow

import * as React from 'react';
import get from 'lodash/get';
import includes from 'lodash/includes';
import type { RouterHistory } from 'react-router-dom';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import NodeHeader from './NodeHeader';
import EditLinks from './EditLinks';
import StyledToolbar from './StyledToolbar';
import ExternalLinks from './ExternalLinks';
import ReportDialog from './Report/ReportDialog';
import PhotoSection from './Photos/PhotoSection';
import ShareButtons from './ShareButtons/ShareButtons';
import AccessibilityDetails from './AccessibilityDetails';
import AccessibleDescription from './AccessibleDescription';
import AccessibilityExtraInfo from './AccessibilityExtraInfo';
import EquipmentOverview from './Equipment/EquipmentOverview';
import EquipmentAccessibility from './EquipmentAccessibility';
import BasicPlaceAccessibility from './BasicPlaceAccessibility';
import AccessibilityEditor from './AccessibilityEditor/AccessibilityEditor';

import type { PhotoModel } from './Photos/PhotoModel';

import type { Feature } from '../../lib/Feature';
import type { Category } from '../../lib/Categories';
import type { ModalNodeState } from '../../lib/queryParams';
import { hasBigViewport } from '../../lib/ViewportSize';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';

import filterAccessibility from '../../lib/filterAccessibility';
import { placeNameFor, isWheelmapFeatureId } from '../../lib/Feature';
import type { YesNoUnknown, YesNoLimitedUnknown } from '../../lib/Feature';
import ToiletStatusEditor from './AccessibilityEditor/ToiletStatusEditor';
import WheelchairStatusEditor from './AccessibilityEditor/WheelchairStatusEditor';


const PositionedCloseLink = styled(CloseLink)`
  margin: -5px -16px -2px -2px; /* move close button to the same position as in search toolbar */
`;
PositionedCloseLink.displayName = 'PositionedCloseLink';


type Props = {
  feature: ?Feature,
  featureId: ?string | number,
  equipmentInfoId: ?string,
  equipmentInfo: ?EquipmentInfo,
  category: ?Category,
  parentCategory: ?Category,
  hidden: boolean,
  modalNodeState: modalNodeState,
  history: RouterHistory,
  onClose?: ?(() => void),
  onOpenReportMode: ?(() => void),
  onOpenToiletAccessibility: (() => void),
  onOpenWheelchairAccessibility: (() => void),
  onCloseWheelchairAccessibility: (() => void),
  onCloseToiletAccessibility: (() => void),
  onClickCurrentMarkerIcon?: ((Feature) => void),

  // photo feature
  onStartPhotoUploadFlow: (() => void),
  onReportPhoto: ((photo: PhotoModel) => void),
  photoFlowNotification?: string,
  onClickCurrentMarkerIcon?: ((Feature) => void)
};


type State = {
  category: ?Category,
  parentCategory: ?Category,
  equipmentInfo: ?EquipmentInfo,
  feature: ?Feature,
};


class NodeToolbar extends React.Component<Props> {
  props: Props;

  toolbar: ?React.ElementRef<typeof Toolbar>;
  editLinks: ?React.ElementRef<typeof EditLinks>;
  reportDialog: ?React.ElementRef<typeof ReportDialog>;
  accessibilityEditor: ?React.ElementRef<typeof AccessibilityEditor>;
  shareButton: ?React.ElementRef<'button'>;
  reportModeButton: ?React.ElementRef<'button'>;

  shouldBeFocused: ?boolean;


  componentDidMount() {
    if (this.props.photoFlowNotification) {
      setTimeout(() => { if (this.toolbar) { this.toolbar.ensureFullVisibility(); }}, 200);
    }
  }


  componentDidUpdate(prevProps: Props, prevState: State) {
    // This variable temporarily indicates that the app wants the node toolbar to be focused, but the to be focused
    // element (the node toolbar's close link) was not rendered yet. See this.focus().
    if (this.shouldBeFocused) {
      this.focus();
    }

    this.manageFocus(prevProps, prevState);
  }


  focus() {
    const elementToFocus = this.editLinks || this.shareButton;
    if (elementToFocus) elementToFocus.focus();
    this.shouldBeFocused = !elementToFocus;
  }


  manageFocus(prevProps: Props, prevState: State) {
    // TODO: Re-integrate this into ExternalLinks
    // if (prevProps.modalNodeState && !this.props.modalNodeState) {
    //   if (this.editLinks) {
    //     this.editLinks.focus();
    //   } else if (this.shareButton) {
    //     this.shareButton.focus();
    //   }
    // }
  }


  placeName() {
    return placeNameFor(get(this.props, 'feature.properties'), this.props.category);
  }


  isEquipment() {
    return !!this.props.equipmentInfoId;
  }


  renderReportDialog() {
    return (<ReportDialog
      innerRef={reportDialog => this.reportDialog = reportDialog}
      feature={this.props.feature}
      featureId={this.props.featureId}
      onClose={() => {
        if (this.props.onClose) this.props.onClose();
      }}
    />);
  }


  renderNodeHeader() {
    const {
      feature,
      equipmentInfo,
      equipmentInfoId,
      category,
      parentCategory,
      onClickCurrentMarkerIcon
    } = this.props;

    return <NodeHeader
      feature={feature}
      equipmentInfo={equipmentInfo}
      equipmentInfoId={equipmentInfoId}
      category={category}
      parentCategory={parentCategory}
      onClickCurrentMarkerIcon={onClickCurrentMarkerIcon}
      showOnlyBasics={this.props.modalNodeState}
    />;
  }


  renderPhotoSection() {
    return <PhotoSection
      featureId={this.props.featureId}
      onReportPhoto={this.props.onReportPhoto}
      onStartPhotoUploadFlow={this.props.onStartPhotoUploadFlow}
      photoFlowNotification={this.props.photoFlowNotification}
    />;
  }


  renderEquipmentOverview() {
    const { history, feature, equipmentInfoId } = this.props;
    return <EquipmentOverview {...{ history, feature, equipmentInfoId }} />;
  }


  renderAccessibilitySection() {
    if (this.isEquipment()) {
      return <EquipmentAccessibility equipmentInfo={this.props.equipmentInfo} />
    }

    const properties = this.props.feature && this.props.feature.properties;
    const accessibility = properties && typeof properties.accessibility === 'object' ? properties.accessibility : null;
    const filteredAccessibility = accessibility ? filterAccessibility(accessibility) : null;

    const { featureId } = this.props;
    const isWheelmapFeature = isWheelmapFeatureId(featureId);
    const equipmentOverview = !isWheelmapFeature && this.renderEquipmentOverview();
    const photoSection = isWheelmapFeature && this.renderPhotoSection();
    const accessibilityDetails = filteredAccessibility && <AccessibilityDetails details={filteredAccessibility} />
    const editLinks = isWheelmapFeature && this.renderEditLinks();

    return <React.Fragment>
      <BasicPlaceAccessibility properties={properties}
        onOpenWheelchairAccessibility={this.props.onOpenWheelchairAccessibility}
        onOpenToiletAccessibility={this.props.onOpenToiletAccessibility}
      >
        {editLinks}
        {photoSection}
        <AccessibleDescription properties={properties} />
        {accessibilityDetails}
      </BasicPlaceAccessibility>
      <AccessibilityExtraInfo properties={properties} />
      {equipmentOverview}
    </React.Fragment>;
  }


  renderPlaceNameForEquipment() {
    const { featureId } = this.props;
    if (!featureId) return;

    return <a
      className="link-button"
      href={`/nodes/${featureId}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        this.props.history.push(`/nodes/${featureId}`);
      }}
    >
      {this.placeName()}
    </a>;
  }


  renderEditLinks() {
    const { feature, featureId, category, parentCategory } = this.props;
    if (!featureId) return;
    return <EditLinks
      {...{ feature, featureId, category, parentCategory }}
      ref={editLinks => (this.editLinks = editLinks)}
    />
  }


  renderShareButtons() {
    const { feature, featureId, category, parentCategory } = this.props;
    return <ShareButtons
      {...{ feature, featureId, category, parentCategory }}
      innerRef={shareButton => this.shareButton = shareButton}
      onToggle={() => {
        if (this.toolbar) this.toolbar.ensureFullVisibility();
      }}
    />;
  }


  renderAccessibilityEditor() {
    const { featureId, feature } = this.props;
    return <AccessibilityEditor
      {...{ featureId, feature }}
      innerRef={accessibilityEditor => this.accessibilityEditor = accessibilityEditor}
      onClose={() => {
        if (featureId) {
          this.props.history.push(`/nodes/${featureId}`);
        }
      }}
    />;
  }


  renderToiletAccessibilityEditor() {
    return (<ToiletStatusEditor
      // innerRef={toiletStatusEditor => this.toiletStatusEditor = toiletStatusEditor}
      featureId={this.props.featureId}
      feature={this.props.feature}
      onSave={(newValue: YesNoUnknown) => this.props.onCloseToiletAccessibility()}
      onClose={this.props.onClose}
    />);
  }


  renderWheelchairAccessibilityEditor() {
    return (<WheelchairStatusEditor
      // innerRef={wheelchairStatusEditor => this.wheelchairStatusEditor = wheelchairStatusEditor}
      featureId={this.props.featureId}
      feature={this.props.feature}
      onSave={(newValue: YesNoLimitedUnknown) => {
        if (includes(['yes', 'limited'], newValue)) {
          this.props.onOpenToiletAccessibility();
        } else {
          this.props.onCloseWheelchairAccessibility();
        }
      }}
      onClose={this.props.onClose}
    />);
  }


  renderContentBelowHeader() {
    const { featureId } = this.props;
    const isEquipment = this.isEquipment();

    if (this.props.modalNodeState === 'report' && !isEquipment) {
      return this.renderReportDialog();
    }

    if (featureId && !isEquipment) {
      switch (this.props.modalNodeState) {
        case 'edit-wheelchair-accessibility': return this.renderWheelchairAccessibilityEditor();
        case 'edit-toilet-accessibility': return this.renderToiletAccessibilityEditor();
        case 'report': return this.renderAccessibilityEditor();
        default: break;
      }
    }

    const { feature, equipmentInfoId, isReportMode, history, onOpenReportMode } = this.props;

    if (!featureId) return;

    return <div>
      {this.props.equipmentInfoId && featureId && this.renderPlaceNameForEquipment()}
      {this.renderAccessibilitySection()}
      <ExternalLinks {...{ featureId, feature, equipmentInfoId, isReportMode, onOpenReportMode, history }} />
      {this.renderShareButtons()}
    </div>;
  }


  renderCloseLink() {
    const { history, onClose, modalNodeState } = this.props;
    return modalNodeState ? null : <PositionedCloseLink {...{ history, onClose }} />;
  }


  render() {
    return <StyledToolbar
      hidden={this.props.hidden}
      isModal={this.props.modalNodeState}
      innerRef={(toolbar) => { this.toolbar = toolbar; }}
      role="dialog"
      ariaLabel={this.placeName()}
      startTopOffset={hasBigViewport() ? 0 : (0.4 * window.innerHeight)}
    >
      {this.renderCloseLink()}
      {this.renderNodeHeader()}
      {this.renderContentBelowHeader()}
    </StyledToolbar>;
  }
}

export default NodeToolbar;
