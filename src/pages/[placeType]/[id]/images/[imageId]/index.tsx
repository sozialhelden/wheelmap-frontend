import { useContext } from 'react'
import { useRouter } from 'next/router'
import { CombinedFeaturePanel } from '../../../../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import PlaceLayout from '../../../../../components/CombinedFeaturePanel/PlaceLayout'
import { FeaturePanelContext } from '../../../../../components/CombinedFeaturePanel/FeaturePanelContext'

export default function ShowImagePage() {
  const { features } = useContext(FeaturePanelContext)
  const { query: { imageId } } = useRouter()

  const id = typeof imageId === 'string' ? imageId : imageId[0]
  return (
    <CombinedFeaturePanel features={features} focusImage={id} />
  )
}

ShowImagePage.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}
