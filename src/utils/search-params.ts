export type NestedRecord<T> = { [key: string]: T | NestedRecord<T> };

/**
 * Converts a nested object into a flat object suitable for URL search parameters.
 * The keys of the flat object are constructed by concatenating the keys of the
 * nested object, using square brackets to indicate nesting.
 */
export function flattenToSearchParams(
  object: NestedRecord<string | undefined> | string,
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
