// @flow

import env from './env';
import pick from 'lodash/pick';
import { globalFetchManager } from './FetchManager';
import { getUserAgent } from './userAgent';
import { hasAllowedAnalytics, getUUID, getJoinedMappingEventId } from './savedState';
import { userPositionTracker } from './UserPositionTracker';
import { mappingEventsCache } from '../lib/cache/MappingEventsCache';

export type AttributeChangedTrackingEvent = {
  type: 'AttributeChanged',
  attributePath: string,
  previousValue?: string | object | number,
  newValue: string | object | number,
  category: string,
  parentCategory?: string,
};

export type SurveyCompletedTrackingEvent = {
  type: 'SurveyCompleted',
  uniqueSurveyId: string,
};

export type TrackingEvent = AttributeChangedTrackingEvent | SurveyCompletedTrackingEvent;

export default class TrackingEventBackend {
  async track(event: TrackingEvent): Promise<boolean> {
    if (!hasAllowedAnalytics()) {
      return Promise.reject(false);
    }

    const joinedMappingEventId = getJoinedMappingEventId();
    const mappingEvent =
      joinedMappingEventId && (await mappingEventsCache.getMappingEvent(joinedMappingEventId));

    // get userLocation
    const userLocation = userPositionTracker.userLocation;

    // determine userUUID
    const userUUID = getUUID() || 'do-not-track';

    const body = JSON.stringify({
      ...event,
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

    const fetchUrl = `${
      env.public.accessibilityCloud.baseUrl.accessibilityApps
    }/tracking-events/report?appToken=${env.public.accessibilityCloud.appToken}`;

    const uploadPromise = new Promise((resolve, reject) => {
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
