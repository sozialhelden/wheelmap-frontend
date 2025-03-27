import { Spinner } from "@radix-ui/themes";
import { useCurrentMappingEvent } from "~/needs-refactoring/lib/context/useCurrentMappingEvent";
import { AppStateLink } from "~/needs-refactoring/components/App/AppStateLink";
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
    <AppStateLink href={href}>{label}</AppStateLink>
  );

  return <MenuItemOrButton {...props}>{children}</MenuItemOrButton>;
}

export default JoinedEventLink;
