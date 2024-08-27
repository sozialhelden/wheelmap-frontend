import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';

export function isDefined(x: unknown): boolean {
  return (
    typeof x !== 'undefined'
    && x !== null
    && !(isArray(x) && x.length === 0)
    && !(isPlainObject(x) && Object.keys(x).length === 0)
  );
}
