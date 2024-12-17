import { Badge, Tooltip } from "@radix-ui/themes";
import { t } from "ttag";
import MenuItemOrButton from "./MenuItemOrButton";
import type { IAutoLinkProps } from "./AutoLink";

export default function ErroneousLink(props: IAutoLinkProps) {
  return (
    <MenuItemOrButton {...props}>
      <Tooltip content={t`This link needs to be configured correctly.`}>
        <Badge variant="soft" color="orange">
          {props.label || t`Link`}
        </Badge>
      </Tooltip>
    </MenuItemOrButton>
  );
}
