import { Button, Flex, Theme } from "@radix-ui/themes";
import { type Ref, forwardRef } from "react";
import { t } from "ttag";

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
        <Button size="3" onClick={onSaveButtonClick}>
          {t`Save`}
        </Button>
        <Button
          size="2"
          variant="soft"
          color="gray"
          onClick={onResetButtonClick}
        >
          {t`Cancel`}
        </Button>
      </Flex>
    );
  },
);
