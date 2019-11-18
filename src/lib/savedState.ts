// @flow

import storage from 'local-storage-fallback';
import debounce from 'lodash/debounce';
import uuidv4 from 'uuid/v4';

const lastMoveDateString = storage.getItem('wheelmap.map.lastMoveDate');

const initialPropsCategoryDataString = storage.getItem('wheelmap.initialProps.rawCategoryLists');
const initialPropsAppString = storage.getItem('wheelmap.initialProps.app');

const hasInitialProps = !!(initialPropsCategoryDataString && initialPropsAppString);

const savedState = {
  map: {
    lastCenter: ['lat', 'lon'].map(coordinate =>
      storage.getItem(`wheelmap.map.lastCenter.${coordinate}`)
    ),
    lastMoveDateString,
    lastMoveDate: lastMoveDateString && new Date(lastMoveDateString),
    lastZoom: storage.getItem('wheelmap.map.lastZoom'),
    locate: storage.getItem('wheelmap.map.locate') === 'true',
  },
  initialProps: hasInitialProps
    ? {
        rawCategoryLists: JSON.parse(initialPropsCategoryDataString),
        app: JSON.parse(initialPropsAppString),
      }
    : null,
};

export default savedState;

const _listeners = new Set<() => void>();

export function addListener(l: () => void) {
  _listeners.add(l);
}

export function removeListener(l: () => void) {
  _listeners.delete(l);
}

const notifyListeners = debounce(() => {
  _listeners.forEach(l => {
    try {
      l();
    } catch (e) {
      console.error('Error in event handler', l, e);
    }
  });
}, 100);

export function saveState(state: { [key: string]: string }) {
  Object.keys(state).forEach(key => storage.setItem(`wheelmap.${key}`, state[key]));
  notifyListeners();
}

export function isFirstStart() {
  return storage.getItem('wheelmap.onboardingCompleted') !== 'true';
}

export function hasOpenedLocationHelp() {
  return storage.getItem('wheelmap.hasOpenedLocationHelp') === 'true';
}

export function shouldLocate() {
  return storage.getItem('wheelmap.map.locate') === 'true';
}

export function hasAllowedAnalytics() {
  return storage.getItem('wheelmap.analyticsAllowed') === 'true';
}

export function setThirdPartyAnalyticsAllowed(value: boolean) {
  storage.setItem('wheelmap.analyticsAllowed', value ? 'true' : 'false');
  notifyListeners();
}

export function getUUID() {
  let result = storage.getItem('wheelmap.userUUID');
  if (!result) {
    result = uuidv4();
    storage.setItem('wheelmap.userUUID', result);
    notifyListeners();
  }

  return result;
}

export function resetUUID() {
  storage.removeItem('wheelmap.userUUID');
  notifyListeners();
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

export function setJoinedMappingEventData(emailAddress: string = null, invitationToken: string = null) {
  const current = getJoinedMappingEventData();
  current.invitationToken = invitationToken;
  current.emailAddress = emailAddress || current.emailAddress;
  storage.setItem('wheelmap.joinedMappingEventData', JSON.stringify(current));
}
