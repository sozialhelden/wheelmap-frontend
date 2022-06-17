import { t } from "ttag";

import { translatedStringFromObject } from "../i18n";
import ResponseError from "../ResponseError";
import config from "../config";

import { SearchResultFeature } from "../fetchers/fetchPlaceSearchResults";
import { hasAccessibleToilet } from "./Feature";
import { LocalizedString } from "../i18n";
import {
  EquipmentInfo,
  EquipmentProperties,
  PlaceInfo,
  PlaceProperties,
} from "@sozialhelden/a11yjson";

export type ACCategory = {
  _tag: "ACCategory";
  _id: string;
  translations: {
    _id: LocalizedString;
  };
  synonyms: string[];
  icon: string;
  parentIds: string[];
};

export type Category = ACCategory;

type SynonymCache = {
  [key: string]: ACCategory;
};

// Contains data as supplied by the server
export type RawCategoryLists = {
  accessibilityCloud: ACCategory[];
};

export type CategoryLookupTables = {
  synonymCache: SynonymCache | undefined;
  categoryTree: ACCategory[];
};

export type RootCategoryEntry = {
  name: string;
  isSubCategory?: boolean;
  isMetaCategory?: boolean;
  filter?: (
    properties: PlaceProperties | EquipmentProperties | undefined
  ) => boolean;
};

// This must be a function - Results from t`` are dependent on the current context.
// If t`` is called at root level of a module, it doesn't know the translations yet
// as they are loaded later, at runtime.
// Using it inside a function while rendering ensures the runtime-loaded translations
// are correctly returned.
const getRootCategoryTable = (): { [key: string]: RootCategoryEntry } => ({
  shopping: {
    // translator: Root category
    name: t`Shopping`,
  },
  food: {
    // translator: Root category
    name: t`Food & Drinks`,
  },
  public_transfer: {
    // translator: Root category
    name: t`Transport`,
  },
  leisure: {
    // translator: Root category
    name: t`Leisure`,
  },
  accommodation: {
    // translator: Root category
    name: t`Hotels`,
  },
  tourism: {
    // translator: Root category
    name: t`Tourism`,
  },
  education: {
    // translator: Root category
    name: t`Education`,
  },
  government: {
    // translator: Root category
    name: t`Authorities`,
  },
  health: {
    // translator: Root category
    name: t`Health`,
  },
  money_post: {
    // translator: Root category
    name: t`Money`,
  },
  sport: {
    // translator: Root category
    name: t`Sports`,
  },
  // This returns all places that either ARE a toilet, or HAVE an accessible toilet
  toilets: {
    // translator: Meta category for any toilet or any place with an accessible toilet
    name: t`Toilets`,
    isMetaCategory: true,
    isSubCategory: true,
    filter: (properties: PlaceProperties | undefined) => {
      if (!properties) {
        return true;
      }
      return (
        properties.category === "toilets" ||
        hasAccessibleToilet(properties) === "yes"
      );
    },
  },
});

export default class Categories {
  static getRootCategories() {
    return getRootCategoryTable();
  }

  static getRootCategory(key: string) {
    return getRootCategoryTable()[key];
  }

  static translatedRootCategoryName(key: string) {
    return getRootCategoryTable()[key].name;
  }

  static getCategory(
    lookupTable: CategoryLookupTables,
    idOrSynonym: string | number
  ): ACCategory {
    const synonymCache = lookupTable.synonymCache;

    if (!synonymCache) {
      throw new Error("Empty synonym cache.");
    }

    return synonymCache[String(idOrSynonym)];
  }

  static generateSynonymCache(
    lookupTable: CategoryLookupTables,
    categories: ACCategory[]
  ): SynonymCache {
    const result: SynonymCache = {};
    categories.forEach((category) => {
      result[category._id] = category;
      category._tag = "ACCategory";
      const synonyms = category.synonyms;
      if (!(synonyms instanceof Array)) return;
      synonyms.forEach((synonym) => {
        result[synonym] = category;
      });
    });
    lookupTable.synonymCache = result;
    return result;
  }

  static getCategoriesForFeature(
    categoryLookupTables: CategoryLookupTables,
    feature: PlaceInfo | EquipmentInfo | SearchResultFeature | null
  ): { category: Category | null; parentCategory: Category | null } {
    if (!feature) {
      return { category: null, parentCategory: null };
    }

    const properties = feature.properties;
    if (!properties) {
      return { category: null, parentCategory: null };
    }

    let categoryId = null;

    if (properties["category"]) {
      // ac node
      categoryId = properties["category"];
    } else if (properties["osm_key"]) {
      // search result node from komoot
      categoryId = properties["osm_value"] || properties["osm_key"];
    }

    if (!categoryId) {
      return { category: null, parentCategory: null };
    }

    const category = Categories.getCategory(
      categoryLookupTables,
      String(categoryId)
    );
    const parentCategory =
      category &&
      Categories.getCategory(categoryLookupTables, category.parentIds[0]);

    return { category, parentCategory };
  }

  static async fetchCategoryData(options: {
    locale: string;
    disableWheelmapSource?: boolean;
    appToken: string;
  }): Promise<RawCategoryLists> {
    const hasAccessibilityCloudCredentials = Boolean(options.appToken);
    const hasWheelmapCredentials =
      config.wheelmapApiKey && typeof config.wheelmapApiBaseUrl === "string";
    const useWheelmapSource =
      hasWheelmapCredentials && !options.disableWheelmapSource;

    const languageCode = options.locale.substr(0, 2);
    const responseHandler = (response) => {
      if (!response.ok) {
        // translator: Shown when there was an error while loading category data from the backend.
        const errorText = t`Error while loading place categories.`;
        throw new ResponseError(errorText, response);
      }
      return response.json();
    };

    function acCategoriesFetch() {
      const baseUrl = "";
      const url = `${baseUrl}/categories.json?appToken=${options.appToken}`;
      return fetch(url)
        .then(responseHandler)
        .then((json): ACCategory[] => json.results || []);
    }

    const [
      accessibilityCloud,
      wheelmapCategories,
      wheelmapNodeTypes,
    ] = await Promise.all([
      hasAccessibilityCloudCredentials
        ? acCategoriesFetch()
        : Promise.resolve([]),
    ]);

    return { accessibilityCloud };
  }

  static generateLookupTables(prefetchedData: RawCategoryLists) {
    const lookupTable: CategoryLookupTables = {
      synonymCache: null,
      categoryTree: prefetchedData.accessibilityCloud,
    };

    Categories.generateSynonymCache(
      lookupTable,
      prefetchedData.accessibilityCloud
    );

    return lookupTable;
  }
}

export function categoryNameFor(category: Category): string | null {
  if (!category) return;
  let idObject = null;

  if (category._tag === "ACCategory") {
    idObject = category.translations._id;
  }

  return translatedStringFromObject(idObject);
}

export function getCategoryId(
  category?: Category | string | undefined
): string | undefined {
  if (!category) {
    return;
  }

  // We got a accessibility.cloud category ID
  if (typeof category === "string") {
    return category;
  }

  if (typeof category === "object" && category) {
    // ac server category object
    if (typeof category["_id"] === "string") {
      return category["_id"];
    }
  }
}
