// @flow

import L from 'leaflet';
import * as React from 'react';
import ReactDOM from 'react-dom';
import * as categoryIcons from '../icons/categories';
import getIconNameForProperties from './getIconNameForProperties';
import { getColorForWheelchairAccessibility } from '../../lib/colors';


// Extend Leaflet-icon to support colors and category images

type Options = typeof L.Icon.options & {
  onClick: ((featureId: string) => void),
  hrefForFeatureId: ((featureId: string) => ?string),
};

export default class MarkerIcon extends L.Icon {
  constructor(options: Options) {
    const defaults = {
      number: '',
      shadowUrl: null,
      iconSize: new L.Point(19, 19),
      iconAnchor: new L.Point(11, 11),
      popupAnchor: new L.Point(11, 11),
      tooltipAnchor: new L.Point(11, 37),
      onClick: ((featureId: string) => {}),
      hrefForFeatureId: ((featureId: string) => null),
    };

    super(Object.assign(defaults, options));
  }

  createIcon() {
    const link = document.createElement('a');
    const properties = this.options.feature.properties;
    const featureId = properties.id || properties._id;
    link.href = this.options.hrefForFeatureId(featureId);

    const iconName = getIconNameForProperties(properties) || 'place';

    const IconComponent = categoryIcons[iconName];
    if (IconComponent) {
      ReactDOM.render(<IconComponent />, link);
    }

    link.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this.options.onClick(featureId);
    });
    this._setIconStyles(link, 'icon');

    const color = getColorForWheelchairAccessibility(properties);
    link.classList.add('ac-marker');
    link.classList.add(`ac-marker-${color}`);

    link.setAttribute('aria-label', properties.name)
    return link;
  }

  createShadow() { // eslint-disable-line class-methods-use-this
    return null;
  }
}
