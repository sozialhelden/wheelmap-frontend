import { humanize } from "inflection";
import { useTranslations } from "~/modules/i18n/hooks/useTranslations";
import type IAccessibilityAttribute from "../ac/IAccessibilityAttribute";
import type OSMFeature from "./OSMFeature";

/**
 * Figure out a (translated) display name for a generic category of a feature.
 * If there is no translation available, we fall back to a "humanized" English version.
 *
 * @example
 * getGenericCategoryDisplayName(
 *   { properties: { building: "office" } },
 *   new Map(),
 *   ["en"]
 * );
 * // => { tagKeys: ["building"], displayNames: ["Office building"], displayName: "Office building" }
 *
 * getGenericCategoryDisplayName(
 *   { properties: { building: "school", shop: "candy" } },
 *   new Map({ "osm:building=school": { label: { de: "Schulgebäude" } } }),
 *   ["de"]
 * );
 * // => { tagKeys: ["building", "shop"], displayNames: ["Schulgebäude", "Candy shop"], displayName: "Schulgebäude, Candy shop" }
 */

export default function getGenericCategoryDisplayName(
  feature: OSMFeature,
  attributeMap: Map<string, IAccessibilityAttribute>,
) {
  const { properties } = feature;
  if (!properties) return { tagKeys: [], displayName: undefined };

  const tagKeys: string[] = [];
  const results: string[] = [];

  // For some keys, we combine **value** and **key** ("building=office" -> "Office building").
  const keysWithSuffix = [
    "studio",
    "office",
    "shop",
    "room",
    "building",
    "landuse",
    "route",
  ];
  // For other keys, we use the **value** as name ("amenity=toilets" -> "Toilets").
  const keysWithoutSuffix = [
    "elevator",
    "stairwell",
    "sport",
    "leisure",
    "tourism",
    "shop",
    "amenity",
    "junction",
    "railway",
    "aeroway",
    "man_made",
    "highway",
  ];
  const allKeys = [...keysWithoutSuffix, ...keysWithSuffix];

  const getLabel = (id: string, fallback: string) => {
    const attr = attributeMap?.get(id);
    if (!attr) return fallback;
    return useTranslations(attr.shortLabel || attr.label) || fallback;
  };

  for (const key of allKeys) {
    const value = properties[key];
    if (typeof value !== "string") continue;

    tagKeys.push(key);

    if (value === "yes") {
      // If the value is \`yes\`, we use the translated key name as a category.
      const label = getLabel(`osm:${key}=yes`, humanize(key));
      const text = String(
        properties.note || `${label} ${properties.ref || ""}`,
      );
      results.push(text);
      break;
    }

    const fallback = keysWithSuffix.includes(key)
      ? `${humanize(value)} ${key} ${properties.ref || ""}`
      : `${humanize(value)} ${properties.ref || ""}`;
    results.push(getLabel(`osm:${key}=${value}`, fallback));
  }

  return { tagKeys, displayNames: results, displayName: results.join(", ") };
}
