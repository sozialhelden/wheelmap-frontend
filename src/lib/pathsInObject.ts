import { Dictionary, flatten, isObject, map } from 'lodash';

export function pathsInObjectWithRootPath<D extends Dictionary<any>>(
  currentPath: string | null,
  object: D,
): string[] {
  return flatten(
    map(object, (value, key) => {
      const path = currentPath ? `${currentPath || ''}.${key}` : key;
      return isObject(value) ? [path].concat(pathsInObjectWithRootPath(path, value)) : path;
    })
  );
}

export default function pathsInObject<D>(object: D): string[] {
  return pathsInObjectWithRootPath<D>(null, object);
}
