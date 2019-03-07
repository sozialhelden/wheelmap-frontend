// @flow

import L from 'leaflet';
import * as React from 'react';
import ReactDOM from 'react-dom';
import * as categoryIcons from '../icons/categories';
import getIconNameForProperties from './getIconNameForProperties';
import { isWheelchairAccessible, accessibilityName } from '../../lib/Feature';
import type { NodeProperties } from '../../lib/Feature';
import { translatedStringFromObject } from '../../lib/i18n';
import MarkerIcon from './MarkerIcon';
import Icon from '../Icon';
import { type CategoryLookupTables } from '../../lib/Categories';
import type { Feature } from '../../lib/Feature';

// Extend Leaflet-icon to support colors and category images

type Options = typeof L.Icon.options & {
  onClick: (featureId: string, properties: ?NodeProperties) => void,
  hrefForFeature: (featureId: string) => ?string,
  feature: Feature,
  categories: CategoryLookupTables,
  highlighted?: boolean,
};

export default class A11yMarkerIcon extends MarkerIcon {
  options: Options;

  createIcon() {
    const link = document.createElement('a');
    const { feature, categories } = this.options;
    const properties = feature.properties;
    const featureId = properties.id || properties._id || feature._id;
    link.href = this.options.hrefForFeature(featureId);

    const iconName = categories
      ? getIconNameForProperties(categories, properties) || 'place'
      : 'event';

    const iconClassNames = `marker-icon${this.options.highlighted ? ' highlighted-marker' : ''}`;

    const accessibility = isWheelchairAccessible(properties);
    const IconComponent = categoryIcons[iconName];
    if (IconComponent) {
      ReactDOM.render(
        <Icon
          className={iconClassNames}
          accessibility={accessibility}
          category={iconName}
          size={this.options.highlighted ? 'big' : 'small'}
          withArrow={this.options.highlighted}
          shadowed={this.options.highlighted}
          centered
          ariaHidden={this.options.highlighted}
        />,
        link
      );
    }
    link.style.touchAction = 'none';
    link.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this.options.onClick(featureId, properties);
    });
    this._setIconStyles(link, 'icon');

    const wheelchairAccessibilityText = accessibilityName(isWheelchairAccessible(properties));

    const accessibleName = `${String(translatedStringFromObject(properties.name))} ${String(
      wheelchairAccessibilityText
    )}`;
    link.setAttribute('aria-label', accessibleName);
    return link;
  }
}
