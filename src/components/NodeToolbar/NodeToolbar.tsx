import * as React from 'react';
import { t } from 'ttag';
import FocusTrap from 'focus-trap-react';
import get from 'lodash/get';
import includes from 'lodash/includes';
import fromPairs from 'lodash/fromPairs';
import styled from 'styled-components';

import { Toolbar as ToolbarClass } from '../Toolbar';
import CloseLink from '../CloseLink';
import ErrorBoundary from '../ErrorBoundary';
import NodeHeader from './NodeHeader';
import SourceList from './SourceList';
import StyledToolbar from './StyledToolbar';
import ReportDialog from './Report/ReportDialog';
import PhotoSection from './Photos/PhotoSection';
import EquipmentOverview from './Equipment/EquipmentOverview';
import EquipmentAccessibility from './AccessibilitySection/EquipmentAccessibility';
import PlaceAccessibilitySection from './AccessibilitySection/PlaceAccessibilitySection';
import Button from '../Button';

import { PhotoModel } from '../../lib/PhotoModel';
import {
  Feature,
  YesNoLimitedUnknown,
  YesNoUnknown,
} from '../../lib/Feature';
import { isWheelmapFeatureId, placeNameFor, wheelmapFeatureFrom } from '../../lib/Feature';
import { Category, CategoryLookupTables, getCategoryId } from '../../lib/Categories';
import { hasBigViewport } from '../../lib/ViewportSize';
import { EquipmentInfo } from '../../lib/EquipmentInfo';
import { ModalNodeState } from '../../lib/ModalNodeState';
import ToiletStatusEditor from './AccessibilityEditor/ToiletStatusEditor';
import WheelchairStatusEditor from './AccessibilityEditor/WheelchairStatusEditor';
import InlineWheelchairAccessibilityEditor from './AccessibilityEditor/InlineWheelchairAccessibilityEditor';
import IconButtonList from './IconButtonList/IconButtonList';
import { SourceWithLicense } from '../../app/PlaceDetailsProps';
import { Cluster } from '../Map/Cluster';
import { AppContextConsumer } from '../../AppContext';
import { equipmentInfoCache } from '../../lib/cache/EquipmentInfoCache';
import { UAResult } from '../../lib/userAgent';

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = 'PositionedCloseLink';

type Props = {
  equipmentInfoId: string | null,
  equipmentInfo: EquipmentInfo | null,
  feature: Feature,
  featureId: string | number,
  cluster: Cluster | null,
  sources: SourceWithLicense[],
  photos: PhotoModel[],
  toiletsNearby: Feature[] | null,
  isLoadingToiletsNearby: boolean,
  categories: CategoryLookupTables,
  category: Category | null,
  parentCategory: Category | null,
  hidden: boolean,
  modalNodeState: ModalNodeState,
  inEmbedMode: boolean,
  userAgent: UAResult,
  onClose?: () => void,
  onOpenReportMode: () => void | null,
  onOpenToiletAccessibility: () => void,
  onOpenWheelchairAccessibility: () => void,
  onOpenToiletNearby: (feature: Feature) => void,
  onCloseWheelchairAccessibility: () => void,
  onCloseToiletAccessibility: () => void,
  onClickCurrentCluster?: () => void,
  onShowPlaceDetails?: (featureId: string | number) => void,
  // Simple 3-button wheelchair status editor
  accessibilityPresetStatus?: YesNoLimitedUnknown | null,
  onSelectWheelchairAccessibility?: (value: YesNoLimitedUnknown) => void,
  onEquipmentSelected?: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void,

  // photo feature
  onStartPhotoUploadFlow: () => void,
  onReportPhoto: (photo: PhotoModel) => void,
  photoFlowNotification?: 'uploadProgress' | 'uploadFailed' | 'reported' | 'waitingForReview',
  photoFlowErrorMessage: string | null,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
};

type State = {
  isScrollable: boolean,
};

interface Focusable {
  focus(): void;
};

class NodeToolbar extends React.Component<Props, State> {
  toolbar = React.createRef<ToolbarClass & Focusable>();
  reportDialog = React.createRef<typeof ReportDialog>();
  shareButton = React.createRef<HTMLButtonElement>();
  reportModeButton = React.createRef<HTMLButtonElement>();

  state = {
    isScrollable: false,
  };

  componentDidMount() {
    if (this.props.photoFlowNotification) {
      // TODO: what is this timeout needed for, and why?
      setTimeout(() => {
        if (this.toolbar.current) {
          this.toolbar.current.ensureFullVisibility();
        }
      }, 200);
    }
  }

  placeName() {
    return placeNameFor(get(this.props, 'feature.properties'), this.props.category);
  }

  focus() {
    if (this.toolbar.current) {
      this.toolbar.current.focus();
    }
  }

  renderReportDialog() {
    return (
      <AppContextConsumer>
        {appContext => (
          <ReportDialog
            appContext={appContext}
            categories={this.props.categories}
            feature={this.props.feature}
            featureId={this.props.featureId}
            onReportComponentChanged={() => {
              if (this.toolbar.current) {
                this.toolbar.current.ensureFullVisibility();
              }
            }}
            onClose={() => {
              if (this.props.onClose) this.props.onClose();
            }}
          />
        )}
      </AppContextConsumer>
    );
  }

