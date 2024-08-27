import { Accessibility } from '@sozialhelden/a11yjson';
import { cloneDeep, isEqual } from 'lodash';
import omit from 'lodash/omit';
import { removeNullAndUndefinedFields } from '../../util/removeNullAndUndefinedFields';
import {
  YesNoLimitedUnknown,
  YesNoUnknown,
  yesNoLimitedUnknownArray,
  yesNoUnknownArray,
} from './Feature';

/** @returns a better structure to represent in the UI than the basic tree structure would provide. */

export default function filterAccessibility(
  properties: Accessibility,
): Partial<Accessibility> {
  const paths = [
    'partiallyAccessibleWith.wheelchair',
    'accessibleWith.wheelchair',
    'areas.0.restrooms.0.isAccessibleWithWheelchair',
    'restrooms.0.isAccessibleWithWheelchair',
    'areas.0.entrances.0.isLevel',
    'entrances.0.isLevel',
  ];
  const props = cloneDeep(properties);
  // TODO: check why called twice
  let result = removeNullAndUndefinedFields(
    removeNullAndUndefinedFields(omit(props, paths)),
  );

  // if the PoI only has one marked area, move root one level down
  if (result && result.areas && result.areas.length === 1) {
    result = result.areas[0];
  }
  return result;
}

function sortedIsEqual(array1: any[], array2: any[]): boolean {
  return isEqual([].concat(array1).sort(), [].concat(array2).sort());
}

function parseStatusString(
  statusStringOrStringArray: string | string[],
  allowedStatuses: string[],
) {
  let statusStringArray = [];
  if (typeof statusStringOrStringArray === 'string') {
    statusStringArray = statusStringOrStringArray.split(',');
  }
  // Safe mutable sort as filter always returns a new array.
  return statusStringArray
    ? statusStringArray.filter((s) => allowedStatuses.includes(s)).sort()
    : // No explicitly set filter means all status values are allowed.
    [...allowedStatuses];
}

export function getAccessibilityFilterFrom(
  statusString?: string | string[],
): YesNoLimitedUnknown[] {
  return parseStatusString(statusString, yesNoLimitedUnknownArray);
}

export function getToiletFilterFrom(
  toiletString?: string | string[],
): YesNoUnknown[] {
  return parseStatusString(toiletString, yesNoUnknownArray);
}

/**
 * @returns `true` if the given array of accessibility values is actually filtering PoIs
 * (which is not the case if it just contains all existing accessibility values), `false` otherwise.
 */

export function isAccessibilityFiltered(
  accessibilityFilter: YesNoLimitedUnknown[] | null,
): boolean {
  return (
    !!accessibilityFilter
    && !isEqual(accessibilityFilter, [])
    && !sortedIsEqual(accessibilityFilter, yesNoLimitedUnknownArray)
  );
}

export function isToiletFiltered(toiletFilter: YesNoUnknown[] | null): boolean {
  return (
    !!toiletFilter
    && !isEqual(toiletFilter, [])
    && !sortedIsEqual(toiletFilter, yesNoUnknownArray)
  );
}
