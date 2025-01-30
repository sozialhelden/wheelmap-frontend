import { Button, Link } from "@radix-ui/themes";
import React, { useContext, useEffect, useState } from "react";
import type { YesNoUnknown } from "../../../lib/model/ac/Feature";
import { isOrHasAccessibleToilet } from "../../../lib/model/accessibility/isOrHasAccessibleToilet";
import { AccessibilityView } from "../../../pages/[placeType]/[id]/report/send-report-to-ac";
import { AppStateLink } from "../../App/AppStateLink";
import { ToiletStatusNotAccessible } from "../../icons/accessibility";
import ToiletStatusAccessibleIcon from "../../icons/accessibility/ToiletStatusAccessible";
import { FeaturePanelContext } from "../FeaturePanelContext";
import { StyledReportView } from "../ReportView";
import FeatureNameHeader from "../components/FeatureNameHeader";
import FeatureImage from "../components/image/FeatureImage";
import type { BaseEditorProps } from "./BaseEditor";

export const ToiletsWheelchairEditor: React.FC<BaseEditorProps> = ({
  feature,
  onChange,
  handleSubmitButtonClick,
}: BaseEditorProps) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);

  const current = isOrHasAccessibleToilet(feature);
  const [editedTagValue, setEditedTagValue] = useState<
    YesNoUnknown | undefined
  >(current);
  const [saveButtonDoesNothing, setSaveButtonDoesNothing] =
    useState<boolean>(true);

  useEffect(() => {
    setSaveButtonDoesNothing(current === editedTagValue);
  }, [current, editedTagValue]);

  return (
    <StyledReportView className="_view">
      <FeatureNameHeader feature={feature}>
        {feature["@type"] === "osm:Feature" && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h2 className="_title">How wheelchair accessible is the toilet?</h2>
      <form>
        <AccessibilityView
          onClick={() => {
            setEditedTagValue("yes");
            onChange?.("yes");
          }}
          className="_yes"
          inputLabel="accessibility-fully"
          selected={editedTagValue === "yes"}
          icon={<ToiletStatusAccessibleIcon />}
          valueName="Yes"
        >
          Entrance has no steps, and all rooms are accessible without steps.
        </AccessibilityView>

        <AccessibilityView
          onClick={() => {
            setEditedTagValue("no");
            onChange?.("no");
          }}
          className="_no"
          inputLabel="accessibility-not-at-all"
          selected={editedTagValue === "no"}
          icon={<ToiletStatusNotAccessible />}
          valueName="No"
        >
          Entrance has a high step or several steps, none of the rooms are
          accessible.
        </AccessibilityView>
      </form>

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
