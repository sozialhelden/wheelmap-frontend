import * as React from 'react'

import { EquipmentInfo, PlaceInfo } from '@sozialhelden/a11yjson'
import NodeToolbar from './NodeToolbar'

import { PlaceDetailsProps, SourceWithLicense, getPlaceDetailsIfAlreadyResolved } from '../../../app/PlaceDetailsProps'
import { YesNoLimitedUnknown } from '../../lib/Feature'
import { ModalNodeState } from '../../lib/ModalNodeState'
import { PhotoModel } from '../../lib/model/ac/PhotoModel'
import Categories, {
  Category,
  CategoryLookupTables,
} from '../../lib/model/ac/categories/Categories'
import { UAResult } from '../../lib/userAgent'
import { Cluster } from '../Map/Cluster'

type Props = {
  categories: CategoryLookupTables;
  cluster: null | Cluster;
  hidden: boolean;
  modalNodeState: ModalNodeState;
  inEmbedMode: boolean;
  onClose: () => void;
  onOpenReportMode: () => void | null;
  onOpenToiletAccessibility: () => void;
  onOpenWheelchairAccessibility: () => void;
  onOpenToiletNearby: (feature: PlaceInfo) => void;
  onCloseWheelchairAccessibility: () => void;
  onCloseToiletAccessibility: () => void;
  onClickCurrentCluster?: (cluster: Cluster) => void;
  onClickCurrentMarkerIcon?: (feature: PlaceInfo) => void;
  onEquipmentSelected: (
    placeInfoId: string,
    equipmentInfo: EquipmentInfo
  ) => void;
  onShowPlaceDetails: (featureId: string | number) => void;
  // Simple 3-button wheelchair status editor
  accessibilityPresetStatus?: null | YesNoLimitedUnknown;
  onSelectWheelchairAccessibility: (value: YesNoLimitedUnknown) => void;

  // photo feature
  onStartPhotoUploadFlow: () => void;
  onReportPhoto: (photo: PhotoModel) => void;
  photoFlowNotification?:
    | 'uploadProgress'
    | 'uploadFailed'
    | 'reported'
    | 'waitingForReview';
  photoFlowErrorMessage: null | string;
  minimalTopPosition: number;
  userAgent: UAResult;
} & PlaceDetailsProps;

type RequiredData = {
  resolvedFeature: null | PlaceInfo | EquipmentInfo;
  resolvedEquipmentInfo: null | EquipmentInfo;
};

type State = {
  category: null | Category;
  parentCategory: null | Category;
  resolvedRequiredData: null | RequiredData;
  requiredDataPromise: null | Promise<RequiredData>;
  resolvedSources: null | SourceWithLicense[];
  resolvedPhotos: null | PhotoModel[];
  resolvedToiletsNearby: null | PlaceInfo[];
  lastFeatureId: null | (string | number);
  lastEquipmentInfoId: null | string;
};

