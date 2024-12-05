import { useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { CombinedFeaturePanel } from '../../../../../components/CombinedFeaturePanel/CombinedFeaturePanel'
import { FeaturePanelContext } from '../../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import { getLayout } from '../../../../../components/CombinedFeaturePanel/PlaceLayout'

export default function ShowImagePage() {
  const { features } = useContext(FeaturePanelContext)
  const resolvedFeatures = useMemo(() => features.map(({ feature }) => feature?.requestedFeature).filter((x) => !!x), [features])
  const { query: { imageId } } = useRouter()

  const id = typeof imageId === 'string' ? imageId : imageId[0]
  return (
    <CombinedFeaturePanel features={resolvedFeatures} focusImage={id} />
  )
}

ShowImagePage.getLayout = getLayout
