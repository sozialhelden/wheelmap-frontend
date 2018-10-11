// @flow

import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';

import NodeToolbar from './NodeToolbar';
import EmptyToolbarWithLoadingIndicator from './EmptyToolbarWithLoadingIndicator';

import Categories, { type Category, type CategoryLookupTables } from '../../lib/Categories';
import type { Feature, YesNoLimitedUnknown } from '../../lib/Feature';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';
import type { ModalNodeState } from '../../lib/queryParams';
import type { PhotoModel } from './Photos/PhotoModel';
import {
  type PlaceDetailsProps,
  type ResolvedPlaceDetailsProps,
  awaitPlaceDetails,
  getPlaceDetailsIfAlreadyResolved,
} from '../../app/PlaceDetailsProps';

type Props = {
  categories: CategoryLookupTables,
  hidden: boolean,
  modalNodeState: ModalNodeState,
  onOpenReportMode: ?() => void,
  onStartPhotoUploadFlow: () => void,
  history: RouterHistory,
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
  presetStatus: YesNoLimitedUnknown,
  onSelectWheelchairAccessibility: (value: YesNoLimitedUnknown) => void,

  // photo feature
  onStartPhotoUploadFlow: () => void,
  onReportPhoto: (photo: PhotoModel) => void,
  photoFlowNotification?: string,
  photoFlowErrorMessage: ?string,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
} & PlaceDetailsProps;

type State = {
  category: ?Category,
  parentCategory: ?Category,
  resolvedPlaceDetails: ?ResolvedPlaceDetailsProps,
};

class NodeToolbarFeatureLoader extends React.Component<Props, State> {
  props: Props;
  state = { category: null, parentCategory: null, resolvedPlaceDetails: null };
  nodeToolbar: ?React.ElementRef<typeof NodeToolbar>;

  static getDerivedStateFromProps(props: Props, state: State) {
    const resolvedPlaceData = getPlaceDetailsIfAlreadyResolved(props);

    // use resolved data
    if (resolvedPlaceData) {
      const resolvedCategories = Categories.getCategoriesForFeature(
        props.categories,
        resolvedPlaceData.equipmentInfo || resolvedPlaceData.feature
      );
      return { ...state, ...resolvedCategories, resolvedPlaceDetails: resolvedPlaceData };
    }

    // keep old data when unchanged
    if (
      state.resolvedPlaceDetails &&
      state.resolvedPlaceDetails.featureId === props.featureId &&
      state.resolvedPlaceDetails.equipmentInfoId === props.equipmentInfoId
    ) {
      return state;
    }

    let categories = { category: null, parentCategory: null };

    // resolve lightweight categories
    if (props.lightweightFeature) {
      categories = Categories.getCategoriesForFeature(props.categories, props.lightweightFeature);
    }

    // wait for new data
    return {
      ...state,
      ...categories,
      resolvedPlaceDetails: null,
    };
  }

  componentDidMount() {
    this.awaitData(this.props);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const prevFeatureId = prevProps.featureId;
    const prevEquipmentInfoId = prevProps.equipmentInfoId;
    if (
      prevFeatureId !== this.props.featureId ||
      prevEquipmentInfoId !== this.props.equipmentInfoId
    ) {
      this.awaitData(this.props);
    }
  }

  focus() {
    if (this.nodeToolbar) {
      this.nodeToolbar.focus();
    }
  }

  awaitData(props: Props) {
    const resolvedPlaceDetails = getPlaceDetailsIfAlreadyResolved(props);

    if (resolvedPlaceDetails) {
      const resolvedCategories = Categories.getCategoriesForFeature(
        props.categories,
        resolvedPlaceDetails.equipmentInfo || resolvedPlaceDetails.feature
      );
      this.setState({ resolvedPlaceDetails, ...resolvedCategories });
    } else {
      this.setState({ resolvedPlaceDetails: null });
      awaitPlaceDetails(this.props).then(resolved => {
        const resolvedCategories = Categories.getCategoriesForFeature(
          props.categories,
          resolved.equipmentInfo || resolved.feature
        );
        this.setState({ resolvedPlaceDetails: resolved, ...resolvedCategories });
      });
    }
  }

  render() {
    const { category, parentCategory, resolvedPlaceDetails } = this.state;
    const { feature, sources, equipmentInfo, lightweightFeature, ...remainingProps } = this.props;

    if (resolvedPlaceDetails) {
      return (
        <NodeToolbar
          category={category}
          parentCategory={parentCategory}
          {...remainingProps}
          {...resolvedPlaceDetails}
          ref={t => (this.nodeToolbar = t)}
        />
      );
    } else if (lightweightFeature) {
      return (
        <NodeToolbar
          category={category}
          parentCategory={parentCategory}
          {...remainingProps}
          feature={lightweightFeature}
          sources={[]}
          ref={t => (this.nodeToolbar = t)}
        />
      );
    }

    return <EmptyToolbarWithLoadingIndicator hidden={this.props.hidden} />;
  }
}

export default NodeToolbarFeatureLoader;
