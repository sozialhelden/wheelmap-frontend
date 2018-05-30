// @flow

import queryString from 'query-string';
import type { RouterHistory } from 'react-router-dom';

export function getQueryParams() {
  const result = {};
  if (window.location.hash.match(/\?/)) {
    Object.assign(result, queryString.parse(window.location.hash.replace(/^.*#/, '').replace(/^.*\?/, '')));
  } else if (window.location.search.match(/\?/)) {
    Object.assign(result, queryString.parse(window.location.search.replace(/^\?/, '')));
  }
  return result;
}


export function setQueryParams(history: RouterHistory, newParams: {}) {
  const params = getQueryParams();
  const changedParams = Object.assign(params, newParams);
  const keysToDelete = Object.keys(changedParams).filter(key => changedParams[key] === null);
  keysToDelete.forEach(key => delete changedParams[key]);
  const newString = queryString.stringify(changedParams);
  const location = { pathname: history.location.pathname, search: `?${newString}` };
  const href = history.createHref(location);
  history.replace(location);
}
