import { v4 as uuidv4 } from 'uuid';

import * as queryString from 'query-string';
import useSWR from 'swr';
import { trackEvent } from '../analytics/Analytics';
import { trackAccessibilityCloudEvent } from '../analytics/trackAccessibilityCloudEvent';
import { IApp } from '../model/ac/App';
import { MappingEvent } from '../model/ac/MappingEvent';
import { storage } from '../util/savedState';

export function trackMappingEventMembershipChanged(
  {
    app,
    reason,
    joinedMappingEvent,
    emailAddress,
    invitationToken,
    userUUID,
  }: {
  app: IApp;
  reason: 'url' | 'button';
  joinedMappingEvent?: MappingEvent;
  emailAddress?: string;
  invitationToken?: string;
  userUUID: string;
},
) {
  const joinedMappingEventId = joinedMappingEvent?._id;
  setJoinedMappingEventId(joinedMappingEventId);
  const { search } = window.location;

  if (joinedMappingEventId) {
    setJoinedMappingEventData(emailAddress, invitationToken);

    trackAccessibilityCloudEvent({
      userUUID,
      app,
      event: {
        invitationToken,
        emailAddress,
        type: 'MappingEventJoined',
        joinedMappingEventId,
        joinedVia: reason,
        query: queryString.parse(search),
      },
      mappingEvent: joinedMappingEvent,
    });

    trackEvent({
      category: 'MappingEvent',
      action: 'Joined',
      label: joinedMappingEventId,
    });
  }
}

export function getUUID() {
  let result = storage.getItem('wheelmap.userUUID');
  if (!result) {
    result = uuidv4();
    storage.setItem('wheelmap.userUUID', result);
  }

  return result;
}

export function resetUUID() {
  storage.removeItem('wheelmap.userUUID');
}

export function useCurrentMappingEventId() {
  return useSWR([null], getJoinedMappingEventId);
}

export function getJoinedMappingEventId(): string | null {
  return storage.getItem('wheelmap.joinedMappingEventId');
}

export function setJoinedMappingEventId(mappingEventId: string | null) {
  if (mappingEventId) {
    storage.setItem('wheelmap.joinedMappingEventId', mappingEventId);
  } else {
    storage.removeItem('wheelmap.joinedMappingEventId');
  }
}

type EventJoinData = {
  emailAddress: string | null,
  invitationToken: string | null,
};

export function getJoinedMappingEventData(): EventJoinData {
  try {
    return JSON.parse(storage.getItem('wheelmap.joinedMappingEventData')) || {};
  } catch {
    return { emailAddress: null, invitationToken: null };
  }
}

export function setJoinedMappingEventData(
  emailAddress: string = null,
  invitationToken: string = null,
) {
  const current = getJoinedMappingEventData();
  current.invitationToken = invitationToken;
  current.emailAddress = emailAddress || current.emailAddress;
  storage.setItem('wheelmap.joinedMappingEventData', JSON.stringify(current));
}
