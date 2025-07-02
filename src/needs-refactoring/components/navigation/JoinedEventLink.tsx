import { Spinner } from "@radix-ui/themes";
import { AppStateAwareLink } from "~/modules/app-state/components/AppStateAwareLink";
import { useCurrentMappingEvent } from "~/needs-refactoring/lib/context/useCurrentMappingEvent";
import type { IAutoLinkProps } from "./AppLink";
import MenuItemOrButton from "./MenuItemOrButton";

/**
 * Links to the current mapping event, or the events overview if no event is joined.
 */
function JoinedEventLink(props: IAutoLinkProps) {
  const { data: joinedMappingEvent, isValidating } = useCurrentMappingEvent();

  const href = joinedMappingEvent
    ? `/events/${joinedMappingEvent._id}`
    : "/events";

  const label = joinedMappingEvent ? joinedMappingEvent.name : props.label;
  const children = isValidating ? (
    <Spinner />
  ) : (
    <AppStateAwareLink href={href}>{label}</AppStateAwareLink>
  );

  return <MenuItemOrButton {...props}>{children}</MenuItemOrButton>;
}

export default JoinedEventLink;
