// @flow

import URLDataCache from './URLDataCache';
import env from '../env';
import type { EventFeature } from '../Feature';

// Types
type EventStatusEnum = 'draft' | 'planned' | 'ongoing' | 'completed' | 'canceled';
type EventOpenForEnum = 'inviteOnly' | 'everyone';

interface EventRegion {
  topLeft: { latitude: number, longitude: number };
  bottomRight: { latitude: number, longitude: number };
}

interface IEventStatistics {
  fullParticipantCount: number;
  invitedParticipantCount: number;
  draftParticipantCount: number;
  acceptedParticipantCount: number;
  mappedPlacesCount: number;
}

export interface Event {
  _id: string;
  organizationId: string;
  sourceId?: string;
  name: string;
  description?: string;
  meetingPoint: EventFeature;
  regionName?: string;
  region?: EventRegion;
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
  status: EventStatusEnum;
  openFor: EventOpenForEnum;
  statistics: IEventStatistics;
}

export type Events = Event[];

type EventsData = {
  results: Events,
};

export const addExtentsDerivedFromRegions = (events: Events = []): Events => {
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

export default class EventsCache extends URLDataCache<EventsData> {
  baseUrl = env.public.accessibilityCloud.baseUrl.cached;
  appToken = env.public.accessibilityCloud.appToken;

  async getEvents() {
    const url = `${this.baseUrl}/events.json?appToken=${this.appToken}`;
    const data = await this.getData(url);
    return data.results;
  }
}

export const eventsCache = new EventsCache({
  ttl: 1000 * 60 * 2, // 2 minutes
});
