// @flow

import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';
import styled from 'styled-components';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import NodeToolbar from './NodeToolbar';
import EmptyToolbarWithLoadingIndicator from './EmptyToolbarWithLoadingIndicator';

import Categories from '../../lib/Categories';
import type { Feature } from '../../lib/Feature';
import type { Category } from '../../lib/Categories';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';
import { equipmentInfoCache } from '../../lib/cache/EquipmentInfoCache';


type Props = {
  feature: ?Feature,
  featureId: ?string | number,
  equipmentInfoId: ?string,
  hidden: boolean,
  isEditMode: boolean,
  isReportMode: boolean,
  onOpenReportMode: ?(() => void),
  onStartPhotoUploadFlow: (() => void),
  history: RouterHistory,
  onClose?: ?(() => void),
  onClickCurrentMarkerIcon?: ((Feature) => void),
};


type State = {
  category: ?Category,
  parentCategory: ?Category,
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
    if (this.props.featureId && (nextProps.featureId !== this.props.featureId)) {
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
      equipmentInfoCache
        .getFeature(props.equipmentInfoId)
        .then(equipmentInfo => {
          if (!equipmentInfo || typeof equipmentInfo !== 'object') return;
          if (
            equipmentInfo.properties &&
            equipmentInfo.properties.placeInfoId &&
            equipmentInfo.properties.placeInfoId !== props.featureId
          ) return;
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

    Categories.getCategory(categoryId).then(
      (category) => { this.setState({ category }); return category; },
      () => this.setState({ category: null }),
    )
      .then(category => category && Categories.getCategory(category.parentIds[0]))
      .then(parentCategory => this.setState({ parentCategory }));
  }


  render() {
    const { props, state } = this;
    const { feature } = this.state;
    const { properties } = feature || {};
    return properties ?
      <NodeToolbar {...props} {...state} ref={t => this.nodeToolbar = t}/> :
      <EmptyToolbarWithLoadingIndicator hidden={this.props.hidden} />;
  }
}

export default NodeToolbarFeatureLoader;
