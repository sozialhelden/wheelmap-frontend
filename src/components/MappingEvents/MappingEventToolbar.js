// @flow

import React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';
import FocusTrap from 'focus-trap-react';

import Toolbar from '../Toolbar';
import MappingEventShareBar from './MappingEventShareBar';
import Statistics from './Statistics';
import Link from '../Link/Link';
import { RouteConsumer, type RouteContext } from '../Link/RouteContext';
import { AppContextConsumer } from '../../AppContext';
import ChevronLeft from './ChevronLeft';
import CloseButton from './CloseButton';
import { buildFullImageUrl } from '../../lib/Image';
import { type MappingEvent, isMappingEventVisible } from '../../lib/MappingEvent';
import { type RouteParams } from '../../lib/RouterHistory';
import { PrimaryButton, ChromelessButton, DangerButton } from '../Button';
import MapPinIcon from '../icons/ui-elements/MapPinIcon';
import GlobeIcon from '../icons/ui-elements/GlobeIcon';

type MappingEventToolbarProps = {
  className?: string,
  mappingEvent: MappingEvent,
  joinedMappingEventId: ?string,
  mappingEventHandlers: {
    updateJoinedMappingEvent: (joinedMappingEventId: ?string) => void,
  },
  onClose: () => void,
  onHeaderClick: () => void,
  productName: ?string,
  focusTrapActive: boolean,
  preferredLanguage: string,
};

const MappingEventToolbar = ({
  className,
  mappingEvent,
  mappingEventHandlers: { updateJoinedMappingEvent },
  joinedMappingEventId,
  onClose,
  onHeaderClick,
  productName,
  focusTrapActive,
  preferredLanguage,
}: MappingEventToolbarProps) => {
  const imageSource =
    mappingEvent.images && mappingEvent.images[0]
      ? buildFullImageUrl(mappingEvent.images[0])
      : '/static/images/eventPlaceholder.png';

  const dateFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const startDate = mappingEvent.startTime ? new Date(mappingEvent.startTime) : null;
  const endDate = mappingEvent.endTime ? new Date(mappingEvent.endTime) : null;
  let startDateString = null;
  let endDateString = null;

  if (startDate) {
    startDateString = Intl.DateTimeFormat(preferredLanguage, dateFormatOptions).format(startDate);

    if (endDate) {
      startDateString += ' -';
      endDateString = Intl.DateTimeFormat(preferredLanguage, dateFormatOptions).format(endDate);
    }
  }

  const areaName = mappingEvent.area.properties.name;
  const meetingPointName = mappingEvent.meetingPoint && mappingEvent.meetingPoint.properties.name;

  // translator: Screenreader description for a mapping event
  const toolbarAriaLabel = t`Mapping event ${mappingEvent.name}`;
  // translator: Screenreader description for the back link that leads to the list of mapping events
  const backLinkAriaLabel = t`Back to the mapping events list`;
  // translator: Button name for social media sharing the current mapping event
  const shareButtonCaption = t`Share`;
  // translator: Button caption for joining an event
  const joinButtonCaption = t`Join mapping event`;
  // translator: Button caption for leaving an event
  const leaveButtonCaption = t`Leave mapping event`;

  const userJoinedMappingEvent = mappingEvent._id === joinedMappingEventId;

  const eventJoinOrLeaveButton = userJoinedMappingEvent ? (
    <DangerButton onClick={() => updateJoinedMappingEvent(null)}>{leaveButtonCaption}</DangerButton>
  ) : (
    <PrimaryButton onClick={() => updateJoinedMappingEvent(mappingEvent._id)}>
      {joinButtonCaption}
    </PrimaryButton>
  );

  const onHeaderKeyPress = (event: SyntheticKeyboardEvent<HTMLDivElement>) =>
    event.key === 'Enter' && onHeaderClick();

  return (
    <FocusTrap active={focusTrapActive} focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <Toolbar className={className} ariaLabel={toolbarAriaLabel} role="dialog">
        <CloseButton onClick={onClose} />
        <header>
          {!joinedMappingEventId && (
            <RouteConsumer>
              {(context: RouteContext) => {
                const params: RouteParams = { ...context.params };
                delete params.id;

                return (
                  <Link to="mappingEvents" params={params} aria-label={backLinkAriaLabel}>
                    <ChevronLeft />
                  </Link>
                );
              }}
            </RouteConsumer>
          )}
          <div onClick={onHeaderClick} role="button" tabIndex="0" onKeyPress={onHeaderKeyPress}>
            <h2>{mappingEvent.name}</h2>
            {startDateString && <p>{startDateString}</p>}
            {endDateString && <p>{endDateString}</p>}
            <address>
              {meetingPointName && (
                <p>
                  <MapPinIcon />
                  {meetingPointName}
                </p>
              )}
              {areaName && (
                <p>
                  <GlobeIcon />
                  {areaName}
                </p>
              )}
            </address>
          </div>
        </header>
        <img className="mapping-event-image" src={imageSource} alt="" />
        <div className="mapping-event-description">{mappingEvent.description}</div>
        <Statistics
          mappedPlacesCount={mappingEvent.statistics.mappedPlacesCount}
          invitedParticipantCount={mappingEvent.statistics.invitedParticipantCount}
          endDate={endDate}
        />
        <div className="actions">
          {isMappingEventVisible(mappingEvent) && eventJoinOrLeaveButton}
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
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;

    > svg {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 0.5rem;
      fill: #89939e;
    }
  }

  .mapping-event-image {
    width: calc(100% + 30px);
    margin: 0 -15px 20px;
  }

  .mapping-event-description {
    margin-bottom: 20px;
  }
`;

export default StyledMappingEventToolbar;
