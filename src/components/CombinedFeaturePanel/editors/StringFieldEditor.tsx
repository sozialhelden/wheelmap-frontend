import { Button, Heading, Link, TextArea } from "@radix-ui/themes";
import React, { useContext, useEffect, useState } from "react";
import { t } from "ttag";
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
}: BaseEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  const current = feature.properties?.[tagKey] || "";
  const [editedTagValue, setEditedTagValue] = React.useState(current);
  const [saveButtonDoesNothing, setSaveButtonDoesNothing] = useState<boolean>(true);

  useEffect(() => {
    setIsNoOpButton(current === editedTagValue);
  }, [current, editedTagValue]);

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

      <footer className="_footer">
        <AppStateLink href={baseFeatureUrl} tabIndex={-1}>
          <Link href="">{isNoOpButton ? "Cancel" : "Back"}</Link>
        </AppStateLink>
        <AppStateLink href={baseFeatureUrl} tabIndex={-1}>
          <Button
            variant="solid"
            onClick={isNoOpButton ? undefined : handleSubmitButtonClick}
          >
            {isNoOpButton ? "Confirm" : "Send"}
          </Button>
        </AppStateLink>
      </footer>
    </StyledReportView>
  );
};
