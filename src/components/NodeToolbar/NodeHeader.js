// @flow

import get from 'lodash/get';
import * as React from 'react';
import styled from 'styled-components';
import type { Feature } from '../../lib/Feature';
import { isWheelchairAccessible, placeNameFor } from '../../lib/Feature';
import type { EquipmentInfo } from '../../lib/EquipmentInfo';

import {
  categoryNameFor,
  getCategoryId,
  type CategoryLookupTables,
  type Category,
} from '../../lib/Categories';
import Icon from '../Icon';
import PlaceName from '../PlaceName';
import BreadCrumbs from './BreadCrumbs';
import { equipmentInfoNameFor, isEquipmentAccessible } from '../../lib/EquipmentInfo';
import colors from '../../lib/colors';
import { type Cluster } from '../Map/Cluster';
import ChevronRight from '../ChevronRight';
import { StyledClusterIcon } from './FeatureClusterPanel';

export const StyledNodeHeader = styled.header`
  margin: -8px -16px 0 -16px;
  padding: 8px 16px;
  display: flex;
  align-items: flex-start;
  position: sticky;
  top: 0px;
  z-index: 1;
  color: rgba(0, 0, 0, 0.8);
  ${PlaceName} {
    flex-grow: 2;
  }
  &.has-opaque-background {
    background-color: ${colors.colorizedBackgroundColor};
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
  }
`;

const StyledBreadCrumbs = styled(BreadCrumbs)`
  margin-left: ${props => (props.hasPadding ? '42' : '0')}px;
  font-size: 16px;
  margin-top: 8px;
`;

type Props = {
  children?: React.Node,
  feature: ?Feature,
  equipmentInfoId: ?string,
  equipmentInfo: ?EquipmentInfo,
  cluster: ?Cluster,
  category: ?Category,
  categories: CategoryLookupTables,
  parentCategory: ?Category,
  hasIcon: boolean,
  hasOpaqueBackground: boolean,
  onClickCurrentCluster?: (cluster: Cluster) => void,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
};

export default class NodeHeader extends React.Component<Props> {
  onClickCurrentMarkerIcon = () => {
    const feature = this.props.feature;
    if (feature && this.props.onClickCurrentMarkerIcon) {
      this.props.onClickCurrentMarkerIcon(feature);
    }
  };

  render() {
    const isEquipment = !!this.props.equipmentInfoId;
    const feature = this.props.feature;
    if (!feature) return null;
    const properties = feature.properties;
    if (!properties) return null;

    const { category, parentCategory, children } = this.props;
    const shownCategory = category || parentCategory;
    let categoryName = shownCategory && categoryNameFor(shownCategory);
    const shownCategoryId = shownCategory && getCategoryId(shownCategory);

    let placeName = placeNameFor(properties, category || parentCategory);
    let ariaLabel = [placeName, categoryName].filter(Boolean).join(', ');
    if (isEquipment) {
      placeName = equipmentInfoNameFor(get(this.props, ['equipmentInfo', 'properties']), false);
      ariaLabel = equipmentInfoNameFor(get(this.props, ['equipmentInfo', 'properties']), true);
    }

    const accessibility = isEquipment
      ? isEquipmentAccessible(get(this.props, ['equipmentInfo', 'properties']))
      : isWheelchairAccessible(properties);
    const hasLongName = placeName && placeName.length > 50;
    const icon = (
      <Icon
        accessibility={accessibility}
        category={categoryName ? shownCategoryId : 'undefined'}
        size="medium"
        ariaHidden={true}
        centered
        onClick={this.onClickCurrentMarkerIcon}
      />
    );

    const categoryElement = properties.name ? (
      <StyledBreadCrumbs
        properties={properties}
        category={this.props.category}
        categories={this.props.categories}
        parentCategory={this.props.parentCategory}
      />
    ) : null;

    const placeNameElement = (
      <PlaceName isSmall={hasLongName} aria-label={ariaLabel}>
        {this.props.hasIcon && icon}
        <div className="place-content">
          {placeName}
          {categoryElement}
        </div>
      </PlaceName>
    );

    const { cluster, onClickCurrentCluster } = this.props;
    const clusterElement = cluster && (
      <React.Fragment>
        <StyledClusterIcon cluster={cluster} onSelectClusterIcon={onClickCurrentCluster} />
        <ChevronRight style={{ marginRight: '4px' }} />
      </React.Fragment>
    );

    return (
      <StyledNodeHeader className={this.props.hasOpaqueBackground ? 'has-opaque-background' : ''}>
        {clusterElement}
        {placeNameElement}
        {children}
      </StyledNodeHeader>
    );
  }
}