  renderIconButtonList() {
    return (
      <IconButtonList
        {...this.props}
        onToggle={() => {
          if (this.toolbar.current) this.toolbar.current.ensureFullVisibility();
        }}
      />
    );
  }

  renderNodeHeader() {
    const {
      feature,
      equipmentInfo,
      equipmentInfoId,
      cluster,
      category,
      categories,
      parentCategory,
      onClickCurrentMarkerIcon,
      onClickCurrentCluster,
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
        cluster={cluster}
        category={category}
        parentCategory={parentCategory}
        onClickCurrentCluster={onClickCurrentCluster}
        onClickCurrentMarkerIcon={onClickCurrentMarkerIcon}
        hasIcon={hasIcon}
        hasShadow={this.state.isScrollable}
      >
        {this.renderCloseLink()}
      </NodeHeader>
    );
  }

  renderPhotoSection() {
    return (
      <PhotoSection
        featureId={this.props.featureId as any}
        photos={this.props.photos || []}
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
      <Button
        className="link-button"
        onClick={e => {
          if (this.props.onShowPlaceDetails) {
            this.props.onShowPlaceDetails(this.props.featureId);
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {this.placeName()}
      </Button>
    );
  }

  renderToiletAccessibilityEditor() {
    return (
      <ToiletStatusEditor
        categories={this.props.categories}
        featureId={this.props.featureId as any}
        feature={this.props.feature as any}
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
        categories={this.props.categories}
        featureId={this.props.featureId as any}
        feature={this.props.feature as any}
        onSave={(newValue: YesNoLimitedUnknown) => {
          this.props.onClose();
          this.props.onCloseWheelchairAccessibility();
        }}
        presetStatus={this.props.accessibilityPresetStatus}
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
        />
      </section>
    );
  }

  renderEquipmentInfos() {
    const { featureId, equipmentInfoId, onEquipmentSelected } = this.props;
    if (!featureId) {
      return;
    }
    const isWheelmapFeature = isWheelmapFeatureId(featureId);
    if (isWheelmapFeature) {
      return;
    }

    const equipmentInfoSet = equipmentInfoCache.getIndexedFeatures(
      'properties.placeInfoId',
      featureId
    );
    if (!equipmentInfoSet) {
      return;
    }

    const equipmentInfos = fromPairs(
      Array.from(equipmentInfoSet).map(equipmentInfo => [
        get(equipmentInfo, 'properties._id'),
        equipmentInfo,
      ])
    );

    return (
      <EquipmentOverview
        placeInfoId={String(featureId)}
        equipmentInfos={equipmentInfos}
        equipmentInfoId={equipmentInfoId}
        onEquipmentSelected={onEquipmentSelected}
      />
    );
  }

  renderContentBelowHeader() {
    const {
      accessibilityPresetStatus,
      equipmentInfo,
      equipmentInfoId,
      feature,
      featureId,
      onOpenReportMode,
      sources,
    } = this.props;

    const isEquipment = !!equipmentInfoId;

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

    if (!featureId) return;

    const sourceLinkProps = {
      equipmentInfoId,
      feature,
      featureId,
      onOpenReportMode,
      sources,
    };

    const accessibilitySection = isEquipment ? (
      <EquipmentAccessibility equipmentInfo={equipmentInfo} />
    ) : (
      <PlaceAccessibilitySection presetStatus={accessibilityPresetStatus} {...this.props} />
    );

    const inlineWheelchairAccessibilityEditor = this.renderInlineWheelchairAccessibilityEditor();
    const photoSection = this.renderPhotoSection();
    const equipmentOverview = this.renderEquipmentInfos();

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
    const { onClose, modalNodeState } = this.props;

    return modalNodeState ? null : <PositionedCloseLink {...{ onClick: onClose }} />;
  }

  render() {
    const hasWindow = typeof window !== 'undefined';
    const offset = hasBigViewport() ? 0 : 0.4 * (hasWindow ? window.innerHeight : 0);

    return (
      <FocusTrap
        // We need to set clickOutsideDeactivates here as we want clicks on e.g. the map markers to not be prevented.
        focusTrapOptions={{ clickOutsideDeactivates: true }}
      >
        <StyledToolbar
          ref={this.toolbar}
          hidden={this.props.hidden}
          isModal={this.props.modalNodeState !== null}
          role="dialog"
          ariaLabel={this.placeName()}
          startTopOffset={offset}
          onScrollable={isScrollable => this.setState({ isScrollable })}
          inEmbedMode={this.props.inEmbedMode}
          isBelowSearchField={true}
        >
          <ErrorBoundary>
            {this.renderNodeHeader()}
            {this.renderContentBelowHeader()}
          </ErrorBoundary>
        </StyledToolbar>
      </FocusTrap>
    );
  }
}

export default NodeToolbar;
