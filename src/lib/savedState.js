// @flow

import storage from 'local-storage-fallback';
import debounce from 'lodash/debounce';
import uuidv4 from 'uuid/v4';

const lastMoveDateString = storage.getItem('wheelmap.map.lastMoveDate');

const initialPropsCategoryDataString = storage.getItem('wheelmap.initialProps.rawCategoryLists');
const initialPropsClientSideConfigurationString = storage.getItem(
  'wheelmap.initialProps.clientSideConfiguration'
);

const hasInitialProps = !!(
  initialPropsCategoryDataString && initialPropsClientSideConfigurationString
);

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
        clientSideConfiguration: JSON.parse(initialPropsClientSideConfigurationString),
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

export function setAnalyticsAllowed(value: boolean) {
  if (value === false) {
    storage.removeItem('wheelmap.userUUID');
  } else {
    if (!storage.getItem('wheelmap.userUUID')) {
      storage.setItem('wheelmap.userUUID', uuidv4());
    }
  }

  storage.setItem('wheelmap.analyticsAllowed', value ? 'true' : 'false');
  notifyListeners();
}

export function getUUID() {
  return storage.getItem('wheelmap.userUUID');
}
