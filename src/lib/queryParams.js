// @flow

import queryString from 'query-string';


export function getQueryParams() {
  return queryString.parse(window.location.hash.replace(/^#?\/?\??/, ''));
}


export function setQueryParams(newParams: {}) {
  const params = getQueryParams();
  const newString = queryString.stringify(Object.assign(params, newParams));
  window.location.hash = `/?${newString}`;
}
