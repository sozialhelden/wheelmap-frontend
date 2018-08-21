// @flow

import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';

export type PlaceFilterParams = {
  status: string;
  toilet: string;
};

export type PlaceFilter = {
  accessibilityFilter: YesNoLimitedUnknown[];
  toiletFilter: YesNoUnknown[];
};