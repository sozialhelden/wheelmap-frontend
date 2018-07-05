import omit from 'lodash/omit';
import type { MinimalAccessibility } from './Feature';
import { removeNullAndUndefinedFields } from './Feature';

/** @returns a better structure to represent in the UI than the basic tree structure would provide. */

export default function filterAccessibility(properties: MinimalAccessibility): ?MinimalAccessibility {
  const paths = [
    'partiallyAccessibleWith.wheelchair',
    'accessibleWith.wheelchair',
    'areas.0.restrooms.0.isAccessibleWithWheelchair',
    'areas.0.entrances.0.isLevel',
  ];
  return removeNullAndUndefinedFields(removeNullAndUndefinedFields(omit(properties, paths)));
}