import { App } from '../App';
import { MappingEvent, MappingEvents } from '../model/ac/MappingEvent';
import URLDataCache from './URLDataCache';

import { IImage } from '../model/ac/Image';

type MappingEventsListResult = {
  results: MappingEvents;
  related: {
    images: IImage[];
  };
};

export type MappingEventByIdResult = MappingEvent & {
  related: {
    images: IImage[];
  };
};

export default class MappingEventsCache extends URLDataCache<
  MappingEventsListResult | MappingEventByIdResult
> {
  baseUrl = process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || '';

  async getMappingEvents(app: App, useCache = true): Promise<MappingEvent[]> {
    const url = `${this.baseUrl}/mapping-events.json?appToken=${app.tokenString}&includeRelated=images`;
    const data = (await this.getData(url, {
      useCache,
    })) as MappingEventsListResult;
    const results: MappingEvents = data.results.map((mappingEvent) => ({
      ...mappingEvent,
      images: Object.keys(data.related.images)
        .map((_id) => data.related.images[_id])
        .filter((image) => image.objectId === mappingEvent._id),
    }));
    return results;
  }

  async getMappingEvent(
    app: App,
    _id: string,
    useCache = true,
  ): Promise<MappingEvent> {
    const url = `${this.baseUrl}/mapping-events/${_id}.json?appToken=${app.tokenString}&includeRelated=images`;
    const mappingEvent = (await this.getData(url, {
      useCache,
    })) as MappingEventByIdResult;
    const result: MappingEvent = {
      ...mappingEvent,
      images: Object.keys(mappingEvent.related.images)
        .map((_id) => mappingEvent.related.images[_id])
        .filter((image) => image.objectId === mappingEvent._id),
    };
    return result;
  }
}

export const mappingEventsCache = new MappingEventsCache({
  reloadInBackground: true,
  maxAllowedCacheAgeBeforeReload: 1000 * 30, // 30 seconds
});
