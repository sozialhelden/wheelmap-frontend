import { forwardRef } from "react";
import { Button, IconButton } from "@radix-ui/themes";
import type { ButtonProps } from "~/components/button/types";

export const TertiaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function TertiaryButton(
    { children, size = "3", iconOnly = false, ...props },
    ref,
  ) {
    const Component = iconOnly ? IconButton : Button;
    return (
      <Component
        ref={ref}
        variant="outline"
        size={size}
        highContrast
        {...props}
      >
        {children}
      </Component>
    );
  },
);
