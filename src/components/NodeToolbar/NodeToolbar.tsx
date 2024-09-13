import FocusTrap from 'focus-trap-react'
import fromPairs from 'lodash/fromPairs'
import get from 'lodash/get'
import includes from 'lodash/includes'
import * as React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'

import { EquipmentInfo, PlaceInfo } from '@sozialhelden/a11yjson'
import Button from '../shared/Button'
import CloseLink from '../shared/CloseLink'
import ErrorBoundary from '../shared/ErrorBoundary'
import EquipmentAccessibility from './AccessibilitySection/EquipmentAccessibility'
import PlaceAccessibilitySection from './AccessibilitySection/PlaceAccessibilitySectionLegacy'
import EquipmentOverview from './Equipment/EquipmentOverview'
import NodeHeader from './NodeHeader'
import PhotoSection from './Photos/PhotoSection'
import ReportDialog from './Report/ReportDialog'
import SourceList from './SourceList'
import StyledToolbar from './StyledToolbar'

import {
  YesNoLimitedUnknown,
  isWheelmapFeatureId,
} from '../../lib/model/ac/Feature'
import { PhotoModel } from '../../lib/model/ac/PhotoModel'
import { isWheelchairAccessible } from '../../lib/model/accessibility/isWheelchairAccessible'
import { placeNameFor } from '../../lib/model/geo/placeNameFor'

import { SourceWithLicense } from '../../../app/PlaceDetailsProps'
import { ModalNodeState } from '../../lib/ModalNodeState'
import { equipmentInfoCache } from '../../lib/cache/EquipmentInfoCache'
import {
  Category,
  CategoryLookupTables,
  getTranslatedCategoryNameFor,
} from '../../lib/model/ac/categories/Categories'
import { UAResult } from '../../lib/userAgent'
import { Cluster } from '../Map/Cluster'
import InlineWheelchairAccessibilityEditor from './AccessibilityEditor/InlineWheelchairAccessibilityEditor'
import ToiletStatusEditor from './AccessibilityEditor/ToiletStatusEditor'
import WheelchairStatusEditor from './AccessibilityEditor/WheelchairStatusEditor'
import isA11yEditable from './AccessibilityEditor/isA11yEditable'
import IconButtonList from './IconButtonList/IconButtonList'
import { AppContextConsumer } from './AppContextConsumer'

