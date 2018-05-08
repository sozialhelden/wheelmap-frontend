// @flow

import L from 'leaflet';
import * as React from 'react';
import ReactDOM from 'react-dom';
import * as categoryIcons from '../icons/categories';
import getIconNameForProperties from './getIconNameForProperties';
import { isWheelchairAccessible, accessibilityName } from '../../lib/Feature';
import type { NodeProperties } from '../../lib/Feature';
import { translatedStringFromObject } from '../../lib/i18n';
import Icon from '../Icon';

// Extend Leaflet-icon to support colors and category images

type Options = typeof L.Icon.options & {
  onClick: ((featureId: string, properties: ?NodeProperties) => void),
  hrefForFeature: ((featureId: string) => ?string),
};

export default class MarkerIcon extends L.Icon {
  constructor(options: Options) {
    // increased tap region for icons, rendered size might differ
    const size = 80;
    const defaults = {
      number: '',
      shadowUrl: null,
      iconSize: new L.Point(size, size),
      iconAnchor: new L.Point(size * .5, size * .5 + 1.5),
      popupAnchor: new L.Point(size * .5, size * .5),
      tooltipAnchor: new L.Point(size * .5, size * .5 + 25),
      onClick: ((featureId: string, properties: ?NodeProperties) => {}),
      hrefForFeature: ((featureId: string) => null),
    };

    super(Object.assign(defaults, options));
  }

  createIcon() {
    const link = document.createElement('a');
    const feature = this.options.feature;
    const properties = feature.properties;
    const featureId = properties.id || properties._id || feature._id;
    link.href = this.options.hrefForFeature(featureId);

    const iconName = getIconNameForProperties(properties) || 'place';
    const accessibility = isWheelchairAccessible(properties);
    const IconComponent = categoryIcons[iconName];
    if (IconComponent) {
      ReactDOM.render(
        <Icon
          accessibility={accessibility}
          properties={properties}
          category={iconName}
          size='small'
          shadowed
          ariaHidden={true}
        />,
        link,
      );
    }

    link.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this.options.onClick(featureId, properties);
    });
    this._setIconStyles(link, 'icon');

    const wheelchairAccessibilityText = accessibilityName(isWheelchairAccessible(properties));

    const accessibleName = `${translatedStringFromObject(properties.name)} ${wheelchairAccessibilityText}`
    link.setAttribute('aria-label', accessibleName)
    return link;
  }

  createShadow() { // eslint-disable-line class-methods-use-this
    return null;
  }
}
