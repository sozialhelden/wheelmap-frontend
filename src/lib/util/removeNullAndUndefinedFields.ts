import isPlainObject from 'lodash/isPlainObject'
import { isDefined } from './isDefined'

export function removeNullAndUndefinedFields(something: unknown): unknown {
  if (isPlainObject(something) && something instanceof Object) {
    const result = {}
    Object.keys(something)
      .filter((key) => isDefined(something[key]))
      .filter(
        (key) => !(
          key.match(/Localized$/)
            && !isDefined(something[key.replace(/Localized$/, '')])
        ),
      )
      .forEach((key) => {
        const value = removeNullAndUndefinedFields(something[key])
        if (isDefined(value)) result[key] = value
      })
    return Object.keys(result).length > 0 ? result : undefined
  } if (something instanceof Array) {
    const result = something
      .filter(isDefined)
      .map(removeNullAndUndefinedFields)
    return result.length ? result : undefined // filter out empty arrays
  }
  return something
}
