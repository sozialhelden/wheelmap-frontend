import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';
import FocusTrap from 'focus-trap-react';

import StyledToolbar from '../NodeToolbar/StyledToolbar';
import Link, { RouteConsumer } from '../Link/Link';
import { MappingEvents } from '../../lib/MappingEvent';
import { App } from '../../lib/App';
import StyledMarkdown from '../StyledMarkdown';
import { mappingEvent as MappingEventMarkerIcon } from '../icons/markers';
import colors from '../../lib/colors';
import CloseButton from '../CloseButton';

type MappingEventsToolbarProps = {
  app: App,
  className?: string,
  mappingEvents: MappingEvents,
  onClose: () => void,
  onMappingEventClick: (eventId: string) => void,
  minimalTopPosition: number,
};

export const StyledCloseButton = styled(CloseButton)``;

const MappingEventsToolbar = ({
  app,
  className,
  mappingEvents,
  onClose,
  onMappingEventClick,
  minimalTopPosition,
}: MappingEventsToolbarProps) => {
  // translator: Screenreader description for the mapping events list
  const mappingEventsListAriaLabel = t`Mapping events list`;
  // translator: Screenreader description for the number of active mapping events in the shown list
  const activeMappingEventsCountAriaLabel = t`${mappingEvents.length} active mapping events`;
  // translator: Generic name for mapping events
  const eventsText = t`Events`;
  // translator: Tagline describing the purpose of mapping events (supports Markdown)
  const mapathonFeatureClaim = t`Meet the community and map the accessibility of places around you!`;
  // translator: Link for further infos about how to organize mapping events
  const mapathonExplanationLinkCaption = t`Learn how to organize a mapping event`;
  // translator: Link for further infos about how to organize mapping events
  const mapathonExplanationLinkURL = t`https://news.wheelmap.org/en/organize-a-mapping-event/`;

  const listedMappingEvents = mappingEvents;

  return (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <div>
        <StyledToolbar
          className={className}
          ariaLabel={mappingEventsListAriaLabel}
          role="dialog"
          minimalHeight={180}
          minimalTopPosition={minimalTopPosition}
        >
          <header>
            <span className="number-badge" aria-hidden={true}>
              {listedMappingEvents.length}
            </span>
            <div className="header-title">
              <h2 aria-label={activeMappingEventsCountAriaLabel}>{eventsText}</h2>
              <StyledMarkdown>{mapathonFeatureClaim}</StyledMarkdown>
            </div>
            <CloseButton onClick={onClose} />
          </header>
          <a className="link-button explanation-link" href={mapathonExplanationLinkURL}>
            👉 {mapathonExplanationLinkCaption}
          </a>
          <ul>
            {listedMappingEvents.map(event => (
              <li key={event._id}>
                <RouteConsumer>
                  {context => {
                    let params = { ...context.params, id: event._id };
                    return (
                      <Link
                        to={'mappingEventDetail'}
                        params={params}
                        className="link-button"
                        onClick={() => onMappingEventClick(event._id)}
                      >
                        <div>
                          <MappingEventMarkerIcon />
                        </div>
                        <div>
                          <h3>{event.name}</h3>
                          {event.area && <p>{event.area.properties.name}</p>}
                        </div>
                      </Link>
                    );
                  }}
                </RouteConsumer>
              </li>
            ))}
          </ul>
          <footer></footer>
        </StyledToolbar>
      </div>
    </FocusTrap>
  );
};
const StyledMappingEventsToolbar = styled(MappingEventsToolbar)`
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
export default StyledMappingEventsToolbar;
