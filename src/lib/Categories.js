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
    _id: {
      [key: string]: string,
    },
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

export default class Categories {
  static synonymCache: SynonymCache = {};
  static idsToWheelmapCategories = {};
  static wheelmapCategoryNamesToCategories = {};
  static wheelmapRootCategoryNamesToCategories = {};
  static fetchPromise: ?Promise<*>;

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

  static getCategory(idOrSynonym): Promise<ACCategory> {
    //if (!this.fetchPromise) throw new Error('Category fetching not initialized yet.');
    // @TODO Refactore to work with next.js
    if (!this.fetchPromise) return Promise.resolve();

    return this.fetchPromise.then(() => this.getCategoryFromCache(idOrSynonym));
  }

  static getCategoryFromCache(idOrSynonym) {
    return this.synonymCache[idOrSynonym];
  }

  static generateSynonymCache(categories: ACCategory[]): SynonymCache {
    const result: SynonymCache = {};
    categories.forEach(category => {
      result[category._id] = category;
      const synonyms = category.synonyms;
      if (!(synonyms instanceof Array)) return;
      synonyms.forEach(synonym => {
        result[synonym] = category;
      });
    });
    this.synonymCache = result;
    return result;
  }

  static loadCategories(categories: WheelmapCategory[]) {
    categories.forEach(category => {
      this.idsToWheelmapCategories[category.id] = category;
      this.wheelmapCategoryNamesToCategories[category.identifier] = category;
      if (!category.category_id) {
        this.wheelmapRootCategoryNamesToCategories[category.identifier] = category;
      }
    });
  }

  static wheelmapCategoryWithName(name: string) {
    return this.wheelmapCategoryNamesToCategories[name];
  }

  static wheelmapRootCategoryWithName(name: string) {
    return this.wheelmapRootCategoryNamesToCategories[name];
  }

  static translatedWheelmapRootCategoryName(name: string) {
    return this.getTranslatedRootCategoryNames()[name];
  }

  static fetchOnce(options: {
    accessibilityCloudBaseUrl: string,
    accessibilityCloudAppToken: string,
    wheelmapApiKey: string,
    wheelmapApiBaseUrl: string,
  }) {
    if (this.fetchPromise) return this.fetchPromise;

    const countryCode = navigator.language.substr(0, 2);

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
        .then(json => Categories.generateSynonymCache(json.results || []));
    }

    function wheelmapCategoriesFetch() {
      const url = `${options.wheelmapApiBaseUrl}/api/categories?api_key=${
        options.wheelmapApiKey
      }&locale=${countryCode}`;
      return globalFetchManager
        .fetch(url, { mode: 'no-cors', cordova: true })
        .then(responseHandler)
        .then(json => Categories.loadCategories(json.categories || []));
    }

    function wheelmapNodeTypesFetch() {
      const url = `${options.wheelmapApiBaseUrl}/api/node_types?api_key=${
        options.wheelmapApiKey
      }&locale=${countryCode}`;
      return globalFetchManager
        .fetch(url, { mode: 'no-cors', cordova: true })
        .then(responseHandler)
        .then(json => Categories.loadCategories(json.node_types || []));
    }

    const hasAccessibilityCloudCredentials = Boolean(options.accessibilityCloudAppToken);
    const hasWheelmapCredentials =
      options.wheelmapApiKey && typeof options.wheelmapApiBaseUrl === 'string';

    this.fetchPromise = Promise.all(
      [
        hasAccessibilityCloudCredentials ? acCategoriesFetch() : null,
        hasWheelmapCredentials ? wheelmapCategoriesFetch() : null,
        hasWheelmapCredentials ? wheelmapNodeTypesFetch() : null,
      ].filter(Boolean)
    );

    return this.fetchPromise;
  }
}

export function categoryNameFor(category: Category): ?string {
  if (!category) return null;
  const translationsObject = category.translations;
  const idObject = translationsObject ? translationsObject._id : null;
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
