import URLDataCache from './URLDataCache';
import { MappingEvents, MappingEvent } from '../MappingEvent';
import { App } from '../App';
import env from '../env';

type MappingEventsData = {
  results: MappingEvents,
};

export default class MappingEventsCache extends URLDataCache<MappingEventsData> {
  baseUrl = env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL || '';

  async getMappingEvents(app: App): Promise<MappingEvent[]> {
    const url = `${this.baseUrl}/mapping-events.json?appToken=${app.tokenString}&includeRelated=images`;
    const data: MappingEventsData = await this.getData(url, { useCache: false });
    const results: MappingEvents = data.results.map(mappingEvent => ({
      ...mappingEvent,
      // @ts-ignore
      images: Object.keys(data.related.images)
        // @ts-ignore
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
  reloadInBackground: false,
  maxAllowedCacheAgeBeforeReload: 1000 * 30, // 30 seconds
});
