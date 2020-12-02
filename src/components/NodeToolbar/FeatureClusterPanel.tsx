import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';
import sortBy from 'lodash/sortBy';

import { Feature, placeNameFor, getFeatureId } from '../../lib/Feature';
import { EquipmentInfo } from '../../lib/EquipmentInfo';
import StyledToolbar from '../NodeToolbar/StyledToolbar';
import ErrorBoundary from '../ErrorBoundary';
import StyledCloseLink from '../CloseLink';
import StyledFrame from './AccessibilitySection/StyledFrame';
import NodeHeader, { StyledNodeHeader } from './NodeHeader';
import PlaceName from '../PlaceName';
import { Circle } from '../IconButton';
import { StyledIconContainer } from '../Icon';
import colors from '../../lib/colors';
import Categories, { CategoryLookupTables } from '../../lib/Categories';
import { Cluster } from '../Map/Cluster';
import * as markers from '../icons/markers';

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

class UnstyledFeatureClusterPanel extends React.Component<Props> {
  renderCloseLink() {
    const { onClose } = this.props;
    return <PositionedCloseLink {...{ onClick: onClose }} />;
  }

  renderClusterEntry(feature: Feature | EquipmentInfo) {
    const { category, parentCategory } = Categories.getCategoriesForFeature(
      this.props.categories,
      feature
    );

    return (
      <button onClick={() => this.props.onFeatureSelected(feature)}>
        <NodeHeader
          // TODO comment that this should allow typed features
          feature={feature as any}
          categories={this.props.categories}
          category={category}
          parentCategory={parentCategory}
          hasIcon={true}
          hasOpaqueBackground={false}
        />
      </button>
    );
  }

  renderClusterEntries(features: ArrayLike<Feature | EquipmentInfo>) {
    const sortedFeatures = sortBy(features, feature => {
      if (!feature.properties) {
        return getFeatureId(feature)
      }
      const { category, parentCategory } = Categories.getCategoriesForFeature(
        this.props.categories,
        feature
      );

      // TODO comment that this should be typed
      return placeNameFor(feature.properties as any, category || parentCategory);
    });

    return sortedFeatures.map(feature => (
      <li key={getFeatureId(feature)}>{this.renderClusterEntry(feature)}</li>
    ));
  }

  render() {
    const { cluster } = this.props;

    if (!cluster || cluster.features.length === 0) {
      return null;
    }

    // translator: Label caption of a cluster that contains multiple nodes with its count, e.g. '(3) Places'
    const placesLabel = t`Places`;

    return (
      <StyledToolbar
        className={this.props.className}
        hidden={this.props.hidden}
        isModal={this.props.modalNodeState}
        role="dialog"
        minimalTopPosition={this.props.minimalTopPosition}
        minimalHeight={135}
      >
        <ErrorBoundary>
          <section className="cluster-entries">
            <StyledNodeHeader>
              <PlaceName>
                <StyledClusterIcon {...this.props} />
                {placesLabel}
              </PlaceName>
              {this.renderCloseLink()}
            </StyledNodeHeader>
            <StyledFrame className="entry-list">
              <ul>{this.renderClusterEntries(cluster.features)}</ul>
            </StyledFrame>
          </section>
        </ErrorBoundary>
      </StyledToolbar>
    );
  }
}

const FeatureClusterPanel = styled(UnstyledFeatureClusterPanel)`
  section.cluster-entries {
    > .entry-list {
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
