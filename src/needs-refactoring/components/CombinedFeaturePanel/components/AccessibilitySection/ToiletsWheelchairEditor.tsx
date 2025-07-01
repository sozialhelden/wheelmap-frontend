import React, { useEffect, useState } from "react";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import useSubmit from "~/needs-refactoring/components/CombinedFeaturePanel/useSubmit";
import { Dialog, Flex, IconButton } from "@radix-ui/themes";
import { t } from "@transifex/native";
import FeatureNameHeader from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureNameHeader";
import ToiletRadioCards from "~/pages/[placeType]/[id]/_components/ToiletRadioCards";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { Pencil } from "lucide-react";

type Props = {
  tagKey: string;
  tagValue: string | undefined;
  feature: AnyFeature;
};

const ToiletsWheelchairEditor = ({ tagKey, tagValue, feature }: Props) => {
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
          <FeatureNameHeader feature={feature} />

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
