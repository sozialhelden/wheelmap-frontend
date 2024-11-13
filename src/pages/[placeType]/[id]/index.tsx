import { useContext } from 'react'
import { CombinedFeaturePanel } from '../../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import {
  FeaturePanelContext,
} from '../../../components/CombinedFeaturePanel/FeaturePanelContext'
import { getLayout } from '../../../components/CombinedFeaturePanel/PlaceLayout'

export default function PlaceFeaturePage() {
  const { features } = useContext(FeaturePanelContext)

  return (
    <CombinedFeaturePanel features={features} />
  )
}

PlaceFeaturePage.getLayout = getLayout
