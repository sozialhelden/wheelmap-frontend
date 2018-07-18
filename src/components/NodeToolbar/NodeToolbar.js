// @flow

import * as React from 'react';
import { t } from 'c-3po';
import get from 'lodash/get';
import includes from 'lodash/includes';
import type { RouterHistory } from 'react-router-dom';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import NodeHeader from './NodeHeader';
import SourceList from './SourceList';
import StyledToolbar from './StyledToolbar';
import ReportDialog from './Report/ReportDialog';
import PhotoSection from './Photos/PhotoSection';
import EquipmentOverview from './Equipment/EquipmentOverview';
import EquipmentAccessibility from './AccessibilitySection/EquipmentAccessibility';
import PlaceAccessibilitySection from './AccessibilitySection/PlaceAccessibilitySection';

import type { PhotoModel } from './Photos/PhotoModel';

import type { Feature } from '../../lib/Feature';
import type { Category } from '../../lib/Categories';
import { hasBigViewport } from '../../lib/ViewportSize';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';
import type { ModalNodeState } from '../../lib/queryParams';

import filterAccessibility from '../../lib/filterAccessibility';
import { placeNameFor, isWheelmapFeatureId, wheelmapFeatureFrom, isWheelchairAccessible } from '../../lib/Feature';
import type { YesNoUnknown, YesNoLimitedUnknown } from '../../lib/Feature';
import ToiletStatusEditor from './AccessibilityEditor/ToiletStatusEditor';
import WheelchairStatusEditor from './AccessibilityEditor/WheelchairStatusEditor';
import InlineWheelchairAccessibilityEditor from './AccessibilityEditor/InlineWheelchairAccessibilityEditor';
import { getCategoryId } from '../../lib/Categories';
import IconButtonList from './IconButtonList/IconButtonList';


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
  modalNodeState: ModalNodeState,
  history: RouterHistory,
  onClose?: ?(() => void),
  onOpenReportMode: ?(() => void),
  onOpenToiletAccessibility: (() => void),
  onOpenWheelchairAccessibility: (() => void),
  onCloseWheelchairAccessibility: (() => void),
  onCloseToiletAccessibility: (() => void),
  onClickCurrentMarkerIcon?: ((Feature) => void),

  // Simple 3-button wheelchair status editor
  presetStatus: YesNoLimitedUnknown,
  onSelectWheelchairAccessibility: ((value: YesNoLimitedUnknown) => void),

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


class NodeToolbar extends React.Component<Props, State> {
  toolbar: ?React.ElementRef<typeof Toolbar>;
  reportDialog: ?React.ElementRef<typeof ReportDialog>;
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
    // const elementToFocus = this.editLinks;
    // if (elementToFocus) elementToFocus.focus();
    // this.shouldBeFocused = !elementToFocus;
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


  renderIconButtonList() {
    const { feature, featureId, category, parentCategory, equipmentInfoId, onOpenReportMode } = this.props;
    return <IconButtonList
      {...{ feature, featureId, category, parentCategory, equipmentInfoId, onOpenReportMode }}
      onToggle={() => {
        if (this.toolbar) this.toolbar.ensureFullVisibility();
      }}
    />
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
      showOnlyBasics={!!this.props.modalNodeState}
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
      presetStatus={this.props.presetStatus}
      onClose={this.props.onClose}
    />);
  }


  renderInlineWheelchairAccessibilityEditor() {
    const wheelmapFeature = wheelmapFeatureFrom(this.props.feature);
    if (!wheelmapFeature || !wheelmapFeature.properties) {
      return null;
    }
    if (wheelmapFeature.properties.wheelchair !== 'unknown') {
      return null;
    }

    return <section>
      <h4 id="wheelchair-accessibility-header">
        {t`How wheelchair accessible is this place?`}
      </h4>
      <InlineWheelchairAccessibilityEditor
        category={getCategoryId(this.props.category)}
        onChange={this.props.onSelectWheelchairAccessibility}
        presetStatus={this.props.presetStatus}
      />
    </section>;
  }


  renderContentBelowHeader() {
    const { featureId } = this.props;
    const isEquipment = this.isEquipment();

    if (featureId && !isEquipment) {
      switch (this.props.modalNodeState) {
        case 'edit-wheelchair-accessibility': return this.renderWheelchairAccessibilityEditor();
        case 'edit-toilet-accessibility': return this.renderToiletAccessibilityEditor();
        case 'report': return this.renderReportDialog();
        default: break;
      }
    }

    const { feature, equipmentInfoId, history, onOpenReportMode } = this.props;
    const sourceLinkProps =  { featureId, feature, equipmentInfoId, onOpenReportMode, history };
    if (!featureId) return;

    const isWheelmapFeature = isWheelmapFeatureId(featureId);
    const accessibilitySection = isEquipment ?
      <EquipmentAccessibility equipmentInfo={this.props.equipmentInfo} /> :
      <PlaceAccessibilitySection {...this.props} />;

    const inlineWheelchairAccessibilityEditor = this.renderInlineWheelchairAccessibilityEditor();
    const photoSection = isWheelmapFeature && this.renderPhotoSection();
    const equipmentOverview = !isWheelmapFeature && <EquipmentOverview {...{ history, feature, equipmentInfoId }} />;

    return <div>
      {this.props.equipmentInfoId && featureId && this.renderPlaceNameForEquipment()}
      {inlineWheelchairAccessibilityEditor}
      {accessibilitySection}
      {photoSection}
      {equipmentOverview}
      {this.renderIconButtonList()}
      <SourceList {...sourceLinkProps} />
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
