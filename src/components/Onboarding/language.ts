import { parse } from 'marked'
import { t } from 'ttag'

import { translatedStringFromObject } from '../../lib/i18n/translatedStringFromObject'
import { ClientSideConfiguration } from '../../lib/model/ac/ClientSideConfiguration'

/**
 * Onboarding Step Texts
 */

// select a white label product name
export const selectProductName = (
  clientSideConfiguration: ClientSideConfiguration,
) => translatedStringFromObject(
  clientSideConfiguration.textContent?.product.name,
) || 'Wheelmap'

// translator: Button caption shown on the onboarding screen. To find it, click the logo at the top.
export const selectHeaderMarkdownHTML = (
  clientSideConfiguration: ClientSideConfiguration,
) => {
  const { headerMarkdown } = clientSideConfiguration.textContent
    ?.onboarding || {
    headerMarkdown: undefined,
  }
  return headerMarkdown && parse(translatedStringFromObject(headerMarkdown))
}

// translator: Shown on the onboarding screen. To find it, click the logo at the top.
export const unknownAccessibilityIncentiveText = t`Help out by marking places!`

// translator: Button caption shown on the onboarding screen. To find it, click the logo at the top.
export const startButtonCaption = t`Okay, let’s go!`

// translator: The alternative description of the app logo for screen readers
export const appLogoAltText = t`App Logo`

/**
 * Location Step Texts
 */

// translator: A description that the app is now asking for location permissions while onboarding
export const LocationStepPrimaryText = t`
# Hold up — we may need your location permissions

Wheelmap is primarily a map app, to orient yourself next to your surroundings, we may ask for location permissions of your device.
You may change your decision at any time!

Your location always stays on your device.
`

export const DenyLocationPermissionText = t`Continue without location access`
export const GrantLocationPermissionText = t`I’m in!`

export const LocationStepAdditionalHint = (uri: string) =>
  // translator: A hint that shows up, when acquiring location permissions initially failed
  // eslint-disable-next-line implicit-arrow-linebreak
  t`If you’re experiencing issues, you may consult [your devices permission configuration](${uri}).`

// translator: The onboarding shows a location search if there is no device location,
// this text shows up next to the search field
export const LocationSearchContinueText = t`Continue`
/**
 * Location No Permission Step Texts
 */

// translator: The text shows when a location perrmision has not been given
export const LocationNoPermissionPrimaryText = (
  productName: string,
  uri: string,
) => t`
# No Problem!

If you change our mind at any time, you can grant location permission for ${productName} at any time through
[your devices' location setting](${uri})

You can still use all features of Wheelmap.

Do you want to start in the center of city instead?
`

/**
 * Location Failed Step Texts
 */

// translator: The text shows when a location permission had been granted but failed to be acquired for other reasons
export const LocationFailedStepPrimaryText = (productName: string) => t`
# That did not work!

Don't worry, you can still use all features of ${productName}.
Do you want to start in the center of a city instead?
`

/**
 * Location Search Texts
 */

// translator: Text in a button to skip initial location selection
export const SearchSkipText = t`Skip`
// translator: Text in a button to set the initial location selection
export const SearchConfirmText = t`Let’s go`
