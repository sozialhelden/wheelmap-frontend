// @flow

import { t } from 'ttag';
import L from 'leaflet';
import LeafletLocateControl from 'leaflet.locatecontrol/src/L.Control.Locate';
import 'leaflet.locatecontrol';

import savedState, { saveState } from '../../lib/savedState';

window.L = L;

type Options = {
  locateOnStart: boolean,
  onLocationError: ((error: any) => void),
};

export default function addLocateControlToMap(map: L.Map, { locateOnStart, onLocationError, onClick }: Options) {
  const control = new LeafletLocateControl({
    onLocationError,
    position: 'topright',
    icon: 'leaflet-icon-locate',
    iconLoading: 'leaflet-icon-locate-loading',
    showPopup: false,
    setView: 'untilPan', // can be overridden by <Map />
    clickBehavior: {
      // only disable when position is on screen
      inView: 'stop',
      outOfView: 'setView'
    },
    circleStyle: {
      color: '#1fabd9',
      fillColor: '#1fabd9',
      fillOpacity: 0.1,
      opacity: 0.25,
    },
    markerStyle: {
      color: '#1fabd9',
      fillColor: '#1fabd9',
    },
    strings: {
      // translator: Locate button aria-label on the map
      title: t`Show me where I am`,
    },
    locateOptions: {
      enableHighAccuracy: false,
      watch: true,
      setView: locateOnStart,
      maxZoom: 17,
    },
  }).addTo(map);
  
  // save state change on click
  L.DomEvent.on(control._link, 'click', () => {
    savedState.map.locate = control._active;
    saveState({ 'map.locate': savedState.map.locate ? 'true' : 'false' });
    onClick();
  });

  // re-enable last state
  if (savedState.map.locate || locateOnStart) {
    control.start();
  }

  return control;
}
