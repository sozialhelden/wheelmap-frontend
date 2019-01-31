// @flow
import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';
import FocusTrap from '@sozialhelden/focus-trap-react';

import { type Feature } from '../../lib/Feature';
import { type EquipmentInfo } from '../../lib/EquipmentInfo';
import StyledToolbar from '../NodeToolbar/StyledToolbar';
import ErrorBoundary from '../ErrorBoundary';
import { hasBigViewport } from '../../lib/ViewportSize';
import StyledCloseLink from '../CloseLink';
import StyledFrame from './AccessibilitySection/StyledFrame';
import NodeHeader, { StyledNodeHeader } from './NodeHeader';
import PlaceName from '../PlaceName';
import { Circle } from '../IconButton';
import { StyledIconContainer } from '../Icon';
import colors from '../../lib/colors';
import Categories from '../../lib/Categories';
import { type Cluster } from '../Map/Cluster';

type Props = {
  hidden?: boolean,
  inEmbedMode?: boolean,
  modalNodeState?: boolean,
  cluster: Cluster,
  categories: CategoryLookupTables,
  onClose: () => void,
  onFeatureSelected: (feature: Feature | EquipmentInfo) => void,
};

type State = {
  isScrollable?: boolean,
};

const PositionedCloseLink = styled(StyledCloseLink)`
  top: 0;
  z-index: 4;
  margin: -5px -16px -2px -2px; /* move close button to the same position as in search toolbar */
`;
PositionedCloseLink.displayName = 'PositionedCloseLink';

class UnstyledFeatureClusterPanel extends React.Component<Props, State> {
  state: State = {};

  renderCloseLink() {
    const { onClose, modalNodeState } = this.props;

    return modalNodeState ? null : <PositionedCloseLink {...{ onClick: onClose }} />;
  }

  renderClusterEntry(feature: Feature | EquipmentInfo) {
    const { category, parentCategory } = Categories.getCategoriesForFeature(
      this.props.categories,
      feature
    );

    return (
      <button onClick={() => this.props.onFeatureSelected(feature)}>
        <NodeHeader
          feature={feature}
          categories={this.props.categories}
          category={category}
          parentCategory={parentCategory}
          hasIcon={true}
          hasShadow={this.state.isScrollable}
        />
      </button>
    );
  }

  renderClusterEntries(features: ArrayLike<Feature | EquipmentInfo>) {
    return features.map((f, i) => <li key={i}>{this.renderClusterEntry(f)}</li>);
  }

  render() {
    const { cluster } = this.props;
    const hasWindow = typeof window !== 'undefined';
    const offset = hasBigViewport() ? 0 : 0.4 * (hasWindow ? window.innerHeight : 0);

    if (!cluster || cluster.features.length === 0) {
      return null;
    }

    return (
      <StyledToolbar
        className={this.props.className}
        hidden={this.props.hidden}
        isModal={this.props.modalNodeState}
        role="dialog"
        startTopOffset={offset}
        onScrollable={isScrollable => this.setState({ isScrollable })}
        inEmbedMode={this.props.inEmbedMode}
      >
        <ErrorBoundary>
          <FocusTrap
            component="div"
            // We need to set clickOutsideDeactivates here as we want clicks on e.g. the map markers to not be prevented.
            focusTrapOptions={{ clickOutsideDeactivates: true }}
          >
            {this.renderCloseLink()}
            <section className="cluster-entries">
              <StyledNodeHeader>
                <PlaceName>
                  <StyledIconContainer size="medium">
                    <Circle>{cluster.features.length}</Circle>
                  </StyledIconContainer>
                  {t`Places`}
                </PlaceName>
              </StyledNodeHeader>
              <StyledFrame className="entry-list">
                <ul>{this.renderClusterEntries(cluster.features)}</ul>
              </StyledFrame>
            </section>
          </FocusTrap>
        </ErrorBoundary>
      </StyledToolbar>
    );
  }
}

const FeatureClusterPanel = styled(UnstyledFeatureClusterPanel)`
  section.cluster-entries {    
    > header {
      figure {
        margin-block-start: 0;
        margin-block-end: 0;
      }

      ${Circle} {
        font-size: 24px;
        color: white;
        background-color: ${props => props.clusterColor || colors.tonedDownSelectedColor};
      }
    }

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
