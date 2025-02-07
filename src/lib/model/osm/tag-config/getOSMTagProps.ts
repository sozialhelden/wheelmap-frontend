import type React from "react";
import type { OSMTagProps } from "~/components/CombinedFeaturePanel/components/AccessibilitySection/OSMTagProps";
import { valueRenderFunctions } from "~/components/CombinedFeaturePanel/components/AccessibilitySection/valueRenderFunctions";
import { normalizeAndExtractLanguageTagsIfPresent } from "~/components/CombinedFeaturePanel/utils/TagKeyUtils";
import { getLocalizedStringTranslationWithMultipleLocales as localize } from "../../../i18n/getLocalizedStringTranslationWithMultipleLocales";
import type IAccessibilityAttribute from "../../ac/IAccessibilityAttribute";
import {
  type AnyFeature,
  isOSMFeature,
  isPlaceInfo,
} from "../../geo/AnyFeature";
import { editableKeys } from "./editableKeys";
import { horizontalKeys } from "./horizontalKeys";
import { languageTaggedKeys } from "./languageTaggedKeys";
import { additionalPrefixesForKeys } from "./sidewalkPrefixSet";
import { tagsWithoutDisplayedKeyRegExp } from "./tagsWithoutDisplayedKeyRegExp";
import { tagsWithoutDisplayedKeySet } from "./tagsWithoutDisplayedKeySet";

function findAttribute(
  attributesById: Map<string, IAccessibilityAttribute>,
  key: string,
  value?: string,
): IAccessibilityAttribute | undefined {
  const suffix = key.match("[^:]+$")?.[0];
  const prefixes = [null, ...(additionalPrefixesForKeys.get(suffix) || [])] || [
    null,
  ];
  for (const prefix of prefixes) {
    let searchKey = prefix ? `osm:${prefix}:${suffix}` : `osm:${key}`;
    // addWheelchairDescription is a pseudo tag that is added to the tag list as a kind of placeholder
    // so that a call to action and an edit button can be displayed in case no wheelchair description
    // is present in the feature
    if (key === "addWheelchairDescription") {
      searchKey = key;
    }
    const attribute =
      attributesById?.get(value ? `${searchKey}=${value}` : searchKey) ||
      attributesById?.get(value ? `osm:${suffix}=${value}` : `osm:${suffix}`);
    if (attribute) {
      return attribute;
    }
  }
  return undefined;
}

export function getOSMTagProps({
  key,
  matchedKey,
  singleValue,
  attributesById,
  languageTags,
  feature,
  baseFeatureUrl,
}: {
  key: string;
  matchedKey: string;
  singleValue: string;
  attributesById: Map<string, IAccessibilityAttribute>;
  languageTags: string[];
  feature: AnyFeature;
  baseFeatureUrl: string;
}): OSMTagProps {
  const keyWithoutLanguageTag = key.replace(/:\w\w(?:[_-]\w\w)?$/, "");
  const keyAttribute =
    findAttribute(attributesById, key) ||
    (languageTaggedKeys.has(keyWithoutLanguageTag) &&
      findAttribute(attributesById, keyWithoutLanguageTag));
  const valueAttribute = findAttribute(attributesById, key, singleValue);
  let valueLabel: string | React.ReactNode | undefined;

  const matches = matchedKey ? key.match(matchedKey) : undefined;

  const valueRenderFn = valueRenderFunctions[matchedKey];
  const defaultValueLabel =
    localize(valueAttribute?.label, languageTags) ||
    localize(valueAttribute?.shortLabel, languageTags) ||
    singleValue;

  if (valueRenderFn) {
    const osmFeature = isOSMFeature(feature) ? feature : null;
    const accessibilityCloudFeature = isPlaceInfo(feature) ? feature : null;
    valueLabel = valueRenderFn({
      value: singleValue,
      matches,
      languageTags,
      osmFeature,
      accessibilityCloudFeature,
      defaultValueLabel,
    });
  } else {
    valueLabel = defaultValueLabel;
  }
  const valueSummary = localize(valueAttribute?.summary, languageTags);
  const valueDetails =
    localize(valueAttribute?.details, languageTags) ||
    (!valueLabel && valueSummary);

  const keyLabel =
    localize(keyAttribute?.shortLabel, languageTags) ||
    localize(keyAttribute?.label, languageTags) ||
    key;
  const keySummary = localize(keyAttribute?.summary, languageTags);
  const keyDetails =
    localize(keyAttribute?.details, languageTags) || (!keyLabel && keySummary);
  const suffix = key.match("[^:]+$")?.[0];
  const hasDisplayedKey =
    !!keyLabel &&
    !(
      tagsWithoutDisplayedKeySet.has(key) ||
      tagsWithoutDisplayedKeySet.has(suffix) ||
      tagsWithoutDisplayedKeyRegExp.test(key)
    );

  const isEditable = editableKeys.has(key);
  const { hasLanguageTagSupport } =
    normalizeAndExtractLanguageTagsIfPresent(key);
  const editURL = `${baseFeatureUrl}/edit/${key}`;
  const tagProps: OSMTagProps = {
    tagKey: key,
    hasDisplayedKey,
    keyLabel,
    keyAttribute,
    valueAttribute,
    valueElement: valueLabel,
    isEditable,
    isLanguageTagged: hasLanguageTagSupport,
    editURL,
    valueDetails,
    keyDetails,
    isHorizontal: horizontalKeys.has(key),
  };
  return tagProps;
}
