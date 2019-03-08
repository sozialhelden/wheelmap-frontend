// @flow
import * as React from 'react';
import { type DataTableEntry, type AppProps } from './getInitialProps';
import { type Event } from '../lib/cache/EventsCache';
import { translatedStringFromObject } from '../lib/i18n';

type EventDetailDataProps = {
  event: Event,
};

const EventDetailData: DataTableEntry<EventDetailDataProps> = {
  getHead({ event, clientSideConfiguration }) {
    const translatedProductName = translatedStringFromObject(
      clientSideConfiguration.textContent.product.name
    );
    const title = translatedProductName ? `${event.name} - ${translatedProductName}` : event.name;
    return <title key="title">{title}</title>;
  },

  getEvent(eventId: string, appProps: AppProps) {
    return appProps.events.find(event => event._id === eventId);
  },

  async getInitialRouteProps(query, appPropsPromise, isServer) {
    const appProps = await appPropsPromise;
    const event = this.getEvent(query.id, appProps);
    const eventFeature = event.meetingPoint;

    return {
      ...appProps,
      event,
      feature: eventFeature,
      featureId: event._id,
    };
  },
};

export default EventDetailData;
