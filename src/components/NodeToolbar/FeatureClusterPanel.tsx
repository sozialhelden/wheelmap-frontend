import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';
import sortBy from 'lodash/sortBy';

import { Feature, placeNameFor, getFeatureId, isWheelmapFeature, accessibilityCloudFeatureFrom } from '../../lib/Feature';
import { EquipmentInfo, CategoryStrings, CategoryString } from '../../lib/EquipmentInfo';
import StyledToolbar from '../NodeToolbar/StyledToolbar';
import ErrorBoundary from '../ErrorBoundary';
import StyledCloseLink from '../CloseLink';
import StyledFrame from './AccessibilitySection/StyledFrame';
import NodeHeader, { StyledNodeHeader } from './NodeHeader';
import { PlaceNameH1 } from '../PlaceName';
import { Circle } from '../IconButton';
import { StyledIconContainer } from '../Icon';
import colors from '../../lib/colors';
import Categories, { CategoryLookupTables } from '../../lib/Categories';
import { Cluster } from '../Map/Cluster';
import * as markers from '../icons/markers';
import { get } from 'lodash';
import AccessibilityCloudFeatureCache, { accessibilityCloudFeatureCache } from '../../lib/cache/AccessibilityCloudFeatureCache';

type Props = {
  hidden?: boolean,
  inEmbedMode?: boolean,
  modalNodeState?: boolean,
  cluster: Cluster | null,
  categories: CategoryLookupTables,
  onClose: () => void,
  onSelectClusterIcon: () => void,
  onFeatureSelected: (feature: Feature | EquipmentInfo) => void,
  className?: string,
  minimalTopPosition: number,
};

const PositionedCloseLink = styled(StyledCloseLink)`
  align-self: flex-start;
  margin-top: -8px;
  margin-right: 1px;
`;
PositionedCloseLink.displayName = 'PositionedCloseLink';

const ClusterIcon = function({ cluster, className, onSelectClusterIcon }: Partial<Props>) {
  const accessibility = cluster.accessibility || 'unknown';
  const MarkerComponent = markers[`${accessibility}WithoutArrow`] || Circle;

  return (
    <StyledIconContainer className={className} size="medium" onClick={onSelectClusterIcon}>
      <MarkerComponent />
      <div>{cluster.features.length}</div>
    </StyledIconContainer>
  );
};

export const StyledClusterIcon = styled(ClusterIcon)`
  margin-block-start: 0;
  margin-block-end: 0;
  display: flex;
  cursor: pointer;

  > div {
    color: ${props => (props.cluster && props.cluster.foregroundColor) || 'white'};
    font-size: 24px;
    z-index: 300;
  }

  svg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  svg g,
  svg polygon,
  svg path,
  svg circle,
  svg rect {
    fill: ${props =>
      (props.cluster && props.cluster.backgroundColor) || colors.tonedDownSelectedColor};
  }
`;

function UnstyledFeatureClusterPanel (props: Props) {
  const { cluster, onClose, categories, onFeatureSelected, className, hidden, modalNodeState, minimalTopPosition } = props;
      
  if (!cluster || cluster.features.length === 0) {
    return null;
  }

  // translator: Label caption of a cluster that contains multiple nodes with its count, e.g. '(3) Places'
  const placesLabel = t`Places`;

  function renderCloseLink() {
      return <PositionedCloseLink {...{ onClick: onClose }} />;
  }

  function renderClusterEntry(feature: Feature | EquipmentInfo, allFeatures: (Feature | EquipmentInfo)[]) {
    const { category, parentCategory } = Categories.getCategoriesForFeature(categories, feature);

    const isEquipment = category && (category._tag === 'ACCategory' && CategoryStrings.includes(category._id as CategoryString));
    const equipmentInfo = isEquipment ? (feature as EquipmentInfo) : undefined;
    const equipmentInfoId = equipmentInfo?.properties._id;
    const parentPlaceInfo = equipmentInfo && accessibilityCloudFeatureCache.getCachedFeature(equipmentInfo.properties.placeInfoId);
    return (
      <button onClick={() => onFeatureSelected(feature)}>
        <NodeHeader
          // TODO comment that this should allow typed features
          feature={parentPlaceInfo || feature as any}
          categories={categories}
          category={category}
          parentCategory={parentCategory}
          equipmentInfo={equipmentInfo}
          equipmentInfoId={equipmentInfoId}
          hasIcon={true}
        />
      </button>
    );
  }

  function renderClusterEntries(features: ArrayLike<Feature | EquipmentInfo>) {
    const sortedFeatures = sortBy(features, feature => {
      if (!feature.properties) {
        return getFeatureId(feature)
      }
      const { category, parentCategory } = Categories.getCategoriesForFeature(
        categories,
        feature
      );

      const placeInfoName = placeNameFor(feature.properties as any, category || parentCategory);
      if (!get(feature, 'properties.parentPlaceInfoId')) {
        // Rank places withuot a parent place first
        return '0' + placeInfoName;
      }
      return placeInfoName;
    });

    return sortedFeatures.map(feature => (
      <li key={getFeatureId(feature)}>{renderClusterEntry(feature, sortedFeatures)}</li>
    ));
  }

  return (
    <StyledToolbar
      className={className}
      hidden={hidden}
      isModal={modalNodeState}
      role="dialog"
      minimalTopPosition={minimalTopPosition}
      minimalHeight={135}
    >
      <ErrorBoundary>
        <section className="cluster-entries">
          <StyledNodeHeader>
            <PlaceNameH1>
              <StyledClusterIcon {...props} />
              {placesLabel}
            </PlaceNameH1>
            {renderCloseLink()}
          </StyledNodeHeader>
          <StyledFrame>
            <ul>{renderClusterEntries(cluster.features)}</ul>
          </StyledFrame>
        </section>
      </ErrorBoundary>
    </StyledToolbar>
  );
}

const FeatureClusterPanel = styled(UnstyledFeatureClusterPanel)`
  section.cluster-entries {
    > .styled-frame {
      z-index: 0;
      padding: 0;
      > ul {
        list-style: none;
        margin: 0;
        padding: 0;

        > li {
          &:not(:first-child) {
            border-top: 1px solid ${colors.borderColor};
          }

          > button {
            border: unset;
            background: unset;
            padding: 0;
            width: 100%;
            cursor: pointer;
            font-size: unset;
            text-align: unset;

            > header {
              /* prevent clipping borders of styled frame */
              background: unset;
              padding-right: 1rem;

              &:hover,
              &:focus {
                color: ${colors.linkColorDarker};
                background-color: ${colors.linkBackgroundColorTransparent};
              }
            }
          }
        }
      }
    }
  }

}`;

export default FeatureClusterPanel;
