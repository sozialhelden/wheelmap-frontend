// @flow

import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';

import NodeToolbar from './NodeToolbar';
import EmptyToolbarWithLoadingIndicator from './EmptyToolbarWithLoadingIndicator';
import { equipmentInfoCache } from '../../lib/cache/EquipmentInfoCache';

import Categories, { type Category, type CategoryLookupTables } from '../../lib/Categories';
import type { Feature, YesNoLimitedUnknown } from '../../lib/Feature';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';
import type { ModalNodeState } from '../../lib/queryParams';

type Props = {
  feature: ?Feature,
  featureId: ?string | number,
  categories: CategoryLookupTables,
  equipmentInfoId: ?string,
  hidden: boolean,
  modalNodeState: ModalNodeState,
  isReportMode: boolean,
  onOpenReportMode: ?() => void,
  onStartPhotoUploadFlow: () => void,
  history: RouterHistory,
  onClose?: ?() => void,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
  onSelectWheelchairAccessibility?: (newValue: YesNoLimitedUnknown) => void,
};

type State = {
  category: ?Category,
  parentCategory?: Category,
  equipmentInfo: ?EquipmentInfo,
};

class NodeToolbarFeatureLoader extends React.Component<Props, State> {
  props: Props;
  state = { category: null, parentCategory: null, equipmentInfo: null };
  nodeToolbar: React.ElementRef<NodeToolbar>;

  constructor(props: Props) {
    super(props);

    const resolvedCategories = NodeToolbarFeatureLoader.getCategoriesForFeature(
      props.categories,
      props.feature
    );
    this.state = { ...this.state, ...resolvedCategories };
  }

  componentDidMount() {
    if (!this.props.equipmentInfoId) {
      const resolvedCategories = NodeToolbarFeatureLoader.getCategoriesForFeature(
        this.props.categories,
        this.props.feature
      );
      this.setState(resolvedCategories);
    }
    this.fetchFeature(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.fetchFeature(nextProps);

    if (this.props.featureId && nextProps.featureId !== this.props.featureId) {
      this.setState({ equipmentInfo: null });
    }

    if (!nextProps.equipmentInfoId) {
      const resolvedCategories = NodeToolbarFeatureLoader.getCategoriesForFeature(
        nextProps.categories,
        nextProps.feature
      );
      this.setState(resolvedCategories);
    }
  }

  focus() {
    if (this.nodeToolbar) {
      this.nodeToolbar.focus();
    }
  }

  fetchFeature(props: Props) {
    if (props.equipmentInfoId) {
      equipmentInfoCache.getFeature(props.equipmentInfoId).then((equipmentInfo: EquipmentInfo) => {
        if (!equipmentInfo || typeof equipmentInfo !== 'object') return;
        if (
          equipmentInfo.properties &&
          equipmentInfo.properties.placeInfoId &&
          equipmentInfo.properties.placeInfoId !== props.featureId
        )
          return;
        const resolvedCategories = NodeToolbarFeatureLoader.getCategoriesForFeature(
          props.categories,
          equipmentInfo
        );
        this.setState({ equipmentInfo, ...resolvedCategories });
      });
    }
  }

  // TODO move to helper
  static getCategoriesForFeature(
    categories: CategoryLookupTables,
    feature: ?Feature | EquipmentInfo
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
    const { feature } = this.props;
    const { properties } = feature || {};

    return properties ? (
      <NodeToolbar {...this.state} {...this.props} ref={t => (this.nodeToolbar = t)} />
    ) : (
      <EmptyToolbarWithLoadingIndicator hidden={this.props.hidden} />
    );
  }
}

export default NodeToolbarFeatureLoader;
