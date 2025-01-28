import { Button, Flex, Theme } from "@radix-ui/themes";
import { type RefObject, forwardRef } from "react";
import { t } from "ttag";

export const NeedsButtonSection = forwardRef(function NeedsButtonSection(
  {
    onSaveButtonClick,
    onResetButtonClick,
    ...props
  }: { onSaveButtonClick: () => void; onResetButtonClick: () => void },
  ref,
) {
  return (
    <Theme
      {...props}
      asChild
      radius="medium"
      ref={ref as RefObject<HTMLDivElement>}
    >
      <Flex
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
    </Theme>
  );
});
