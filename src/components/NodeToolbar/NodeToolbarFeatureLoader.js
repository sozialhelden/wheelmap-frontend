// @flow

import * as React from 'react';

import NodeToolbar from './NodeToolbar';
import EmptyToolbarWithLoadingIndicator from './EmptyToolbarWithLoadingIndicator';

import Categories, { type Category, type CategoryLookupTables } from '../../lib/Categories';
import type { Feature, YesNoLimitedUnknown } from '../../lib/Feature';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';
import type { ModalNodeState } from '../../lib/ModalNodeState';
import type { PhotoModel } from '../../lib/PhotoModel';
import { type SourceWithLicense } from '../../app/PlaceDetailsProps';
import {
  type PlaceDetailsProps,
  getPlaceDetailsIfAlreadyResolved,
} from '../../app/PlaceDetailsProps';

type Props = {
  categories: CategoryLookupTables,
  hidden: boolean,
  modalNodeState: ModalNodeState,
  onOpenReportMode: ?() => void,
  onStartPhotoUploadFlow: () => void,
  onClose?: ?() => void,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
  onSelectWheelchairAccessibility?: (newValue: YesNoLimitedUnknown) => void,
  onEquipmentSelected: (placeInfoId: string, equipmentInfo: EquipmentInfo) => void,
  onShowPlaceDetails: (featureId: string | number) => void,
  hidden: boolean,
  modalNodeState: ModalNodeState,
  onClose: () => void,
  onOpenReportMode: ?() => void,
  onOpenToiletAccessibility: () => void,
  onOpenWheelchairAccessibility: () => void,
  onCloseWheelchairAccessibility: () => void,
  onCloseToiletAccessibility: () => void,
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
    // use resolved data if available (on server everything is preloaded)
    if (resolvedPlaceDetails) {
      const resolvedCategories = Categories.getCategoriesForFeature(
        props.categories,
        resolvedPlaceDetails.equipmentInfo || resolvedPlaceDetails.feature
      );
      const { feature, equipmentInfo } = resolvedPlaceDetails;
      return {
        ...state,
        ...resolvedCategories,
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
        ...resolvedCategories,
      });
    } else {
      const { feature, equipmentInfo, sources, photos } = this.props;

      // they are always all promises, this is to make flow happy
      if (
        feature instanceof Promise &&
        (!equipmentInfo || equipmentInfo instanceof Promise) &&
        sources instanceof Promise &&
        photos instanceof Promise
      ) {
        // wait for required data
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
          photos.then(resolved => this.handlePhotosFetched(photos, resolved));
          sources.then(resolved => this.handleSourcesFetched(sources, resolved));
        });
      } else {
        console.warn('received mixed promise / resolved results - this should never happen!');
        return;
      }
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

  render() {
    const {
      category,
      parentCategory,
      resolvedRequiredData,
      resolvedPhotos,
      resolvedSources,
    } = this.state;
    // strip promises from props
    const {
      feature,
      sources,
      equipmentInfo,
      lightweightFeature,
      photos,
      ...remainingProps
    } = this.props;

    if (resolvedRequiredData && resolvedRequiredData.resolvedFeature) {
      const { resolvedFeature, resolvedEquipmentInfo } = resolvedRequiredData;

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
          ref={t => (this.nodeToolbar = t)}
        />
      );
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
