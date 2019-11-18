import get from 'lodash/get';
import * as React from 'react';
import styled from 'styled-components';
import { Feature } from '../../lib/Feature';
import { isWheelchairAccessible, placeNameFor } from '../../lib/Feature';
import { EquipmentInfo } from '../../lib/EquipmentInfo';

import {
  categoryNameFor,
  getCategoryId,
  CategoryLookupTables,
  Category,
} from '../../lib/Categories';
import Icon from '../Icon';
import PlaceName from '../PlaceName';
import BreadCrumbs from './BreadCrumbs';
import { equipmentInfoNameFor, isEquipmentAccessible } from '../../lib/EquipmentInfo';
import colors from '../../lib/colors';
import { Cluster } from '../Map/Cluster';
import ChevronRight from '../ChevronRight';
import { StyledClusterIcon } from './FeatureClusterPanel';

export const StyledNodeHeader = styled.header.attrs({ hasShadow: false })`
  display: flex;
  align-items: center;
  position: sticky;
  top: 0px;
  z-index: 1;
  margin: 0 -1rem;
  padding: 0.5rem 0 0.4rem 1rem;
  color: rgba(0, 0, 0, 0.8);
  background-color: ${colors.colorizedBackgroundColor};
  transition: box-shadow 0.3s ease-out;
  box-shadow: ${props =>
    props.hasShadow ? '0 0 33px rgba(0, 0, 0, 0.1)' : '0 0 33px rgba(0, 0, 0, 0)'};

  ${PlaceName} {
    flex-grow: 2;
  }
`;

const StyledBreadCrumbs = styled(BreadCrumbs).attrs({ hasPadding: false })`
  margin-left: ${props => (props.hasPadding ? '42' : '0')}px;
  font-size: 16px;
`;

type Props = {
  children?: React.ReactNode,
  feature: Feature | null,
  equipmentInfoId?: string | null,
  equipmentInfo?: EquipmentInfo | null,
  cluster?: Cluster | null,
  category: Category | null,
  categories: CategoryLookupTables,
  parentCategory: Category | null,
  hasIcon: boolean,
  onClickCurrentCluster?: () => void,
  onClickCurrentMarkerIcon?: (feature: Feature) => void,
  hasShadow: boolean,
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
      <StyledNodeHeader hasShadow={this.props.hasShadow}>
        {clusterElement}
        {placeNameElement}
        {children}
      </StyledNodeHeader>
    );
  }
}
