import { parse } from 'marked'
import { t } from 'ttag'

import { translatedStringFromObject } from '../../lib/i18n/translatedStringFromObject'
import { ClientSideConfiguration } from '../../lib/model/ac/ClientSideConfiguration'

/**
 * Onboarding Step Texts
 */

// select a white label product name
export const selectProductName = (
  clientSideConfiguration: ClientSideConfiguration | undefined,
) => translatedStringFromObject(
  clientSideConfiguration?.textContent?.product?.name,
) || 'Wheelmap'

// translator: Button caption shown on the onboarding screen. To find it, click the logo at the top.
export const selectHeaderMarkdownHTML = (
  clientSideConfiguration: ClientSideConfiguration | undefined,
) => {
  if (!clientSideConfiguration) {
    return undefined
  }
  const { headerMarkdown } = clientSideConfiguration.textContent
    ?.onboarding || {
    headerMarkdown: undefined,
  }
  return headerMarkdown && parse(translatedStringFromObject(headerMarkdown) ?? '')
}

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
**No Problem!** If you change your mind, grant location permissions for ${productName} in [your deviceʼs location settings](${uri}).

You can still use all features of the app.
`

/**
 * Location Failed Step Texts
 */

// translator: The text shows when a location permission had been granted but failed to be acquired for other reasons
export const LocationFailedStepPrimaryText = (productName: string) => t`
Could not determine location – you can still use all features of ${productName}.
`
