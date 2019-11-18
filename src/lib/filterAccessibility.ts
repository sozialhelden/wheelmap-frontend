import omit from 'lodash/omit';
import { MinimalAccessibility } from './Feature';
import { removeNullAndUndefinedFields } from './Feature';

/** @returns a better structure to represent in the UI than the basic tree structure would provide. */

export default function filterAccessibility(properties: MinimalAccessibility): Partial<MinimalAccessibility> {
  const paths = [
    'partiallyAccessibleWith.wheelchair',
    'accessibleWith.wheelchair',
    'areas.0.restrooms.0.isAccessibleWithWheelchair',
    'areas.0.entrances.0.isLevel',
  ];
  // TODO: check why called twice
  let result = removeNullAndUndefinedFields(removeNullAndUndefinedFields(omit(properties, paths)));

  // if the PoI only has one marked area, move root one level down
  if (result && result.areas && result.areas.length === 1) {
    result = result.areas[0];
  }
  return result;
}
