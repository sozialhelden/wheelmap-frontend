// @flow

import Categories, { type CategoryLookupTables } from '../../lib/Categories';
import includes from 'lodash/includes';

export default function getIconNameForProperties(lookup: CategoryLookupTables, properties) {
  const givenNodeTypeId = properties.node_type ? properties.node_type.identifier : null;

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

  const category = Categories.getCategory(lookup, categoryIdOrSynonym);
  return category ? category._id : null;
}
