// @flow

import * as React from 'react';
import { t } from 'ttag';
import FocusTrap from '@sozialhelden/focus-trap-react';
import get from 'lodash/get';
import includes from 'lodash/includes';
import type { RouterHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
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
import type {
  Feature,
  YesNoLimitedUnknown,
  YesNoUnknown,
  WheelmapFeature,
} from '../../lib/Feature';
import { isWheelmapFeatureId, placeNameFor, wheelmapFeatureFrom } from '../../lib/Feature';
import { type Category, type CategoryLookupTables, getCategoryId } from '../../lib/Categories';
import { hasBigViewport } from '../../lib/ViewportSize';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';
import type { ModalNodeState } from '../../lib/queryParams';
import ToiletStatusEditor from './AccessibilityEditor/ToiletStatusEditor';
import WheelchairStatusEditor from './AccessibilityEditor/WheelchairStatusEditor';
import InlineWheelchairAccessibilityEditor from './AccessibilityEditor/InlineWheelchairAccessibilityEditor';
import IconButtonList from './IconButtonList/IconButtonList';
import { type SourceWithLicense } from '../../app/PlaceDetailsProps';

const PositionedCloseLink = styled(CloseLink)`
  top: 0;
  z-index: 4;
  margin: -5px -16px -2px -2px; /* move close button to the same position as in search toolbar */
`;
PositionedCloseLink.displayName = 'PositionedCloseLink';

type Props = {
  equipmentInfoId: ?string,
  equipmentInfo: ?EquipmentInfo,
  feature: Feature,
  featureId: string | number,
  sources: SourceWithLicense[],
  category: Category,
  categories: CategoryLookupTables,
  parentCategory: ?Category,
  hidden: boolean,
  modalNodeState: ModalNodeState,
  history: RouterHistory,
  onClose: () => void,
  onOpenReportMode: ?() => void,
  onOpenToiletAccessibility: () => void,
  onOpenWheelchairAccessibility: () => void,
  onCloseWheelchairAccessibility: () => void,
  onCloseToiletAccessibility: () => void,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
  onEquipmentSelected: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void,
  // Simple 3-button wheelchair status editor
  presetStatus: YesNoLimitedUnknown,
  onSelectWheelchairAccessibility: (value: YesNoLimitedUnknown) => void,

  // photo feature
  onStartPhotoUploadFlow: () => void,
  onReportPhoto: (photo: PhotoModel) => void,
  photoFlowNotification?: string,
  photoFlowErrorMessage: ?string,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
};

type State = {
  category: Category,
  parentCategory: ?Category,
  equipmentInfo: ?EquipmentInfo,
  feature: ?Feature,
  isScrollable: boolean,
};

class NodeToolbar extends React.Component<Props, State> {
  toolbar: ?React.ElementRef<typeof Toolbar>;
  reportDialog: ?React.ElementRef<typeof ReportDialog>;
  shareButton: ?React.ElementRef<'button'>;
  reportModeButton: ?React.ElementRef<'button'>;

  state = {
    category: null,
    parentCategory: null,
    equipmentInfo: null,
    feature: null,
    isScrollable: false,
  };

  componentDidMount() {
    if (this.props.photoFlowNotification) {
      setTimeout(() => {
        if (this.toolbar) {
          this.toolbar.ensureFullVisibility();
        }
      }, 200);
    }
  }

  placeName() {
    return placeNameFor(get(this.props, 'feature.properties'), this.props.category);
  }

  isEquipment() {
    return !!this.props.equipmentInfoId;
  }

  renderReportDialog() {
    return (
      <ReportDialog
        feature={this.props.feature}
        featureId={this.props.featureId}
        onReportComponentChanged={() => {
          if (this.toolbar) {
            this.toolbar.ensureFullVisibility();
          }
        }}
        onClose={() => {
          if (this.props.onClose) this.props.onClose();
        }}
      />
    );
  }

  renderIconButtonList() {
    return (
      <IconButtonList
        {...this.props}
        onToggle={() => {
          if (this.toolbar) this.toolbar.ensureFullVisibility();
        }}
      />
    );
  }

  renderNodeHeader() {
    const {
      feature,
      equipmentInfo,
      equipmentInfoId,
      category,
      categories,
      parentCategory,
      onClickCurrentMarkerIcon,
    } = this.props;

    const statesWithIcon = ['edit-toilet-accessibility', 'report'];
    const isModalStateWithPlaceIcon = includes(statesWithIcon, this.props.modalNodeState);
    const hasIcon = !this.props.modalNodeState || isModalStateWithPlaceIcon;

    return (
      <NodeHeader
        feature={feature}
        categories={categories}
        equipmentInfo={equipmentInfo}
        equipmentInfoId={equipmentInfoId}
        category={category}
        parentCategory={parentCategory}
        onClickCurrentMarkerIcon={onClickCurrentMarkerIcon}
        hasIcon={hasIcon}
        hasShadow={this.state.isScrollable}
      />
    );
  }

  renderPhotoSection() {
    return (
      <PhotoSection
        featureId={this.props.featureId}
        onReportPhoto={this.props.onReportPhoto}
        onStartPhotoUploadFlow={this.props.onStartPhotoUploadFlow}
        photoFlowNotification={this.props.photoFlowNotification}
        photoFlowErrorMessage={this.props.photoFlowErrorMessage}
      />
    );
  }

  renderPlaceNameForEquipment() {
    const { featureId } = this.props;
    if (!featureId) return;

    return (
      <Link className="link-button" to={`/beta/nodes/${featureId}`}>
        {this.placeName()}
      </Link>
    );
  }

  renderToiletAccessibilityEditor() {
    return (
      <ToiletStatusEditor
        featureId={this.props.featureId}
        feature={((this.props.feature: any): WheelmapFeature)}
        onSave={(newValue: YesNoUnknown) => {
          this.props.onClose();
          this.props.onCloseToiletAccessibility();
        }}
        onClose={this.props.onClose}
      />
    );
  }

  renderWheelchairAccessibilityEditor() {
    return (
      <WheelchairStatusEditor
        featureId={this.props.featureId}
        feature={((this.props.feature: any): WheelmapFeature)}
        onSave={(newValue: YesNoLimitedUnknown) => {
          this.props.onClose();
          this.props.onCloseWheelchairAccessibility();
        }}
        presetStatus={this.props.presetStatus}
        onClose={this.props.onClose}
      />
    );
  }

  renderInlineWheelchairAccessibilityEditor() {
    const wheelmapFeature = wheelmapFeatureFrom(this.props.feature);
    if (!wheelmapFeature || !wheelmapFeature.properties) {
      return null;
    }
    if (wheelmapFeature.properties.wheelchair !== 'unknown') {
      return null;
    }

    // translator: Shown as header/title when you edit wheelchair accessibility of a place
    const header = t`How wheelchair accessible is this place?`;

    return (
      <section>
        <h4 id="wheelchair-accessibility-header">{header}</h4>
        <InlineWheelchairAccessibilityEditor
          category={getCategoryId(this.props.category)}
          onChange={this.props.onSelectWheelchairAccessibility}
          presetStatus={this.props.presetStatus}
        />
      </section>
    );
  }

  renderContentBelowHeader() {
    const { featureId } = this.props;
    const isEquipment = this.isEquipment();

    if (featureId && !isEquipment) {
      switch (this.props.modalNodeState) {
        case 'edit-wheelchair-accessibility':
          return this.renderWheelchairAccessibilityEditor();
        case 'edit-toilet-accessibility':
          return this.renderToiletAccessibilityEditor();
        case 'report':
          return this.renderReportDialog();
        default:
          break;
      }
    }

    const { feature, equipmentInfoId, history, onOpenReportMode, sources } = this.props;
    const sourceLinkProps = {
      featureId,
      feature,
      equipmentInfoId,
      onOpenReportMode,
      history,
      sources,
    };
    if (!featureId) return;

    const isWheelmapFeature = isWheelmapFeatureId(featureId);
    const accessibilitySection = isEquipment ? (
      <EquipmentAccessibility equipmentInfo={this.props.equipmentInfo} />
    ) : (
      <PlaceAccessibilitySection {...this.props} />
    );

    const inlineWheelchairAccessibilityEditor = this.renderInlineWheelchairAccessibilityEditor();
    const photoSection = isWheelmapFeature && this.renderPhotoSection();

    const equipmentOverview = !isWheelmapFeature &&
      !!(feature.properties && feature.properties.equipmentInfos) && (
        <EquipmentOverview
          placeInfoId={featureId}
          equipmentInfos={feature.properties.equipmentInfos}
          equipmentInfoId={equipmentInfoId}
          onEquipmentSelected={this.props.onEquipmentSelected}
        />
      );

    return (
      <div>
        {isEquipment && featureId && this.renderPlaceNameForEquipment()}
        {inlineWheelchairAccessibilityEditor}
        {accessibilitySection}
        {photoSection}
        {equipmentOverview}
        {this.renderIconButtonList()}
        <SourceList {...sourceLinkProps} />
      </div>
    );
  }

  renderCloseLink() {
    const { history, onClose, modalNodeState } = this.props;
    return modalNodeState ? null : <PositionedCloseLink {...{ history, onClick: onClose }} />;
  }

  render() {
    const hasWindow = typeof window !== 'undefined';
    const offset = hasBigViewport() ? 0 : 0.4 * (hasWindow ? window.innerHeight : 0);
    return (
      <FocusTrap
        component={StyledToolbar}
        hidden={this.props.hidden}
        isModal={this.props.modalNodeState}
        ref={toolbar => (this.toolbar = toolbar)}
        role="dialog"
        ariaLabel={this.placeName()}
        startTopOffset={offset}
        onScrollable={isScrollable => this.setState({ isScrollable })}
        // We need to set clickOutsideDeactivates here as we want clicks on e.g. the map markers to not be pervented.
        focusTrapOptions={{ clickOutsideDeactivates: true }}
      >
        {this.renderCloseLink()}
        {this.renderNodeHeader()}
        {this.renderContentBelowHeader()}
      </FocusTrap>
    );
  }
}

export default NodeToolbar;
