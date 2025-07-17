import React from "react";
import { useI18n } from "~/modules/i18n/context/I18nContext";
import { EditButton } from "./EditButton";

export default function AddWheelchairDescription() {
  const { languageTag } = useI18n();
  const key = `wheelchair:description:${languageTag}`;
  return <EditButton tagKey={key} addNewLanguage={true} />;
}
