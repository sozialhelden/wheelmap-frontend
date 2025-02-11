import { ChevronRightIcon } from "@radix-ui/react-icons";
import {
  Badge,
  Button,
  Card,
  DataList,
  Flex,
  Heading,
  Text,
} from "@radix-ui/themes";
import Link from "next/link";
import styled from "styled-components";
import { t } from "ttag";
import { useAppContext } from "../../lib/context/AppContext";
import useCollectionSWR from "../../lib/fetchers/ac/useCollectionSWR";
import type { MappingEvent } from "../../lib/model/ac/MappingEvent";
import StyledToolbar from "../NodeToolbar/StyledToolbar";
import { mappingEvent as MappingEventMarkerIcon } from "../icons/markers";
import CloseButton from "../shared/CloseButton";
import StyledMarkdown from "../shared/StyledMarkdown";

export const StyledCloseButton = styled(CloseButton)``;

const StyledMappingEventsToolbar = styled(StyledToolbar)`
  padding-top: 0;
  padding-bottom: 1rem;
  line-height: 1.2;

  header {
    position: sticky;
    display: flex;
    align-items: start;
    top: 0;
    z-index: 1;
    margin: -1rem;
    padding: 0.75rem 1rem;
  }
`;

function getMappingEventLink(event: MappingEvent): string {
  const extent = event?.area?.properties.extent;
  if (!extent) {
    return `/events/${event._id}`;
  }
  return `/events/${event._id}?extent=${extent}`;
}

export default function MappingEventListPanel() {
  const { data, isValidating, error } = useCollectionSWR({
    type: "ac:MappingEvent",
    params: new URLSearchParams({
      includeRelated: "images",
    }),
  });

  const mappingEvents = data?.results;

  const eventCount = mappingEvents?.length || 0;

  // translator: Screenreader description for the mapping events list
  const mappingEventsListAriaLabel = t`Mapping events list`;
  // translator: Screenreader description for the number of active mapping events in the shown list
  const activeMappingEventsCountAriaLabel = t`${eventCount} active mapping events`;
  // translator: Generic name for mapping events
  const eventsText = t`Events`;
  // translator: Tagline describing the purpose of mapping events (supports Markdown)
  const mapathonFeatureClaim = t`Meet the community and map the accessibility of places around you!`;
  // translator: Link for further infos about how to organize mapping events
  const mapathonExplanationLinkCaption = t`Learn how to organize a mapping event`;
  // translator: Link for further infos about how to organize mapping events
  const mapathonExplanationLinkURL = t`https://news.wheelmap.org/en/organize-a-mapping-event/`;

  return (
    <StyledMappingEventsToolbar
      ariaLabel={mappingEventsListAriaLabel}
      minimalHeight={180}
    >
      <Flex align="center" gap="3">
        <Heading as="h1" aria-label={activeMappingEventsCountAriaLabel}>
          <StyledMarkdown inline>{mapathonFeatureClaim}</StyledMarkdown>
        </Heading>
        <Link href="/" legacyBehavior>
          <CloseButton />
        </Link>
      </Flex>

      <Flex gap="3" align="center" justify="between" my="5">
        <Badge size="3" aria-hidden color="bronze">
          {eventCount} {eventsText}
        </Badge>
        <Button size="3" asChild variant="ghost">
          <a href={mapathonExplanationLinkURL}>
            {mapathonExplanationLinkCaption}
            <ChevronRightIcon />
          </a>
        </Button>
      </Flex>

      <Flex asChild direction="column" gap="3" my="5">
        <ul>
          {mappingEvents?.map((event) => (
            <li key={event._id}>
              <Card asChild variant="surface">
                <Link href={getMappingEventLink(event)}>
                  <Flex gap="2" align="center" justify="between">
                    <MappingEventMarkerIcon
                      aria-hidden
                      width="2em"
                      height="2em"
                    />
                    <Text weight="bold" style={{ flex: "1" }}>
                      {event.name}
                    </Text>
                    <Text weight="medium" color="bronze">
                      {event.area && <p>{event.area.properties.name}</p>}
                    </Text>
                  </Flex>
                </Link>
              </Card>
            </li>
          ))}
        </ul>
      </Flex>
    </StyledMappingEventsToolbar>
  );
}
