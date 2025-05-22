import {
  categories,
  type Category,
  type CategoryProperties,
} from "~/modules/categories/categories";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

export const synonymMap: Map<string, Category> = Object.entries(
  categories,
).reduce((acc, [category, properties]) => {
  for (const synonym of properties.synonyms ?? []) {
    acc.set(synonym, category as Category);
  }
  return acc;
}, new Map<string, Category>());

function getSynonyms(
  feature: AnyFeature & { properties?: { category?: string } },
): string[] {
  const { properties, "@type": type } = feature;

  if (!properties || !type) {
    return [];
  }

  if (
    [
      "a11yjson:PlaceInfo",
      "a11yjson:EquipmentInfo",
      "ac:PlaceInfo",
      "ac:EquipmentInfo",
    ].includes(type)
  ) {
    return [properties?.category].filter(Boolean) as string[];
  }

  if (type === "photon:SearchResult") {
    return [properties?.osm_value || properties?.osm_key].filter(
      Boolean,
    ) as string[];
  }

  if (type !== "osm:Feature") {
    return [];
  }

  return Object.entries(properties).map(([key, value]) => {
    if (key.startsWith("category") || key === "amenity") {
      return String(value);
    }
    return `${key}=${value}`;
  });
}

export function findCategoryBySynonym(synonym?: string): CategoryProperties {
  const id = synonymMap.get(synonym ?? "") || "unknown";
  return { id, ...categories[id] };
}

export function findCategory(feature: AnyFeature): CategoryProperties {
  return findCategoryBySynonym(
    getSynonyms(feature).find((synonym) => synonymMap.has(synonym)),
  );
}
