import { memoize } from 'lodash'

export default function kebapCase(str: string) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase().replace(/^-/g, '');
}

export const memoizedKebapCase = memoize(kebapCase)
