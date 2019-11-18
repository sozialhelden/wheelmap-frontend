import { MappingEventFeature } from './Feature';
import { IImage } from './Image';

type MappingEventStatusEnum = 'draft' | 'planned' | 'ongoing' | 'completed' | 'canceled';

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

export interface MappingEvent {
  _id: string;
  organizationId: string;
  appId?: string;
  sourceId?: string;
  name: string;
  description?: string;
  welcomeMessage?: string;
  area?: MappingEventFeature;
  meetingPoint?: MappingEventFeature;
  startTime?: Date;
  endTime?: Date;
  webSiteUrl?: string;
  images?: IImage[];
  targets?: {
    mappedPlacesCount?: number,
  };
  visibility?: 'listed' | 'unlisted';
  emailCollectionMode?: 'required' | 'optional' | 'disabled';
  status: MappingEventStatusEnum;
  statistics: MappingEventStatistics;
}

export type MappingEvents = MappingEvent[];

export const hrefForMappingEvent = (mappingEvent: MappingEvent): string =>
  `/events/${mappingEvent._id}`;

export const canMappingEventBeJoined = (mappingEvent: MappingEvent): boolean =>
  mappingEvent.status === 'ongoing' || mappingEvent.status === 'planned';

export const isMappingEventVisible = (mappingEvent: MappingEvent): boolean =>
  (mappingEvent.status === 'ongoing' || mappingEvent.status === 'planned') &&
  mappingEvent.visibility !== 'unlisted';
