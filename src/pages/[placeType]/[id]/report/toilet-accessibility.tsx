import React, {
  FC, useContext, useState,
} from 'react'
import { AccessibilityView } from './send-report-to-ac'
import FeatureNameHeader from '../../../../components/CombinedFeaturePanel/components/FeatureNameHeader'
import FeatureImage from '../../../../components/CombinedFeaturePanel/components/image/FeatureImage'
import { AnyFeature } from '../../../../lib/model/geo/AnyFeature'

import { cx } from '../../../../lib/util/cx'
import { FeaturePanelContext } from '../../../../components/CombinedFeaturePanel/FeaturePanelContext'
import PlaceLayout from '../../../../components/CombinedFeaturePanel/PlaceLayout'
import { StyledReportView } from './index'
import { AppStateLink } from '../../../../components/App/AppStateLink'
import { YesNoUnknown } from '../../../../lib/model/ac/Feature'
import { isOrHasAccessibleToilet } from '../../../../lib/model/accessibility/isOrHasAccessibleToilet'

import { ToiletStatusNotAccessible } from '../../../../components/icons/accessibility'
import ToiletStatusAccessibleIcon from '../../../../components/icons/accessibility/ToiletStatusAccessible'

const View: FC<{ feature: AnyFeature }> = ({ feature }) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext)

  const current = isOrHasAccessibleToilet(feature)
  const [option, setOption] = useState<YesNoUnknown | undefined>(current)

  return (
    <StyledReportView className="_view">
      <FeatureNameHeader feature={feature}>
        {feature['@type'] === 'osm:Feature' && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <div className="_title">How wheelchair accessible is the toilet?</div>
      <form>
        <AccessibilityView
          onClick={() => { setOption('yes') }}
          className="_yes"
          inputLabel="accessibility-fully"
          selected={option === 'yes'}
          icon={<ToiletStatusAccessibleIcon />}
          valueName="Yes"
        >
          Entrance has no steps, and all rooms are accessible without steps.
        </AccessibilityView>

        <AccessibilityView
          onClick={() => { setOption('no') }}
          className="_no"
          inputLabel="accessibility-not-at-all"
          selected={option === 'no'}
          icon={<ToiletStatusNotAccessible />}
          valueName="No"
        >
          Entrance has a high step or several steps, none of the rooms are accessible.
        </AccessibilityView>
      </form>

      <footer className="_footer">
        <AppStateLink href={baseFeatureUrl}><div role="button" className="_option _back">Back</div></AppStateLink>
        <div role="button" className={cx('_option', '_primary', option === undefined && '_disabled')}>Send</div>
      </footer>
    </StyledReportView>
  )
}

function ToiletAccessibility() {
  const { features } = useContext(FeaturePanelContext)

  const feature = features[0]
  return <View feature={feature} />
}

ToiletAccessibility.getLayout = function getLayout(page) {
  return <PlaceLayout>{page}</PlaceLayout>
}

export default ToiletAccessibility
