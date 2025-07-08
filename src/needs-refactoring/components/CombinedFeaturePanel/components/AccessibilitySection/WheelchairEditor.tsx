import { Dialog, Flex, IconButton } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import WheelchairRadioCards from "~/modules/edit/components/WheelchairRadioCards";
import { StyledReportView } from "~/needs-refactoring/components/CombinedFeaturePanel/ReportView";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import useSubmit from "~/needs-refactoring/components/CombinedFeaturePanel/useSubmit";
import { useFeatureLabel } from "~/needs-refactoring/components/CombinedFeaturePanel/utils/useFeatureLabel";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

type Props = {
  tagKey: string;
  tagValue: string | undefined;
  feature: AnyFeature;
};

const WheelchairEditor = ({ tagKey, tagValue, feature }: Props) => {
  const [editedTagValue, setEditedTagValue] = useState<
    string | number | undefined
  >(tagValue);
  const [hasDataToSubmit, setHasDataToSubmit] = useState<boolean>(true);
  useEffect(() => {
    setHasDataToSubmit(tagValue !== editedTagValue);
  }, [tagValue, editedTagValue]);

  const onSubmit = useSubmit(tagKey, editedTagValue);

  const { category } = useFeatureLabel({ feature });

  useEffect(() => {}, [hasDataToSubmit]);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton aria-label={t("Edit")} variant="soft" data-testid={tagKey}>
          <Pencil size={18} aria-hidden />
        </IconButton>
      </Dialog.Trigger>
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
              }}
              defaultValue={tagValue}
            />

            <Dialog.Close>
              <Flex gap="3" mt="4" justify="end">
                <SecondaryButton>{t("Cancel")}</SecondaryButton>
                <PrimaryButton
                  onClick={() => {
                    if (hasDataToSubmit) {
                      onSubmit();
                    }
                  }}
                >
                  {hasDataToSubmit ? t("Send") : t("Confirm")}
                </PrimaryButton>
              </Flex>
            </Dialog.Close>
          </StyledReportView>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
export default WheelchairEditor;
