// @flow

import queryString from 'query-string';
import type { RouterHistory } from 'react-router-dom';

export function getQueryParams() {
  return queryString.parse(window.location.hash.replace(/^#?\/?\??/, ''));
}


export function setQueryParams(history: RouterHistory, newParams: {}) {
  const params = getQueryParams();
  const changedParams = Object.assign(params, newParams);
  const keysToDelete = Object.keys(changedParams).filter(key => changedParams[key] === null);
  keysToDelete.forEach(key => delete changedParams[key]);
  const newString = queryString.stringify(changedParams);
  const newHash = `#?${newString}`;
  history.replace({ hash: newHash });
}
