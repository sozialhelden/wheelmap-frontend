// @flow

import * as React from 'react';
import { t } from 'ttag';

import NodeToolbar from './NodeToolbar';
import EmptyToolbarWithLoadingIndicator from './EmptyToolbarWithLoadingIndicator';

import { type Cluster } from '../../components/Map/Cluster';
import Categories, {
  type Category,
  type CategoryLookupTables,
  getCategoryId,
} from '../../lib/Categories';
import {
  Feature,
  YesNoLimitedUnknown,
  wheelmapFeatureFrom,
  isWheelchairAccessible,
} from '../../lib/Feature';
import { isWheelmapFeatureId } from '../../lib/Feature';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';
import type { ModalNodeState } from '../../lib/ModalNodeState';
import type { PhotoModel } from '../../lib/PhotoModel';
import { type SourceWithLicense } from '../../app/PlaceDetailsProps';
import {
  type PlaceDetailsProps,
  getPlaceDetailsIfAlreadyResolved,
} from '../../app/PlaceDetailsProps';
import DetailPanel from './DetailPanel';
import WheelchairAndToiletAccessibility from './AccessibilitySection/WheelchairAndToiletAccessibility';
import Description from './AccessibilitySection/Description';
import AccessibleDescription from './AccessibilitySection/AccessibleDescription';
import IconButtonList from './IconButtonList/IconButtonList';
import InlineWheelchairAccessibilityEditor from './AccessibilityEditor/InlineWheelchairAccessibilityEditor';
import StyledPhotoSection from './Photos/PhotoSection';
import filterAccessibility from '../../lib/filterAccessibility';
import StyledAccessibilityDetailsTree from './AccessibilitySection/AccessibilityDetailsTree';
import A11yDetails from './A11yDetails';
import SourcePraise from './SourcePraise';
import Icon from '../Icon';
import AccessibilitySourceDisclaimer from './AccessibilitySection/AccessibilitySourceDisclaimer';
import { AppContextConsumer } from '../../AppContext';
import PhotoUploadButton from '../PhotoUpload/PhotoUploadButton';

type Props = {
  categories: CategoryLookupTables,
  cluster: ?Cluster,
  hidden: boolean,
  modalNodeState: ModalNodeState,
  onDetailPanelClose: () => void,
  onOpenReportMode: ?() => void,
  onStartPhotoUploadFlow: () => void,
  onClose?: ?() => void,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
  onSelectWheelchairAccessibility?: (newValue: YesNoLimitedUnknown) => void,
  onEquipmentSelected: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void,
  onShowPlaceDetails: (featureId: string | number) => void,
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
} & PlaceDetailsProps;

type RequiredData = {
  resolvedFeature: ?Feature,
  resolvedEquipmentInfo: ?EquipmentInfo,
};

type State = {
  category: ?Category,
  parentCategory: ?Category,
  resolvedRequiredData: ?RequiredData,
  requiredDataPromise: ?Promise<RequiredData>,
  resolvedSources: ?(SourceWithLicense[]),
  resolvedPhotos: ?(PhotoModel[]),
  resolvedToiletsNearby: ?(Feature[]),
  isLoadingToiletsNearby: boolean,
  lastFeatureId: ?(string | number),
  lastEquipmentInfoId: ?string,
};

class NodeToolbarFeatureLoader extends React.Component<Props, State> {
  props: Props;
  state = {
    category: null,
    parentCategory: null,
    resolvedRequiredData: null,
    resolvedSources: null,
    resolvedPhotos: null,
    resolvedToiletsNearby: null,
    isLoadingToiletsNearby: false,
    requiredDataPromise: null,
    lastFeatureId: null,
    lastEquipmentInfoId: null,
  };
  nodeToolbar: ?React.ElementRef<typeof NodeToolbar>;

