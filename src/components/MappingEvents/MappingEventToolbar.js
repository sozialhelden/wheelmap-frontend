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

type MappingEventToolbarProps = {
  className?: string,
  mappingEvent: MappingEvent,
  joinedMappingEventId: ?String,
  mappingEventHandlers: {
    updateJoinedMappingEvent: (joinedMappingEventId: ?string) => void,
  },
  onClose: () => void,
  onHeaderClick: () => void,
  productName: string,
  focusTrapActive: Boolean,
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
  const startDate = new Date(mappingEvent.startTime);
  const endDate = mappingEvent.endTime ? new Date(mappingEvent.endTime) : null;

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

  let startDateString = Intl.DateTimeFormat(preferredLanguage, dateFormatOptions).format(startDate);
  let endDateString = null;

  if (endDate) {
    startDateString += ' -';
    endDateString = Intl.DateTimeFormat(preferredLanguage, dateFormatOptions).format(endDate);
  }

  const areaName = mappingEvent.area.properties.name;
  const meetingPointName = mappingEvent.meetingPoint && mappingEvent.meetingPoint.properties.name;

  // translator: Screenreader description for a mapping event
  const toolbarAriaLabel = t`Mapping Event ${mappingEvent.name}`;
  // translator: Screenreader description for the back link that leads to the list of mapping events
  const backLinkAriaLabel = t`Zurück zur Mapping Events Liste`;
  // translator: Button name for social media sharing the current mapping event
  const shareButtonCaption = t`Teilen`;
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
            <p>{startDateString}</p>
            {endDateString && <p>{endDateString}</p>}
            <address>
              {areaName && <p>{areaName}</p>}
              {meetingPointName && <p>{meetingPointName}</p>}
            </address>
          </div>
        </header>
        <img className="mapping-event-image" src={imageSource} alt="" />
        <div className="mapping-event-description">{mappingEvent.description}</div>
        <Statistics
          mappedPlacesCount={mappingEvent.statistics.mappedPlacesCount}
          invitedParticipantCount={mappingEvent.statistics.invitedParticipantCount}
          startDate={startDate}
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
