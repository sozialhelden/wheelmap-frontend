// @flow

import L from 'leaflet';
import * as React from 'react';
import ReactDOM from 'react-dom';
import * as categoryIcons from '../components/icons/categories';

let currentHighlightedMarker: ?HTMLElement = null;

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

// Appends a big marker div as child element to the given marker's element.
// Returns `false` if the marker already was removed from the map, true if ther marker has been
// appended (or was appended already).
function appendBigMarkerDiv(marker: L.Marker, firstTime: boolean): boolean {
  const markerEl = marker.getElement();

  if (!markerEl) {
    // Parent marker element already removed from map
    return false;
  }

  if (markerEl.querySelector('.ac-big-icon-marker')) {
    // Big marker child <div> already appended
    return true;
  }

  console.log('Appending big marker')

  const IconComponent = categoryIcons[marker.options.icon.options.iconName || 'undefined'];
  const bigMarkerDiv = document.createElement('div');
  bigMarkerDiv.className = `${marker.options.icon.options.className} ac-big-icon-marker`;
  if (firstTime) {
    bigMarkerDiv.className += ' animated';
  }
  markerEl.appendChild(bigMarkerDiv);
  markerEl.classList.add('ac-marker-current');
  if (IconComponent) {
    ReactDOM.render(<IconComponent />, bigMarkerDiv);
  }
  return true;
}


export default function highlightMarker(marker: L.Marker, firstTime: boolean = true) {
  if (marker !== currentHighlightedMarker) removeCurrentHighlightedMarker();

  currentHighlightedMarker = marker;

  if (!appendBigMarkerDiv(marker, firstTime)) {
    currentHighlightedMarker = null;
  }
}
