import type { ButtonProps } from "@radix-ui/themes";
import { useMemo } from "react";
import ErroneousLink from "./ErroneousLink";
import ExternalOrInternalAppLink from "./ExternalOrInternalAppLink";
import JoinedEventLink from "./JoinedEventLink";
import SessionElement from "./SessionElement";
import type { translateAndInterpolateAppLink } from "../translateAndInterpolateAppLink";
import { useExpertMode } from "../useExpertMode";

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
export default function AutoLink({
  tags,
  label,
  badgeLabel,
  url,
  asMenuItem,
}: ReturnType<typeof translateAndInterpolateAppLink> & {
  asMenuItem: boolean;
}) {
  const buttonProps: ButtonProps = useAppLinkButtonProps(tags);

  let Element: React.ComponentType<IAutoLinkProps> | null;
  if (tags?.includes("events")) {
    Element = JoinedEventLink;
  } else if (tags?.includes("session")) {
    Element = SessionElement;
  } else if (typeof url === "string") {
    Element = ExternalOrInternalAppLink;
  } else {
    Element = ErroneousLink;
  }

  return (
    Element && (
      <Element {...{ label, badgeLabel, url, asMenuItem, buttonProps }} />
    )
  );
}
