import React, { useContext } from "react";
import {
  normalizeLanguageTag,
  useCurrentLanguageTagStrings,
} from "../../../../lib/context/LanguageTagContext";
import { FeaturePanelContext } from "../../FeaturePanelContext";
import { EditButton } from "./EditButton";

export default function AddWheelchairDescription() {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  const languageTags = useCurrentLanguageTagStrings();
  const normalizedLanguageTag = normalizeLanguageTag(languageTags[0]);
  const key = `wheelchair:description:${normalizedLanguageTag}`;
  const editURL = `${baseFeatureUrl}/edit/${key}`;
  const editButton = <EditButton editURL={editURL} />;
  return editButton;
}
