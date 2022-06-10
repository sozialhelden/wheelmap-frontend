import { EquipmentProperties, PlaceProperties } from '@sozialhelden/a11yjson';
import Categories, { CategoryLookupTables } from '../../lib/Categories';

export default function getIconNameForProperties(
  lookup: CategoryLookupTables,
  properties: PlaceProperties | EquipmentProperties
) {
  if (!properties) {
    return null;
  }
  let categoryIdOrSynonym = null;
  if (typeof properties.category === 'string') {
    if (['escalator', 'elevator'].includes(properties.category)) {
      return properties.category;
    }
    categoryIdOrSynonym = properties.category;
  }

  if (categoryIdOrSynonym === '2nd_hand') {
    categoryIdOrSynonym = 'second_hand';
  }

  const category = categoryIdOrSynonym ? Categories.getCategory(lookup, categoryIdOrSynonym) : null;
  return category ? category._id : null;
}
