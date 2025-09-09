import { Dialog, Flex, IconButton } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import { StyledReportView } from "~/needs-refactoring/components/CombinedFeaturePanel/ReportView";
import FeatureHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureHeader";
import useSubmit from "~/needs-refactoring/components/CombinedFeaturePanel/useSubmit";
import { useFeatureLabel } from "~/needs-refactoring/components/CombinedFeaturePanel/utils/useFeatureLabel";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import WheelchairRadioCards from "~/needs-refactoring/modules/edit/components/WheelchairRadioCards";

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
        <IconButton
          aria-label={t("Edit wheelchair accessibility")}
          variant="soft"
          data-testid={tagKey}
        >
          <Pencil size={18} aria-hidden />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content
        aria-label={t("Wheelchair Accessibility Editor")}
        data-testid="dialog"
      >
        <Flex direction="column" gap="4" style={{ padding: "10px" }}>
          <FeatureHeader feature={feature} level="h2" />
          <StyledReportView className="_view">
            <Dialog.Description size="3" mb="1">
              {t(
                "How wheelchair accessible is this place? Select one of the following options:",
              )}
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