class NodeToolbarFeatureLoader extends React.Component<Props, State> {
  props: Props

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
  }

  nodeToolbar = React.createRef<NodeToolbar>()

  static getDerivedStateFromProps(props: Props, state: State) {
    // keep old data when unchanged
    if (
      state.lastFeatureId === props.featureId
      && state.lastEquipmentInfoId === props.equipmentInfoId
    ) {
      return state
    }

    const resolvedPlaceDetails = getPlaceDetailsIfAlreadyResolved(props)
    // use resolved data if available (on server at least the required data is preloaded)
    if (resolvedPlaceDetails) {
      const resolvedCategories = Categories.getCategoriesForFeature(
        props.categories,
        resolvedPlaceDetails.equipmentInfo || resolvedPlaceDetails.feature,
      )
      const { feature, equipmentInfo } = resolvedPlaceDetails
      return {
        ...state,
        ...resolvedCategories,
        resolvedSources: resolvedPlaceDetails.sources,
        resolvedPhotos: resolvedPlaceDetails.photos,
        resolvedToiletsNearby: resolvedPlaceDetails.toiletsNearby,
        resolvedRequiredData: {
          resolvedFeature: feature,
          resolvedEquipmentInfo: equipmentInfo,
        },
        lastFeatureId: props.featureId,
        lastEquipmentInfoId: props.equipmentInfoId,
      }
    }

    // resolve lightweight categories if it is set
    const categories: {
      category: Category | null;
      parentCategory: Category | null;
    } = {
      category: null,
      parentCategory: null,
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
    }
  }

  componentDidMount() {
    this.awaitRequiredData()
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const prevFeatureId = prevProps.featureId
    const prevEquipmentInfoId = prevProps.equipmentInfoId

    if (
      prevFeatureId !== this.props.featureId
      || prevEquipmentInfoId !== this.props.equipmentInfoId
    ) {
      this.awaitRequiredData()
    }
  }

  focus() {
    if (this.nodeToolbar.current) {
      this.nodeToolbar.current.focus()
    }
  }

  awaitRequiredData() {
    const resolvedPlaceDetails = getPlaceDetailsIfAlreadyResolved(this.props)
    if (resolvedPlaceDetails) {
      const resolvedCategories = Categories.getCategoriesForFeature(
        this.props.categories,
        resolvedPlaceDetails.equipmentInfo || resolvedPlaceDetails.feature,
      )
      const { feature, equipmentInfo } = resolvedPlaceDetails
      this.setState({
        resolvedRequiredData: {
          resolvedFeature: feature,
          resolvedEquipmentInfo: equipmentInfo,
        },
        resolvedSources: resolvedPlaceDetails.sources,
        resolvedPhotos: resolvedPlaceDetails.photos,
        resolvedToiletsNearby: resolvedPlaceDetails.toiletsNearby,
        ...resolvedCategories,
      })
    }

    const {
      feature,
      equipmentInfo,
      sources,
      photos,
      toiletsNearby,
    } = this.props

    // required data promise
    if (
      feature instanceof Promise
      && (!equipmentInfo || equipmentInfo instanceof Promise)
    ) {
      const requiredDataPromise: Promise<RequiredData> = feature.then(
        async (resolvedFeature) => {
          let resolvedEquipmentInfo = null
          if (equipmentInfo) {
            resolvedEquipmentInfo = await equipmentInfo
          }
          return { resolvedFeature, resolvedEquipmentInfo }
        },
      )

      this.setState({ requiredDataPromise }, () => {
        requiredDataPromise.then((resolved) => this.handleRequiredDataFetched(requiredDataPromise, resolved))
      })
    }

    // toilets nearby promise
    if (toiletsNearby instanceof Promise) {
      toiletsNearby.then((resolved) => this.handleToiletsNearbyFetched(toiletsNearby, resolved))
    }

    // sources promise
    if (sources instanceof Promise) {
      sources.then((resolved) => this.handleSourcesFetched(sources, resolved))
    }

    // photos promise
    if (photos instanceof Promise) {
      photos.then((resolved) => this.handlePhotosFetched(photos, resolved))
    }
  }

  handleRequiredDataFetched(
    requiredDataPromise: Promise<RequiredData>,
    resolved: RequiredData,
  ) {
    // ignore unwanted promise results (e.g. after unmounting)
    if (requiredDataPromise !== this.state.requiredDataPromise) {
      return
    }

    const { resolvedFeature, resolvedEquipmentInfo } = resolved
    const resolvedCategories = Categories.getCategoriesForFeature(
      this.props.categories,
      resolvedEquipmentInfo || resolvedFeature,
    )
    this.setState({
      resolvedRequiredData: { resolvedFeature, resolvedEquipmentInfo },
      ...resolvedCategories,
    })
  }

  handlePhotosFetched(
    photosPromise: Promise<PhotoModel[]>,
    resolvedPhotos: PhotoModel[],
  ) {
    // ignore unwanted promise results (e.g. after unmounting)
    if (photosPromise !== this.props.photos) {
      return
    }
    this.setState({ resolvedPhotos })
  }

  handleToiletsNearbyFetched(
    toiletsNearbyPromise: Promise<Feature[]>,
    resolvedToiletsNearby: Feature[],
  ) {
    // ignore unwanted promise results (e.g. after unmounting)
    if (toiletsNearbyPromise !== this.props.toiletsNearby) {
      return
    }
    this.setState({ resolvedToiletsNearby })
  }

  handleSourcesFetched(
    sourcesPromise: Promise<SourceWithLicense[]>,
    resolvedSources: SourceWithLicense[],
  ) {
    // ignore unwanted promise results (e.g. after unmounting)
    if (sourcesPromise !== this.props.sources) {
      return
    }
    this.setState({ resolvedSources })
  }

  render() {
    const {
      category,
      parentCategory,
      resolvedRequiredData,
      resolvedPhotos,
      resolvedSources,
      resolvedToiletsNearby,
    } = this.state
    // strip promises from props
    const {
      feature,
      sources,
      equipmentInfo,
      photos,
      toiletsNearby,
      ...remainingProps
    } = this.props

    const { resolvedFeature, resolvedEquipmentInfo } = resolvedRequiredData || {}

    return (
      <NodeToolbar
        {...remainingProps}
        category={category}
        parentCategory={parentCategory}
        feature={resolvedFeature}
        equipmentInfo={resolvedEquipmentInfo}
        sources={resolvedSources || []}
        photos={resolvedPhotos || []}
        toiletsNearby={resolvedToiletsNearby || []}
        ref={this.nodeToolbar}
      />
    )
  }
}

export default NodeToolbarFeatureLoader
