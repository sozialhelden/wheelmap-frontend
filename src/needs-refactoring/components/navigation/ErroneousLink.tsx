import { Badge, Tooltip } from "@radix-ui/themes";
import { t } from "@transifex/native";
import type { IAutoLinkProps } from "./AppLink";
import MenuItemOrButton from "./MenuItemOrButton";

export default function ErroneousLink(props: IAutoLinkProps) {
  return (
    <MenuItemOrButton {...props}>
      <Tooltip content={t("This link needs to be configured correctly.")}>
        <Badge variant="soft" color="orange">
          {props.label || t("Link")}
        </Badge>
      </Tooltip>
    </MenuItemOrButton>
  );
}
