import React, { useContext } from 'react'
import { FeaturePanelContext } from '../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { WheelchairEditor } from '../../../../components/CombinedFeaturePanel/editors/WheelchairEditor'

function WheelchairAccessibility() {
  const { features } = useContext(FeaturePanelContext)

  const feature = features[0]
  return <WheelchairEditor feature={feature} tagKey="wheelchair" />
}

WheelchairAccessibility.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}

export default WheelchairAccessibility
