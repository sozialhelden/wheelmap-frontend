import { Button } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { omit } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";
import styled from "styled-components";
import { useAppContext } from "../../lib/context/AppContext";
import {
  getUUID,
  setJoinedMappingEventId,
  trackMappingEventMembershipChanged,
  useCurrentMappingEventId,
} from "../../lib/context/MappingEventContext";
import { buildFullImageUrl } from "../../lib/model/ac/Image";
import {
  type MappingEvent,
  canMappingEventBeJoined,
} from "../../lib/model/ac/MappingEvent";
import StyledToolbar from "../NodeToolbar/StyledToolbar";
import GlobeIcon from "../icons/ui-elements/GlobeIcon";
import MapPinIcon from "../icons/ui-elements/MapPinIcon";
import CloseButton from "../shared/CloseButton";
import StyledMarkdown from "../shared/StyledMarkdown";
import ChevronLeft from "./ChevronLeft";
import Statistics from "./Statistics";
import { useCurrentLanguage } from "./useCurrentLanguage";

export const StyledCloseButton = styled(CloseButton)`
  float: right;
  align-self: flex-start;
`;

type Props = {
  mappingEvent?: MappingEvent;
};

const StyledMappingEventToolbar = styled(StyledToolbar)`
  padding-top: 0;
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

  .mapping-event-image {
    width: calc(100% + 30px);
    margin: 0 -15px 20px;
  }

  .mapping-event-description {
    margin-bottom: 20px;
  }
`;

