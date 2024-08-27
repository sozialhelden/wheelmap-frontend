import * as React from 'react'
import { t } from 'ttag'

import { EquipmentInfo, PlaceInfo } from '@sozialhelden/a11yjson'
import {
  Category,
  getCategoryId,
} from '../../../lib/model/ac/categories/Categories'
import ShareBar from '../../ShareBar/ShareBar'
import { translatedStringFromObject } from '../../../lib/i18n/translatedStringFromObject'

type Props = {
  feature: PlaceInfo;
  featureId: string | number | null;
  category: Category | null;
  parentCategory: Category | null;
  onToggle?: () => void;
  className?: string;
};

function ShareButtons({
  feature,
  featureId,
  category,
  parentCategory,
  onToggle,
  className,
}: Props) {
  // translator: Additional description text for sharing a place in a social network.
  let pageDescription = t`Learn more about the accessibility of this place`
  const url = featureId
    ? `https://wheelmap.org/nodes/${featureId}`
    : 'https://wheelmap.org'

  // translator: Email body used when sharing a place without known name/category via email.
  let mailBody = t`I found a place on Wheelmap: ${url}`
  // translator: Email body used when sharing a place without known name/category via email.// Email subject used for sharing a place via email.
  let mailSubject = t`Wheelmap.org`
  // translator: First line in an email and shared object title used when sharing a place via email or a social network.
  let sharedObjectTitle = t`I found a place on Wheelmap…`
  // translator: Shown as button caption in the place toolbar
  const shareButtonCaption = t`Share`

  if (feature && feature.properties) {
    const { properties } = feature
    const { description } = properties
    const categoryOrParentCategory = category || parentCategory
    const categoryName = categoryOrParentCategory
      ? getCategoryId(categoryOrParentCategory)
      : null
    // translator: Used to describe a place with unknown name, but known category (when sharing)
    const placeName = (properties.name && translatedStringFromObject(properties.name))
      || (categoryName && t`${categoryName} on Wheelmap`)
    if (placeName) {
      // translator: First line in an email and shared object title used when sharing a place via email or a social network.
      sharedObjectTitle = t`I found this place on Wheelmap: ${placeName}`
      // translator: Email body used when sharing a place with known name via email.// Email subject used for sharing a place via email.
      mailSubject = t`${placeName} on Wheelmap.org`
    }

    // translator: Additional description text for sharing a place in a social network.
    pageDescription = translatedStringFromObject(description)
      || t`Learn more about the accessibility of this place`
    // translator: Text for mail body for shared place asking to click a link to open the shared place
    mailBody = t`${sharedObjectTitle}\n\nClick on this link to open it: ${url}`
  }
  const mailToLink = `mailto:?subject=${encodeURIComponent(
    mailSubject,
  )}&body=${encodeURIComponent(mailBody)}`

  return (
    <ShareBar
      shareButtonCaption={shareButtonCaption}
      url={url}
      pageDescription={pageDescription}
      sharedObjectTitle={sharedObjectTitle}
      mailToLink={mailToLink}
      onToggle={onToggle}
      featureId={featureId ? featureId.toString() : null}
      className={className}
    />
  )
}

export default ShareButtons
