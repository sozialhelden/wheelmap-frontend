import React from 'react'
import {
  getLocalizedStringTranslationWithMultipleLocales as localize,
} from '../../../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales'
import IAccessibilityAttribute from '../../../../lib/model/ac/IAccessibilityAttribute'
import { OSMTagProps } from './OSMTagProps'
import { horizontalKeys } from '../../../../lib/model/osm/tag-config/horizontalKeys'
import { languageTaggedKeys } from '../../../../lib/model/osm/tag-config/languageTaggedKeys'
import { additionalPrefixesForKeys } from '../../../../lib/model/osm/tag-config/sidewalkPrefixSet'
import { editableKeys } from '../../../../lib/model/osm/tag-config/editableKeys'
import { tagsWithoutDisplayedKeyRegExp } from '../../../../lib/model/osm/tag-config/tagsWithoutDisplayedKeyRegExp'
import { tagsWithoutDisplayedKeySet } from '../../../../lib/model/osm/tag-config/tagsWithoutDisplayedKeySet'
import { valueRenderFunctions } from './tagging-schema/valueRenderFunctions'

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
    key, matchedKey, singleValue, ids, currentId, attributesById, languageTags,
  }: {
    key: string;
    matchedKey: string;
    singleValue: string;
    ids: string | string[];
    currentId: string;
    attributesById: Map<string, IAccessibilityAttribute>;
    languageTags: string[];
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
    valueLabel = valueRenderFn({ value: singleValue, matches })
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
  const editURL = `/composite/${ids}/${currentId}/${key}/edit`
  const tagProps: OSMTagProps = {
    key,
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
