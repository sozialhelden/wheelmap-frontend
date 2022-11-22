import omit from 'lodash/omit';
import { MinimalAccessibility } from './Feature';
import { removeNullAndUndefinedFields } from './Feature';
import { cloneDeep } from 'lodash';
import pathsInObject from './pathsInObject';

/**
 * Remove A11yJSON fields/subtrees that are not intended to be displayed to the user.
 *
 * @returns a better structure to represent in the UI than the basic tree structure would provide.
 */

export default function filterAccessibility(
  inputProperties: MinimalAccessibility
): Partial<MinimalAccessibility> {
  const removedPathPatterns = [
    /^partiallyAccessibleWith.wheelchair$/,
    /^accessibleWith.wheelchair$/,
    /^areas.\d+.restrooms.\d+.isAccessibleWithWheelchair$/,
    /^restrooms.0.isAccessibleWithWheelchair$/,
    /^areas.\d+.entrances.\d+.isLevel$/,
    /^entrances.\d+.isLevel$/,
    /^entrances.\d+.geometry$/,
  ];
  const properties = cloneDeep(inputProperties);
  const removedPaths = pathsInObject(properties).filter(path => {
    return removedPathPatterns.some(pattern => pattern.test(path));
  });

  // TODO: check why called twice
  let result = removeNullAndUndefinedFields(
    removeNullAndUndefinedFields(omit(properties, removedPaths))
  );

  // if the PoI only has one marked area, move root one level down
  if (result && result.areas && result.areas.length === 1) {
    result = result.areas[0];
  }

  return result;
}
