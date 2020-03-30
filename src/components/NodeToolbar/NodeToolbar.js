// @flow

import * as React from 'react';
import FocusTrap from 'focus-trap-react';
import get from 'lodash/get';
import includes from 'lodash/includes';
import fromPairs from 'lodash/fromPairs';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import ErrorBoundary from '../ErrorBoundary';
import NodeHeader from './NodeHeader';
import SourceList from './SourceList';
import StyledToolbar from './StyledToolbar';
import ReportDialog from './Report/ReportDialog';
import PhotoSection from './Photos/PhotoSection';
import EquipmentOverview from './Equipment/EquipmentOverview';
import EquipmentAccessibility from './AccessibilitySection/EquipmentAccessibility';
import Button from '../Button';

import type { PhotoModel } from '../../lib/PhotoModel';
import type {
  Feature,
  YesNoLimitedUnknown,
  YesNoUnknown,
  WheelmapFeature,
} from '../../lib/Feature';
import { isWheelmapFeatureId, placeNameFor } from '../../lib/Feature';
import { type Category, type CategoryLookupTables } from '../../lib/Categories';
import { hasBigViewport } from '../../lib/ViewportSize';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';
import type { ModalNodeState } from '../../lib/ModalNodeState';
import ToiletStatusEditor from './AccessibilityEditor/ToiletStatusEditor';
import WheelchairStatusEditor from './AccessibilityEditor/WheelchairStatusEditor';
import IconButtonList from './IconButtonList/IconButtonList';
import { type SourceWithLicense } from '../../app/PlaceDetailsProps';
import { type Cluster } from '../Map/Cluster';
import { AppContextConsumer } from '../../AppContext';
import { equipmentInfoCache } from '../../lib/cache/EquipmentInfoCache';

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = 'PositionedCloseLink';

type Props = {
  equipmentInfoId: ?string,
  equipmentInfo: ?EquipmentInfo,
  feature: Feature,
  featureId: string | number,
  cluster: ?Cluster,
  sources: SourceWithLicense[],
  photos: PhotoModel[],
  toiletsNearby: ?(Feature[]),
  isLoadingToiletsNearby: boolean,
  categories: CategoryLookupTables,
  category: ?Category,
  parentCategory: ?Category,
  hidden: boolean,
  modalNodeState: ModalNodeState,
  inEmbedMode: boolean,
  onClose: () => void,
  onOpenReportMode: ?() => void,
  onOpenToiletAccessibility: () => void,
  onOpenWheelchairAccessibility: () => void,
  onOpenToiletNearby: (feature: Feature) => void,
  onCloseWheelchairAccessibility: () => void,
  onCloseToiletAccessibility: () => void,
  onClickCurrentCluster?: (cluster: Cluster) => void,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
  onEquipmentSelected: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void,
  onShowPlaceDetails: (featureId: string | number) => void,
  // Simple 3-button wheelchair status editor
  accessibilityPresetStatus?: ?YesNoLimitedUnknown,
  onSelectWheelchairAccessibility: (value: YesNoLimitedUnknown) => void,

  // photo feature
  onStartPhotoUploadFlow: () => void,
  onReportPhoto: (photo: PhotoModel) => void,
  photoFlowNotification?: string,
  photoFlowErrorMessage: ?string,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
};

type State = {
  isScrollable: boolean,
};

class NodeToolbar extends React.Component<Props, State> {
  toolbar: ?React.ElementRef<typeof Toolbar>;
  reportDialog: ?React.ElementRef<typeof ReportDialog>;
  shareButton: ?React.ElementRef<'button'>;
  reportModeButton: ?React.ElementRef<'button'>;

  state = {
    isScrollable: false,
  };

  componentDidMount() {
    if (this.props.photoFlowNotification) {
      // TODO: what is this timeout needed for, and why?
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

  focus() {
    if (this.toolbar) {
      this.toolbar.focus();
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
              if (this.toolbar) {
                this.toolbar.ensureFullVisibility();
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
        featureId={this.props.featureId}
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
        categories={this.props.categories}
        featureId={this.props.featureId}
        feature={((this.props.feature: any): WheelmapFeature)}
        onSave={(newValue: YesNoLimitedUnknown) => {
          this.props.onClose();
          this.props.onCloseWheelchairAccessibility();
        }}
        presetStatus={this.props.accessibilityPresetStatus}
        onClose={this.props.onClose}
      />
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

  // This used to render both equipment and places. But now it's only rendering equipment
  renderContentBelowHeader() {
    const {
      equipmentInfo,
      equipmentInfoId,
      feature,
      featureId,
      onOpenReportMode,
      sources,
      modalNodeState,
    } = this.props;

    const isEquipment = !!equipmentInfoId;

    if (modalNodeState && featureId && !isEquipment) {
      switch (modalNodeState) {
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

    if (!isEquipment) {
      return null;
    }

    if (!featureId) return;

    const sourceLinkProps = {
      equipmentInfoId,
      feature,
      featureId,
      onOpenReportMode,
      sources,
    };

    const accessibilitySection = <EquipmentAccessibility equipmentInfo={equipmentInfo} />;

    const photoSection = this.renderPhotoSection();
    const equipmentOverview = this.renderEquipmentInfos();

    return (
      <div>
        {isEquipment && featureId && this.renderPlaceNameForEquipment()}
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
          ref={toolbar => (this.toolbar = toolbar)}
          hidden={this.props.hidden}
          isSwipeable={false}
          isModal={this.props.modalNodeState}
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
