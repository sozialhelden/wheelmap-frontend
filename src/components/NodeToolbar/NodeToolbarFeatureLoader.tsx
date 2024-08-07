import * as React from 'react';

import NodeToolbar from './NodeToolbar';

import { getPlaceDetailsIfAlreadyResolved, PlaceDetailsProps, SourceWithLicense } from '../../app/PlaceDetailsProps';
import Categories, { Category, CategoryLookupTables } from '../../lib/Categories';
import { EquipmentInfo } from '../../lib/EquipmentInfo';
import { Feature, YesNoLimitedUnknown } from '../../lib/Feature';
import { MappingEvent } from '../../lib/MappingEvent';
import { ModalNodeState } from '../../lib/ModalNodeState';
import { PhotoModel } from '../../lib/PhotoModel';
import { UAResult } from '../../lib/userAgent';
import { Cluster } from '../Map/Cluster';

type Props = {
  categories: CategoryLookupTables,
  cluster: null | Cluster,
  hidden: boolean,
  modalNodeState: ModalNodeState,
  inEmbedMode: boolean,
  onClose: () => void,
  onOpenReportMode: () => void | null,
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
  accessibilityPresetStatus?: null | YesNoLimitedUnknown,
  onSelectWheelchairAccessibility: (value: YesNoLimitedUnknown) => void,

  // photo feature
  onStartPhotoUploadFlow: () => void,
  onReportPhoto: (photo: PhotoModel) => void
  photoFlowNotification?: 'uploadProgress' | 'uploadFailed' | 'reported' | 'waitingForReview',
  photoFlowErrorMessage: null | string,
  minimalTopPosition: number,
  userAgent: UAResult,
  joinedMappingEventId?: string,
  joinedMappingEvent?: MappingEvent,
} & PlaceDetailsProps;

type RequiredData = {
  resolvedFeature: null | Feature,
  resolvedEquipmentInfo: null | EquipmentInfo,
};

type State = {
  category: null | Category,
  parentCategory: null | Category,
  resolvedRequiredData: null | RequiredData,
  requiredDataPromise: null | Promise<RequiredData>,
  resolvedSources: null | SourceWithLicense[],
  resolvedPhotos: null | PhotoModel[],
  resolvedChildPlaceInfos: null | Feature[],
  resolvedToiletsNearby: null | Feature[],
  lastFeatureId: null | (string | number),
  lastEquipmentInfoId: null | string,
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
    requiredDataPromise: null,
    lastFeatureId: null,
    lastEquipmentInfoId: null,
    resolvedChildPlaceInfos: null,
  };
  nodeToolbar = React.createRef<NodeToolbar>();

  static getDerivedStateFromProps(props: Props, state: State) {
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
        resolvedChildPlaceInfos: resolvedPlaceDetails.childPlaceInfos,
        resolvedToiletsNearby: resolvedPlaceDetails.toiletsNearby,
        resolvedRequiredData: { resolvedFeature: feature, resolvedEquipmentInfo: equipmentInfo },
        lastFeatureId: props.featureId,
        lastEquipmentInfoId: props.equipmentInfoId,
      };
    }

    // resolve lightweight categories if it is set
    let categories: { category: Category | null, parentCategory: Category | null } = {
      category: null,
      parentCategory: null,
    };
    if (props.lightweightFeature) {
      categories = Categories.getCategoriesForFeature(props.categories, props.lightweightFeature);
    }

    // wait for new data
    return {
      ...state,
      ...categories,
      lastFeatureId: props.featureId,
      lastEquipmentInfoId: props.equipmentInfoId,
      resolvedChildPlaceInfos: null,
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
    if (this.nodeToolbar.current) {
      this.nodeToolbar.current.focus();
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
        resolvedChildPlaceInfos: resolvedPlaceDetails.childPlaceInfos,
        ...resolvedCategories,
      });
    }

    const { feature, equipmentInfo, sources, photos, toiletsNearby, childPlaceInfos } = this.props;

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

    if (toiletsNearby instanceof Promise) {
      toiletsNearby.then(resolved => this.handleToiletsNearbyFetched(toiletsNearby, resolved));
    }

    if (childPlaceInfos instanceof Promise) {
      childPlaceInfos.then(resolved => this.handleChildPlaceInfosFetched(childPlaceInfos, resolved));
    }

    if (sources instanceof Promise) {
      sources.then(resolved => this.handleSourcesFetched(sources, resolved));
    }

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
    this.setState({ resolvedToiletsNearby });
  }

  handleChildPlaceInfosFetched(
    childPlaceInfosPromise: Promise<Feature[]>,
    resolvedChildPlaceInfos: Feature[]
  ) {
    // ignore unwanted promise results (e.g. after unmounting)
    if (childPlaceInfosPromise !== this.props.childPlaceInfos) {
      return;
    }
    this.setState({ resolvedChildPlaceInfos });
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
      resolvedToiletsNearby,
      resolvedChildPlaceInfos,
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

    const { resolvedFeature, resolvedEquipmentInfo } = resolvedRequiredData || {};

    return (
      <NodeToolbar
        {...remainingProps}
        category={category}
        parentCategory={parentCategory}
        feature={lightweightFeature || resolvedFeature}
        equipmentInfo={resolvedEquipmentInfo}
        sources={resolvedSources || []}
        photos={resolvedPhotos || []}
        toiletsNearby={resolvedToiletsNearby || []}
        childPlaceInfos={resolvedChildPlaceInfos || []}
        ref={this.nodeToolbar}
      />
    );
  }
}

export default NodeToolbarFeatureLoader;
