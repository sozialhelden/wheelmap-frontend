import type { MappingEventFeature } from "./Feature";
import type { IImage } from "./Image";

type MappingEventStatusEnum =
  | "draft"
  | "planned"
  | "ongoing"
  | "completed"
  | "canceled";

interface MappingEventStatistics {
  // deprecated, do not use
  fullParticipantCount?: number;
  // deprecated, do not use
  draftParticipantCount?: number;
  // deprecated, do not use
  acceptedParticipantCount?: number;
  // deprecated, do not use
  mappedPlacesCount?: number;

  invitedParticipantCount?: number;
  joinedParticipantCount?: number;

  attributeChangedCount?: number;
  surveyCompletedCount?: number;
}

export type MappingEvent = {
  _id: string;
  organizationId: string;
  appId?: string;
  sourceId?: string;
  name: string;
  description?: string;
  welcomeMessage?: string;
  area?: MappingEventFeature;
  meetingPoint?: MappingEventFeature;
  startTime?: string;
  endTime?: string;
  webSiteUrl?: string;
  images?: IImage[];
  targets?: {
    mappedPlacesCount?: number;
  };
  visibility?: "listed" | "unlisted";
  emailCollectionMode?: "required" | "optional" | "disabled";
  status: MappingEventStatusEnum;
  statistics: MappingEventStatistics;
};

export type MappingEvents = MappingEvent[];

export const hrefForMappingEvent = (mappingEvent: MappingEvent): string =>
  `/events/${mappingEvent._id}`;

export const canMappingEventBeJoined = (mappingEvent?: MappingEvent): boolean =>
  !!mappingEvent &&
  (mappingEvent.status === "ongoing" || mappingEvent.status === "planned");

export const isMappingEventVisible = (mappingEvent?: MappingEvent): boolean =>
  !!mappingEvent &&
  (mappingEvent.status === "ongoing" || mappingEvent.status === "planned") &&
  mappingEvent.visibility !== "unlisted";

// filters mapping events for the active app & shown mapping event
export function filterMappingEvents(
  mappingEvents: MappingEvents,
  appId: string,
  activeEventId?: string,
): MappingEvents {
  return mappingEvents
    .filter(
      (event) => isMappingEventVisible(event) || activeEventId === event._id,
    )
    .filter((event) => appId === event.appId);
}
