import { Button, Callout, useHotkeys } from '@blueprintjs/core'
import { uniqBy } from 'lodash'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import {
  AnyFeature, getKey, isOSMFeature, isSearchResultFeature,
} from '../../lib/model/geo/AnyFeature'
import colors from '../../lib/util/colors'
import FeaturesDebugJSON from './components/FeaturesDebugJSON'
import PlaceOfInterestDetails from './type-specific/poi/PlaceOfInterestDetails'
import ErrorBoundary from '../shared/ErrorBoundary'
import OSMSidewalkDetails from './type-specific/surroundings/OSMSidewalkDetails'
import OSMBuildingDetails from './type-specific/building/OSMBuildingDetails'
import {
  composeOrFilter, makeFilterByNode, useMapFilterContext, useMapHighlight,
} from '../MapNew/filter'

type Props = {
  features: AnyFeature[];
}

function FeatureSection({ feature }: { feature: AnyFeature }) {
  if (!isOSMFeature(feature)) {
    return <section>Feature type not supported</section>
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

  return (
    <section>
      <h2>Feature type not supported</h2>
    </section>
  )
}

const Panel = styled.section`
  color: ${colors.textColorTonedDownSlightly};
`

export function CombinedFeaturePanel(props: Props) {
  const features = uniqBy(props.features, (feature) => (isSearchResultFeature(feature) ? feature.properties.osm_id : feature._id))
  const { addFilter } = useMapFilterContext()

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
  const surroundings = features && features.length > 1 && features.slice(1)
  useMapHighlight(features[0])

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Panel onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
          {features && features[0] && <PlaceOfInterestDetails feature={features[0]} />}
          {surroundings && surroundings.map((feature) => <FeatureSection key={getKey(feature)} feature={feature} />)}

          {(!features || features.length === 0) && (
            <Callout>
              <h2>{t`No features found.`}</h2>
            </Callout>
          )}

          <p>
            {showDebugger && <FeaturesDebugJSON features={features} /> }
            {showDebugger && (
              <Button onClick={() => {
                addFilter(
                  composeOrFilter(
                    makeFilterByNode('node/4487513227'),
                    makeFilterByNode('node/5643775387'),
                    makeFilterByNode('node/5063750226'),
                  ),
                )
              }}
              >
                Filter for three places in central Berlin
              </Button>
            )}
          </p>
        </Panel>
      </ErrorBoundary>
    </React.StrictMode>
  )
}
