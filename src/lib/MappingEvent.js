import type { MappingEventFeature } from './Feature';

type MappingEventStatusEnum = 'draft' | 'planned' | 'ongoing' | 'completed' | 'canceled';
type MappingEventOpenForEnum = 'inviteOnly' | 'everyone';

interface MappingEventRegion {
  topLeft: { latitude: number, longitude: number };
  bottomRight: { latitude: number, longitude: number };
}

interface IMappingEventStatistics {
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
  meetingPoint: MappingEventFeature;
  regionName?: string;
  region?: MappingEventRegion;
  extent?: [number, number, number, number];
  startTime?: Date;
  endTime?: Date;
  webSiteUrl?: string;
  photoUrl?: string;
  invitationToken?: string;
  verifyGpsPositionsOfEdits?: boolean;
  targets?: {
    mappedPlacesCount?: number,
  };
  status: MappingEventStatusEnum;
  openFor: MappingEventOpenForEnum;
  statistics: IMappingEventStatistics;
}

export type MappingEvents = MappingEvent[];

export const hrefForMappingEvent = (mappingEvent: MappingEvent): string =>
  `/events/${mappingEvent._id}`;
