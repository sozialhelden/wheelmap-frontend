import type { ButtonProps } from "@radix-ui/themes";
import { useMemo } from "react";
import type { useAppLink } from "~/lib/useAppLink";
import ErroneousLink from "./ErroneousLink";
import ExternalOrInternalLink from "./ExternalOrInternalLink";
import JoinedEventLink from "./JoinedEventLink";
import SessionElement from "./SessionElement";

export type IAutoLinkProps = {
  asMenuItem: boolean;
  buttonProps?: ButtonProps;
  label?: string;
  badgeLabel?: string;
  url?: string;
};

function useAppLinkButtonProps(tags: string[] | undefined): ButtonProps {
  return useMemo(
    () => ({
      variant: tags?.includes("primary") ? "solid" : "ghost",
      highContrast: !tags?.includes("primary"),
    }),
    [tags],
  );
}

/**
 * A link that can be used in the main menu, which can be either a button (if rendered in the
 * toolbar) or a menu item (if rendered inside the dropdown menu).
 */
export default function AppLink({
  tags,
  label,
  badgeLabel,
  url,
  asMenuItem,
}: ReturnType<typeof useAppLink> & {
  asMenuItem: boolean;
}) {
  const buttonProps: ButtonProps = useAppLinkButtonProps(tags);

  let Element: React.ComponentType<IAutoLinkProps> | null;
  if (tags?.includes("events")) {
    Element = JoinedEventLink;
  } else if (tags?.includes("session")) {
    Element = SessionElement;
  } else if (typeof url === "string") {
    Element = ExternalOrInternalLink;
  } else {
    Element = ErroneousLink;
  }

  console.log("Element", label);

  return (
    Element && (
      <Element {...{ label, badgeLabel, url, asMenuItem, buttonProps }} />
    )
  );
}
