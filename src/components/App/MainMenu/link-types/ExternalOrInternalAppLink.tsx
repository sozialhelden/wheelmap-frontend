import { Badge, type ButtonProps, Tooltip } from "@radix-ui/themes";
import Link from "next/link";
import { AppStateLink } from "../../AppStateLink";
import type { IAutoLinkProps } from "./AutoLink";
import ErroneousLink from "./ErroneousLink";
import MenuItemOrButton from "./MenuItemOrButton";

export default function ExternalOrInternalAppLink(props: IAutoLinkProps) {
  const { label, badgeLabel, url } = props;
  let children: React.ReactNode;
  if (!url) {
    children = <ErroneousLink {...props} />;
  } else {
    const isExternal = url.startsWith("http");
    const LinkElement = isExternal ? Link : AppStateLink;
    children = (
      <LinkElement
        href={url}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noreferrer noopener" : undefined}
      >
        {label}
        {badgeLabel && <Badge>{badgeLabel}</Badge>}
      </LinkElement>
    );
  }

  return <MenuItemOrButton {...props}>{children}</MenuItemOrButton>;
}
