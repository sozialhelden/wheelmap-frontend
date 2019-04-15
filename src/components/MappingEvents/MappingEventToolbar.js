// @flow

import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';
import FocusTrap from 'focus-trap-react';

import Toolbar from '../Toolbar';
import MappingEventShareBar from './MappingEventShareBar';
import Link from '../Link/Link';
import { RouteConsumer } from '../Link/RouteContext';
import MapPinWithPlusIcon from './MapPinWithPlusIcon';
import BellIcon from './BellIcon';
import { AppContextConsumer } from '../../AppContext';
import ChevronLeft from './ChevronLeft';
import CloseButton from './CloseButton';
import { buildFullImageUrl } from '../../lib/Image';
import type { MappingEvent } from '../../lib/MappingEvent';
import { PrimaryButton, ChromelessButton, DangerButton } from '../Button';

interface MappingEventToolbarProps {
  className: string;
  mappingEvent: MappingEvent;
  joinedMappingEventId: ?String;
  mappingEventHandlers: {
    updateJoinedMappingEvent: (joinedMappingEventId: ?string) => void,
  };
  onClose: () => void;
  productName: string;
}

const MappingEventToolbar = ({
  className,
  mappingEvent,
  mappingEventHandlers: { updateJoinedMappingEvent },
  joinedMappingEventId,
  onClose,
  productName,
}: MappingEventToolbarProps) => {
  const startDate = new Date(mappingEvent.startTime);
  const endDate = mappingEvent.endTime ? new Date(mappingEvent.endTime) : null;

  const imageSource =
    mappingEvent.photos && mappingEvent.photos[0]
      ? buildFullImageUrl(mappingEvent.photos[0])
      : '/static/images/eventPlaceholder.png';

  let dateString = `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()}`;
  if (endDate) {
    dateString += ` - ${endDate.toLocaleDateString()} ${endDate.toLocaleTimeString()}`;
  }

  const areaName = mappingEvent.area.properties.name;
  const meetingPointName = mappingEvent.meetingPoint && mappingEvent.meetingPoint.properties.name;

  // translator: Screenreader description for a mapping event
  const toolbarAriaLabel = t`Mapping Event ${mappingEvent.name}`;
  // translator: Screenreader description for the back link that leads to the list of mapping events
  const backLinkAriaLabel = t`Zurück zur Mapping Events Liste`;
  // translator: Button name for social media sharing the current mapping event
  const shareButtonCaption = t`Teilen`;
  // translator: Screenreader description for the statistics/numbers part of a mapping event
  const statisticsRegionAriaLabel = t`Mapping Event Zahlen`;
  // translator: Description for number of already mapped places in the mapping event
  const mappedPlacesLabel = t`Neue Orte`;
  // translator: Description for number of people invited to the current mapping event
  const inviteesCountAriaLabel = t`Teilnehmer`;
  // translator: Button caption for joining an event
  const joinButtonCaption = t`Mitmachen`;
  // translator: Button caption for leaving an event
  const leaveButtonCaption = t`Event verlassen`;

  const userJoinedMappingEvent = mappingEvent._id === joinedMappingEventId;

  const eventJoinOrLeaveButton = userJoinedMappingEvent ? (
    <DangerButton onClick={() => updateJoinedMappingEvent(null)}>{leaveButtonCaption}</DangerButton>
  ) : (
    <PrimaryButton onClick={() => updateJoinedMappingEvent(mappingEvent._id)}>
      {joinButtonCaption}
    </PrimaryButton>
  );

  return (
    <FocusTrap focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <Toolbar className={className} ariaLabel={toolbarAriaLabel} role="dialog">
        <CloseButton onClick={onClose} />
        <header>
          {!joinedMappingEventId && (
            <RouteConsumer>
              {context => {
                const params = { ...context.params };
                delete params.id;

                return (
                  <Link to="mappingEvents" params={params} aria-label={backLinkAriaLabel}>
                    <ChevronLeft />
                  </Link>
                );
              }}
            </RouteConsumer>
          )}
          <div>
            <h2>{mappingEvent.name}</h2>
            <p>{dateString}</p>
            <address>
              {areaName && <p>{areaName}</p>}
              {meetingPointName && <p>{meetingPointName}</p>}
            </address>
          </div>
        </header>
        <img className="mapping-event-image" src={imageSource} alt="" />
        <div className="mapping-event-description">{mappingEvent.description}</div>
        <section className="statistics" aria-label={statisticsRegionAriaLabel}>
          <div>
            <div className="statistics-count">
              <MapPinWithPlusIcon />
              <span>{mappingEvent.statistics.mappedPlacesCount}</span>
            </div>
            <div className="statistics-description">{mappedPlacesLabel}</div>
          </div>
          <div>
            <div className="statistics-count">
              <BellIcon />
              <span>{mappingEvent.statistics.invitedParticipantCount}</span>
            </div>
            <div className="statistics-description">{inviteesCountAriaLabel}</div>
          </div>
        </section>
        <div className="actions">
          {mappingEvent.status === 'ongoing' && eventJoinOrLeaveButton}
          <AppContextConsumer>
            {appContext => (
              <MappingEventShareBar
                mappingEvent={mappingEvent}
                buttonCaption={shareButtonCaption}
                baseUrl={appContext.baseUrl}
                productName={productName}
              />
            )}
          </AppContextConsumer>
        </div>
      </Toolbar>
    </FocusTrap>
  );
};

const StyledMappingEventToolbar = styled(MappingEventToolbar)`
  padding-top: 0;
  color: #22262d;
  line-height: 1.2;

  header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-top: 10px;
    margin-bottom: 20px;
  }

  h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
  }

  p {
    color: #676b72;
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    line-height: 1.2;
  }

  ${ChromelessButton}.expand-button {
    display: flex;
    margin-top: 10px;
    justify-content: center;
    width: 100%;

    svg {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.5rem;
      fill: #89939e;
    }
  }

  .actions {
    margin-bottom: 20px;
  }

  .mapping-event-image {
    width: calc(100% + 30px);
    margin: 0 -15px 20px;
  }

  .statistics {
    display: flex;
    justify-content: space-around;
    text-align: center;
    margin-bottom: 20px;

    svg {
      margin-right: 10px;
    }
  }

  .statistics-count {
    font-size: 27px;
    font-weight: 300;
    color: #37404d;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .statistics-description {
    font-size: 14px;
    color: #22262d;
  }

  .mapping-event-description {
    margin-bottom: 20px;
  }
`;

export default StyledMappingEventToolbar;
