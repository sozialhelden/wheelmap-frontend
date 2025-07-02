export type NestedRecord<T> = { [key: string]: T | NestedRecord<T> };

/**
 * Converts a nested object into a flat object suitable for URL search parameters.
 * The keys of the flat object are constructed by concatenating the keys of the
 * nested object, using square brackets to indicate nesting. For example:
 *
 * input:
 * {
 *     "key1": "value1",
 *     "key2": {
 *        "subkey1": "value2",
 *        "subkey2": {
 *            "subkey3": "value3"
 *        }
 *     },
 * }
 *
 * output:
 * {
 *     "key1": "value1",
 *     "key2[subkey1]": "value2",
 *     "key2[subkey2][subkey3]": "value3"
 * }
 */
export function flattenToSearchParams(
  object: NestedRecord<string | number | boolean | undefined>,
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

/**
 * Get a nested object from a flat object representing URL search parameters. For example:
 *
 * input:
 * {
 *    "key1": "value1",
 *    "key2[subkey1]": "value2",
 *    "key2[subkey2][subkey3]": "value3"
 * }
 *
 * output:
 * {
 *    "key1": "value1",
 *    "key2": {
 *        "subkey1": "value2",
 *        "subkey2": {
 *            "subkey3": "value3"
 *        }
 *    },
 * }
 */
export function unflattenSearchParams(
  searchParams: Record<string, string>,
): NestedRecord<string | undefined> {
  const result: NestedRecord<string | undefined> = {};

  for (const [key, value] of Object.entries(searchParams)) {
    const keys = key.split(/\[|\]/).filter(Boolean);
    let current = result;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as NestedRecord<string | undefined>;
    }

    current[keys[keys.length - 1]] = value;
  }

  return result;
}
