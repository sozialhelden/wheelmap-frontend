import { Dialog, Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import type React from "react";
import { useEffect, useState } from "react";
import type { YesNoUnknown } from "~/needs-refactoring/lib/model/ac/Feature";
import { isOrHasAccessibleToilet } from "~/needs-refactoring/lib/model/accessibility/isOrHasAccessibleToilet";
import { AccessibilityView } from "~/needs-refactoring/pages/[placeType]/[id]/report/send-report-to-ac";
import { ToiletStatusNotAccessible } from "~/components/icons/accessibility";
import ToiletStatusAccessibleIcon from "~/components/icons/accessibility/ToiletStatusAccessible";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import type { BaseEditorProps } from "./BaseEditor";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import { StyledReportView } from "~/needs-refactoring/components/CombinedFeaturePanel/ReportView";

export const ToiletsWheelchairEditor: React.FC<BaseEditorProps> = ({
  feature,
  onChange,
  onSubmit,
  onClose,
}: BaseEditorProps) => {
  const current = isOrHasAccessibleToilet(feature);
  const [editedTagValue, setEditedTagValue] = useState<
    YesNoUnknown | undefined
  >(current);

  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [saveButtonDoesNothing, setSaveButtonDoesNothing] =
    useState<boolean>(true);

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
          <FeatureNameHeader feature={feature} />

          <Dialog.Description id="dialog-description" size="3">
            {t("Is this toilet wheelchair accessible?")}
          </Dialog.Description>

          <StyledReportView className="_view">
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
                {t`Entrance has no steps, and all rooms are accessible without
                  steps.`}
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
                {t`Entrance has a high step or several steps, none of the rooms are
                  accessible.`}
              </AccessibilityView>
            </form>

            <Flex gap="3" mt="3" justify="end">
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
