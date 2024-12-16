import type React from "react";
import styled from "styled-components";
import { useCurrentMappingEvent } from "../../../lib/context/useCurrentMappingEvent";
import Spinner from "../../ActivityIndicator/Spinner";
import SessionMenuItem from "./SessionMenuItem";
import { Button, DropdownMenu, type ButtonProps } from "@radix-ui/themes";
import { useExpertMode } from "./useExpertMode";
import type { expandLinkMetadata } from "./useAppLinks";
import { AppStateLink } from "../AppStateLink";
import Link from "next/link";

const Badge = styled.span`
  border-radius: 0.5rlh;
  padding: 0.2rem 0.3rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin: 0.1rem;
`;

function JoinedEventLink(props: { label?: string; url?: string, asMenuItem?: boolean }) {
  const { data: joinedMappingEvent, isValidating } = useCurrentMappingEvent();

  if (isValidating) {
    return <Spinner />;
  }

  const href = joinedMappingEvent
    ? `/events/${joinedMappingEvent._id}`
    : "/events";

  const label = joinedMappingEvent ? joinedMappingEvent.name : props.label;

  return (
    <ButtonOrMenuItem asMenuItem={props.asMenuItem}><AppStateLink href={href}>
      {label}
    </AppStateLink>
  </ButtonOrMenuItem>
  );
}

function ButtonOrMenuItem({ asMenuItem, buttonProps, children }: { asMenuItem?: boolean, buttonProps?: ButtonProps, children?: React.ReactNode }) {
  return asMenuItem
    ? <DropdownMenu.Item asChild>
      {children}
    </DropdownMenu.Item>
    : <Button {...buttonProps} asChild>{children}</Button>;

}

export function AutoLink({
  tags,
  label,
  badgeLabel,
  url,
  asMenuItem,
}: ReturnType<typeof expandLinkMetadata> & { asMenuItem?: boolean }) {
  const { isExpertMode } = useExpertMode();
  const isEventsLink = tags?.includes("events");
  if (isEventsLink) {
    return <JoinedEventLink {...{ asMenuItem, label, url }} key="joined-event" />;
  }

  const isSessionLink = tags?.includes("session");
  if (isSessionLink) {
    return isExpertMode ? <SessionMenuItem {...{ asMenuItem, label }} key="session" /> : null;
  }

  if (typeof url === "string") {
    const buttonProps: ButtonProps = {
      variant: tags?.includes("primary") ? "solid" : "ghost",
    };

    const isExternal = url.startsWith("http");
    const LinkElement = isExternal ? Link : AppStateLink
    const link = <LinkElement href={url} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer noopener' : undefined}>
      {label}
      {badgeLabel && <Badge>{badgeLabel}</Badge>}
    </LinkElement>;

    return <ButtonOrMenuItem asMenuItem={asMenuItem} buttonProps={buttonProps}>{link}</ButtonOrMenuItem>;
  }

  return null;
}
