// @flow

import type { RouterHistory } from 'react-router-dom';
import { isFiltered } from '../../lib/Feature';
import { newLocationWithReplacedQueryParams, getQueryParams } from '../../lib/queryParams';
import type { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/Feature';


type Params = {
  history: RouterHistory,
  category: ?string,
  accessibilityFilter: ?YesNoLimitedUnknown[],
  toiletFilter: ?YesNoUnknown[],
};


export default function urlForFilters({ history, category, accessibilityFilter, toiletFilter }: Params) {
  const queryParams = getQueryParams();
  let newQueryParams: { [string]: ?string } = Object.assign({}, queryParams, { toilet: null, status: null });

  const hasStatusParameter = accessibilityFilter && isFiltered(accessibilityFilter);
  const hasToiletParameter = toiletFilter && toiletFilter.length;
  const status = hasStatusParameter ? (accessibilityFilter || []).sort().join('.') : null;
  const toilet = hasToiletParameter ? (toiletFilter || []).sort().join('.') : null;
  Object.assign(newQueryParams, { status, toilet });

  const location = newLocationWithReplacedQueryParams(history, newQueryParams);
  location.pathname = category ? `/beta/categories/${category}` : `/beta`;
  return location;
}
