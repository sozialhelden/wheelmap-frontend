// @flow
import * as React from 'react';
import { type DataTableEntry, type RenderContext } from './getInitialProps';
import { type MappingEvent } from '../lib/MappingEvent';
import { translatedStringFromObject } from '../lib/i18n';
import { mappingEventsCache } from '../lib/cache/MappingEventsCache';

type MappingEventDetailDataProps = {
  mappingEvent: MappingEvent,
};

const MappingEventDetailData: DataTableEntry<MappingEventDetailDataProps> = {
  getHead({ mappingEvent, app }) {
    const translatedProductName = translatedStringFromObject(
      app.clientSideConfiguration.textContent.product.name
    );
    const title = translatedProductName
      ? `${mappingEvent.name} - ${translatedProductName}`
      : mappingEvent.name;
    return <title key="title">{title}</title>;
  },

  async getMappingEvent(eventId: string, renderContext: RenderContext) {
    const app = renderContext.app;
    return (
      renderContext.mappingEvents.find(event => event._id === eventId) ||
      (await mappingEventsCache.getMappingEvent(app, eventId, false))
    );
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
