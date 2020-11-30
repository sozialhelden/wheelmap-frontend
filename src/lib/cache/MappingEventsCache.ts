import URLDataCache from './URLDataCache';
import { MappingEvents, MappingEvent } from '../MappingEvent';
import { App } from '../App';
import env from '../env';

type MappingEventsData = {
  results: MappingEvents,
};

function setRelatedImagesAsChildProperty(mappingEvent: MappingEvent) {
  return {
    ...mappingEvent,
    images: Object.keys(mappingEvent.related.images)
      .map(_id => mappingEvent.related.images[_id])
      .filter(image => image.objectId === mappingEvent._id),
  };
}

export default class MappingEventsCache extends URLDataCache<MappingEventsData> {
  baseUrl = env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL || '';

  async getMappingEvents(app: App, useCache = true): Promise<MappingEvent[]> {
    const url = `${this.baseUrl}/mapping-events.json?appToken=${app.tokenString}&includeRelated=images`;
    const data: MappingEventsData = await this.getData(url, {
      useCache,
    });
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

  async getMappingEvent(
    app: App,
    _id: string,
    useCache = true
  ): Promise<MappingEvent | typeof undefined> {
    const url = `${this.baseUrl}/mapping-events/${_id}.json?appToken=${app.tokenString}&includeRelated=images`;
    const mappingEvent: MappingEventsData = await this.getData(url, {
      useCache,
    });
    const result: MappingEvent = {
      ...mappingEvent,
      images: Object.keys(mappingEvent.related.images)
        .map(_id => mappingEvent.related.images[_id])
        .filter(image => image.objectId === mappingEvent._id),
    };
    return result;
  }
}

export const mappingEventsCache = new MappingEventsCache({
  reloadInBackground: true,
  maxAllowedCacheAgeBeforeReload: 1000 * 30, // 30 seconds
});
