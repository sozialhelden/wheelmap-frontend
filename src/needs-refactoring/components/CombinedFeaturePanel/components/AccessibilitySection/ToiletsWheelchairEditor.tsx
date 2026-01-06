import { Dialog, Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { Pencil } from "lucide-react";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import FeatureHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureHeader";
import useSubmit from "~/needs-refactoring/components/CombinedFeaturePanel/useSubmit";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import ToiletRadioCards from "~/needs-refactoring/modules/edit/components/ToiletRadioCards";

type Props = {
  tagKey: string;
  tagValue?: string | undefined;
  feature: AnyFeature;
  isNewlyTagged?: boolean;
};

const ToiletsWheelchairEditor = ({
  tagKey,
  tagValue,
  feature,
  isNewlyTagged,
}: Props) => {
  const [editedTagValue, setEditedTagValue] = useState<
    string | number | undefined
  >(tagValue);
  const [hasDataToSubmit, setHasDataToSubmit] = useState<boolean>(true);
  useEffect(() => {
    setHasDataToSubmit(tagValue !== editedTagValue);
  }, [tagValue, editedTagValue]);
  const onSubmit = useSubmit(tagKey, editedTagValue);

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <SecondaryButton
          aria-label={t("Edit toilet accessibility")}
          data-testid="toilets-wheelchair-editor__button"
          size="2"
        >
          {isNewlyTagged ? t("Add toilet information") : ""}
          <Pencil size={18} aria-hidden />
        </SecondaryButton>
      </Dialog.Trigger>
      <Dialog.Content
        aria-label={t("Toilet Accessibility Editor")}
        aria-describedby="dialog-description"
        data-testid="toilets-wheelchair-editor__dialog"
      >
        <Flex direction="column" gap="4" style={{ padding: "10px" }}>
          <FeatureHeader feature={feature} level="h2" />

          <Dialog.Description id="dialog-description" size="3" mb="1">
            {t("Is this toilet wheelchair accessible?")}
          </Dialog.Description>

          <ToiletRadioCards
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
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
export default ToiletsWheelchairEditor;
