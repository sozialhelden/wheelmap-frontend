import * as React from 'react';
import { DataTableEntry, RenderContext } from './getInitialProps';
import { MappingEvent } from '../lib/MappingEvent';
import { translatedStringFromObject } from '../lib/i18n';

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

  getMappingEvent(eventId: string, renderContext: RenderContext) {
    return renderContext.mappingEvents.find(event => event._id === eventId);
  },

  async getInitialRouteProps(query, renderContextPromise, isServer) {
    const renderContext = await renderContextPromise;
    const mappingEvent = this.getMappingEvent(query.id, renderContext);
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
