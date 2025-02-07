import isPlainObject from "lodash/isPlainObject";
import { isDefined } from "./isDefined";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export function removeNullAndUndefinedFields<T extends {}>(
  something: T,
): DeepPartial<T>;
export function removeNullAndUndefinedFields<T extends []>(
  something: T,
): DeepPartial<T>;

/**
 * Recursively removes
 *
 * - all fields with `null` or `undefined` values from an object or array.
 * - empty arrays and objects.
 *
 * @example
 * removeNullAndUndefinedFields({ a: 1, b: null, c: undefined, d: { e: [], f: null, g: 2 } })
 * // => { a: 1, d: { g: 2 } }
 */

export function removeNullAndUndefinedFields(something: unknown): unknown {
  if (isPlainObject(something) && something instanceof Object) {
    const result = {};
    const keys = Object.keys(something)
      .filter((key) => isDefined(something[key]))
      .filter(
        (key) =>
          !(
            key.match(/Localized$/) &&
            !isDefined(something[key.replace(/Localized$/, "")])
          ),
      );
    for (const key of keys) {
      const value = removeNullAndUndefinedFields(something[key]);
      if (isDefined(value)) result[key] = value;
    }
    return Object.keys(result).length > 0 ? result : undefined;
  }
  if (Array.isArray(something)) {
    const result = something
      .filter(isDefined)
      .map(removeNullAndUndefinedFields);
    return result.length ? result : undefined; // filter out empty arrays
  }
  return something;
}
