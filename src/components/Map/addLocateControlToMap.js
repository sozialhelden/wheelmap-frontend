// @flow

import L from 'leaflet';
import LeafletLocateControl from 'leaflet.locatecontrol/src/L.Control.Locate';
import 'leaflet.locatecontrol';

window.L = L;


export default function addLocateControlToMap(map: L.Map) {
  new LeafletLocateControl({
    position: 'topright',
    icon: 'leaflet-icon-locate',
    iconLoading: 'leaflet-icon-locate-loading',
    showPopup: false,
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
      title: 'Show me where I am',
    },
    locateOptions: {
      enableHighAccuracy: true,
    },
  }).addTo(map);
}
