import { useContext } from 'react'
import { CombinedFeaturePanel } from '../../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import {
  FeaturePanelContext,
} from '../../../components/CombinedFeaturePanel/FeaturePanelContext'
import PlaceLayout from '../../../components/CombinedFeaturePanel/PlaceLayout'

export default function PlaceFeaturePage() {
  const { features } = useContext(FeaturePanelContext)

  return (
    <CombinedFeaturePanel features={features} />
  )
}

PlaceFeaturePage.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}
