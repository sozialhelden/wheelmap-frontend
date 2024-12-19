import { Button, Link, TextArea } from "@radix-ui/themes";
import React, { useContext, useEffect, useState } from "react";
import { t } from "ttag";
import Picker from "~/components/CombinedFeaturePanel/editors/Picker";
import { AppStateLink } from "../../App/AppStateLink";
import { FeaturePanelContext } from "../FeaturePanelContext";
import { StyledReportView } from "../ReportView";
import FeatureNameHeader from "../components/FeatureNameHeader";
import FeatureImage from "../components/image/FeatureImage";
import type { BaseEditorProps } from "./BaseEditor";

export const StringFieldEditor = ({
  feature,
  tagKey,
  onChange,
  handleSubmitButtonClick,
  passLanguagePickerValueToParent,
}: BaseEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  const current = feature.properties?.[tagKey] || "";
  const [editedTagValue, setEditedTagValue] = React.useState(current);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [saveButtonDoesNothing, setSaveButtonDoesNothing] =
    useState<boolean>(true);

  useEffect(() => {
    setSaveButtonDoesNothing(current === editedTagValue);
  }, [current, editedTagValue]);

  const mockItems = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "ja", label: "Japanese" },
    { value: "zh", label: "Chinese" },
    { value: "ar", label: "Arabic" },
    { value: "ru", label: "Russian" },
    { value: "hi", label: "Hindi" },
  ];

  return (
    <StyledReportView>
      <FeatureNameHeader feature={feature}>
        {feature["@type"] === "osm:Feature" && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h2 className="_title">{t`Editing ${tagKey}`}</h2>

      <TextArea
        variant="classic"
        className="_textarea"
        placeholder="Enter text here"
        value={editedTagValue}
        autoFocus
        onChange={(evt) => {
          setEditedTagValue(evt.target.value);
          onChange(evt.target.value);
        }}
      />
      <Picker
        placeholder={"Please select a language"}
        items={mockItems}
        onSelect={(value) => {
          setSelectedLanguage(value);
          if (passLanguagePickerValueToParent) {
            passLanguagePickerValueToParent(value);
          }
          console.log("Selected Language Tag:", value);
        }}
      />

      <footer className="_footer">
        <AppStateLink href={baseFeatureUrl} tabIndex={-1}>
          <Link href="">{saveButtonDoesNothing ? "Cancel" : "Back"}</Link>
        </AppStateLink>

        <AppStateLink href={baseFeatureUrl} tabIndex={-1}>
          <Button
            variant="solid"
            onClick={
              saveButtonDoesNothing ? undefined : handleSubmitButtonClick
            }
          >
            {saveButtonDoesNothing ? "Confirm" : "Send"}
          </Button>
        </AppStateLink>
      </footer>
    </StyledReportView>
  );
};
