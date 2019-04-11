// @flow
import * as React from 'react';
import { type DataTableEntry, type AppProps } from './getInitialProps';
import { type MappingEvent } from '../lib/cache/MappingEventsCache';
import { translatedStringFromObject } from '../lib/i18n';

type MappingEventDetailDataProps = {
  mappingEvent: MappingEvent,
};

const MappingEventDetailData: DataTableEntry<MappingEventDetailDataProps> = {
  getHead({ mappingEvent, clientSideConfiguration }) {
    const translatedProductName = translatedStringFromObject(
      clientSideConfiguration.textContent.product.name
    );
    const title = translatedProductName
      ? `${mappingEvent.name} - ${translatedProductName}`
      : mappingEvent.name;
    return <title key="title">{title}</title>;
  },

  getMappingEvent(eventId: string, appProps: AppProps) {
    return appProps.mappingEvents.find(event => event._id === eventId);
  },

  async getInitialRouteProps(query, appPropsPromise, isServer) {
    const appProps = await appPropsPromise;
    const mappingEvent = this.getMappingEvent(query.id, appProps);
    const eventFeature = mappingEvent.meetingPoint;

    return {
      ...appProps,
      mappingEvent,
      feature: eventFeature,
      featureId: mappingEvent._id,
    };
  },
};

export default MappingEventDetailData;
