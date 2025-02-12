import { Button, Dialog, Flex } from "@radix-ui/themes";
import type React from "react";
import { useContext, useEffect, useState } from "react";
import { t } from "ttag";
import { useCurrentLanguageTagStrings } from "~/lib/context/LanguageTagContext";
import type { YesNoLimitedUnknown } from "~/lib/model/ac/Feature";
import { unknownCategory } from "~/lib/model/ac/categories/Categories";
import { isWheelchairAccessible } from "~/lib/model/accessibility/isWheelchairAccessible";
import { AccessibilityView } from "~/pages/[placeType]/[id]/report/send-report-to-ac";
import { AppStateLink } from "../../App/AppStateLink";
import Icon from "../../shared/Icon";
import { FeaturePanelContext } from "../FeaturePanelContext";
import { StyledReportView } from "../ReportView";
import FeatureNameHeader from "../components/FeatureNameHeader";
import FeatureImage from "../components/image/FeatureImage";
import { useFeatureLabel } from "../utils/useFeatureLabel";
import type { BaseEditorProps } from "./BaseEditor";

export const WheelchairEditor: React.FC<BaseEditorProps> = ({
  feature,
  onChange,
  onSubmit,
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
  const [saveButtonDoesNothing, setSaveButtonDoesNothing] =
    useState<boolean>(true);

  useEffect(() => {
    setSaveButtonDoesNothing(current === editedTagValue);
  }, [current, editedTagValue]);

  return (
    <Dialog.Root open>
      <Dialog.Content
        aria-label={t`Toilet Accessibility Editor`}
        aria-describedby="dialog-description"
      >
        <Flex direction="column" gap="4" style={{ padding: "10px" }}>
          <StyledReportView className="_view">
            <FeatureNameHeader feature={feature}>
              {feature["@type"] === "osm:Feature" && (
                <FeatureImage feature={feature} />
              )}
            </FeatureNameHeader>

            <Dialog.Description id="dialog-description" size="3">
              {t`How wheelchair accessible is this place?`}
            </Dialog.Description>

            <form>
              <AccessibilityView
                onClick={() => {
                  setEditedTagValue("yes");
                  onChange?.("yes");
                }}
                className="_yes"
                inputLabel="accessibility-fully"
                selected={editedTagValue === "yes"}
                icon={<Icon size="medium" accessibility="yes" category={cat} />}
                valueName="Fully"
              >
                {t`Entrance has no steps, and all rooms are accessible without steps.`}
              </AccessibilityView>
              <AccessibilityView
                onClick={() => {
                  setEditedTagValue("limited");
                  onChange?.("limited");
                }}
                className="_okay"
                inputLabel="accessibility-partially"
                selected={editedTagValue === "limited"}
                icon={
                  <Icon size="medium" accessibility="limited" category={cat} />
                }
                valueName="Partially"
              >
                {t`Entrance has one step with max. 3 inches height, most rooms are
                without steps`}
              </AccessibilityView>

              <AccessibilityView
                onClick={() => {
                  setEditedTagValue("no");
                  onChange?.("no");
                }}
                className="_no"
                inputLabel="accessibility-not-at-all"
                selected={editedTagValue === "no"}
                icon={<Icon size="medium" accessibility="no" category={cat} />}
                valueName="Not at all"
              >
                {t`Entrance has a high step or several steps, none of the rooms are
                accessible.`}
              </AccessibilityView>
            </form>

            <Flex gap="3" mt="3" justify="end">
              <AppStateLink href={baseFeatureUrl} tabIndex={-1}>
                <Button variant="soft" size="2" aria-label={t`Cancel`}>
                  {t`Cancel`}
                </Button>
              </AppStateLink>

              <AppStateLink href={baseFeatureUrl} tabIndex={-1}>
                <Button
                  variant="solid"
                  size="2"
                  aria-label={saveButtonDoesNothing ? t`Confirm` : t`Send`}
                  onClick={saveButtonDoesNothing ? undefined : onSubmit}
                >
                  {saveButtonDoesNothing ? t`Confirm` : t`Send`}
                </Button>
              </AppStateLink>
            </Flex>
          </StyledReportView>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
