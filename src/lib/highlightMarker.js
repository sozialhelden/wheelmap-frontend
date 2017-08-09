// @flow

import L from 'leaflet';
import React from 'react';
import ReactDOM from 'react-dom';
import * as categoryIcons from '../components/icons/categories';

let currentHighlightedMarker: ?HTMLELement = null;

export function removeCurrentHighlightedMarker() {
  if (!currentHighlightedMarker) return;
  const markerEl = currentHighlightedMarker.getElement();
  if (!markerEl) {
    currentHighlightedMarker = null;
    return;
  }
  markerEl.classList.remove('ac-marker-current');
  const bigMarkerDiv = markerEl.getElementsByClassName('ac-big-icon-marker')[0];
  if (bigMarkerDiv) {
    ReactDOM.unmountComponentAtNode(bigMarkerDiv);
    markerEl.removeChild(bigMarkerDiv);
  }
  currentHighlightedMarker = null;
}

export default function highlightMarker(marker: L.Marker) {
  if (marker === currentHighlightedMarker) return;
  removeCurrentHighlightedMarker();
  currentHighlightedMarker = marker;

  const IconComponent = categoryIcons[marker.options.icon.options.iconName || 'undefined'];
  const bigMarkerDiv = document.createElement('div');
  bigMarkerDiv.className = `${marker.options.icon.options.className} ac-big-icon-marker`;
  const markerEl = marker.getElement();
  if (!markerEl) {
    currentHighlightedMarker = null;
    return;
  }
  markerEl.appendChild(bigMarkerDiv);
  markerEl.classList.add('ac-marker-current');
  if (IconComponent) {
    ReactDOM.render(<IconComponent />, bigMarkerDiv);
  }
}
