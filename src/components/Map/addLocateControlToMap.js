// @flow

import { t } from 'c-3po';
import L from 'leaflet';
import LeafletLocateControl from 'leaflet.locatecontrol/src/L.Control.Locate';
import 'leaflet.locatecontrol';

import savedState, { saveState } from '../../lib/savedState';

window.L = L;

export default function addLocateControlToMap(map: L.Map) {
  const control = new LeafletLocateControl({
    position: 'topright',
    icon: 'leaflet-icon-locate',
    iconLoading: 'leaflet-icon-locate-loading',
    showPopup: false,
    // do not follow user
    setView: false, 
    clickBehavior: { 
      // only disable when pos is on screen
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
      enableHighAccuracy: true,
      watch: true,
      // do not follow user 2
      setView: false, 
    },
  }).addTo(map);
  
  // save state change on click
  L.DomEvent.on(control._link, 'click', () => {
    savedState.map.locate = control._active;
    saveState({ 'map.locate': savedState.map.locate ? 'true' : 'false' });
  });

  // re-enable last state
  if (savedState.map.locate) {
    control.start();
  }
}
