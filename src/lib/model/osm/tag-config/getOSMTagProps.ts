import React from 'react'
import {
  getLocalizedStringTranslationWithMultipleLocales as localize,
} from '../../../i18n/getLocalizedStringTranslationWithMultipleLocales'
import IAccessibilityAttribute from '../../ac/IAccessibilityAttribute'
import { OSMTagProps } from '../../../../components/CombinedFeaturePanel/components/AccessibilitySection/OSMTagProps'
import { horizontalKeys } from './horizontalKeys'
import { languageTaggedKeys } from './languageTaggedKeys'
import { additionalPrefixesForKeys } from './sidewalkPrefixSet'
import { editableKeys } from './editableKeys'
import { tagsWithoutDisplayedKeyRegExp } from './tagsWithoutDisplayedKeyRegExp'
import { tagsWithoutDisplayedKeySet } from './tagsWithoutDisplayedKeySet'
import { valueRenderFunctions } from '../../../../components/CombinedFeaturePanel/components/AccessibilitySection/valueRenderFunctions'
import { AnyFeature, isOSMFeature, isPlaceInfo } from '../../geo/AnyFeature'

function findAttribute(
  attributesById: Map<string, IAccessibilityAttribute>,
  key: string,
  value?: string,
): IAccessibilityAttribute | undefined {
  const suffix = key.match('[^:]+$')?.[0]
  const prefixes = [null, ...(additionalPrefixesForKeys.get(suffix) || [])] || [null]
  for (const prefix of prefixes) {
    const searchKey = prefix ? `osm:${prefix}:${suffix}` : `osm:${key}`
    const attribute = attributesById?.get(value ? `${searchKey}=${value}` : searchKey)
      || attributesById?.get(value ? `osm:${suffix}=${value}` : `osm:${suffix}`)
    if (attribute) {
      return attribute
    }
  }
  return undefined
}

export function getOSMTagProps(
  {
    key, matchedKey, singleValue, attributesById, languageTags,
    feature, baseFeatureUrl,
  }: {
    key: string;
    matchedKey: string;
    singleValue: string;
    attributesById: Map<string, IAccessibilityAttribute>;
    languageTags: string[];
    feature: AnyFeature;
    baseFeatureUrl: string;
  },
): OSMTagProps {
  const keyWithoutLanguageTag = key.replace(/:\w\w(?:[_-]\w\w)?$/, '')
  const keyAttribute = findAttribute(attributesById, key)
    || languageTaggedKeys.has(keyWithoutLanguageTag)
    && findAttribute(attributesById, keyWithoutLanguageTag)
  const valueAttribute = findAttribute(attributesById, key, singleValue)
  let valueLabel: string | React.ReactNode | undefined

  const matches = matchedKey ? key.match(matchedKey) : undefined

  const valueRenderFn = valueRenderFunctions[matchedKey]
  if (valueRenderFn) {
    const osmFeature = isOSMFeature(feature) ? feature : null
    const accessibilityCloudFeature = isPlaceInfo(feature) ? feature : null
    valueLabel = valueRenderFn({
      value: singleValue, matches, languageTags, osmFeature, accessibilityCloudFeature,
    })
  } else {
    valueLabel = localize(valueAttribute?.label, languageTags)
    || localize(valueAttribute?.shortLabel, languageTags)
    || singleValue
  }
  const valueSummary = localize(valueAttribute?.summary, languageTags)
  const valueDetails = localize(valueAttribute?.details, languageTags) || (!valueLabel && valueSummary)

  const keyLabel = localize(keyAttribute?.shortLabel, languageTags)
    || localize(keyAttribute?.label, languageTags)
    || key
  const keySummary = localize(keyAttribute?.summary, languageTags)
  const keyDetails = localize(keyAttribute?.details, languageTags) || (!keyLabel && keySummary)
  const suffix = key.match('[^:]+$')?.[0]
  const hasDisplayedKey = !!keyLabel
    && !(
      tagsWithoutDisplayedKeySet.has(key)
      || tagsWithoutDisplayedKeySet.has(suffix)
      || tagsWithoutDisplayedKeyRegExp.test(key)
    )

  const isEditable = editableKeys.has(key)
  const editURL = `${baseFeatureUrl}/edit/${key}`
  const tagProps: OSMTagProps = {
    tagKey: key,
    hasDisplayedKey,
    keyLabel,
    keyAttribute,
    valueAttribute,
    valueElement: valueLabel,
    isEditable,
    editURL,
    valueDetails,
    keyDetails,
    isHorizontal: horizontalKeys.has(key),
  }
  return tagProps
}
