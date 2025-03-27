import { forwardRef } from "react";
import { Button, IconButton } from "@radix-ui/themes";
import type { ButtonProps } from "~/components/button/types";

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function PrimaryButton(
    { children, size = "3", iconOnly = false, ...props },
    ref,
  ) {
    const Component = iconOnly ? IconButton : Button;
    return (
      <Component ref={ref} variant="solid" size={size} {...props}>
        {children}
      </Component>
    );
  },
);
