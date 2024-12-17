import React, { useCallback } from "react";
import styled from "styled-components";
import { useCurrentMappingEvent } from "../../../lib/context/useCurrentMappingEvent";
import Spinner from "../../ActivityIndicator/Spinner";
import SessionMenuItem from "./SessionMenuItem";
import { Button, DropdownMenu, type ButtonProps } from "@radix-ui/themes";
import { useExpertMode } from "./useExpertMode";
import type { expandLinkMetadata } from "./useAppLinks";
import { AppStateLink } from "../AppStateLink";
import Link from "next/link";
import { Ref } from "colorjs.io/fn";
import { useAppStateAwareHref } from "../useAppStateAwareHref";
import { useRouter } from "next/router";

const Badge = styled.span`
  border-radius: 0.5rlh;
  padding: 0.2rem 0.3rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin: 0.1rem;
`;

function JoinedEventLink(props: { label?: string; url?: string; asMenuItem?: boolean; buttonProps?: ButtonProps }) {
  const { data: joinedMappingEvent, isValidating } = useCurrentMappingEvent();

  const href = joinedMappingEvent
    ? `/events/${joinedMappingEvent._id}`
    : "/events";

  const label = joinedMappingEvent ? joinedMappingEvent.name : props.label;
  const content = isValidating ? <Spinner /> : label;
  const router = useRouter();
  // XXX: This should be an <AppStateAwareLink>, but using it would keyboard navigation, as there
  // is a bug in Radix UI that appears to not update the ref correctly.
  const hrefWithParams = useAppStateAwareHref(href);
  const openHref = useCallback(() => {
    router.push(hrefWithParams);
  }, [router, hrefWithParams]);

  return props.asMenuItem
      ? <DropdownMenu.Item onClick={openHref}>
          {content}
        </DropdownMenu.Item>
    : <Button {...props.buttonProps} onClick={openHref}>{content}</Button>;
}

const ButtonOrMenuItem = React.forwardRef(
    ({ asMenuItem, buttonProps, children }: { asMenuItem?: boolean, buttonProps?: ButtonProps, children?: React.ReactNode },
      forwardedRef: React.Ref<HTMLDivElement>
    ) => {
  return asMenuItem
    ? <DropdownMenu.Item asChild ref={forwardedRef}>
      {children}
    </DropdownMenu.Item>
    : <Button {...buttonProps} asChild ref={forwardedRef}>{children}</Button>;
});

export function AutoLink({
  tags,
  label,
  badgeLabel,
  url,
  asMenuItem,
}: ReturnType<typeof expandLinkMetadata> & { asMenuItem?: boolean }) {
  const buttonProps: ButtonProps = {
    variant: tags?.includes("primary") ? "solid" : "ghost",
    highContrast: !tags?.includes("primary"),
  };
  const { isExpertMode } = useExpertMode();
  const isEventsLink = tags?.includes("events");
  if (isEventsLink) {
    return <JoinedEventLink {...{ asMenuItem, label, url, buttonProps }} key="joined-event" />;
  }

  const isSessionLink = tags?.includes("session");
  if (isSessionLink) {
    return isExpertMode ? <SessionMenuItem {...{ asMenuItem, label, buttonProps }} key="session" /> : null;
  }

  if (typeof url === "string") {
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
