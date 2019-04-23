// @flow

import type { MappingEventFeature } from './Feature';
import type { IImage } from './Image';

type MappingEventStatusEnum = 'draft' | 'planned' | 'ongoing' | 'completed' | 'canceled';

interface MappingEventStatistics {
  fullParticipantCount: number;
  invitedParticipantCount: number;
  draftParticipantCount: number;
  acceptedParticipantCount: number;
  mappedPlacesCount: number;
}

export interface MappingEvent {
  _id: string;
  organizationId: string;
  sourceId?: string;
  name: string;
  description?: string;
  welcomeMessage?: string;
  meetingPoint?: MappingEventFeature;
  area: MappingEventFeature;
  startTime: Date;
  endTime?: Date;
  webSiteUrl?: string;
  images?: IImage[];
  targets?: {
    mappedPlacesCount?: number,
  };
  status: MappingEventStatusEnum;
  statistics: MappingEventStatistics;
}

export type MappingEvents = MappingEvent[];

export const hrefForMappingEvent = (mappingEvent: MappingEvent): string =>
  `/events/${mappingEvent._id}`;
