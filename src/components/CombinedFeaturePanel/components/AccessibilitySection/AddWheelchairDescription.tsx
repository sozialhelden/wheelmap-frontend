import React from "react";
import {
  normalizeLanguageTag,
  useCurrentLanguageTagStrings,
} from "~/lib/context/LanguageTagContext";
import { EditButton } from "./EditButton";

export default function AddWheelchairDescription() {
  const languageTags = useCurrentLanguageTagStrings();
  const normalizedLanguageTag = normalizeLanguageTag(languageTags[0]);
  const key = `wheelchair:description:${normalizedLanguageTag}`;
  return <EditButton tagKey={key} addNewLanguage={true} />;
}
