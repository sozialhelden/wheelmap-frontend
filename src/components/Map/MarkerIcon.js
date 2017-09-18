// @flow

import L from 'leaflet';
import * as React from 'react';
import ReactDOM from 'react-dom';
import queryString from 'query-string';
import * as categoryIcons from '../icons/categories';
import { getQueryParams } from '../../lib/queryParams';
import getIconNameForProperties from './getIconNameForProperties';
import { getColorForWheelchairAccessibility } from '../../lib/colors';


// Extend Leaflet-icon to support colors and category images

export default class MarkerIcon extends L.Icon {
  constructor(options: typeof L.Icon.options) {
    const defaults = {
      number: '',
      shadowUrl: null,
      iconSize: new L.Point(19, 19),
      iconAnchor: new L.Point(11, 11),
      popupAnchor: new L.Point(11, 11),
      tooltipAnchor: new L.Point(11, 37),
    };

    super(Object.assign(defaults, options));
  }

  createIcon() {
    const link = document.createElement('a');
    const properties = this.options.feature.properties;
    const href = `/beta/nodes/${properties.id || properties._id}`;
    link.href = href;

    const iconName = getIconNameForProperties(properties) || 'place';

    const IconComponent = categoryIcons[iconName];
    if (IconComponent) {
      ReactDOM.render(<IconComponent />, link);
    }

    link.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      const params = getQueryParams();
      this.options.history.push(`${href}#?${queryString.stringify(params)}`);
    });
    this._setIconStyles(link, 'icon');

    const color = getColorForWheelchairAccessibility(properties);
    link.classList.add('ac-marker');
    link.classList.add(`ac-marker-${color}`);
    return link;
  }

  createShadow() { // eslint-disable-line class-methods-use-this
    return null;
  }
}
