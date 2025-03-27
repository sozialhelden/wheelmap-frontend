export type NestedRecord<T> = { [key: string]: T | NestedRecord<T> };

export function flattenToSearchParams(
  object: NestedRecord<string> | string,
  prefix = "",
): Record<string, string> {
  return Object.entries(object).reduce(
    (acc: Record<string, string>, [key, value]) => {
      const newKey = prefix ? `${prefix}[${key}]` : key;

      if (value === null || value === undefined) {
        return acc;
      }

      if (typeof value === "object") {
        Object.assign(acc, flattenToSearchParams(value, newKey));
      } else {
        acc[newKey] = String(value);
      }

      return acc;
    },
    {},
  );
}
