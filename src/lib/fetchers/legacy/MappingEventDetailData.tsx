import * as React from 'react';
import { DataTableEntry, RenderContext } from './getInitialProps';
import { MappingEvent } from '../lib/model/MappingEvent';
import { translatedStringFromObject } from '../lib/i18n';
import { mappingEventsCache } from '../lib/cache/MappingEventsCache';

type MappingEventDetailDataProps = {
  mappingEvent: MappingEvent;
};

const MappingEventDetailData: DataTableEntry<MappingEventDetailDataProps> = {
  getHead({ mappingEvent, app }) {
    const translatedProductName = translatedStringFromObject(
      app.clientSideConfiguration.textContent.product.name,
    );
    const title = translatedProductName
      ? `${mappingEvent.name} - ${translatedProductName}`
      : mappingEvent.name;
    return <title key="title">{title}</title>;
  },

  async getMappingEvent(eventId: string, renderContext: RenderContext) {
    const { app } = renderContext;
    const found = renderContext.mappingEvents.find((event) => event._id === eventId);
    const result = found || (await mappingEventsCache.getMappingEvent(app, eventId, false));
    return result;
  },

  async getInitialRouteProps(query, renderContextPromise, isServer) {
    const renderContext = await renderContextPromise;
    const mappingEvent = await this.getMappingEvent(query.id, renderContext);
    const eventFeature = mappingEvent.meetingPoint;

    return {
      ...renderContext,
      mappingEvent,
      feature: eventFeature,
      featureId: mappingEvent._id,
    };
  },
};

export default MappingEventDetailData;
