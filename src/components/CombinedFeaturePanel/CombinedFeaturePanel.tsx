import { useHotkeys } from '@blueprintjs/core'
import { uniqBy } from 'lodash'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  AnyFeature, getKey, isOSMFeature, isSearchResultFeature,
} from '../../lib/model/geo/AnyFeature'
import colors from '../../lib/util/colors'
import OSMBuildingDetails from './OSMBuildingDetails'
import OSMSidewalkDetails from './OSMSidewalkDetails'
import FeaturesDebugJSON from './components/FeaturesDebugJSON'
import PlaceOfInterestDetails from './type-specific/poi/PlaceOfInterestDetails'

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
  // Place of Interest
  // Environment
}

const Panel = styled.section`
  color: ${colors.textColorTonedDownSlightly};
`

export function CombinedFeaturePanel(props: Props) {
  const { handleOpenReportMode } = props.options || {}
  const features = uniqBy(props.features, (feature) => (isSearchResultFeature(feature) ? feature.properties.osm_id : feature._id))

  /* Hotkeys */
  const [toogle, setToogle] = useState(false)
  const hotkeys = useMemo(() => [
    {
      combo: 'j',
      global: true,
      label: 'Show JSON Feature Debugger',
      onKeyDown: () => setToogle(!toogle),
    },

  ], [toogle])
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys)

  return (
    <Panel onKeyDown={handleKeyDown}>
      {features && features[0] && (
        <>
          <PlaceOfInterestDetails feature={features[0]} />

          {/* <ReportIssueButton
            equipmentInfoId={null}
            feature={features[0]}
            onOpenReportMode={handleOpenReportMode}
          /> */}
        </>
      )}
      {features
        && features.length > 1
        && features
          .slice(1)
          .map((feature) => <FeatureSection key={getKey(feature)} feature={feature} />)}

      <p>
        {toogle && <FeaturesDebugJSON features={features} /> }
      </p>
    </Panel>
  )
}
