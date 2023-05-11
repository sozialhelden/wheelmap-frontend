import { editableKeys, tagsWithoutDisplayedKey } from "./config";
import React from "react";
import { useCurrentAppToken } from "../../../../lib/context/AppContext";
import { useCurrentLanguageTagStrings } from "../../../../lib/context/LanguageTagContext";
import { useAccessibilityAttributesIdMap } from "../../../../lib/fetchers/fetchAccessibilityAttributes";
import { getLocalizedStringTranslationWithMultipleLocales as localize } from "../../../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { valueRenderFunctions } from "./OSMTagTable";
import { OSMTagProps } from "./OSMTagProps";
import IAccessibilityAttribute from "../../../../lib/model/ac/IAccessibilityAttribute";

export function getOSMTagProps(
  { key, matchedKey, singleValue, ids, currentId, appToken, attributesById, languageTags }: {
    key: string;
    matchedKey: string;
    singleValue: string;
    ids: string | string[];
    currentId: string;
    appToken: string;
    attributesById: Map<string, IAccessibilityAttribute>;
    languageTags: string[];
  }): OSMTagProps {

  const keyAttribute = attributesById?.get(`osm:${key}`);
  const valueAttribute = attributesById?.get(`osm:${key}=${singleValue}`);
  const keyLabel = localize(keyAttribute?.shortLabel, languageTags) ||
    localize(keyAttribute?.label, languageTags);
  let valueLabel: string | React.ReactNode | undefined;
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
  const editURL = `/composite/${ids}/${currentId}/${key}/edit`;
  const tagProps: OSMTagProps = {
    key,
    hasDisplayedKey,
    keyLabel,
    keyAttribute,
    valueAttribute,
    valueElement: valueLabel,
    isEditable,
    editURL,
    shownDetailsLine,
  };
  return tagProps;
}
