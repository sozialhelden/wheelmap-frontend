import { forwardRef } from "react";
import { Button, IconButton } from "@radix-ui/themes";
import type { ButtonProps } from "~/components/button/types";

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function SecondaryButton(
    { children, size = "3", iconOnly = false, ...props },
    ref,
  ) {
    const Component = iconOnly ? IconButton : Button;
    return (
      <Component ref={ref} variant="soft" size={size} highContrast {...props}>
        {children}
      </Component>
    );
  },
);
