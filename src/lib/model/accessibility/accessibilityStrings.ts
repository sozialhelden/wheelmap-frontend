import { t } from 'ttag'
import { YesNoLimitedUnknown, YesNoUnknown } from '../ac/Feature'
import shouldPreferImperialUnits from '../geo/shouldPreferImperialUnits'

export function accessibilityName(
  accessibility: YesNoLimitedUnknown,
): string | null {
  switch (accessibility) {
  // translator: Long accessibility description for full wheelchair accessibility
  case 'yes':
    return t`Fully wheelchair accessible`
    // translator: Long accessibility description for partial wheelchair accessibility
  case 'limited':
    return t`Partially wheelchair accessible`
    // translator: Long accessibility description for no wheelchair accessibility
  case 'no':
    return t`Not wheelchair accessible`
    // translator: Long accessibility description for unknown wheelchair accessibility
  case 'unknown':
    return t`Unknown accessibility`
  default:
    return null
  }
}

export function accessibilityColor(
  accessibility: YesNoLimitedUnknown,
): string | null {
  switch (accessibility) {
  // translator: color representing full accessibility
  case 'yes':
    return t`green`
    // translator: color representing partial accessibility
  case 'limited':
    return t`orange`
    // translator: color representing inaccessibility
  case 'no':
    return t`red`
    // translator: color representing unknown accessibility
  case 'unknown':
    return t`gray`
  default:
    return null
  }
}

export function shortAccessibilityName(
  accessibility: YesNoLimitedUnknown,
): string | null {
  switch (accessibility) {
  // translator: Shortened accessibility description for full wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
  case 'yes':
    return t`Fully`
    // translator: Shortened accessibility description for partial wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
  case 'limited':
    return t`Partially`
    // translator: Shortened accessibility description for no wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
  case 'no':
    return t`Not at all`
    // translator: Shortened accessibility description for unknown wheelchair accessibility (imagine as short answer to the question ‘how accessible is this place?’)
  case 'unknown':
    return t`Unknown`
  default:
    return null
  }
}

export function accessibilityDescription(
  accessibility: YesNoLimitedUnknown,
): string | null {
  switch (accessibility) {
  // translator: Describes criteria for marking places as fully wheelchair accessible on Wheelmap
  case 'yes':
    return t`Entrance has no steps, important areas are accessible without steps.`
  case 'limited':
    return shouldPreferImperialUnits()
      ? // translator: Describes criteria for marking places as partially wheelchair accessible on Wheelmap, using imperial units
      t`Entrance has one step with max. 3 inches height, most areas are without steps.`
      : // translator: Describes criteria for marking places as partially wheelchair accessible on Wheelmap, using metric units
      t`Entrance has one step with max. 7 cm height, most areas are without steps.`
    // translator: Describes criteria for marking places as not wheelchair accessible on Wheelmap
  case 'no':
    return t`Entrance has a high step or several steps, important areas are inaccessible.`
  case 'unknown':
  default:
    return null
  }
}

export function toiletDescription(accessibility: YesNoUnknown): string | null {
  switch (accessibility) {
  // translator: Long toilet accessibility description on place toolbar if the toilet IS accessible
  case 'yes':
    return t`Wheelchair accessible WC`
    // translator: Long toilet accessibility description on place toolbar if the toilet is NOT accessible
  case 'no':
    return t`No wheelchair accessible WC`
  case 'unknown':
  default:
    return null
  }
}

export const accessibleToiletDescription = (useImperialUnits: boolean) => [
  useImperialUnits
    ? t`Doorways' inner width ≥ 35 inches`
    : t`Doorways' inner width ≥ 90 cm`,
  useImperialUnits
    ? t`Clear turning space ≥ 59 inches wide`
    : t`Clear turning space ≥ 150 cm wide`,
  t`Wheelchair-height WC seat`,
  t`Foldable grab rails`,
  t`Accessible sink`,
]
