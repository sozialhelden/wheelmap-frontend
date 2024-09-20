import React, {
  FC, useContext, useState,
} from 'react'
import { AccessibilityView } from './send-report-to-ac'
import FeatureNameHeader from '../../../../components/CombinedFeaturePanel/components/FeatureNameHeader'
import FeatureImage from '../../../../components/CombinedFeaturePanel/components/image/FeatureImage'
import { useCurrentLanguageTagStrings } from '../../../../lib/context/LanguageTagContext'
import Icon from '../../../../components/shared/Icon'
import { AnyFeature } from '../../../../lib/model/geo/AnyFeature'

import {
  unknownCategory,
} from '../../../../lib/model/ac/categories/Categories'
import { cx } from '../../../../lib/util/cx'
import { useFeatureLabel } from '../../../../components/CombinedFeaturePanel/utils/useFeatureLabel'
import { FeaturePanelContext } from '../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { StyledReportView } from './index'
import { AppStateLink } from '../../../../components/App/AppStateLink'

const View: FC<{ feature: AnyFeature }> = ({ feature }) => {
  const languageTags = useCurrentLanguageTagStrings()

  const {
    category,
    categoryTagKeys,
  } = useFeatureLabel({
    feature,
    languageTags,
  })

  const cat = ((category !== unknownCategory && category?._id) ? category._id : categoryTagKeys[0]) || 'undefined'
  const [option, setOption] = useState<'fully' | 'partially' | 'not-at-all' | undefined>()

  return (
    <StyledReportView className="_view">
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <div className="_title">How wheelchair accessible is this place?</div>
      <form>
        <AccessibilityView
          onClick={() => { setOption('fully') }}
          className="_yes"
          inputLabel="accessibility-fully"
          selected={option === 'fully'}
          icon={<Icon size="medium" accessibility="yes" category={cat} />}
          valueName="Fully"
        >
          Entrance has no steps, and all rooms are accessible without steps.
        </AccessibilityView>
        <AccessibilityView
          onClick={() => { setOption('partially') }}
          className="_okay"
          inputLabel="accessibility-partially"
          selected={option === 'partially'}
          icon={<Icon size="medium" accessibility="limited" category={cat} />}
          valueName="Partially"
        >
          Entrance has one step with max. 3 inches height, most rooms are without steps
        </AccessibilityView>

        <AccessibilityView
          onClick={() => { setOption('not-at-all') }}
          className="_no"
          inputLabel="accessibility-not-at-all"
          selected={option === 'not-at-all'}
          icon={<Icon size="medium" accessibility="no" category={cat} />}
          valueName="Not at all"
        >
          Entrance has a high step or several steps, none of the rooms are accessible.
        </AccessibilityView>
      </form>

      <footer className="_footer">
        <AppStateLink href="../report"><div role="button" className="_option _back">Back</div></AppStateLink>
        <div role="button" className={cx('_option', '_primary', option === undefined && '_disabled')}>Send</div>
      </footer>
    </StyledReportView>
  )
}

function WheelchairAccessibility() {
  const { features } = useContext(FeaturePanelContext)

  const feature = features[0]
  return <View feature={feature} />
}

WheelchairAccessibility.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}

export default WheelchairAccessibility
