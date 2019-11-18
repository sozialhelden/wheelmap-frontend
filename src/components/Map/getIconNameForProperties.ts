import Categories, { CategoryLookupTables } from '../../lib/Categories';
import { NodeProperties, isWheelmapProperties } from '../../lib/Feature';
import includes from 'lodash/includes';

export default function getIconNameForProperties(
  lookup: CategoryLookupTables,
  properties: NodeProperties
) {
  let givenNodeTypeId = null
  if (isWheelmapProperties(properties)) {
    givenNodeTypeId = properties.node_type ? properties.node_type.identifier : null;
  }

  let givenCategoryId = null;
  if (typeof properties.category === 'string') {
    if (includes(['escalator', 'elevator'], properties.category)) {
      return properties.category;
    }
    givenCategoryId = properties.category;
  }
  if (properties.category && typeof properties.category === 'object') {
    givenCategoryId = properties.category.identifier;
  }
  let categoryIdOrSynonym = givenNodeTypeId || givenCategoryId;
  if (categoryIdOrSynonym === '2nd_hand') {
    categoryIdOrSynonym = 'second_hand';
  }

  const category = categoryIdOrSynonym ? Categories.getCategory(lookup, categoryIdOrSynonym) : null;
  return category ? category._id : null;
}
