// @flow
import { t } from 'ttag';

import { globalFetchManager } from './FetchManager';
import { translatedStringFromObject } from './i18n';
import ResponseError from './ResponseError';
import config from './config';
import env from './env';

import type { Feature } from './Feature';
import type { SearchResultFeature } from './searchPlaces';
import type { EquipmentInfo } from './EquipmentInfo';

export type ACCategory = {
  _id: string,
  icon: string,
  parentIds: string[],
  translations: {
    _id: string,
  },
  synonyms: string[],
};

export type WheelmapCategory = {
  id: number,
  identifier: string,
  category_id: number,
  category: {
    id: number,
    identifier: string,
  },
  localized_name: string,
  icon: string,
};

export type Category = WheelmapCategory | ACCategory;

type SynonymCache = {
  [key: string]: ACCategory,
};

export type CategoryLookupTables = {
  synonymCache: ?SynonymCache,
  idsToWheelmapCategories: { [number]: WheelmapCategory },
  wheelmapCategoryNamesToCategories: { [string]: WheelmapCategory },
  wheelmapRootCategoryNamesToCategories: { [string]: WheelmapCategory },
};

export function isACCategory(category: any): boolean {
  return !!(category && category._id);
}

// This is just for typecasting.
export function acCategoryFrom(category: ?Category): ?ACCategory {
  if (category && isACCategory(category)) {
    return ((category: any): ACCategory);
  }

  return null;
}

export default class Categories {
  static getTranslatedRootCategoryNames() {
    return {
      // translator: Root category
      shopping: t`Shopping`,
      // translator: Root category
      food: t`Food & Drinks`,
      // translator: Root category
      public_transfer: t`Transport`,
      // translator: Root category
      leisure: t`Leisure`,
      // translator: Root category
      accommodation: t`Hotels`,
      // translator: Root category
      tourism: t`Tourism`,
      // translator: Root category
      education: t`Education`,
      // translator: Root category
      government: t`Authorities`,
      // translator: Root category
      health: t`Health`,
      // translator: Root category
      money_post: t`Money`,
      // translator: Root category
      sport: t`Sports`,
      // translator: Root category
      misc: t`Miscellaneous`,
    };
  }

  static getCategory(lookupTable: CategoryLookupTables, idOrSynonym: string | number): ACCategory {
    const synonymCache = lookupTable.synonymCache;

    if (!synonymCache) {
      throw new Error('Empty synonym cache.');
    }

    return synonymCache[String(idOrSynonym)];
  }

  static generateSynonymCache(
    lookupTable: CategoryLookupTables,
    categories: ACCategory[]
  ): SynonymCache {
    const result: SynonymCache = {};
    categories.forEach(category => {
      result[category._id] = category;
      const synonyms = category.synonyms;
      if (!(synonyms instanceof Array)) return;
      synonyms.forEach(synonym => {
        result[synonym] = category;
      });
    });
    lookupTable.synonymCache = result;
    return result;
  }

  static getCategoriesForFeature(
    categories: CategoryLookupTables,
    feature: ?Feature | ?EquipmentInfo | ?SearchResultFeature
  ): { category: ?Category, parentCategory?: Category } {
    if (!feature) {
      return { category: null };
    }

    const properties = feature.properties;
    if (!properties) {
      return { category: null };
    }

    // wheelmap classic node
    const wheelmapCategory = properties.node_type ? properties.node_type.identifier : null;
    // properties.category also exists on wheelmap classic nodes, resolve this afterwards
    const acCategoryId = properties.category ? properties.category : null;
    // search result node from komoot
    const baseOsmCategory = properties.osm_value || properties.osm_key;

    const categoryId = [wheelmapCategory, acCategoryId, baseOsmCategory].filter(Boolean)[0];

    if (!categoryId) {
      return { category: null };
    }

    const category = Categories.getCategory(categories, String(categoryId));
    const parentCategory = category && Categories.getCategory(categories, category.parentIds[0]);

    return { category, parentCategory };
  }