  static getDerivedStateFromProps(props: Props, state: State): $Shape<State> {
    // keep old data when unchanged
    if (
      state.lastFeatureId === props.featureId &&
      state.lastEquipmentInfoId === props.equipmentInfoId
    ) {
      return state;
    }

    const resolvedPlaceDetails = getPlaceDetailsIfAlreadyResolved(props);
    // use resolved data if available (on server at least the required data is preloaded)
    if (resolvedPlaceDetails) {
      const resolvedCategories = Categories.getCategoriesForFeature(
        props.categories,
        resolvedPlaceDetails.equipmentInfo || resolvedPlaceDetails.feature
      );
      const { feature, equipmentInfo } = resolvedPlaceDetails;
      return {
        ...state,
        ...resolvedCategories,
        resolvedSources: resolvedPlaceDetails.sources,
        resolvedPhotos: resolvedPlaceDetails.photos,
        resolvedToiletsNearby: resolvedPlaceDetails.toiletsNearby,
        resolvedRequiredData: { resolvedFeature: feature, resolvedEquipmentInfo: equipmentInfo },
        lastFeatureId: props.featureId,
        lastEquipmentInfoId: props.equipmentInfoId,
      };
    }

    // resolve lightweight categories if it is set
    let categories = { category: null, parentCategory: null };
    if (props.lightweightFeature) {
      categories = Categories.getCategoriesForFeature(props.categories, props.lightweightFeature);
    }

    // wait for new data
    return {
      ...state,
      ...categories,
      lastFeatureId: props.featureId,
      lastEquipmentInfoId: props.equipmentInfoId,
      resolvedRequiredData: null,
      requiredDataPromise: null,
      resolvedPhotos: null,
      resolvedSources: null,
      resolvedToiletsNearby: null,
    };
  }

  componentDidMount() {
    this.awaitRequiredData();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const prevFeatureId = prevProps.featureId;
    const prevEquipmentInfoId = prevProps.equipmentInfoId;

    if (
      prevFeatureId !== this.props.featureId ||
      prevEquipmentInfoId !== this.props.equipmentInfoId
    ) {
      this.awaitRequiredData();
    }
  }

  focus() {
    if (this.nodeToolbar) {
      this.nodeToolbar.focus();
    }
  }

  awaitRequiredData() {
    const resolvedPlaceDetails = getPlaceDetailsIfAlreadyResolved(this.props);
    if (resolvedPlaceDetails) {
      const resolvedCategories = Categories.getCategoriesForFeature(
        this.props.categories,
        resolvedPlaceDetails.equipmentInfo || resolvedPlaceDetails.feature
      );
      const { feature, equipmentInfo } = resolvedPlaceDetails;
      this.setState({
        resolvedRequiredData: { resolvedFeature: feature, resolvedEquipmentInfo: equipmentInfo },
        resolvedSources: resolvedPlaceDetails.sources,
        resolvedPhotos: resolvedPlaceDetails.photos,
        resolvedToiletsNearby: resolvedPlaceDetails.toiletsNearby,
        ...resolvedCategories,
      });
    }

    const { feature, equipmentInfo, sources, photos, toiletsNearby } = this.props;

    // required data promise
    if (feature instanceof Promise && (!equipmentInfo || equipmentInfo instanceof Promise)) {
      const requiredDataPromise: Promise<RequiredData> = feature.then(async resolvedFeature => {
        let resolvedEquipmentInfo = null;
        if (equipmentInfo) {
          resolvedEquipmentInfo = await equipmentInfo;
        }
        return { resolvedFeature, resolvedEquipmentInfo };
      });

      this.setState({ requiredDataPromise }, () => {
        requiredDataPromise.then(resolved =>
          this.handleRequiredDataFetched(requiredDataPromise, resolved)
        );
      });
    }

    // toilets nearby promise
    if (toiletsNearby instanceof Promise) {
      this.setState({ isLoadingToiletsNearby: true }, () => {
        toiletsNearby.then(resolved => this.handleToiletsNearbyFetched(toiletsNearby, resolved));
      });
    }

    // sources promise
    if (sources instanceof Promise) {
      sources.then(resolved => this.handleSourcesFetched(sources, resolved));
    }

    // photos promise
    if (photos instanceof Promise) {
      photos.then(resolved => this.handlePhotosFetched(photos, resolved));
    }
  }

