import { memoize, kebabCase } from 'lodash'

export const memoizedKebabCase = memoize(kebabCase)
