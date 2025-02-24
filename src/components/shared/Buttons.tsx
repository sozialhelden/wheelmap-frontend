import { Button, type ButtonProps, IconButton } from "@radix-ui/themes";
import type { ReactNode } from "react";
import { forwardRef } from "react";

type Props = { children: ReactNode; iconOnly?: boolean } & ButtonProps;

export const PrimaryButton = forwardRef<HTMLButtonElement, Props>(
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

export const SecondaryButton = forwardRef<HTMLButtonElement, Props>(
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

export const TertiaryButton = forwardRef<HTMLButtonElement, Props>(
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
