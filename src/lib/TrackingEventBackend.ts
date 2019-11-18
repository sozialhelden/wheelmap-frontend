import pick from 'lodash/pick';
import { globalFetchManager } from './FetchManager';
import { getUserAgent } from './userAgent';
import { hasAllowedAnalytics, getUUID, getJoinedMappingEventId } from './savedState';
import { userPositionTracker } from './UserPositionTracker';
import { mappingEventsCache } from './cache/MappingEventsCache';
import { App } from './App';
import env from './env';

export type Query = {
  [k: string]: string | Array<string> | null,
};

export type AttributeChangedTrackingEvent = {
  type: 'AttributeChanged',
  attributePath: string,
  previousValue?: any,
  newValue: any,
  category: string,
  parentCategory?: string,
  placeInfoId?: string | number,
  organizationId?: string,
  appId?: string
};

export type SurveyCompletedTrackingEvent = {
  type: 'SurveyCompleted',
  uniqueSurveyId: string,
};

export type AppOpenedTrackingEvent = {
  type: 'AppOpened',
  query: Query,
};

export type MappingEventJoinedTrackingEvent = {
  type: 'MappingEventJoined',
  joinedMappingEventId: string,
  joinedVia: 'url' | 'button',
  query: Query,
  emailAddress?: string | null,
  invitationToken?: string | null,
};

export type MappingEventLeftTrackingEvent = {
  type: 'MappingEventLeft',
  leftMappingEventId: string,
  query: Query,
  emailAddress?: string | null,
  invitationToken?: string | null,
};

export type TrackingEvent =
  | AttributeChangedTrackingEvent
  | SurveyCompletedTrackingEvent
  | AppOpenedTrackingEvent
  | MappingEventJoinedTrackingEvent
  | MappingEventLeftTrackingEvent;

export default class TrackingEventBackend {
  async track(app: App, event: TrackingEvent): Promise<boolean> {
    const joinedMappingEventId = getJoinedMappingEventId();
    const mappingEvent =
      joinedMappingEventId && (await mappingEventsCache.getMappingEvent(app, joinedMappingEventId));

    // get userLocation
    const userLocation = userPositionTracker.userLocation;

    // determine userUUID
    const userUUID = getUUID();

    const body = JSON.stringify({
      ...event,
      appId: app._id,
      mappingEvent:
        mappingEvent &&
        pick(mappingEvent, '_id', 'name', 'organizationId', 'appId', 'startTime', 'endTime'),
      userUUID,
      timestamp: Math.round(Date.now() / 1000),
      userAgent: getUserAgent(),
      userLocation: userLocation && {
        type: 'Point',
        coordinates: [userLocation.coords.longitude, userLocation.coords.latitude],
      },
    });

    const fetchRequest = {
      body,
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    const fetchUrl = `${env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL}/tracking-events/report?appToken=${app.tokenString}`;

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
