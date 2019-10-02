// @flow

import URLDataCache from './URLDataCache';
import type { MappingEvents, MappingEvent } from '../MappingEvent';
import { type App } from '../App';
import env from '../env';

type MappingEventsData = {
  results: MappingEvents,
};

export default class MappingEventsCache extends URLDataCache<MappingEventsData> {
  baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';

  async getMappingEvents(app: App): MappingEvent[] {
    const url = `${this.baseUrl}/mapping-events.json?appToken=${app.tokenString}&includeRelated=images`;
    const data: MappingEventsData = await this.getData(url);
    const results: MappingEvents = data.results.map(mappingEvent => ({
      ...mappingEvent,
      images: Object.keys(data.related.images)
        .map(_id => data.related.images[_id])
        .filter(image => image.objectId === mappingEvent._id),
    }));
    return results;
  }

  async getMappingEvent(app: App, _id: string): Promise<MappingEvent | typeof undefined> {
    const mappingEvents = await this.getMappingEvents(app);
    return mappingEvents.find(mappingEvent => mappingEvent._id === _id);
  }
}

export const mappingEventsCache = new MappingEventsCache({
  reloadInBackground: true,
  maxAllowedCacheAgeBeforeReload: 1000 * 30, // 30 seconds
});
