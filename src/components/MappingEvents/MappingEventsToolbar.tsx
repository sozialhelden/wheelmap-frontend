import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';
import FocusTrap from 'focus-trap-react';

import StyledToolbar from '../NodeToolbar/StyledToolbar';
import Link, { RouteConsumer } from '../Link/Link';
import CloseButton from './CloseButton';
import { MappingEvents } from '../../lib/MappingEvent';
import { App } from '../../lib/App';

type MappingEventsToolbarProps = {
  app: App,
  className?: string,
  mappingEvents: MappingEvents,
  onClose: () => void,
  onMappingEventClick: (eventId: string) => void,
};

const MappingEventsToolbar = ({
  app,
  className,
  mappingEvents,
  onClose,
  onMappingEventClick,
}: MappingEventsToolbarProps) => {
  // translator: Screenreader description for the mapping events list
  const mappingEventsListAriaLabel = t`Mapping events list`;
  // translator: Screenreader description for the number of active mapping events in the shown list
  const activeMappingEventsCountAriaLabel = t`${mappingEvents.length} active mapping events`;
  // translator: Generic name for mapping events
  const eventsText = t`Events`;
  // translator: Tagline describing the purpose of mapping events
  const mappingEventsTagLine = t`Meet the community and map the accessibility of places around you!`;

  const listedMappingEvents = mappingEvents;

  return (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <StyledToolbar
        className={className}
        ariaLabel={mappingEventsListAriaLabel}
        role="dialog"
        minimalHeight={180}
      >
        <CloseButton onClick={onClose} />
        <header>
          <span className="number-badge" aria-hidden={true}>
            {listedMappingEvents.length}
          </span>
          <div className="header-title">
            <h2 aria-label={activeMappingEventsCountAriaLabel}>{eventsText}</h2>
            <p>{mappingEventsTagLine}</p>
          </div>
        </header>
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
                      <h3>{event.name}</h3>
                      {event.area && <p>{event.area.properties.name}</p>}
                    </Link>
                  );
                }}
              </RouteConsumer>
            </li>
          ))}
        </ul>
      </StyledToolbar>
    </FocusTrap>
  );
};

const StyledMappingEventsToolbar = styled(MappingEventsToolbar)`
  padding-top: 0;
  color: #22262d;
  line-height: 1.2;

  header {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
  }

  h2 {
    font-size: 20px;
    margin: 0;
  }

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #22262d;
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
  }

  .link-button {
    width: 100%;
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
