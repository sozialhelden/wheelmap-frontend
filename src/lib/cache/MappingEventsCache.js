// @flow

import URLDataCache from './URLDataCache';
import env from '../env';
import type { MappingEvents } from '../MappingEvent';

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
