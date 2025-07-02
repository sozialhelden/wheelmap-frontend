import { Dialog, Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import type React from "react";
import { useEffect, useState } from "react";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import WheelchairRadioCards from "~/modules/edit/components/WheelchairRadioCards";
import { StyledReportView } from "~/needs-refactoring/components/CombinedFeaturePanel/ReportView";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import { useFeatureLabel } from "~/needs-refactoring/components/CombinedFeaturePanel/utils/useFeatureLabel";
import type { YesNoLimitedUnknown } from "~/needs-refactoring/lib/model/ac/Feature";
import { isWheelchairAccessible } from "~/needs-refactoring/lib/model/accessibility/isWheelchairAccessible";
import type { BaseEditorProps } from "./BaseEditor";

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

            <Dialog.Description id="dialog-description" size="3" mb="1">
              {t("How wheelchair accessible is this place?")}
            </Dialog.Description>

            <WheelchairRadioCards
              category={category}
              onSelect={(value) => {
                setEditedTagValue(value);
                onChange?.(value);
              }}
              defaultValue={current}
            />

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
