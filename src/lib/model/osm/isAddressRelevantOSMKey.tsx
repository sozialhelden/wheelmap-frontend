/**
 * Takes a list of OSM keys, and returns a Set of the keys that are relevant for accessibility.
 */

export const accessibilityPrefixes = new Set(['addr']);

export default function isAddressRelevantOSMKey(osmKey: string): boolean {
  return (
    accessibilityPrefixes.has(osmKey)
    || accessibilityPrefixes.has(osmKey.substr(0, osmKey.indexOf(':')))
  );
}
