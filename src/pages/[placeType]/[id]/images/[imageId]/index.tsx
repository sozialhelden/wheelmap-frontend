import { useContext } from 'react'
import { useRouter } from 'next/router'
import { CombinedFeaturePanel } from '../../../../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import { FeaturePanelContext } from '../../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import { getLayout } from '../../../../../components/App/MapLayout'

export default function ShowImagePage() {
  const { features } = useContext(FeaturePanelContext)
  const { query: { imageId } } = useRouter()

  const id = typeof imageId === 'string' ? imageId : imageId[0]
  return (
    <CombinedFeaturePanel features={features} focusImage={id} />
  )
}

ShowImagePage.getLayout = getLayout
