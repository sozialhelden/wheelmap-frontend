import React, { useContext } from 'react'
import { useRouter } from 'next/router'
import { t } from 'ttag'
import WheelchairAccessibility from '../report/wheelchair-accessibility'
import { FeaturePanelContext } from '../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { AppStateLink } from '../../../../components/App/AppStateLink'
import ToiletAccessibility from '../report/toilet-accessibility'

export default function EditPage() {
  const { query: { tagKey } } = useRouter()
  const { baseFeatureUrl } = useContext(FeaturePanelContext)

  if (tagKey === 'wheelchair') {
    return <WheelchairAccessibility />
  }

  if (tagKey === 'toilets:wheelchair') {
    return <ToiletAccessibility />
  }

  return (
    <div>
      <p>{t`No editor available for ${tagKey}`}</p>
      <footer className="_footer">
        <AppStateLink href={baseFeatureUrl}>
          <div role="button" className="_option _back">Back</div>
        </AppStateLink>
      </footer>
    </div>
  )
}

EditPage.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}
