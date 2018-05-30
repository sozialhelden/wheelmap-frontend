// @flow

import isEqual from 'lodash/isEqual';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';

export type FilterName = 'all' | 'partial' | 'full' | 'unknown';

export type PlaceFilterParams = {
  status: string,
  toilet: string,
};

export type PlaceFilter = {
  accessibilityFilter: YesNoLimitedUnknown[],
  toiletFilter: YesNoUnknown[],
};

function sortedIsEqual(array1, array2): boolean {
  return isEqual([].concat(array1).sort(), [].concat(array2).sort());
}

export function getFiltersForNamedFilter(name: FilterName): YesNoLimitedUnknown[] {
  switch (name) {
    case 'partial': return ['yes', 'limited'];
    case 'full': return ['yes'];
    case 'unknown': return ['unknown'];
    case 'all':
    default: return ['yes', 'limited', 'no', 'unknown'];
  }
}

export function getFilterNameForFilterList(list: YesNoLimitedUnknown[]): FilterName {
  if (sortedIsEqual(list, ['yes', 'limited'])) return 'partial';
  if (sortedIsEqual(list, ['yes'])) return 'full';
  if (sortedIsEqual(list, ['unknown'])) return 'unknown';
  if (sortedIsEqual(list, ['yes', 'limited', 'no', 'unknown']) || sortedIsEqual(list, [])) return 'all';
  return 'all';
}
