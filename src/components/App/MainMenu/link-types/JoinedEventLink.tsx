import { useCurrentMappingEvent } from "../../../../lib/context/useCurrentMappingEvent";
import Spinner from "../../../ActivityIndicator/Spinner";
import type { IAutoLinkProps } from "./AutoLink";
import MenuItemOrButton from "./MenuItemOrButton";
import { AppStateLink } from "../../AppStateLink";

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
