// @flow

import URLDataCache from './URLDataCache';
import env from '../env';
import type { MappingEvents, MappingEvent } from '../MappingEvent';

type MappingEventsData = {
  results: MappingEvents,
};

export default class MappingEventsCache extends URLDataCache<MappingEventsData> {
  baseUrl = env.public.accessibilityCloud.baseUrl.cached;
  appToken = env.public.accessibilityCloud.appToken;

  async getMappingEvents() {
    const url = `${this.baseUrl}/mapping-events.json?appToken=${
      this.appToken
    }&includeRelated=images`;
    const data = await this.getData(url);
    return data.results.map(mappingEvent => ({
      ...mappingEvent,
      images: Object.keys(data.related.images)
        .map(_id => data.related.images[_id])
        .filter(image => image.objectId === mappingEvent._id),
    }));
  }

  async getMappingEvent(_id: string): Promise<MappingEvent | typeof undefined> {
    const mappingEvents = await this.getMappingEvents();
    return mappingEvents.find(mappingEvent => mappingEvent._id === _id);
  }
}

export const mappingEventsCache = new MappingEventsCache({
  ttl: 1000 * 60 * 2, // 2 minutes
});
