import { isEqual } from 'lodash'
import { t } from 'ttag'
import { TypeTaggedOSMFeature } from '../../../../lib/model/geo/AnyFeature'
import isAccessibilityRelevantOSMKey from '../../../../lib/model/osm/tag-config/isAccessibilityRelevantOSMKey'
import FeatureNameHeader from '../../components/FeatureNameHeader'
import FeatureAccessibility from '../../components/AccessibilitySection/FeatureAccessibility'

export default function OSMBuildingDetails({ feature }: { feature: TypeTaggedOSMFeature }) {
  const keys = Object.keys(feature.properties).filter(isAccessibilityRelevantOSMKey)
  if (keys.length === 0 || isEqual(keys, ['building:levels'])) {
    return null
  }

  return (
    <section>
      <h4>{t`Part of`}</h4>
      <article>
        <FeatureNameHeader feature={feature} size="small" />
        <FeatureAccessibility feature={feature} />
      </article>
    </section>
  )
}
