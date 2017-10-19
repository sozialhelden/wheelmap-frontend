// @flow

const lastMoveDateString = localStorage.getItem('wheelmap.map.lastMoveDate');

const savedState = {
  map: {
    lastCenter: ['lat', 'lon']
      .map(coordinate => localStorage.getItem(`wheelmap.map.lastCenter.${coordinate}`)),
    lastMoveDateString,
    lastMoveDate: lastMoveDateString && new Date(lastMoveDateString),
    lastZoom: localStorage.getItem('wheelmap.map.lastZoom'),
  }
};

export default savedState;

export function saveState(key: string, value: string) {
  localStorage.setItem(`wheelmap.${key}`, value);
}