export default function MappingEventPanel({ mappingEvent }: Props) {
  const mappingEventId = mappingEvent?._id;

  const imageSource = mappingEvent?.images?.[0]
    ? buildFullImageUrl(mappingEvent.images[0])
    : "/images/eventPlaceholder.png";

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const startDate = mappingEvent?.startTime
    ? new Date(mappingEvent.startTime)
    : null;
  const endDate = mappingEvent?.endTime ? new Date(mappingEvent.endTime) : null;
  let startDateString: string | null = null;
  let endDateString: string | null = null;

  const { preferredLanguage } = useCurrentLanguage();

  if (startDate) {
    startDateString = Intl.DateTimeFormat(
      preferredLanguage,
      dateFormatOptions,
    ).format(startDate);

    if (endDate) {
      const isSameDay =
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate();

      endDateString = Intl.DateTimeFormat(
        preferredLanguage,
        isSameDay
          ? omit(dateFormatOptions, "year", "month", "day")
          : dateFormatOptions,
      ).format(endDate);
    } else {
      // translator: Prefix for the mapping event start date ("starting 01.12.2019")
      const startingDatePrefix = t("starting");
      startDateString = `${startingDatePrefix} ${startDateString}`;
    }
  } else {
    // translator: Prefix for the mapping event end date ("until 01.12.2019")
    const untilDatePrefix = t("until");
    if (endDate) {
      endDateString = `${untilDatePrefix} ${Intl.DateTimeFormat(
        preferredLanguage,
        dateFormatOptions,
      ).format(endDate)}`;
    }
  }

  const hasMeetingPoint = Boolean(mappingEvent?.meetingPoint);

  const areaName = mappingEvent?.area?.properties?.name || null;
  const meetingPointName = mappingEvent?.meetingPoint?.properties?.name;
  const mappingEventName = mappingEvent?.name;

  // translator: Screenreader description for a mapping event
  const toolbarAriaLabel = t("Mapping event {mappingEventName}", {
    mappingEventName,
  });
  // translator: Label for clickable mapping event name that makes the map jump to the event's position
  const centerMapOnMappingEvent = t("Center map on mapping event");
  // translator: Label for the meeting point of a mapping event
  const meetingPointLabel = t("Meeting point");
  // translator: Label for the area of a mapping event
  const areaNameLabel = t("Area name");
  // translator: Label for the date of a mapping event
  const eventDateLabel = t("Event date");
  // translator: Label for the start date of a mapping event
  const eventStartDateLabel = t("Event start date");
  // translator: Label for the end date of a mapping event
  const eventEndDateLabel = t("Event end date");
  // translator: Screenreader description for the back link that leads to the list of mapping events
  const backLinkAriaLabel = t("Back to the mapping events list");
  // translator: Button name for social media sharing the current mapping event
  const shareButtonCaption = t("Share");
  // translator: Button caption for joining an event
  const joinButtonCaption = t("Join mapping event");
  // translator: Button caption for leaving an event
  const leaveButtonCaption = t("Leave mapping event");

  const { data: joinedMappingEventId, mutate: mutateMappingEventId } =
    useCurrentMappingEventId();
  const userJoinedMappingEvent = mappingEvent?._id === joinedMappingEventId;
  const userUUID = getUUID();
  const app = useAppContext();
  const leaveMappingEvent = useCallback(() => {
    setJoinedMappingEventId(null);
    trackMappingEventMembershipChanged({ userUUID, app, reason: "button" });
    mutateMappingEventId();
  }, [userUUID, app, mutateMappingEventId]);

  const router = useRouter();
  const joinMappingEventAndShowWelcomeDialog = useCallback(() => {
    setJoinedMappingEventId(mappingEventId ?? null);
    trackMappingEventMembershipChanged({
      userUUID,
      app,
      reason: "button",
      joinedMappingEvent: mappingEvent,
    });
    router.push(`/events/${mappingEventId}/welcome`, undefined, {
      shallow: true,
    });
    mutateMappingEventId();
  }, [
    mappingEvent,
    mappingEventId,
    mutateMappingEventId,
    app,
    router,
    userUUID,
  ]);

  const mappingEventCenterUrl = `/events/${mappingEventId}?lat=${mappingEvent?.meetingPoint?.geometry?.[1]}&lon=${mappingEvent?.meetingPoint?.geometry?.[0]}&zoom=18`;

  return (
    <StyledMappingEventToolbar ariaLabel={toolbarAriaLabel} minimalHeight={205}>
      <header style={{ marginTop: "24px" }}>
        {!joinedMappingEventId && (
          <Link href="/events" aria-label={backLinkAriaLabel}>
            <ChevronLeft />
          </Link>
        )}

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "-16px",
            }}
          >
            <h2 style={{ flex: "1" }}>
              {hasMeetingPoint ? (
                <Link href={mappingEventCenterUrl} legacyBehavior>
                  <Button title={centerMapOnMappingEvent}>
                    {mappingEventName}
                  </Button>
                </Link>
              ) : (
                mappingEventName
              )}
            </h2>
          </div>

          {(startDateString || endDateString) && (
            <time className="event-date" title={eventDateLabel}>
              {startDateString && (
                <span title={eventStartDateLabel}>{startDateString}</span>
              )}
              {endDateString && (
                <>
                  &nbsp;-&nbsp;
                  <span title={eventEndDateLabel}>{endDateString}</span>
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

        {joinedMappingEventId && (
          <Link href="/" legacyBehavior>
            <StyledCloseButton />
          </Link>
        )}
      </header>

      <img className="mapping-event-image" src={imageSource} alt="" />

      {mappingEvent?.description && (
        <div className="mapping-event-description">
          <StyledMarkdown>{String(mappingEvent?.description)}</StyledMarkdown>
        </div>
      )}

      <Statistics
        mappedPlacesCount={
          (mappingEvent?.statistics?.attributeChangedCount || 0) +
          (mappingEvent?.statistics?.surveyCompletedCount || 0)
        }
        participantCount={mappingEvent?.statistics?.joinedParticipantCount || 0}
        startDate={startDate}
        endDate={endDate}
      />

      <div className="actions" style={{ marginBottom: "1rem" }}>
        {!joinedMappingEventId && canMappingEventBeJoined(mappingEvent) && (
          <Button onClick={joinMappingEventAndShowWelcomeDialog}>
            {joinButtonCaption}
          </Button>
        )}

        {userJoinedMappingEvent && (
          <Button onClick={leaveMappingEvent}>{leaveButtonCaption}</Button>
        )}
      </div>
    </StyledMappingEventToolbar>
  );
}
