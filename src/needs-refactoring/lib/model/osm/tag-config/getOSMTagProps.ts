import type React from "react";
import type { OSMTagProps } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/OSMTagProps";
import { valueRenderFunctions } from "~/needs-refactoring/components/CombinedFeaturePanel/components/AccessibilitySection/valueRenderFunctions";
import { normalizeAndExtractLanguageTagsIfPresent } from "~/needs-refactoring/lib/util/TagKeyUtils";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
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
import { tagsWithoutDisplayedKeySet } from "./tagsWithoutDisplayedKeySet";
import { tagsWithoutDisplayedKeyRegExp } from "./tagsWithoutDisplayedKeyRegExp";

function findAttribute(
  attributesById: Map<string, IAccessibilityAttribute>,
  key: string,
  value?: string,
): IAccessibilityAttribute | undefined {
  const suffix = key.match("[^:]+$")?.[0];
  // the following is necessary
  const prefixes = [null, ...(additionalPrefixesForKeys.get(suffix) || [])];
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
  feature,
}: {
  key: string;
  matchedKey: string;
  singleValue: string;
  attributesById: Map<string, IAccessibilityAttribute>;
  feature: AnyFeature;
  baseFeatureUrl: string;
}): OSMTagProps {
  const keyWithoutLanguageTag = key.replace(/:\w\w(?:[_-]\w\w)?$/, "");
  let keyAttribute = findAttribute(attributesById, key);
  if (!keyAttribute && languageTaggedKeys.has(keyWithoutLanguageTag)) {
    keyAttribute = findAttribute(attributesById, keyWithoutLanguageTag);
  }

  const valueAttribute = findAttribute(attributesById, key, singleValue);
  let valueLabel: string | React.ReactNode | undefined;

  const matches = matchedKey ? key.match(matchedKey) : undefined;

  const valueRenderFn = valueRenderFunctions[matchedKey];
  const defaultValueLabel =
    useTranslations(valueAttribute?.label) ||
    useTranslations(valueAttribute?.shortLabel) ||
    singleValue;

  if (valueRenderFn) {
    const osmFeature = isOSMFeature(feature) ? feature : undefined;
    const accessibilityCloudFeature = isPlaceInfo(feature)
      ? feature
      : undefined;
    valueLabel = valueRenderFn({
      value: singleValue,
      key: key,
      matches,
      osmFeature,
      accessibilityCloudFeature,
      defaultValueLabel,
    });
  } else {
    valueLabel = defaultValueLabel;
  }
  const valueSummary = useTranslations(valueAttribute?.summary);
  let valueDetails = useTranslations(valueAttribute?.details);
  if (!valueDetails && !valueLabel) {
    valueDetails = valueSummary;
  }

  const keyLabel =
    useTranslations(keyAttribute?.shortLabel) ||
    useTranslations(keyAttribute?.label) ||
    key;

  const keySummary = useTranslations(keyAttribute?.summary);
  let keyDetails = useTranslations(keyAttribute?.details);
  if (!keyDetails && !keyLabel) {
    keyDetails = keySummary;
  }
  const suffix = key.match("[^:]+$")?.[0];
  const hasDisplayedKey =
    !!keyLabel &&
    !(
      tagsWithoutDisplayedKeySet.has(key) ||
      (suffix && tagsWithoutDisplayedKeySet.has(suffix)) ||
      tagsWithoutDisplayedKeyRegExp.test(key)
    );

  const isEditable = editableKeys.has(key);
  const { hasLanguageTagSupport } =
    normalizeAndExtractLanguageTagsIfPresent(key);
  const isDescription = key.includes("description");

  return {
    tagKey: key,
    hasDisplayedKey,
    keyLabel,
    keyAttribute,
    valueAttribute,
    valueElement: valueLabel,
    isEditable,
    isDescription,
    isLanguageTagged: hasLanguageTagSupport,
    valueDetails,
    keyDetails,
    isHorizontal: horizontalKeys.has(key),
  };
}