  handleRequiredDataFetched(requiredDataPromise: Promise<RequiredData>, resolved: RequiredData) {
    // ignore unwanted promise results (e.g. after unmounting)
    if (requiredDataPromise !== this.state.requiredDataPromise) {
      return;
    }

    const { resolvedFeature, resolvedEquipmentInfo } = resolved;
    const resolvedCategories = Categories.getCategoriesForFeature(
      this.props.categories,
      resolvedEquipmentInfo || resolvedFeature
    );
    this.setState({
      resolvedRequiredData: { resolvedFeature, resolvedEquipmentInfo },
      ...resolvedCategories,
    });
  }

  handlePhotosFetched(photosPromise: Promise<PhotoModel[]>, resolvedPhotos: PhotoModel[]) {
    // ignore unwanted promise results (e.g. after unmounting)
    if (photosPromise !== this.props.photos) {
      return;
    }
    this.setState({ resolvedPhotos });
  }

  handleToiletsNearbyFetched(
    toiletsNearbyPromise: Promise<Feature[]>,
    resolvedToiletsNearby: Feature[]
  ) {
    // ignore unwanted promise results (e.g. after unmounting)
    if (toiletsNearbyPromise !== this.props.toiletsNearby) {
      return;
    }
    this.setState({ resolvedToiletsNearby, isLoadingToiletsNearby: false });
  }

  handleSourcesFetched(
    sourcesPromise: Promise<SourceWithLicense[]>,
    resolvedSources: SourceWithLicense[]
  ) {
    // ignore unwanted promise results (e.g. after unmounting)
    if (sourcesPromise !== this.props.sources) {
      return;
    }
    this.setState({ resolvedSources });
  }

  renderDetailPanel() {
    const {
      category,
      parentCategory,
      resolvedRequiredData,
      resolvedToiletsNearby,
      isLoadingToiletsNearby,
      resolvedPhotos,
      resolvedSources,
    } = this.state;

    const {
      featureId,
      userAgent,
      onDetailPanelClose,
      onOpenWheelchairAccessibility,
      onOpenToiletAccessibility,
      onOpenToiletNearby,
      onSelectWheelchairAccessibility,
      onReportPhoto,
      onStartPhotoUploadFlow,
      photoFlowNotification,
      photoFlowErrorMessage,
      accessibilityPresetStatus,
    } = this.props;

    if (!resolvedRequiredData || !resolvedRequiredData.resolvedFeature) {
      return null;
    }

    const feature = resolvedRequiredData.resolvedFeature;
    const toiletsNearby = resolvedToiletsNearby || [];

    let description: ?string = null;
    if (feature.properties && typeof feature.properties.wheelchair_description === 'string') {
      description = feature.properties.wheelchair_description;
    }

    const descriptionElement = description ? <Description>{description}</Description> : null;

    let inlineWheelchairAccessibilityEditorElement;
    const wheelmapFeature = wheelmapFeatureFrom(feature);

    if (
      !wheelmapFeature ||
      !wheelmapFeature.properties ||
      wheelmapFeature.properties.wheelchair !== 'unknown'
    ) {
      inlineWheelchairAccessibilityEditorElement = null;
    } else {
      // translator: Shown as header/title when you edit wheelchair accessibility of a place
      const header = t`How wheelchair accessible is this place?`;
      inlineWheelchairAccessibilityEditorElement = (
        <section>
          <h4 id="wheelchair-accessibility-header">{header}</h4>
          <InlineWheelchairAccessibilityEditor
            category={getCategoryId(category)}
            onChange={onSelectWheelchairAccessibility}
            presetStatus={accessibilityPresetStatus}
          />
        </section>
      );
    }

    const accessibilitySectionElement = (
      <section>
        {inlineWheelchairAccessibilityEditorElement}
        <WheelchairAndToiletAccessibility
          isEditingEnabled={isWheelmapFeatureId(featureId)}
          feature={feature}
          toiletsNearby={toiletsNearby}
          isLoadingToiletsNearby={isLoadingToiletsNearby}
          onOpenWheelchairAccessibility={onOpenWheelchairAccessibility}
          onOpenToiletAccessibility={onOpenToiletAccessibility}
          onOpenToiletNearby={onOpenToiletNearby}
        />
        {description && descriptionElement}
        <AccessibleDescription properties={feature.properties} />
      </section>
    );

    const iconButtonListElement = (
      <IconButtonList
        feature={feature}
        featureId={featureId}
        category={category}
        parentCategory={parentCategory}
        userAgent={userAgent}
        onToggle={() => {
          if (this.toolbar) this.toolbar.ensureFullVisibility();
        }}
      />
    );

    const photoSectionElement = (
      <StyledPhotoSection
        featureId={featureId}
        photos={resolvedPhotos || []}
        onReportPhoto={onReportPhoto}
        onStartPhotoUploadFlow={onStartPhotoUploadFlow}
        photoFlowNotification={photoFlowNotification}
        photoFlowErrorMessage={photoFlowErrorMessage}
      />
    );

    const accessibilityTree =
      feature.properties && typeof feature.properties.accessibility === 'object'
        ? feature.properties.accessibility
        : null;
    const filteredAccessibilityTree = accessibilityTree
      ? filterAccessibility(accessibilityTree)
      : null;

    const a11yDetailsElement = <A11yDetails details={filteredAccessibilityTree} />;

    const sourcePraiseElement =
      resolvedSources && resolvedSources.length > 0 ? (
        <SourcePraise sources={resolvedSources} />
      ) : null;

    const categoryId = getCategoryId(category);
    const iconElement = (
      <Icon
        accessibility={isWheelchairAccessible(feature.properties)}
        category={categoryId || 'undefined'}
        size="big"
        ariaHidden={true}
      />
    );

    const sourceDisclaimerElement = (
      <AppContextConsumer>
        {appContext => (
          <AccessibilitySourceDisclaimer
            properties={feature.properties}
            appToken={appContext.app.tokenString}
          />
        )}
      </AppContextConsumer>
    );

    const photoUploadButtonElement =
      resolvedPhotos && resolvedPhotos.length !== 0 ? (
        <PhotoUploadButton
          onClick={onStartPhotoUploadFlow}
          textVisible={false}
          incentiveHintVisible={true}
        />
      ) : null;

    const elements = {
      iconElement,
      accessibilitySectionElement,
      iconButtonListElement,
      photoSectionElement,
      photoUploadButtonElement,
      a11yDetailsElement,
      sourcePraiseElement,
      sourceDisclaimerElement,
    };

    return (
      <DetailPanel
        feature={feature}
        categories={this.props.categories}
        onClose={onDetailPanelClose}
        {...elements}
      />
    );
  }

