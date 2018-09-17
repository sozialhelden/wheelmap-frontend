// @flow

import { globalFetchManager } from './FetchManager';
import { t } from 'ttag';
import { translatedStringFromObject } from './i18n';
import ResponseError from './ResponseError';

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

  static getCategory(lookUp: CategoryLookupTables, idOrSynonym: string | number): ACCategory {
    if (!lookUp.synonymCache) throw new Error('Empty synonym cache.');

    // @TODO \o/ Help! Sebastian!
    return lookUp.synonymCache[String(idOrSynonym)];
  }

  static generateSynonymCache(
    lookUp: CategoryLookupTables,
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
    lookUp.synonymCache = result;
    return result;
  }

  static buildCategoryLookUp(lookUp: CategoryLookupTables, categories: WheelmapCategory[]) {
    categories.forEach(category => {
      lookUp.idsToWheelmapCategories[category.id] = category;
      lookUp.wheelmapCategoryNamesToCategories[category.identifier] = category;
      if (!category.category_id) {
        lookUp.wheelmapRootCategoryNamesToCategories[category.identifier] = category;
      }
    });
  }

  static wheelmapCategoryWithName(lookUp: CategoryLookupTables, name: string) {
    return lookUp.wheelmapCategoryNamesToCategories[name];
  }

  static wheelmapRootCategoryWithName(lookUp: CategoryLookupTables, name: string) {
    return lookUp.wheelmapRootCategoryNamesToCategories[name];
  }

  static translatedWheelmapRootCategoryName(name: string) {
    return this.getTranslatedRootCategoryNames()[name];
  }

  static async fetchOnce(options: {
    accessibilityCloudBaseUrl: string,
    accessibilityCloudAppToken: string,
    wheelmapApiKey: string,
    wheelmapApiBaseUrl: string,
    locale: string,
  }) {
    const lookUp: CategoryLookupTables = {
      synonymCache: null,
      idsToWheelmapCategories: {},
      wheelmapCategoryNamesToCategories: {},
      wheelmapRootCategoryNamesToCategories: {},
    };
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
      const url = `${options.accessibilityCloudBaseUrl}/categories.json?appToken=${
        options.accessibilityCloudAppToken
      }`;
      return globalFetchManager
        .fetch(url, { cordova: true })
        .then(responseHandler)
        .then(json => Categories.generateSynonymCache(lookUp, json.results || []));
    }

    function wheelmapCategoriesFetch() {
      const url = `${options.wheelmapApiBaseUrl}/api/categories?api_key=${
        options.wheelmapApiKey
      }&locale=${countryCode}`;
      return globalFetchManager
        .fetch(url, { mode: 'no-cors', cordova: true })
        .then(responseHandler)
        .then(json => Categories.buildCategoryLookUp(lookUp, json.categories || []));
    }

    function wheelmapNodeTypesFetch() {
      const url = `${options.wheelmapApiBaseUrl}/api/node_types?api_key=${
        options.wheelmapApiKey
      }&locale=${countryCode}`;
      return globalFetchManager
        .fetch(url, { mode: 'no-cors', cordova: true })
        .then(responseHandler)
        .then(json => Categories.buildCategoryLookUp(lookUp, json.node_types || []));
    }

    const hasAccessibilityCloudCredentials = Boolean(options.accessibilityCloudAppToken);
    const hasWheelmapCredentials =
      options.wheelmapApiKey && typeof options.wheelmapApiBaseUrl === 'string';

    await Promise.all(
      [
        hasAccessibilityCloudCredentials ? acCategoriesFetch() : null,
        hasWheelmapCredentials ? wheelmapCategoriesFetch() : null,
        hasWheelmapCredentials ? wheelmapNodeTypesFetch() : null,
      ].filter(Boolean)
    );

    return lookUp;
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