  static fillCategoryLookupTable(
    lookupTable: CategoryLookupTables,
    categories: WheelmapCategory[]
  ) {
    categories.forEach(category => {
      lookupTable.idsToWheelmapCategories[category.id] = category;
      lookupTable.wheelmapCategoryNamesToCategories[category.identifier] = category;
      if (!category.category_id) {
        lookupTable.wheelmapRootCategoryNamesToCategories[category.identifier] = category;
      }
    });
  }

  static wheelmapCategoryWithName(lookupTable: CategoryLookupTables, name: string) {
    return lookupTable.wheelmapCategoryNamesToCategories[name];
  }

  static wheelmapRootCategoryWithName(lookupTable: CategoryLookupTables, name: string) {
    return lookupTable.wheelmapRootCategoryNamesToCategories[name];
  }

  static translatedWheelmapRootCategoryName(name: string) {
    return this.getTranslatedRootCategoryNames()[name];
  }

  static async fetchCategoryData(options: {
    locale: string,
  }): Promise<[ACCategory[], WheelmapCategory[], WheelmapCategory[]]> {
    const hasAccessibilityCloudCredentials = Boolean(env.public.accessibilityCloud.appToken);
    const hasWheelmapCredentials =
      config.wheelmapApiKey && typeof config.wheelmapApiBaseUrl === 'string';

    const countryCode = options.locale.substr(0, 2);
    const responseHandler = response => {
      if (!response.ok) {
        // translator: Shown when there was an error while loading category data from the backend.
        const errorText = t`Error while loading place categories.`;
        throw new ResponseError(errorText, response);
      }
      return response.json();
    };

    function acCategoriesFetch() {
      const url = `${env.public.accessibilityCloud.baseUrl.cached}/categories.json?appToken=${
        env.public.accessibilityCloud.appToken
      }`;
      return globalFetchManager
        .fetch(url, { cordova: true })
        .then(responseHandler)
        .then((json): ACCategory[] => json.results || []);
    }

    function wheelmapCategoriesFetch() {
      const url = `${config.wheelmapApiBaseUrl}/api/categories?api_key=${
        env.public.wheelmap.apiKey
      }&locale=${countryCode}`;
      return globalFetchManager
        .fetch(url, { mode: 'no-cors', cordova: true })
        .then(responseHandler)
        .then((json): WheelmapCategory[] => json.categories || []);
    }

    function wheelmapNodeTypesFetch() {
      const url = `${config.wheelmapApiBaseUrl}/api/node_types?api_key=${
        config.wheelmapApiKey
      }&locale=${countryCode}`;
      return globalFetchManager
        .fetch(url, { mode: 'no-cors', cordova: true })
        .then(responseHandler)
        .then((json): WheelmapCategory[] => json.node_types || []);
    }

    return await Promise.all([
      hasAccessibilityCloudCredentials ? acCategoriesFetch() : [],
      hasWheelmapCredentials ? wheelmapCategoriesFetch() : [],
      hasWheelmapCredentials ? wheelmapNodeTypesFetch() : [],
    ]);
  }

  static generateLookupTables(
    prefetchedData: [ACCategory[], WheelmapCategory[], WheelmapCategory[]]
  ) {
    const lookupTable: CategoryLookupTables = {
      synonymCache: null,
      idsToWheelmapCategories: {},
      wheelmapCategoryNamesToCategories: {},
      wheelmapRootCategoryNamesToCategories: {},
    };

    Categories.generateSynonymCache(lookupTable, prefetchedData[0]);
    Categories.fillCategoryLookupTable(lookupTable, prefetchedData[1]);
    Categories.fillCategoryLookupTable(lookupTable, prefetchedData[2]);

    return lookupTable;
  }
}

export function categoryNameFor(category: Category): ?string {
  if (!category) return null;
  let idObject = null;

  const acCategory = acCategoryFrom(category);

  if (acCategory) {
    idObject = acCategory.translations._id;
  }

  return translatedStringFromObject(idObject);
}

export function getCategoryId(category: ?Category | string): ?string {
  if (!category) {
    return;
  }
  if (typeof category === 'string') {
    return category;
  }
  if (typeof category.id === 'string') {
    return category.id;
  }
  if (typeof category._id === 'string') {
    return category._id;
  }
}
