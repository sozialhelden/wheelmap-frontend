import FocusTrap from 'focus-trap-react';
import styled from 'styled-components';
import { t } from 'ttag';

import { omit } from 'lodash';
import { AppContextConsumer } from '../../AppContext';
import colors from '../../lib/colors';
import { buildFullImageUrl } from '../../lib/Image';
import { canMappingEventBeJoined, MappingEvent } from '../../lib/MappingEvent';
import { RouteParams } from '../../lib/RouterHistory';
import Button, { ChromelessButton, DangerButton, PrimaryButton } from '../Button';
import CloseButton from '../CloseButton';
import GlobeIcon from '../icons/ui-elements/GlobeIcon';
import MapPinIcon from '../icons/ui-elements/MapPinIcon';
import Link from '../Link/Link';
import { RouteConsumer, RouteContext } from '../Link/RouteContext';
import StyledToolbar from '../NodeToolbar/StyledToolbar';
import StyledMarkdown from '../StyledMarkdown';
import ChevronLeft from './ChevronLeft';
import MappingEventShareBar from './MappingEventShareBar';
import Statistics from './Statistics';

export const StyledCloseButton = styled(CloseButton)`
  float: right;
  align-self: flex-start;
`;

type MappingEventToolbarProps = {
  className?: string;
  mappingEvent: MappingEvent;
  onMappingEventLeave: () => void;
  onMappingEventWelcomeDialogOpen: () => void;
  joinedMappingEventId: string | null;
  mappingEventHandlers: {
    updateJoinedMappingEvent: (joinedMappingEventId: string | null) => void;
  };
  onClose: () => void;
  onHeaderClick: () => void;
  productName: string | null;
  focusTrapActive: boolean;
  preferredLanguage: string;
  minimalTopPosition: number;
};

const MappingEventToolbar = ({
  className,
  mappingEvent,
  onMappingEventLeave,
  onMappingEventWelcomeDialogOpen,
  joinedMappingEventId,
  onClose,
  onHeaderClick,
  productName,
  focusTrapActive,
  preferredLanguage,
  minimalTopPosition,
}: MappingEventToolbarProps) => {
  const imageSource =
    mappingEvent.images && mappingEvent.images[0]
      ? buildFullImageUrl(mappingEvent.images[0])
      : '/images/eventPlaceholder.png';

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
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
      const isSameDay =
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate();

      endDateString = Intl.DateTimeFormat(
        preferredLanguage,
        isSameDay ? omit(dateFormatOptions, 'year', 'month', 'day') : dateFormatOptions
      ).format(endDate);
    } else {
      // translator: Prefix for the mapping event start date ("starting 01.12.2019")
      const startingDatePrefix = t`starting`;
      startDateString = `${startingDatePrefix} ${startDateString}`;
    }
  } else {
    // translator: Prefix for the mapping event end date ("until 01.12.2019")
    const untilDatePrefix = t`until`;
    if (endDate) {
      endDateString = `${untilDatePrefix} ${Intl.DateTimeFormat(
        preferredLanguage,
        dateFormatOptions
      ).format(endDate)}`;
    }
  }

  const hasMeetingPoint = Boolean(mappingEvent.meetingPoint);

  const areaName = mappingEvent.area ? mappingEvent.area.properties.name : null;
  const meetingPointName = mappingEvent.meetingPoint && mappingEvent.meetingPoint.properties.name;

  // translator: Screenreader description for a mapping event
  const toolbarAriaLabel = t`Mapping event ${mappingEvent.name}`;
  // translator: Label for clickable mapping event name that makes the map jump to the event's position
  const centerMapOnMappingEvent = t`Center map on mapping event`;
  // translator: Label for the meeting point of a mapping event
  const meetingPointLabel = t`Meeting point`;
  // translator: Label for the area of a mapping event
  const areaNameLabel = t`Area name`;
  // translator: Label for the date of a mapping event
  const eventDateLabel = t`Event date`;
  // translator: Label for the start date of a mapping event
  const eventStartDateLabel = t`Event start date`;
  // translator: Label for the end date of a mapping event
  const eventEndDateLabel = t`Event end date`;
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
    <DangerButton onClick={onMappingEventLeave}>{leaveButtonCaption}</DangerButton>
  ) : (
    <PrimaryButton onClick={onMappingEventWelcomeDialogOpen}>{joinButtonCaption}</PrimaryButton>
  );

  return (
    <FocusTrap active={focusTrapActive} focusTrapOptions={{ clickOutsideDeactivates: true }}>
      <div>
        <StyledToolbar
          className={className}
          ariaLabel={toolbarAriaLabel}
          role="dialog"
          minimalHeight={205}
          minimalTopPosition={minimalTopPosition}
        >
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

            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: '-16px',
                }}
              >
                <h2 style={{ flex: '1' }}>
                  {hasMeetingPoint ? (
                    <Button onClick={onHeaderClick} title={centerMapOnMappingEvent}>
                      {mappingEvent.name}
                    </Button>
                  ) : (
                    mappingEvent.name
                  )}
                </h2>
                <StyledCloseButton onClick={onClose} />
              </div>

              {(startDateString || endDateString) && (
                <time className="event-date" title={eventDateLabel}>
                  {startDateString && <span title={eventStartDateLabel}>{startDateString}</span>}
                  {endDateString && (
                    <>
                      &nbsp;-&nbsp;<span title={eventEndDateLabel}>{endDateString}</span>
                    </>
                  )}
                </time>
              )}

              {meetingPointName && (
                <div className="meeting-point" title={meetingPointLabel}>
                  <MapPinIcon className="meeting-point-icon" />
                  {meetingPointName}
                </div>
              )}

              {areaName && (
                <div className="area-name" title={areaNameLabel}>
                  <GlobeIcon className="area-name-icon" />
                  {areaName}
                </div>
              )}
            </div>
          </header>

          <img className="mapping-event-image" src={imageSource} alt="" />

          <div className="mapping-event-description">
            <StyledMarkdown>{mappingEvent.description}</StyledMarkdown>
          </div>

          <Statistics
            mappedPlacesCount={
              (mappingEvent.statistics.attributeChangedCount || 0) +
              (mappingEvent.statistics.surveyCompletedCount || 0)
            }
            participantCount={mappingEvent.statistics.joinedParticipantCount || 0}
            startDate={startDate}
            endDate={endDate}
          />

          <div className="actions">
            {canMappingEventBeJoined(mappingEvent) && eventJoinOrLeaveButton}
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
        </StyledToolbar>
      </div>
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
    margin-bottom: 16px;
    margin-top: 16px;
  }

  h2 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 16px 0 0;
  }

  p {
    color: ${colors.textColorTonedDown};
    font-size: 16px;
    font-weight: 400;
  }

  .event-date,
  .meeting-point,
  .area-name {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    margin-top: 8px;
  }

  .date-icon,
  .meeting-point-icon,
  .area-name-icon {
    margin-right: 4px;
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
