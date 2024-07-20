import L, { IconOptions } from 'leaflet';
import { CategoryLookupTables } from '../../lib/Categories';
import { EquipmentInfo } from '../../lib/EquipmentInfo';
import { accessibilityName, Feature, isWheelchairAccessible } from '../../lib/Feature';
import { translatedStringFromObject } from '../../lib/i18n';
import CategoryIcon from '../Icon';
import * as categoryIcons from '../icons/categories';
import getEquipmentInfoDescription from '../NodeToolbar/Equipment/getEquipmentInfoDescription';
import getIconNameForProperties from './getIconNameForProperties';
import MarkerIcon from './MarkerIcon';

type Options = IconOptions & {
  href: string;
  onClick: () => void;
  highlighted?: boolean;
  feature: Feature | EquipmentInfo;
  categories: CategoryLookupTables;
};

export default class A11yMarkerIcon extends MarkerIcon {
  constructor(options: Options) {
    const { feature, categories, highlighted, ...restOptions } = options;

    const iconAnchorOffset = highlighted ? new L.Point(0, 21.5) : new L.Point(0, 1.5);

    const accessibility = isWheelchairAccessible(feature.properties);
    const iconName = getIconNameForProperties(categories, feature.properties);
    const placeName = translatedStringFromObject(feature.properties?.name);
    const equipmentDescription = feature && getEquipmentInfoDescription(feature, "longDescription");
    const wheelchairAccessibilityText = accessibilityName(
      isWheelchairAccessible(feature.properties)
    );
    const accessibleName = equipmentDescription || `${placeName}, ${String(
      wheelchairAccessibilityText
    )}`;

    super({ iconAnchorOffset, highlighted, accessibleName, ...restOptions });

    const hasIcon = !!categoryIcons[iconName];
    this.iconSvgElement = (
      <CategoryIcon
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
