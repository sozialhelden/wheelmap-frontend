import { Button, DropdownMenu } from "@radix-ui/themes";
import type { IAutoLinkProps } from "./AutoLink";

/**
 * Use this to render a menu item or a button, depending on the `asMenuItem` prop.
 */
export default function MenuItemOrButton({
  asMenuItem,
  buttonProps,
  children,
  onClick,
}: IAutoLinkProps & { children: React.ReactElement; onClick?: () => void }) {
  return asMenuItem ? (
    <DropdownMenu.Item asChild onClick={onClick}>
      {children}
    </DropdownMenu.Item>
  ) : (
    <Button {...buttonProps} asChild onClick={onClick}>
      {children}
    </Button>
  );
}
