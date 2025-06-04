import {
  type Category,
  type CategoryBaseProperties,
  type CategoryProperties,
  findCategoryByOSMTags,
  getCategories,
  getTopLevelCategories,
} from "@sozialhelden/core";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

export function getTopLevelCategoryList() {
  return Object.entries(getTopLevelCategories())
    .filter(([, category]) => !category.hide)
    .map(([id, category]) => {
      return {
        ...category,
        id,
      };
    })
    .sort((a: CategoryBaseProperties, b: CategoryBaseProperties) => {
      return (a.priority ?? 9999) - (b.priority ?? 9999);
    }) as CategoryProperties[];
}

function getCategoryProperties(category: Category): CategoryProperties {
  return {
    ...getCategories()[category],
    id: category,
  };
}

export function findCategory(feature: AnyFeature): CategoryProperties {
  const { properties, "@type": type } = feature;

  if (!properties || !type) {
    return getCategoryProperties("unknown");
  }

  if (
    [
      "a11yjson:PlaceInfo",
      "a11yjson:EquipmentInfo",
      "ac:PlaceInfo",
      "ac:EquipmentInfo",
    ].includes(type)
  ) {
    return getCategoryProperties(
      (properties.category ?? "unknown") as Category,
    );
  }

  if (type === "photon:SearchResult") {
    if (!properties.osm_key || !properties.osm_value) {
      return getCategoryProperties("unknown");
    }
    return findCategoryByOSMTags({
      [properties.osm_key]: properties.osm_value,
    });
  }

  if (type !== "osm:Feature") {
    return getCategoryProperties("unknown");
  }

  return findCategoryByOSMTags(properties as Record<string, string>);
}
