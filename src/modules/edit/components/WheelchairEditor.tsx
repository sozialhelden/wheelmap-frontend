import { Dialog, Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import type React from "react";
import { useEffect, useState } from "react";
import type { YesNoLimitedUnknown } from "~/needs-refactoring/lib/model/ac/Feature";
import { isWheelchairAccessible } from "~/needs-refactoring/lib/model/accessibility/isWheelchairAccessible";
import { AccessibilityView } from "~/needs-refactoring/pages/[placeType]/[id]/report/send-report-to-ac";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import { useFeatureLabel } from "~/needs-refactoring/components/CombinedFeaturePanel/utils/useFeatureLabel";
import type { BaseEditorProps } from "./BaseEditor";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import { StyledReportView } from "~/needs-refactoring/components/CombinedFeaturePanel/ReportView";
import AccessibleIconMarker from "~/modules/map/components/AccessibleIconMarker";

export const WheelchairEditor: React.FC<BaseEditorProps> = ({
  feature,
  onChange,
  onSubmit,
  onClose,
}: BaseEditorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [saveButtonDoesNothing, setSaveButtonDoesNothing] =
    useState<boolean>(true);

  const { category } = useFeatureLabel({ feature });

  const current = isWheelchairAccessible(feature);

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
        data-testid="dialog"
      >
        <Flex direction="column" gap="4" style={{ padding: "10px" }}>
          <StyledReportView className="_view">
            <FeatureNameHeader feature={feature} />

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
                icon={
                  <AccessibleIconMarker
                    accessibilityGrade="good"
                    category={category.id}
                    width="30"
                    height="30"
                  />
                }
                valueName="Fully"
              >
                {t(
                  "Entrance has no steps, and all rooms are accessible without steps.",
                )}
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
                  <AccessibleIconMarker
                    accessibilityGrade="mediocre"
                    category={category.id}
                    width="30"
                    height="30"
                  />
                }
                valueName="Partially"
              >
                {t(
                  "Entrance has one step with max. 3 inches height, most rooms are without steps",
                )}
              </AccessibilityView>

              <AccessibilityView
                onClick={() => {
                  setEditedTagValue("no");
                  onChange?.("no");
                }}
                className="_no"
                inputLabel="accessibility-not-at-all"
                selected={editedTagValue === "no"}
                icon={
                  <AccessibleIconMarker
                    accessibilityGrade="bad"
                    category={category.id}
                    width="30"
                    height="30"
                  />
                }
                valueName="Not at all"
              >
                {t(
                  "Entrance has a high step or several steps, none of the rooms are accessible.",
                )}
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
