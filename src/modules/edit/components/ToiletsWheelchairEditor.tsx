import { Dialog, Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import type React from "react";
import { useEffect, useState } from "react";
import type { YesNoUnknown } from "~/needs-refactoring/lib/model/ac/Feature";
import { isOrHasAccessibleToilet } from "~/needs-refactoring/lib/model/accessibility/isOrHasAccessibleToilet";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import type { BaseEditorProps } from "./BaseEditor";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import { StyledReportView } from "~/needs-refactoring/components/CombinedFeaturePanel/ReportView";
import ToiletRadioCards from "~/modules/edit/components/ToiletRadioCards";

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

          <Dialog.Description id="dialog-description" size="3" mb="1">
            {t("Is this toilet wheelchair accessible?")}
          </Dialog.Description>

          <ToiletRadioCards
            onSelect={(value) => {
              setEditedTagValue(value);
              onChange?.(value);
            }}
            defaultValue={current}
          />

          <StyledReportView className="_view">
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
