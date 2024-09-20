import React, { useContext } from 'react'
import { FeaturePanelContext } from '../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { ToiletsWheelchairEditor } from '../../../../components/CombinedFeaturePanel/editors/ToiletsWheelchairEditor'

function ToiletAccessibility() {
  const { features } = useContext(FeaturePanelContext)

  const feature = features[0]
  return <ToiletsWheelchairEditor feature={feature} tagKey="toilets:wheelchair" />
}

ToiletAccessibility.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}

export default ToiletAccessibility
