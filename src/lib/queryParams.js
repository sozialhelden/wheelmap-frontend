// @flow

import queryString from 'query-string';


export function getQueryParams() {
  return queryString.parse(window.location.hash.replace(/^#?\/?\??/, ''));
}


export function setQueryParams(newParams: {}) {
  const params = getQueryParams();
  const changedParams = Object.assign(params, newParams);
  const keysToDelete = Object.keys(changedParams).filter(key => changedParams[key] === null);
  keysToDelete.forEach(key => delete changedParams[key]);
  const newString = queryString.stringify(changedParams);
  window.location.hash = `/?${newString}`;
}
