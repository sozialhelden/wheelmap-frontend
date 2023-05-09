import React from "react";
import { useCurrentAppToken } from "../../../../lib/context/AppContext";
import { useCurrentLanguageTagStrings } from "../../../../lib/context/LanguageTagContext";
import { useAccessibilityAttributesIdMap } from "../../../../lib/fetchers/fetchAccessibilityAttributes";
import { getLocalizedStringTranslationWithMultipleLocales as localize } from "../../../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { TypeTaggedOSMFeature } from "../../../../lib/model/shared/AnyFeature";
import { valueRenderFunctions, editableKeys } from "./OSMTagTable";
import { OSMTagProps } from "./OSMTagProps";

export const tagsWithoutDisplayedKey = new Set([
  "wheelchair",
  "wheelchair:description",
  "wheelchair:description:de",
  "wheelchair:description:en",
  "toilets:wheelchair",
  "internet_access:fee",
]);

export function getOSMTagProps(
  { key, feature, ids }: {
    key: string;
    feature: TypeTaggedOSMFeature;
    ids: string | string[];
  }): OSMTagProps {
  const appToken = useCurrentAppToken();
  const singleValue = feature.properties[key];
  const languageTags = useCurrentLanguageTagStrings();
  const { data: attributesById, isValidating } = useAccessibilityAttributesIdMap(languageTags, appToken);
  const keyAttribute = attributesById?.get(`osm:${key}`);
  const valueAttribute = attributesById?.get(`osm:${key}=${singleValue}`);
  const keyLabel = localize(keyAttribute?.shortLabel, languageTags) ||
    localize(keyAttribute?.label, languageTags);
  let valueLabel: string | React.ReactNode | undefined;
  const matchedKey = React.useMemo(
    () => Object.keys(valueRenderFunctions).find((renderFunctionKey) => key.match(renderFunctionKey)
    ),
    [key]
  );
  const matches = matchedKey ? key.match(matchedKey) : undefined;
  const valueRenderFn = valueRenderFunctions[matchedKey];
  if (valueRenderFn) {
    valueLabel = valueRenderFn({ value: singleValue, matches });
  } else {
    valueLabel = localize(valueAttribute?.label, languageTags) ||
      localize(valueAttribute?.shortLabel, languageTags) ||
      singleValue;
  }
  const summary = localize(valueAttribute?.summary, languageTags);
  const details = localize(valueAttribute?.details, languageTags);
  const shownDetailsLine = details || (!valueLabel && summary);
  const hasDisplayedKey = !!keyLabel && !tagsWithoutDisplayedKey.has(key);
  const isEditable = editableKeys.has(key);
  const editURL = `/composite/${ids}/${feature._id}/${key}/edit`;
  const tagProps: OSMTagProps = {
    key,
    hasDisplayedKey,
    keyLabel,
    valueElement: valueLabel,
    isEditable,
    editURL,
    shownDetailsLine,
  };
  return tagProps;
}
