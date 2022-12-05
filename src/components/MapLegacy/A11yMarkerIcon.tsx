import L, { IconOptions } from "leaflet";
import * as React from "react";
import * as categoryIcons from "../icons/categories";
import getIconNameForProperties from "./getIconNameForProperties";
import MarkerIcon from "./MarkerIcon";
import { CategoryLookupTables } from "../../lib/model/ac/categories/Categories";
import { translatedStringFromObject } from "../../lib/i18n/translatedStringFromObject";
import Icon from "../shared/Icon";
import { Feature } from "geojson";
import { isWheelchairAccessible } from "../../lib/model/shared/isWheelchairAccessible";
import { accessibilityName } from "../../lib/model/accessibilityStrings";

type Options = IconOptions & {
  href: string;
  onClick: () => void;
  highlighted?: boolean;
  feature: Feature;
  categories: CategoryLookupTables;
};

export default class A11yMarkerIcon extends MarkerIcon {
  constructor(options: Options) {
    const { feature, categories, highlighted, ...restOptions } = options;

    const iconAnchorOffset = highlighted
      ? new L.Point(0, 21.5)
      : new L.Point(0, 1.5);

    const accessibility = isWheelchairAccessible(feature.properties);
    const iconName = getIconNameForProperties(categories, feature.properties);
    const wheelchairAccessibilityText = accessibilityName(
      isWheelchairAccessible(feature.properties)
    );
    const accessibleName = `${String(
      translatedStringFromObject(feature.properties.name)
    )} ${String(wheelchairAccessibilityText)}`;

    super({ iconAnchorOffset, highlighted, accessibleName, ...restOptions });

    const hasIcon = !!categoryIcons[iconName];
    this.iconSvgElement = (
      <Icon
        accessibility={accessibility}
        category={hasIcon ? iconName : "other"}
        size={highlighted ? "big" : "small"}
        withArrow={highlighted}
        shadowed={highlighted}
        centered
        ariaHidden={highlighted}
      />
    );
  }
}
