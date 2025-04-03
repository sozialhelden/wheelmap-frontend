import React from "react";
import { useI18nContext } from "~/modules/i18n/context/I18nContext";
import { EditButton } from "./EditButton";

export default function AddWheelchairDescription() {
  const { languageTag } = useI18nContext();
  const key = `wheelchair:description:${languageTag}`;
  return <EditButton tagKey={key} addNewLanguage={true} />;
}
