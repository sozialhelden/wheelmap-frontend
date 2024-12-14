import { Button, Link } from "@radix-ui/themes";
import React, { useContext, useEffect, useState } from "react";
import { useCurrentLanguageTagStrings } from "../../../lib/context/LanguageTagContext";
import type { YesNoLimitedUnknown } from "../../../lib/model/ac/Feature";
import { unknownCategory } from "../../../lib/model/ac/categories/Categories";
import { isWheelchairAccessible } from "../../../lib/model/accessibility/isWheelchairAccessible";
import { AccessibilityView } from "../../../pages/[placeType]/[id]/report/send-report-to-ac";
import { AppStateLink } from "../../App/AppStateLink";
import Icon from "../../shared/Icon";
import { FeaturePanelContext } from "../FeaturePanelContext";
import { StyledReportView } from "../ReportView";
import FeatureNameHeader from "../components/FeatureNameHeader";
import FeatureImage from "../components/image/FeatureImage";
import { useFeatureLabel } from "../utils/useFeatureLabel";
import type { BaseEditorProps } from "./BaseEditor";

export const WheelchairEditor = ({
  feature,
  onChange,
  handleSubmitButtonClick,
}: BaseEditorProps) => {
  const languageTags = useCurrentLanguageTagStrings();
  const { baseFeatureUrl } = useContext(FeaturePanelContext);

  const { category, categoryTagKeys } = useFeatureLabel({
    feature,
    languageTags,
  });

  const current = isWheelchairAccessible(feature);

  const cat =
    (category && category !== unknownCategory
      ? category._id
      : categoryTagKeys[0]) || "undefined";
  const [editedTagValue, setEditedTagValue] = useState<
    YesNoLimitedUnknown | undefined
  >(current);
  const [isNoOpButton, setIsNoOpButton] = useState<boolean>(true);

  useEffect(() => {
    setIsNoOpButton(current === editedTagValue);
  }, [current, editedTagValue]);

  return (
    <StyledReportView className="_view">
      <FeatureNameHeader feature={feature}>
        {feature["@type"] === "osm:Feature" && (
          <FeatureImage feature={feature} />
        )}
      </FeatureNameHeader>
      <h2 className="_title">How wheelchair accessible is this place?</h2>
      <form>
        <AccessibilityView
          onClick={() => {
            setEditedTagValue("yes");
            onChange("yes");
          }}
          className="_yes"
          inputLabel="accessibility-fully"
          selected={editedTagValue === "yes"}
          icon={<Icon size="medium" accessibility="yes" category={cat} />}
          valueName="Fully"
        >
          Entrance has no steps, and all rooms are accessible without steps.
        </AccessibilityView>
        <AccessibilityView
          onClick={() => {
            setEditedTagValue("limited");
            onChange("limited");
          }}
          className="_okay"
          inputLabel="accessibility-partially"
          selected={editedTagValue === "limited"}
          icon={<Icon size="medium" accessibility="limited" category={cat} />}
          valueName="Partially"
        >
          Entrance has one step with max. 3 inches height, most rooms are
          without steps
        </AccessibilityView>

        <AccessibilityView
          onClick={() => {
            setEditedTagValue("no");
            onChange("no");
          }}
          className="_no"
          inputLabel="accessibility-not-at-all"
          selected={editedTagValue === "no"}
          icon={<Icon size="medium" accessibility="no" category={cat} />}
          valueName="Not at all"
        >
          Entrance has a high step or several steps, none of the rooms are
          accessible.
        </AccessibilityView>
      </form>

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
