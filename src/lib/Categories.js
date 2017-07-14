// @flow

import config from './config';

export type ACCategory = {
  _id: string,
  icon: string,
  parentIds: string[],
  translations: {
    _id: {
      [string]: string,
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

type SynonymCache = {
  [string]: ACCategory,
};


export default class Categories {
  static synonymCache: SynonymCache;
  static idsToWheelmapCategories = {};
  static wheelmapCategoryNamesToCategories = {};
  static wheelmapRootCategoryNamesToCategories = {};
  static fetchPromise: ?Promise<*>;

  static getCategory(idOrSynonym): Promise<ACCategory> {
    if (!this.fetchPromise) throw new Error('Category fetching not initialized yet.');
    return this.fetchPromise.then(() => this.getCategoryFromCache(idOrSynonym));
  }

  static getCategoryFromCache(idOrSynonym) {
    return this.synonymCache[idOrSynonym];
  }

  static generateSynonymCache(categories: ACCategory[]): SynonymCache {
    const result: SynonymCache = {};
    categories.forEach((category) => {
      result[category._id] = category;
      const synonyms = category.synonyms;
      if (!(synonyms instanceof Array)) return;
      synonyms.forEach((synonym) => { result[synonym] = category; });
    });
    this.synonymCache = result;
    return result;
  }

  static loadCategories(categories: WheelmapCategory[]) {
    categories.forEach((category) => {
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
}


const countryCode = navigator.language.substr(0, 2);

function acCategoriesFetch() {
  const url = `https://www.accessibility.cloud/categories.json?appToken=${config.accessibilityCloudAppToken}`;
  return fetch(url)
    .then(response => response.json())
    .then(json => Categories.generateSynonymCache(json.results || []));
}

function wheelmapCategoriesFetch() {
  const url = `/api/categories?api_key=${config.wheelmapApiKey}&locale=${countryCode}`;
  return fetch(url)
    .then(response => response.json())
    .then(json => Categories.loadCategories(json.categories || []));
}

function wheelmapNodeTypesFetch() {
  const url = `/api/node_types?api_key=${config.wheelmapApiKey}&locale=${countryCode}`;
  return fetch(url)
    .then(response => response.json())
    .then(json => Categories.loadCategories(json.node_types || []));
}

Categories.fetchPromise = Promise.all([
  acCategoriesFetch(),
  wheelmapCategoriesFetch(),
  wheelmapNodeTypesFetch(),
]);
