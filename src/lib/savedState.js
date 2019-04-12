// @flow

import storage from 'local-storage-fallback';

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

export function saveState(state: { [key: string]: string }) {
  Object.keys(state).forEach(key => storage.setItem(`wheelmap.${key}`, state[key]));
}

export function isFirstStart() {
  return storage.getItem('wheelmap.onboardingCompleted') !== 'true';
}

export function hasOpenedLocationHelp() {
  return storage.getItem('wheelmap.hasOpenedLocationHelp') === 'true';
}

export function hasAllowedAnalytics() {
  return storage.getItem('wheelmap.analyticsAllowed') === 'true';
}

export function setAnalyticsAllowed(value: boolean) {
  return storage.setItem('wheelmap.analyticsAllowed', value ? 'true' : 'false');
}

export function getJoinedMappingEventId(): ?string {
  return JSON.parse(storage.getItem('wheelmap.joinedMappingEventId'));
}

export function setJoinedMappingEventId(mappingEventId: ?string) {
  storage.setItem('wheelmap.joinedMappingEventId', JSON.stringify(mappingEventId));
}
