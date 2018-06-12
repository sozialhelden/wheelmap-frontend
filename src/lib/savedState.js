// @flow

const lastMoveDateString = localStorage.getItem('wheelmap.map.lastMoveDate');

const savedState = {
  map: {
    lastCenter: ['lat', 'lon']
      .map(coordinate => localStorage.getItem(`wheelmap.map.lastCenter.${coordinate}`)),
    lastMoveDateString,
    lastMoveDate: lastMoveDateString && new Date(lastMoveDateString),
    lastZoom: localStorage.getItem('wheelmap.map.lastZoom'),
    locate: localStorage.getItem('wheelmap.map.locate') === 'true',
  }
};

export default savedState;

export function saveState(state: { [string]: string }) {
  Object.keys(state)
    .forEach(key => localStorage.setItem(`wheelmap.${key}`, state[key]));
}
