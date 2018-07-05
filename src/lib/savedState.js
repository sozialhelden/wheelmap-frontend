// @flow

import storage from 'local-storage-fallback';

const lastMoveDateString = storage.getItem('wheelmap.map.lastMoveDate');

const savedState = {
  map: {
    lastCenter: ['lat', 'lon']
      .map(coordinate => storage.getItem(`wheelmap.map.lastCenter.${coordinate}`)),
    lastMoveDateString,
    lastMoveDate: lastMoveDateString && new Date(lastMoveDateString),
    lastZoom: storage.getItem('wheelmap.map.lastZoom'),
    locate: storage.getItem('wheelmap.map.locate') === 'true',
  }
};

export default savedState;

export function saveState(state: { [string]: string }) {
  Object.keys(state)
    .forEach(key => storage.setItem(`wheelmap.${key}`, state[key]));
}

export function isFirstStart() {
  return storage.getItem('wheelmap.onboardingCompleted') !== 'true';
}

export function hasOpenedLocationHelp() {
  return storage.getItem('wheelmap.hasOpenedLocationHelp') === 'true';
}