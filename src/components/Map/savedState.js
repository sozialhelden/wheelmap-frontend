// @flow

const lastMoveDateString = localStorage.getItem('wheelmap.lastMoveDate');

const savedState = {
  lastCenter: ['lat', 'lon']
    .map(coordinate => localStorage.getItem(`wheelmap.lastCenter.${coordinate}`)),
  lastMoveDateString,
  lastMoveDate: lastMoveDateString && new Date(lastMoveDateString),
  lastZoom: localStorage.getItem('wheelmap.lastZoom'),
};

export default savedState;

export function saveState(key: string, value: string) {
  localStorage.setItem(`wheelmap.${key}`, value);
}
