import { t } from "@transifex/native";
import Link from "next/link";
import styled from "styled-components";
import { useAppContext } from "~/needs-refactoring/lib/context/AppContext";
import useCollectionSWR from "~/needs-refactoring/lib/fetchers/ac/useCollectionSWR";
import type { MappingEvent } from "~/needs-refactoring/lib/model/ac/MappingEvent";
import colors from "~/needs-refactoring/lib/util/colors";
import { mappingEvent as MappingEventMarkerIcon } from "~/components/icons/markers";
import CloseButton from "../shared/CloseButton";
import StyledMarkdown from "../shared/StyledMarkdown";

export const StyledCloseButton = styled(CloseButton)``;

const StyledMappingEventsToolbar = styled.div`
  padding-top: 0;
  padding-bottom: 1rem;
  color: #22262d;
  line-height: 1.2;

  .explanation-link {
    margin: 2.5rem 0 1rem;
  }

  header {
    position: sticky;
    display: flex;
    align-items: start;
    top: 0;
    z-index: 1;
    margin: -1rem;
    padding: 0.75rem 1rem;
    background: ${colors.colorizedBackgroundColor};
  }

  h2 {
    font-size: 20px;
    margin: 0;
  }

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  }

  p {
    color: #676b72;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.2;
    margin: 0;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    padding: 0;

    .link-button {
      display: flex;
      align-items: center;
      svg {
        width: 2rem;
        height: 2rem;
        margin-right: 0.25rem;
      }
    }
  }

  .number-badge {
    background-color: #2e6ce0;
    border-radius: 100%;
    color: #ffffff;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    padding: 4px 0;
    margin-right: 10px;
    min-width: 30px;
    line-height: 22px;
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
  const app = useAppContext();
  const { data, isValidating, error } = useCollectionSWR({
    type: "ac:MappingEvent",
    params: new URLSearchParams({
      includeRelated: "images",
    }),
  });

  const mappingEvents = data?.results;

  const eventCount = mappingEvents?.length || 0;

  // translator: Screenreader description for the mapping events list
  const mappingEventsListAriaLabel = t("Mapping events list");
  // translator: Screenreader description for the number of active mapping events in the shown list
  const activeMappingEventsCountAriaLabel = t(
    `${eventCount} active mapping events`,
  );
  // translator: Generic name for mapping events
  const eventsText = t("Events");
  // translator: Tagline describing the purpose of mapping events (supports Markdown)
  const mapathonFeatureClaim = t(
    "Meet the community and map the accessibility of places around you!",
  );
  // translator: Link for further infos about how to organize mapping events
  const mapathonExplanationLinkCaption = t(
    "Learn how to organize a mapping event",
  );
  // translator: Link for further infos about how to organize mapping events
  const mapathonExplanationLinkURL = t(
    "https://news.wheelmap.org/en/organize-a-mapping-event/",
  );

  return (
    <StyledMappingEventsToolbar
      ariaLabel={mappingEventsListAriaLabel}
      minimalHeight={180}
    >
      <header>
        <span className="number-badge" aria-hidden>
          {eventCount}
        </span>
        <div className="header-title">
          <h2 aria-label={activeMappingEventsCountAriaLabel}>{eventsText}</h2>
          <StyledMarkdown>{mapathonFeatureClaim}</StyledMarkdown>
        </div>
        <Link href="/public" legacyBehavior>
          <CloseButton />
        </Link>
      </header>
      <a
        className="link-button explanation-link"
        href={mapathonExplanationLinkURL}
      >
        👉 {mapathonExplanationLinkCaption}
      </a>
      <ul>
        {mappingEvents?.map((event) => (
          <li key={event._id}>
            <Link href={getMappingEventLink(event)} className="link-button">
              <div>
                <MappingEventMarkerIcon />
              </div>
              <div>
                <h3>{event.name}</h3>
                {event.area && <p>{event.area.properties.name}</p>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <footer />
    </StyledMappingEventsToolbar>
  );
}
