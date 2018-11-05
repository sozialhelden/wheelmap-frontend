// @flow

import L from 'leaflet';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { color as d3Color } from 'd3-color';
import { interpolateWheelchairAccessibilityColors } from '../../lib/colors';
import isSamePlace from './isSamePlace';
import getIconNameForProperties from './getIconNameForProperties';
import * as categoryIcons from '../icons/categories';

export default class ClusterIcon extends L.Icon {
  constructor(options: typeof L.Icon.options) {
    const defaults = {
      number: '',
      shadowUrl: null,
      className: 'leaflet-div-icon accessiblity ac-marker ac-marker-cluster',
      iconSize: new L.Point(20, 20),
      iconAnchor: new L.Point(11, 11),
      popupAnchor: new L.Point(11, 11),
    };

    super(Object.assign(defaults, options));
  }

  createIcon() {
    const div = document.createElement('div');
    const propertiesArray = this.options.propertiesArray;
    const categories = this.options.categories;

    if (isSamePlace(propertiesArray)) {
      const iconNames = propertiesArray
        .map(p => getIconNameForProperties(categories, p))
        .filter(Boolean);
      const IconComponent = categoryIcons[iconNames[0] || 'undefined'];
      if (IconComponent) {
        ReactDOM.render(<IconComponent />, div);
      }
    } else {
      div.innerHTML = String(propertiesArray.length);
    }

    div.style.backgroundColor =
      this.options.backgroundColor ||
      d3Color(interpolateWheelchairAccessibilityColors(propertiesArray));
    const count = propertiesArray.length;
    this._setIconStyles(div, 'icon');

    if (count >= 500) {
      div.classList.add('over-fivehundred');
    } else if (count >= 100) {
      div.classList.add('over-hundred');
    } else if (count >= 50) {
      div.classList.add('over-fifty');
    }
    return div;
  }

  createShadow() {
    // eslint-disable-line class-methods-use-this
    return null;
  }
}
