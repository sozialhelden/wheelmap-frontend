import { useRouter } from 'next/router'
import { ReactElement, useRef, useState } from 'react'
import Link from 'next/link'
import MapLayout from '../../../../components/App/MapLayout'
import { AccessibilityView, StyledToolbar } from './send-report-to-ac'
import FeatureNameHeader, { useFeatureLabel } from '../../../../components/CombinedFeaturePanel/components/FeatureNameHeader'
import FeatureImage from '../../../../components/CombinedFeaturePanel/components/image/FeatureImage'
import { useCurrentLanguageTagStrings } from '../../../../lib/context/LanguageTagContext'
import Icon from '../../../../components/shared/Icon'
import { AnyFeature } from '../../../../lib/model/geo/AnyFeature'
import { useMultipleFeatures } from '../../../../lib/fetchers/fetchMultipleFeatures'

import {
  unknownCategory,
} from '../../../../lib/model/ac/categories/Categories'
import { ErrorToolBar, LoadingToolbar } from '.'
import { cx } from '../../../../lib/util/cx'

const View: FC<{ feature: AnyFeature}> = ({ feature }) => {
  const router = useRouter()
  const { placeType, id } = router.query
  const languageTags = useCurrentLanguageTagStrings()
  const ref = useRef(null)
  const {
    category,
    categoryTagKeys,
  } = useFeatureLabel({
    feature,
    languageTags,
  })

  const cat = (category !== unknownCategory) && category?._id || categoryTagKeys[0] || 'undefined'
  const [option, setOption] = useState<'fully' | 'partially' | 'not-at-all' | undefined>()

  return (
    <StyledToolbar innerRef={ref}>
      <div className="_view" ref={ref}>
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
          <Link href={{ pathname: '../report', query: { placeType, id } }}><div role="button" className="_option _back">Back</div></Link>
          <div role="button" className={cx('_option', '_primary', option === undefined && '_disabled')}>Send</div>
        </footer>
      </div>
    </StyledToolbar>
  )
}

function WheelchairAccessibility() {
  const router = useRouter()
  const { placeType, id } = router.query
  const features = useMultipleFeatures(`${placeType}:${id}`)
  const feature = features && features.data ? features.data[0] : undefined

  if (features.isLoading || features.isValidating) {
    return <LoadingToolbar />
  }

  if (features.data === undefined) {
    return <ErrorToolBar />
  }

  return <View feature={feature} />
}

WheelchairAccessibility.getLayout = function getLayout(page: ReactElement) {
  return <MapLayout>{page}</MapLayout>
}

export default WheelchairAccessibility
