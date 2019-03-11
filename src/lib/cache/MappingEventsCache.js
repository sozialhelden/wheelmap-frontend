// @flow

import URLDataCache from './URLDataCache';
import env from '../env';
import type { MappingEventFeature } from '../Feature';

// Types
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

type MappingEventsData = {
  results: MappingEvents,
};

export const addExtentsDerivedFromRegions = (events: MappingEvents = []): MappingEvents => {
  events.map(event => {
    if (event.region) {
      event.extent = [
        event.region.topLeft.longitude,
        event.region.topLeft.latitude,
        event.region.bottomRight.longitude,
        event.region.bottomRight.latitude,
      ];
    }
    return event;
  });

  return events;
};

export default class MappingEventsCache extends URLDataCache<MappingEventsData> {
  baseUrl = env.public.accessibilityCloud.baseUrl.cached;
  appToken = env.public.accessibilityCloud.appToken;

  async getMappingEvents() {
    const url = `${this.baseUrl}/events.json?appToken=${this.appToken}`;
    const data = await this.getData(url);
    return data.results;
  }
}

export const mappingEventsCache = new MappingEventsCache({
  ttl: 1000 * 60 * 2, // 2 minutes
});
