import { Dialog, Flex } from "@radix-ui/themes";
import type React from "react";
import { useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton } from "~/components/shared/Buttons";
import { unknownCategory } from "~/domains/categories/functions/cache";
import { useCurrentLanguageTagStrings } from "~/lib/context/LanguageTagContext";
import type { YesNoLimitedUnknown } from "~/lib/model/ac/Feature";
import { isWheelchairAccessible } from "~/lib/model/accessibility/isWheelchairAccessible";
import { AccessibilityView } from "~/pages/[placeType]/[id]/report/send-report-to-ac";
import Icon from "../../shared/Icon";
import { StyledReportView } from "../ReportView";
import FeatureNameHeader from "../components/FeatureNameHeader";
import FeatureImage from "../components/image/FeatureImage";
import { useFeatureLabel } from "../utils/useFeatureLabel";
import type { BaseEditorProps } from "./BaseEditor";
import {t} from "@transifex/native";

export const WheelchairEditor: React.FC<BaseEditorProps> = ({
  feature,
  onChange,
  onSubmit,
  onClose,
}: BaseEditorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [saveButtonDoesNothing, setSaveButtonDoesNothing] =
    useState<boolean>(true);

  const languageTags = useCurrentLanguageTagStrings();

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

  useEffect(() => {
    setSaveButtonDoesNothing(current === editedTagValue);
  }, [current, editedTagValue]);

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Content
        aria-label={t("Toilet Accessibility Editor")}
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
              {t("How wheelchair accessible is this place?")}
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
                {t("Entrance has no steps, and all rooms are accessible without steps.")}
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
                {t("Entrance has one step with max. 3 inches height, most rooms are without steps")}
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
                {t("Entrance has a high step or several steps, none of the rooms are accessible.")}
              </AccessibilityView>
            </form>

            <Flex gap="3" mt="4" justify="end">
              <SecondaryButton onClick={onClose}>{t("Cancel")}</SecondaryButton>
              <PrimaryButton
                onClick={saveButtonDoesNothing ? onClose : onSubmit}
              >
                {saveButtonDoesNothing ? t("Confirm") : t("Send")}
              </PrimaryButton>
            </Flex>
          </StyledReportView>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
