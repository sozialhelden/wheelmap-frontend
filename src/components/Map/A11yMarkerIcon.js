// @flow

import L, { type IconOptions } from 'leaflet';
import * as React from 'react';
import * as categoryIcons from '../icons/categories';
import getIconNameForProperties from './getIconNameForProperties';
import { isWheelchairAccessible, accessibilityName } from '../../lib/Feature';
import MarkerIcon from './MarkerIcon';
import Icon from '../Icon';
import { type CategoryLookupTables } from '../../lib/Categories';
import { translatedStringFromObject } from '../../lib/i18n';
import type { Feature } from '../../lib/Feature';

type Options = IconOptions & {
  href: string,
  onClick: () => void,
  highlighted?: boolean,
  feature: Feature,
  categories: CategoryLookupTables,
};

export default class A11yMarkerIcon extends MarkerIcon {
  constructor(options: Options) {
    const { feature, categories, highlighted, ...restOptions } = options;

    const iconAnchorOffset = highlighted ? new L.Point(0, 21.5) : new L.Point(0, 1.5);

    const accessibility = isWheelchairAccessible(feature.properties);
    const iconName = getIconNameForProperties(categories, feature.properties);
    const wheelchairAccessibilityText = accessibilityName(
      isWheelchairAccessible(feature.properties)
    );
    const accessibleName = `${String(translatedStringFromObject(feature.properties.name))} ${String(
      wheelchairAccessibilityText
    )}`;

    super({ iconAnchorOffset, highlighted, accessibleName, ...restOptions });

    const hasIcon = !!categoryIcons[iconName];
    this.iconSvgElement = (
      <Icon
        accessibility={accessibility}
        category={hasIcon ? iconName : 'other'}
        size={highlighted ? 'big' : 'small'}
        withArrow={highlighted}
        shadowed={highlighted}
        centered
        ariaHidden={highlighted}
      />
    );
  }
}
