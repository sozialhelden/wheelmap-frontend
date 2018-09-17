// @flow

import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';

import NodeToolbar from './NodeToolbar';
import EmptyToolbarWithLoadingIndicator from './EmptyToolbarWithLoadingIndicator';

import Categories, { type CategoryLookupTables } from '../../lib/Categories';
import type { Feature } from '../../lib/Feature';
import type { Category } from '../../lib/Categories';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';
import type { ModalNodeState } from '../../lib/queryParams';
import { equipmentInfoCache } from '../../lib/cache/EquipmentInfoCache';
import type { YesNoLimitedUnknown } from '../../lib/Feature';

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
  category: Category | null,
  parentCategory: Category | null,
  equipmentInfo: ?EquipmentInfo,
  feature: ?Feature,
};

class NodeToolbarFeatureLoader extends React.Component<Props, State> {
  props: Props;
  state = { category: null, parentCategory: null, feature: null, equipmentInfo: null };
  nodeToolbar: React.ElementRef<NodeToolbar>;

  componentDidMount() {
    if (!this.props.equipmentInfoId) {
      this.fetchCategory(this.props.feature);
    }
    this.fetchFeature(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.fetchFeature(nextProps);
    if (this.props.featureId && nextProps.featureId !== this.props.featureId) {
      this.setState({ equipmentInfo: null });
    }
    if (!nextProps.equipmentInfoId) {
      this.fetchCategory(nextProps.feature);
    }
  }

  focus() {
    if (this.nodeToolbar) {
      this.nodeToolbar.focus();
    }
  }

  fetchFeature(props: Props) {
    if (props.equipmentInfoId) {
      equipmentInfoCache.getFeature(props.equipmentInfoId).then(equipmentInfo => {
        if (!equipmentInfo || typeof equipmentInfo !== 'object') return;
        if (
          equipmentInfo.properties &&
          equipmentInfo.properties.placeInfoId &&
          equipmentInfo.properties.placeInfoId !== props.featureId
        )
          return;
        this.setState({ equipmentInfo });
        this.fetchCategory(equipmentInfo);
      });
    }

    if (props.feature) {
      this.setState({ feature: props.feature });
    }
  }

  fetchCategory(feature: ?Feature) {
    if (!feature) {
      this.setState({ category: null });
      return;
    }

    const properties = feature.properties;
    if (!properties) {
      this.setState({ category: null });
      return;
    }

    const categoryId =
      (properties.node_type && properties.node_type.identifier) || properties.category;

    if (!categoryId) {
      this.setState({ category: null });
      return;
    }

    const category = Categories.getCategory(this.props.categories, categoryId);
    const parentCategory =
      category && Categories.getCategory(this.props.categories, category.parentIds[0]);

    this.setState({ category, parentCategory });
  }

  render() {
    const { props, state } = this;
    const { feature } = this.state;
    const { properties } = feature || {};
    return properties ? (
      <NodeToolbar {...props} {...state} ref={t => (this.nodeToolbar = t)} />
    ) : (
      <EmptyToolbarWithLoadingIndicator hidden={this.props.hidden} />
    );
  }
}

export default NodeToolbarFeatureLoader;
