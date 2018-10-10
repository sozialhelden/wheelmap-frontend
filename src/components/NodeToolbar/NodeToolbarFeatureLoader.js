// @flow

import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';

import NodeToolbar from './NodeToolbar';
import EmptyToolbarWithLoadingIndicator from './EmptyToolbarWithLoadingIndicator';

import Categories, { type Category, type CategoryLookupTables } from '../../lib/Categories';
import type { Feature, YesNoLimitedUnknown } from '../../lib/Feature';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';
import type { ModalNodeState } from '../../lib/queryParams';
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
} & PlaceDetailsProps;

type State = {
  category: ?Category,
  parentCategory: ?Category,
  resolvedPlaceDetails: ?ResolvedPlaceDetailsProps,
};

class NodeToolbarFeatureLoader extends React.Component<Props, State> {
  props: Props;
  state = { category: null, parentCategory: null, resolvedPlaceDetails: null };
  nodeToolbar: React.ElementRef<NodeToolbar>;

  static getDerivedStateFromProps(props: Props, state: State) {
    const resolvedPlaceData = getPlaceDetailsIfAlreadyResolved(props);

    // use resolved data
    if (resolvedPlaceData) {
      const resolvedCategories = NodeToolbarFeatureLoader.getCategoriesForFeature(
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

    // wait for new data
    return {
      ...state,
      category: null,
      parentCategory: null,
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
      const resolvedCategories = NodeToolbarFeatureLoader.getCategoriesForFeature(
        props.categories,
        resolvedPlaceDetails.equipmentInfo || resolvedPlaceDetails.feature
      );
      this.setState({ resolvedPlaceDetails, ...resolvedCategories });
    } else {
      awaitPlaceDetails(this.props).then(resolved => {
        const resolvedCategories = NodeToolbarFeatureLoader.getCategoriesForFeature(
          props.categories,
          resolved.equipmentInfo || resolved.feature
        );
        this.setState({ resolvedPlaceDetails: resolved, ...resolvedCategories });
      });
    }
  }

  // TODO move to helper
  static getCategoriesForFeature(
    categories: CategoryLookupTables,
    feature: ?Feature | ?EquipmentInfo
  ): { category: ?Category, parentCategory?: Category } {
    if (!feature) {
      return { category: null };
    }

    const properties = feature.properties;
    if (!properties) {
      return { category: null };
    }

    const categoryId =
      (properties.node_type && properties.node_type.identifier) || properties.category;

    if (!categoryId) {
      return { category: null };
    }

    const category = Categories.getCategory(categories, categoryId);
    const parentCategory = category && Categories.getCategory(categories, category.parentIds[0]);

    return { category, parentCategory };
  }

  render() {
    const resolvedData = this.state.resolvedPlaceDetails;

    if (resolvedData) {
      return (
        <NodeToolbar
          {...this.state}
          {...this.props}
          {...resolvedData}
          ref={t => (this.nodeToolbar = t)}
        />
      );
    }

    return <EmptyToolbarWithLoadingIndicator hidden={this.props.hidden} />;
  }
}

export default NodeToolbarFeatureLoader;
