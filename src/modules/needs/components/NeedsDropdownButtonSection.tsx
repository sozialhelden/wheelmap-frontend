import { Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { type Ref, forwardRef } from "react";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SecondaryButton } from "~/components/button/SecondaryButton";

export const NeedsDropdownButtonSection = forwardRef(
  function NeedsDropdownButtonSection(
    {
      onSaveButtonClick,
      onResetButtonClick,
      ...props
    }: { onSaveButtonClick: () => void; onResetButtonClick: () => void },
    ref: Ref<HTMLDivElement>,
  ) {
    return (
      <Flex
        {...props}
        ref={ref}
        p="6"
        gap="4"
        align="center"
        justify={{ initial: "between", sm: "center" }}
        direction={{ initial: "row-reverse", sm: "column" }}
      >
        <PrimaryButton onClick={onSaveButtonClick}>{t("Save")}</PrimaryButton>
        <SecondaryButton size="2" onClick={onResetButtonClick}>
          {t("Cancel")}
        </SecondaryButton>
      </Flex>
    );
  },
);
