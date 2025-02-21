import { Flex } from "@radix-ui/themes";
import { type Ref, forwardRef } from "react";
import { t } from "ttag";
import { PrimaryButton, SecondaryButton } from "~/components/shared/Buttons";

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
        <PrimaryButton text={t`Save`} onClick={onSaveButtonClick} />
        <SecondaryButton
          text={t`Cancel`}
          size="2"
          onClick={onResetButtonClick}
        />
      </Flex>
    );
  },
);
