import { useRouter } from "next/router";
import { useCallback } from "react";
import { useCurrentMappingEvent } from "../../../../lib/context/useCurrentMappingEvent";
import Spinner from "../../../ActivityIndicator/Spinner";
import { useAppStateAwareHref } from "../../useAppStateAwareHref";
import type { IAutoLinkProps } from "./AutoLink";
import MenuItemOrButton from "./MenuItemOrButton";
import { Text } from "@radix-ui/themes";

/**
 * Links to the current mapping event, or the events overview if no event is joined.
 */
function JoinedEventLink(props: IAutoLinkProps) {
  const { data: joinedMappingEvent, isValidating } = useCurrentMappingEvent();

  const href = joinedMappingEvent
    ? `/events/${joinedMappingEvent._id}`
    : "/events";

  const label = joinedMappingEvent ? joinedMappingEvent.name : props.label;
  const children = isValidating ? <Spinner /> : <Text>{label}</Text>;
  const router = useRouter();
  // XXX: This should be an <AppStateAwareLink>, but this would break keyboard navigation:
  // A bug in Radix UI (?) appears to not update the internal `ref` correctly.
  const hrefWithParams = useAppStateAwareHref(href);
  const openHref = useCallback(() => {
    router.push(hrefWithParams);
  }, [router, hrefWithParams]);

  return (
    <MenuItemOrButton {...props} onClick={openHref}>
      {children}
    </MenuItemOrButton>
  );
}

export default JoinedEventLink;
