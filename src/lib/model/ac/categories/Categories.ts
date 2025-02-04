import type { LocalizedString } from "../../../i18n/LocalizedString";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../../i18n/getLocalizedStringTranslationWithMultipleLocales";
import type { AnyFeature } from "../../geo/AnyFeature";
import type { ACCategory } from "./ACCategory";

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

export type CategoryLookupTables = {
  synonymCache: SynonymCache | undefined;
  categories: ACCategory[];
};

export function getCategory(
  synonymCache: SynonymCache,
  idOrSynonym: string | number,
): ACCategory | undefined {
  return synonymCache.get(String(idOrSynonym));
}

export function generateSynonymCache(categories: ACCategory[]): SynonymCache {
  const result: SynonymCache = new Map();
  for (const category of categories) {
    result.set(category._id, category);
    const { synonyms } = category;
    if (!Array.isArray(synonyms)) {
      continue;
    }
    for (const synonym of synonyms) {
      result.set(synonym, category);
    }
  }
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

export async function fetchCategoryData(
  appToken?: string,
  baseUrl?: string,
): Promise<ACCategory[]> {
  if (!appToken || !baseUrl) {
    return [];
  }
  const url = `${baseUrl}/categories.json?appToken=${appToken}`;
  return fetch(url)
    .then((r) => r.json())
    .then((json) => json.results || []);
}

export function getLocalizableCategoryName(
  category: ACCategory,
): LocalizedString | undefined {
  return category.translations?._id;
}

export function getLocalizedCategoryName(
  category: ACCategory | undefined | null,
  requestedLanguageTags: string[],
) {
  if (!category) {
    return undefined;
  }

  const localizedString = getLocalizableCategoryName(category);
  if (!localizedString) {
    return undefined;
  }

  return getLocalizedStringTranslationWithMultipleLocales(
    localizedString,
    requestedLanguageTags,
  );
}
