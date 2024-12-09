import sortBy from 'lodash/sortBy'
import * as React from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import { EquipmentInfo, PlaceInfo } from '@sozialhelden/a11yjson'
import { getFeatureId } from '../../lib/model/ac/Feature'
import Categories, { CategoryLookupTables } from '../../lib/model/ac/categories/Categories'
import { placeNameFor } from '../../lib/model/geo/placeNameFor'
import colors from '../../lib/util/colors'
import { Cluster } from '../Map/Cluster'
import StyledToolbar from './StyledToolbar'
import * as markers from '../icons/markers'
import ErrorBoundary from '../shared/ErrorBoundary'
import { StyledIconContainer } from '../shared/Icon'
import { Circle } from '../shared/IconButton'
import { PlaceNameH1 } from '../shared/PlaceName'
import StyledFrame from './AccessibilitySection/StyledFrame'
import NodeHeader, { StyledNodeHeader } from './NodeHeader'
// import { accessibilityCloudFeatureCache } from '../../lib/cache/AccessibilityCloudFeatureCache';

type Props = {
  hidden?: boolean,
  inEmbedMode?: boolean,
  modalNodeState?: boolean,
  cluster: Cluster | null,
  categories: CategoryLookupTables,
  onClose: () => void,
  onSelectClusterIcon: () => void,
  onFeatureSelected: (feature: PlaceInfo | EquipmentInfo) => void,
  className?: string,
  minimalTopPosition: number,
};

const ClusterIcon = function ({ cluster, className, onSelectClusterIcon }: Partial<Props>) {
  const accessibility = cluster.accessibility || 'unknown'
  const MarkerComponent = markers[`${accessibility}WithoutArrow`] || Circle

  return (
    <StyledIconContainer className={className} size="medium" onClick={onSelectClusterIcon}>
      <MarkerComponent />
      <div>{cluster.features.length}</div>
    </StyledIconContainer>
  )
}

export const StyledClusterIcon = styled(ClusterIcon)`
  margin-block-start: 0;
  margin-block-end: 0;
  display: flex;
  cursor: pointer;

  > div {
    color: ${(props) => (props.cluster && props.cluster.foregroundColor) || 'white'};
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
    fill: ${(props) => (props.cluster && props.cluster.backgroundColor) || colors.tonedDownSelectedColor};
  }
`

class UnstyledFeatureClusterPanel extends React.Component<Props> {
  renderCloseLink() {
    const { onClose } = this.props
    return <PositionedCloseLink {...{ onClick: onClose }} />
  }

  renderClusterEntry(feature: PlaceInfo | EquipmentInfo, allFeatures: (PlaceInfo | EquipmentInfo)[]) {
    const { category, parentCategory } = Categories.getCategoriesForFeature(
      this.props.categories,
      feature,
    )

    const isEquipment = ['elevator', 'escalator'].includes(category._id)
    const equipmentInfo = isEquipment ? (feature as EquipmentInfo) : undefined
    const equipmentInfoId = equipmentInfo?._id || equipmentInfo?.properties._id
    // const parentPlaceInfo = equipmentInfo && accessibilityCloudFeatureCache.getCachedFeature(equipmentInfo.properties.placeInfoId);
    return (
      <button onClick={() => this.props.onFeatureSelected(feature)}>
        <NodeHeader
          // TODO comment that this should allow typed features
          feature={feature as any}
          categories={this.props.categories}
          category={category}
          parentCategory={parentCategory}
          equipmentInfo={equipmentInfo}
          equipmentInfoId={equipmentInfoId}
          hasIcon
        />
      </button>
    )
  }

  renderClusterEntries(features: ArrayLike<PlaceInfo | EquipmentInfo>) {
    const sortedFeatures = sortBy(features, (feature) => {
      if (!feature.properties) {
        return getFeatureId(feature)
      }
      const { category, parentCategory } = Categories.getCategoriesForFeature(
        this.props.categories,
        feature,
      )

      // TODO comment that this should be typed
      return placeNameFor(feature.properties as any, category || parentCategory)
    })

    return sortedFeatures.map((feature) => (
      <li key={getFeatureId(feature)}>{this.renderClusterEntry(feature, sortedFeatures)}</li>
    ))
  }

  render() {
    const { cluster } = this.props

    if (!cluster || cluster.features.length === 0) {
      return null
    }

    // translator: Label caption of a cluster that contains multiple nodes with its count, e.g. '(3) Places'
    const placesLabel = t`Places`

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
              <PlaceNameH1>
                <StyledClusterIcon {...this.props} />
                {placesLabel}
              </PlaceNameH1>
              {this.renderCloseLink()}
            </StyledNodeHeader>
            <StyledFrame>
              <ul>{this.renderClusterEntries(cluster.features)}</ul>
            </StyledFrame>
          </section>
        </ErrorBoundary>
      </StyledToolbar>
    )
  }
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

}`

export default FeatureClusterPanel
