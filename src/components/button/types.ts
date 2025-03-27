import type { ReactNode } from "react";
import type { ButtonProps as RadixButtonProps } from "@radix-ui/themes";

export type ButtonProps = {
  children: ReactNode;
  iconOnly?: boolean;
} & RadixButtonProps;
