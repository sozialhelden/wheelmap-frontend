import { ControlGroup } from '@blueprintjs/core'
import includes from 'lodash/includes'
import { t } from 'ttag'
import {
  hasAccessibleToilet, YesNoUnknown,
} from '../../../../../lib/model/ac/Feature'
import {
  accessibilityDescription, toiletDescription,
} from '../../../../../lib/model/accessibility/accessibilityStrings'
import { isWheelchairAccessible } from '../../../../../lib/model/accessibility/isWheelchairAccessible'
import {
  AnyFeature,
  isOSMFeature,
  isPlaceInfo,
} from '../../../../../lib/model/geo/AnyFeature'
import ToiletStatuAccessibleIcon from '../../../../icons/accessibility/ToiletStatusAccessible'
import ToiletStatusNotAccessibleIcon from '../../../../icons/accessibility/ToiletStatusNotAccessible'

// Don't incentivize people to add toilet status to places of these categories
const placeCategoriesWithoutExtraToiletEntry = [
  'parking', // because this mostly affects parking lots
  'bus_stop',
  'tram_stop',
  'atm',
  'toilets',
  'elevator',
  'escalator',
]

const toiletIcons = {
  yes: <ToiletStatuAccessibleIcon style={{ verticalAlign: 'middle' }} />,
  no: <ToiletStatusNotAccessibleIcon style={{ verticalAlign: 'middle' }} />,
}

function ToiletDescription(accessibility: YesNoUnknown) {
  if (!accessibility) return

  // translator: Button caption, shown in the place toolbar
  const editButtonCaption = t`Mark wheelchair accessibility of WC`
  const description = toiletDescription(accessibility) || editButtonCaption
  const icon = toiletIcons[accessibility] || null
  return (
    <>
      {icon}
      {icon && <>&nbsp;</>}
      {description}
    </>
  )
}

export default function PlaceWheelchairAccessibility({ feature }: { feature?: AnyFeature }) {
  if (!feature || (!isOSMFeature(feature) && !isPlaceInfo(feature))) {
    return null
  }
  const { properties } = feature || {}
  if (!properties) {
    return null
  }

  const wheelchairAccessibility = isWheelchairAccessible(feature)
  return (
    <ControlGroup vertical>
      <header>accessibilityName(wheelchairAccessibility)</header>
      <footer className="accessibility-description">
        {accessibilityDescription(wheelchairAccessibility)}
      </footer>
    </ControlGroup>
  )
}

export function PlaceToiletAccessibility({ feature }: { feature: AnyFeature }) {
  if (!isOSMFeature(feature) && !isPlaceInfo(feature)) {
    return null
  }
  const { properties } = feature || {}
  if (!properties) {
    return null
  }

  const wheelchairAccessibility = isWheelchairAccessible(feature)
  const isKnownWheelchairAccessibility = wheelchairAccessibility !== 'unknown'
  const toiletAccessibility = hasAccessibleToilet(feature)
  const categoryId = properties.category
  const hasBannedCategory = includes(
    placeCategoriesWithoutExtraToiletEntry,
    categoryId,
  )
  const canAddToiletStatus = includes(['yes', 'limited'], wheelchairAccessibility)
  const isToiletButtonShown = ((isKnownWheelchairAccessibility
        && !hasBannedCategory
        && canAddToiletStatus))
    || (toiletAccessibility === 'yes' && categoryId !== 'toilets')

  const hasContent = isToiletButtonShown /* || findToiletsNearby */
  if (!hasContent) {
    return null
  }

  return (
    <>
      {ToiletDescription(toiletAccessibility)}
    </>
  )
}
