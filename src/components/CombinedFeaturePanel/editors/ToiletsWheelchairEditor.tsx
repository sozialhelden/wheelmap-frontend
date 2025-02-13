import { Button, Dialog, Flex } from "@radix-ui/themes";
import type React from "react";
import { useEffect, useState } from "react";
import { t } from "ttag";
import type { YesNoUnknown } from "~/lib/model/ac/Feature";
import { isOrHasAccessibleToilet } from "~/lib/model/accessibility/isOrHasAccessibleToilet";
import { AccessibilityView } from "~/pages/[placeType]/[id]/report/send-report-to-ac";
import { ToiletStatusNotAccessible } from "../../icons/accessibility";
import ToiletStatusAccessibleIcon from "../../icons/accessibility/ToiletStatusAccessible";
import { StyledReportView } from "../ReportView";
import FeatureNameHeader from "../components/FeatureNameHeader";
import FeatureImage from "../components/image/FeatureImage";
import type { BaseEditorProps } from "./BaseEditor";

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
        aria-label={t`Toilet Accessibility Editor`}
        aria-describedby="dialog-description"
      >
        <Flex direction="column" gap="4" style={{ padding: "10px" }}>
          <FeatureNameHeader feature={feature}>
            {feature["@type"] === "osm:Feature" && (
              <FeatureImage feature={feature} />
            )}
          </FeatureNameHeader>

          <Dialog.Description id="dialog-description" size="3">
            {t`Is this toilet wheelchair accessible?`}
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
              <Button
                variant="soft"
                size="2"
                aria-label={t`Cancel`}
                onClick={onClose}
              >
                {t`Cancel`}
              </Button>

              <Button
                variant="solid"
                size="2"
                aria-label={saveButtonDoesNothing ? t`Confirm` : t`Send`}
                onClick={saveButtonDoesNothing ? onClose : onSubmit}
              >
                {saveButtonDoesNothing ? t`Confirm` : t`Send`}
              </Button>
            </Flex>
          </StyledReportView>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
