import type { AnyFeature } from "~/lib/model/geo/AnyFeature";
import type { ACCategory } from "~/modules/categories/types/ACCategory";

type SynonymCache = Map<string, ACCategory>;
export const unknownCategory: Readonly<ACCategory> = {
  _id: "unknown",
  translations: {
    _id: "Unknown",
  },
  icon: "unknown",
  synonyms: [],
  parentIds: [],
};

export function getCategory(
  synonymCache: SynonymCache,
  idOrSynonym: string | number,
): ACCategory | undefined {
  return synonymCache.get(String(idOrSynonym));
}

export function generateSynonymCache(categories: ACCategory[]): SynonymCache {
  const result: SynonymCache = new Map();
  // biome-ignore lint/complexity/noForEach: <explanation>
  categories.forEach((category) => {
    result.set(category._id, category);
    const { synonyms } = category;
    if (!Array.isArray(synonyms)) {
      return;
    }
    // biome-ignore lint/complexity/noForEach: <explanation>
    synonyms.forEach((synonym) => {
      result.set(synonym, category);
    });
  });
  return result;
}

export function getCategoryForFeature(
  synonymCache: SynonymCache,
  feature: AnyFeature,
): ACCategory | undefined {
  const { properties } = feature;
  if (!properties) {
    return unknownCategory;
  }

  let categoryId: string | undefined;
  if (
    feature["@type"] === "a11yjson:PlaceInfo" ||
    feature["@type"] === "a11yjson:EquipmentInfo" ||
    feature["@type"] === "ac:PlaceInfo" ||
    feature["@type"] === "ac:EquipmentInfo"
  ) {
    categoryId = feature.properties?.category;
  } else if (feature["@type"] === "photon:SearchResult") {
    categoryId = feature.properties.osm_value || feature.properties.osm_key;
  } else if (feature["@type"] === "osm:Feature") {
    for (const [key, value] of Object.entries(feature.properties)) {
      const foundCategory = getCategory(synonymCache, `${key}=${value}`);
      if (foundCategory) {
        return foundCategory;
      }
    }
    categoryId = feature.properties.amenity as string | undefined;
  }

  if (!categoryId) {
    return unknownCategory;
  }

  return getCategory(synonymCache, String(categoryId));
}
