// @flow

import L from 'leaflet';
import * as React from 'react';
import ReactDOM from 'react-dom';
import * as categoryIcons from '../icons/categories';
import MarkerIcon from './MarkerIcon';
import type { Feature } from '../../lib/Feature';
import getIconNameForProperties from './getIconNameForProperties';


type Options = typeof L.Marker.Options & {
  feature: Feature,
  onClick: ((featureId: string) => void),
  hrefForFeatureId: ((featureId: string) => string),
};


export default class HighlightableMarker extends L.Marker {
  constructor(latlng: L.LatLng, options: Options) {
    const defaults: Options = {
      icon: new MarkerIcon({
        hrefForFeatureId: options.hrefForFeatureId,
        onClick: options.onClick,
        feature: options.feature,
      }),
    };
    super(latlng, Object.assign(defaults, options));
  }


  unhighlight() {
    const markerEl = this.getElement();
    if (!markerEl) {
      return;
    }
    markerEl.classList.remove('ac-marker-current');
    const bigMarkerDiv = markerEl.getElementsByClassName('ac-big-icon-marker')[0];
    if (bigMarkerDiv) {
      ReactDOM.unmountComponentAtNode(bigMarkerDiv);
      markerEl.removeChild(bigMarkerDiv);
    }
  }


  // Appends a big marker div as child element to the given marker's element.
  // Returns `false` if the marker already was removed from the map, true if ther marker has been
  // appended (or was appended already).
  highlight(animated: boolean): boolean {
    const markerEl = this.getElement();

    if (!markerEl) {
      // Parent marker element already removed from map
      return false;
    }

    if (markerEl.querySelector('.ac-big-icon-marker')) {
      // Big marker child <div> already appended
      return true;
    }
    if (!this.options.feature) return false;

    const iconName = getIconNameForProperties(this.options.feature.properties);

    const IconComponent = categoryIcons[iconName || 'place'];
    const bigMarkerDiv = document.createElement('div');
    bigMarkerDiv.className = 'ac-big-icon-marker';
    if (animated) bigMarkerDiv.className += ' animated';
    markerEl.appendChild(bigMarkerDiv);
    markerEl.classList.add('ac-marker-current');
    if (IconComponent) {
      ReactDOM.render(<IconComponent />, bigMarkerDiv);
    }
    return true;
  }
}
