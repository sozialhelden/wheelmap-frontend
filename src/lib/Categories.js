// @flow

export type Category = {
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

type SynonymCache = {
  [string]: Category,
};


const url = 'https://www.accessibility.cloud/categories.json?appToken=27be4b5216aced82122d7cf8f69e4a07';

export default class Categories {
  static synonymCache: SynonymCache;

  static fetchPromise = fetch(url)
    .then(response => response.json())
    .then(json => Categories.generateSynonymCache(json.results || []));

  static getCategory(idOrSynonym): Promise<Category> {
    return this.fetchPromise.then(() => this.getCategoryFromCache(idOrSynonym));
  }

  static getCategoryFromCache(idOrSynonym) {
    return this.synonymCache[idOrSynonym];
  }

  static generateSynonymCache(categories: Category[]): SynonymCache {
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
}