  render() {
    const {
      category,
      parentCategory,
      resolvedRequiredData,
      resolvedPhotos,
      resolvedSources,
      resolvedToiletsNearby,
    } = this.state;
    // strip promises from props
    const {
      feature,
      sources,
      equipmentInfo,
      lightweightFeature,
      photos,
      toiletsNearby,
      ...remainingProps
    } = this.props;

    if (resolvedRequiredData && resolvedRequiredData.resolvedFeature) {
      const { resolvedFeature, resolvedEquipmentInfo } = resolvedRequiredData;

      const useNodeToolbar = this.props.modalNodeState || resolvedEquipmentInfo;

      if (useNodeToolbar) {
        return (
          <NodeToolbar
            {...remainingProps}
            featureId={remainingProps.featureId}
            equipmentInfoId={remainingProps.equipmentInfoId}
            category={category}
            parentCategory={parentCategory}
            feature={resolvedFeature}
            equipmentInfo={resolvedEquipmentInfo}
            sources={resolvedSources || []}
            photos={resolvedPhotos || []}
            toiletsNearby={resolvedToiletsNearby || []}
            isLoadingToiletsNearby={this.state.isLoadingToiletsNearby}
            ref={t => (this.nodeToolbar = t)}
          />
        );
      } else {
        return this.renderDetailPanel();
      }
    } else if (lightweightFeature) {
      return (
        <NodeToolbar
          {...remainingProps}
          featureId={remainingProps.featureId}
          equipmentInfoId={remainingProps.equipmentInfoId}
          category={category}
          parentCategory={parentCategory}
          feature={lightweightFeature}
          equipmentInfo={null}
          toiletsNearby={null}
          isLoadingToiletsNearby={true}
          sources={[]}
          photos={[]}
          ref={t => (this.nodeToolbar = t)}
        />
      );
    }

    return <EmptyToolbarWithLoadingIndicator hidden={this.props.hidden} />;
  }
}

export default NodeToolbarFeatureLoader;
