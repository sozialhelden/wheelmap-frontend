import pick from 'lodash/pick';
import { App } from './App';
import { mappingEventsCache } from './cache/MappingEventsCache';
import env from './env';
import { globalFetchManager } from './FetchManager';
import { getJoinedMappingEventId, getUUID } from './savedState';
import { getUserAgent } from './userAgent';

export type Query = {
  [k: string]: string | Array<string> | null,
};

export type BaseTrackingEvent = {
  geometry?: {
    type: 'Point',
    coordinates: number[],
  },
  longitude?: number,
  latitude?: number,
};

export type AttributeChangedTrackingEvent = BaseTrackingEvent & {
  type: 'AttributeChanged',
  attributePath: string,
  previousValue?: any,
  newValue: any,
  category: string,
  parentCategory?: string,
  placeInfoId?: string | number,
  organizationId?: string,
  appId?: string,
  osmId?: number,
  osmType?: string,
  featureUrl?: string,
};

export type SurveyCompletedTrackingEvent = BaseTrackingEvent & {
  type: 'SurveyCompleted',
  uniqueSurveyId: string,
};

export type ThanksDialogShownTrackingEvent = BaseTrackingEvent & {
  type: 'ThanksDialogShown',
  uniqueSurveyId: string,
};

export type AppOpenedTrackingEvent = BaseTrackingEvent & {
  type: 'AppOpened',
  query: Query,
};

export type MappingEventJoinedTrackingEvent = BaseTrackingEvent & {
  type: 'MappingEventJoined',
  joinedMappingEventId: string,
  joinedVia: 'url' | 'button',
  query: Query,
  emailAddress?: string | null,
  invitationToken?: string | null,
};

export type MappingEventLeftTrackingEvent = BaseTrackingEvent & {
  type: 'MappingEventLeft',
  leftMappingEventId: string,
  query: Query,
  emailAddress?: string | null,
  invitationToken?: string | null,
};

export type TrackingEvent =
  | AttributeChangedTrackingEvent
  | SurveyCompletedTrackingEvent
  | ThanksDialogShownTrackingEvent
  | AppOpenedTrackingEvent
  | MappingEventJoinedTrackingEvent
  | MappingEventLeftTrackingEvent;

export default class TrackingEventBackend {
  async track(app: App, event: TrackingEvent): Promise<boolean> {
    const joinedMappingEventId = getJoinedMappingEventId();
    const mappingEvent =
      joinedMappingEventId && (await mappingEventsCache.getMappingEvent(app, joinedMappingEventId));

    // determine userUUID
    const userUUID = getUUID();

    const body = JSON.stringify({
      ...event,
      appId: app._id,
      mappingEventId: joinedMappingEventId,
      mappingEvent:
        mappingEvent &&
        pick(mappingEvent, '_id', 'name', 'organizationId', 'appId', 'startTime', 'endTime'),
      userUUID,
      timestamp: Math.round(Date.now() / 1000),
      userAgent: getUserAgent(),
    });

    const fetchRequest = {
      body,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const fetchUrl = `${env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL}/tracking-events/report?appToken=${app.tokenString}`;

    const uploadPromise: Promise<boolean> = new Promise((resolve, reject) => {
      globalFetchManager
        .fetch(fetchUrl, fetchRequest)
        .then((response: Response) => {
          if (response.ok) {
            resolve(true);
          } else {
            reject('failed');
          }
        })
        .catch(reject)
        .catch(console.error);
    });

    return uploadPromise;
  }
}

export const trackingEventBackend = new TrackingEventBackend();