const PositionedCloseLink = styled(CloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`
PositionedCloseLink.displayName = 'PositionedCloseLink'

type Props = {
  equipmentInfoId: string | null;
  equipmentInfo: EquipmentInfo | null;
  feature: PlaceInfo | EquipmentInfo | null;
  featureId: string | number;
  cluster: Cluster | null;
  sources: SourceWithLicense[];
  photos: PhotoModel[];
  toiletsNearby: PlaceInfo[] | null;
  categories: CategoryLookupTables;
  category: Category | null;
  parentCategory: Category | null;
  hidden: boolean;
  modalNodeState: ModalNodeState;
  userAgent: UAResult;
  minimalTopPosition: number;
  onClose: () => void;
  onOpenReportMode: () => void | null;
  onOpenToiletAccessibility: () => void;
  onOpenWheelchairAccessibility: () => void;
  onOpenToiletNearby: (feature: PlaceInfo) => void;
  onCloseWheelchairAccessibility: () => void;
  onCloseToiletAccessibility: () => void;
  onClickCurrentCluster?: (cluster: Cluster) => void;
  onShowPlaceDetails?: (featureId: string | number) => void;
  // Simple 3-button wheelchair status editor
  accessibilityPresetStatus?: YesNoLimitedUnknown | null;
  onSelectWheelchairAccessibility?: (value: YesNoLimitedUnknown) => void;
  onEquipmentSelected?: (
    placeInfoId: string,
    equipmentInfo: EquipmentInfo
  ) => void;

  // photo feature
  onStartPhotoUploadFlow: () => void;
  onReportPhoto: (photo: PhotoModel) => void;
  photoFlowNotification?:
    | 'uploadProgress'
    | 'uploadFailed'
    | 'reported'
    | 'waitingForReview';
  photoFlowErrorMessage: string | null;
  onClickCurrentMarkerIcon?: (feature: Feature) => void;
};

type State = {};

class NodeToolbar extends React.PureComponent<Props, State> {
  toolbar = React.createRef<HTMLElement>()

  reportDialog: React.ElementRef<typeof ReportDialog> | null

  state = {}

  placeName() {
    return placeNameFor(
      get(this.props, 'feature.properties'),
      this.props.category,
    )
  }

  focus() {
    this.toolbar.current?.focus()
  }

  onLightboxStateChange = (isLightboxOpen: boolean) => {}

  renderReportDialog() {
    return (
      <AppContextConsumer>
        {(appContext) => (
          <ReportDialog
            appContext={appContext}
            categories={this.props.categories}
            feature={this.props.feature}
            featureId={this.props.featureId}
            onClose={() => {
              if (this.props.onClose) this.props.onClose()
            }}
          />
        )}
      </AppContextConsumer>
    )
  }

  renderIconButtonList() {
    return <IconButtonList {...this.props} />
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
    } = this.props

    const statesWithIcon = ['edit-toilet-accessibility', 'report']
    const isModalStateWithPlaceIcon = includes(
      statesWithIcon,
      this.props.modalNodeState,
    )
    const hasIcon = !this.props.modalNodeState || isModalStateWithPlaceIcon

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
      >
        {this.renderCloseLink()}
      </NodeHeader>
    )
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
        onLightbox={this.onLightboxStateChange}
      />
    )
  }

  renderPlaceNameForEquipment() {
    const { featureId } = this.props
    if (!featureId) return

    return (
      <Button
        className="link-button"
        onClick={(e) => {
          if (this.props.onShowPlaceDetails) {
            this.props.onShowPlaceDetails(this.props.featureId)
            e.preventDefault()
            e.stopPropagation()
          }
        }}
      >
        {this.placeName()}
      </Button>
    )
  }

  renderToiletAccessibilityEditor() {
    return (
      <ToiletStatusEditor
        categories={this.props.categories}
        featureId={this.props.featureId as any}
        feature={this.props.feature}
        onSave={() => {
          this.props.onClose()
          this.props.onCloseToiletAccessibility()
        }}
        onClose={this.props.onClose}
      />
    )
  }

  renderWheelchairAccessibilityEditor() {
    return (
      <WheelchairStatusEditor
        categories={this.props.categories}
        featureId={this.props.featureId as any}
        feature={this.props.feature}
        onSave={() => {
          this.props.onClose()
          this.props.onCloseWheelchairAccessibility()
        }}
        presetStatus={this.props.accessibilityPresetStatus}
        onClose={this.props.onClose}
      />
    )
  }

  renderInlineWheelchairAccessibilityEditor(
    feature: PlaceInfo | EquipmentInfo,
    category: null | undefined | Category,
    sources: null | undefined | SourceWithLicense[],
  ) {
    const { featureId } = this.props
    const wheelchairAccessibility = feature.properties
      ? isWheelchairAccessible(feature.properties)
      : 'unknown'

    if (wheelchairAccessibility !== 'unknown') {
      return null
    }

    const primarySource = sources && sources.length > 0 ? sources[0].source : undefined
    // translator: Shown as header/title when you edit wheelchair accessibility of a place
    const header = t`How wheelchair accessible is this place?`

    const categoryName = getTranslatedCategoryNameFor(category)

    return (
      <AppContextConsumer>
        {(appContext) => {
          if (!isA11yEditable(featureId, appContext.app, primarySource)) {
            return null
          }

          return (
            <section>
              <h4 id="wheelchair-accessibility-header">{header}</h4>
              <InlineWheelchairAccessibilityEditor
                category={categoryName}
                onChange={this.props.onSelectWheelchairAccessibility}
              />
            </section>
          )
        }}
      </AppContextConsumer>
    )
  }

  renderEquipmentInfos() {
    const { featureId, equipmentInfoId, onEquipmentSelected } = this.props
    if (!featureId) {
      return
    }
    const isWheelmapFeature = isWheelmapFeatureId(featureId)
    if (isWheelmapFeature) {
      return
    }

    const equipmentInfoSet = equipmentInfoCache.getIndexedFeatures(
      'properties.placeInfoId',
      featureId,
    )
    if (!equipmentInfoSet) {
      return
    }

    const equipmentInfos = fromPairs(
      Array.from(equipmentInfoSet).map((equipmentInfo) => [
        get(equipmentInfo, 'properties._id'),
        equipmentInfo,
      ]),
    )

    return (
      <EquipmentOverview
        placeInfoId={String(featureId)}
        equipmentInfos={equipmentInfos}
        equipmentInfoId={equipmentInfoId}
        onEquipmentSelected={onEquipmentSelected}
      />
    )
  }

  renderContentBelowHeader() {
    const {
      accessibilityPresetStatus,
      equipmentInfo,
      equipmentInfoId,
      feature,
      featureId,
      onOpenReportMode,
      category,
      sources,
    } = this.props

    const isEquipment = !!equipmentInfoId

    if (featureId && !isEquipment) {
      switch (this.props.modalNodeState) {
      case 'edit-wheelchair-accessibility':
        return this.renderWheelchairAccessibilityEditor()
      case 'edit-toilet-accessibility':
        return this.renderToiletAccessibilityEditor()
      case 'report':
        return this.renderReportDialog()
      default:
        break
      }
    }

    if (!featureId) return

    const sourceLinkProps = {
      equipmentInfoId,
      feature,
      featureId,
      onOpenReportMode,
      sources,
    }

    const accessibilitySection = isEquipment ? (
      <EquipmentAccessibility equipmentInfo={equipmentInfo} />
    ) : (
      <PlaceAccessibilitySection
        presetStatus={accessibilityPresetStatus}
        isWheelmapFeature={isWheelmapFeatureId(featureId)}
        {...this.props}
      />
    )

    const inlineWheelchairAccessibilityEditor = feature
      ? this.renderInlineWheelchairAccessibilityEditor(
        feature,
        category,
        sources,
      )
      : null
    const photoSection = this.renderPhotoSection()
    const equipmentOverview = this.renderEquipmentInfos()

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
    )
  }

  renderCloseLink() {
    const { onClose } = this.props
    return <PositionedCloseLink {...{ onClick: onClose }} />
  }

  render() {
    return (
      <FocusTrap
        // We need to set clickOutsideDeactivates here as we want clicks on e.g. the map markers to not be prevented.
        focusTrapOptions={{ clickOutsideDeactivates: true }}
      >
        <div>
          <StyledToolbar
            ref={this.toolbar}
            hidden={this.props.hidden}
            isModal={this.props.modalNodeState !== null}
            role="dialog"
            ariaLabel={this.placeName()}
            minimalTopPosition={this.props.minimalTopPosition}
            minimalHeight={135}
          >
            <ErrorBoundary>
              {this.renderNodeHeader()}
              {this.renderContentBelowHeader()}
            </ErrorBoundary>
          </StyledToolbar>
        </div>
      </FocusTrap>
    )
  }
}

export default NodeToolbar
