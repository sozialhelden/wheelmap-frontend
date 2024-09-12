import { useHotkeys } from '@blueprintjs/core'
import { uniqBy } from 'lodash'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  AnyFeature, getKey, isOSMFeature, isSearchResultFeature,
} from '../../lib/model/geo/AnyFeature'
import colors from '../../lib/util/colors'
import FeaturesDebugJSON from './components/FeaturesDebugJSON'
import PlaceOfInterestDetails from './type-specific/poi/PlaceOfInterestDetails'
import NextToiletDirections from './components/AccessibilitySection/NextToiletDirections'
import ErrorBoundary from '../shared/ErrorBoundary'
import OSMSidewalkDetails from './type-specific/surroundings/OSMSidewalkDetails'
import OSMBuildingDetails from './type-specific/building/OSMBuildingDetails'

type Props = {
  features: AnyFeature[];
  options?: { handleOpenReportMode?: () => void };
};

function FeatureSection({ feature }: { feature: AnyFeature }) {
  if (!isOSMFeature(feature)) {
    return null
  }

  if (feature.properties.building) {
    return <OSMBuildingDetails feature={feature} />
  }

  if (
    feature.properties.highway === 'footway'
    || feature.properties.highway === 'pedestrian'
  ) {
    return <OSMSidewalkDetails feature={feature} />
  }
}

const Panel = styled.section`
  color: ${colors.textColorTonedDownSlightly};
`

export function CombinedFeaturePanel(props: Props) {
  const features = uniqBy(props.features, (feature) => (isSearchResultFeature(feature) ? feature.properties.osm_id : feature._id))

  const [showDebugger, setShowDebugger] = useState(false)
  const hotkeys = useMemo(() => [
    {
      combo: 'j',
      global: true,
      label: 'Show JSON Feature Debugger',
      onKeyDown: () => setShowDebugger(!showDebugger),
    },

  ], [showDebugger])
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys)

  return (
    <ErrorBoundary>
      <Panel onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onClick={() => { throw new Error() }}>
        {features && features[0] && <PlaceOfInterestDetails feature={features[0]} />}
        {/* TODO: Report button goes here. */}
        {features
          && features.length > 1
          && features
            .slice(1)
            .map((feature) => <FeatureSection key={getKey(feature)} feature={feature} />)}

        <p>
          {showDebugger && <FeaturesDebugJSON features={features} /> }
        </p>
      </Panel>
    </ErrorBoundary>
  )
}
