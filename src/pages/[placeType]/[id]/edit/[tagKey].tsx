import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { FeaturePanelContext } from '../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { AutoEditor } from '../../../../components/CombinedFeaturePanel/editors/AutoEditor'

export default function EditPage() {
  const { query: { tagKey } } = useRouter()
  const { features } = useContext(FeaturePanelContext)

  const feature = features[0]
  const key = Array.isArray(tagKey) ? tagKey[0] : tagKey

  return <AutoEditor tagKey={key} feature={feature} />
}

EditPage.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}
