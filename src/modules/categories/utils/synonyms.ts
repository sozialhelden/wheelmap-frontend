import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import {
  getSynonymMap,
  findCategoryBySynonym,
  type CategoryProperties,
} from "@sozialhelden/core";

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

export function findCategory(feature: AnyFeature): CategoryProperties {
  const synonymMap = getSynonymMap();
  return findCategoryBySynonym(
    getSynonyms(feature).find((synonym) => synonymMap.has(synonym)),
  );
}
