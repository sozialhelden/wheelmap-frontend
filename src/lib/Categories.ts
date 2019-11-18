import { t } from 'ttag';

import { globalFetchManager } from './FetchManager';
import { translatedStringFromObject } from './i18n';
import ResponseError from './ResponseError';
import config from './config';
import env from './env';

import {
  Feature,
  WheelmapCategoryOrNodeType,
  WheelmapProperties,
  AccessibilityCloudProperties,
  NodeProperties,
  isWheelmapProperties,
} from './Feature';
import { SearchResultFeature } from './searchPlaces';
import { hasAccessibleToilet } from './Feature';
import { EquipmentInfo } from './EquipmentInfo';
import { LocalizedString } from './i18n';

/*
  Using the | characters around the type definitions of `ACCategory` and
  `WheelmapCategory` has a very specific reason. This feature of Flow is called
  exact object types, and it's used here on purpose. Without it it's tough for
  Flow to determine the actual specific type when it sees the `Category` union
  type in parts of our codebase.

  This is a pretty "debatable" feature of Flow and we should be aware of this
  when we migrate our code to TypeScript in the future. Flow's own explanation
  of why we need this can be found here:
  https://flow.org/en/docs/types/unions/#toc-disjoint-unions-with-exact-types
  https://flow.org/en/docs/lang/width-subtyping/
*/
export interface ACCategory {
  _tag: 'ACCategory',
  _id: string,
  translations: {
    _id: LocalizedString,
  },
  synonyms: string[],
  icon: string,
  parentIds: string[],
};

export interface WheelmapCategory {
  _tag: 'WheelmapCategory'
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

// Contains data as supplied by the server
export type RawCategoryLists = {
  accessibilityCloud: ACCategory[],
  wheelmapCategories: WheelmapCategory[],
  wheelmapNodeTypes: WheelmapCategory[],
};

export type CategoryLookupTables = {
  synonymCache: SynonymCache | undefined,
  idsToWheelmapCategories: { [idx: number]: WheelmapCategory },
  wheelmapCategoryNamesToCategories: { [key: string]: WheelmapCategory },
  wheelmapRootCategoryNamesToCategories: { [key: string]: WheelmapCategory },
};

export type RootCategoryEntry = {
  name: string,
  isSubCategory?: boolean,
  isMetaCategory?: boolean,
  filter?: (properties: NodeProperties | undefined) => boolean,
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
  toilets: {
    // translator: Meta category for any toilet or any place with an accessible toilet
    name: t`Toilets`,
    isMetaCategory: true,
    isSubCategory: true,
    filter: (properties: NodeProperties | undefined) => {
      if (!properties) {
        return true;
      }

      return hasAccessibleToilet(properties, true) === 'yes';
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
    categoryLookupTables: CategoryLookupTables,
    feature: Feature | EquipmentInfo | SearchResultFeature | null
  ): { category: Category | null, parentCategory: Category | null } {
    if (!feature) {
      return { category: null, parentCategory: null };
    }

    const properties = feature.properties;
    if (!properties) {
      return { category: null, parentCategory: null };
    }

    let categoryId = null;

    if (properties['node_type'] && typeof properties['node_type'].identifier === 'string') {
      // wheelmap classic node
      categoryId = properties['node_type'].identifier;
    } else if (properties['category']) {
      // ac node
      categoryId = properties['category'];
    } else if (properties['osm_key']) {
      // search result node from komoot
      categoryId = properties['osm_value'] || properties['osm_key'];
    }

    if (!categoryId) {
      return { category: null, parentCategory: null };
    }

    const category = Categories.getCategory(categoryLookupTables, String(categoryId));
    const parentCategory =
      category && Categories.getCategory(categoryLookupTables, category.parentIds[0]);

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

  static async fetchCategoryData(options: {
    locale: string,
    disableWheelmapSource?: boolean,
    appToken: string,
  }): Promise<RawCategoryLists> {
    const hasAccessibilityCloudCredentials = Boolean(options.appToken);
    const hasWheelmapCredentials =
      config.wheelmapApiKey && typeof config.wheelmapApiBaseUrl === 'string';
    const useWheelmapSource = hasWheelmapCredentials && !options.disableWheelmapSource;

    const languageCode = options.locale.substr(0, 2);
    const responseHandler = response => {
      if (!response.ok) {
        // translator: Shown when there was an error while loading category data from the backend.
        const errorText = t`Error while loading place categories.`;
        throw new ResponseError(errorText, response);
      }
      return response.json();
    };

    function acCategoriesFetch() {
      const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
      const url = `${baseUrl}/categories.json?appToken=${options.appToken}`;
      return globalFetchManager
        .fetch(url)
        .then(responseHandler)
        .then((json): ACCategory[] => json.results || []);
    }

    function wheelmapCategoriesFetch() {
      const url = `${config.wheelmapApiBaseUrl}/api/categories?api_key=${env.REACT_APP_WHEELMAP_API_KEY}&locale=${languageCode}`;
      return globalFetchManager
        .fetch(url, { mode: 'no-cors' })
        .then(responseHandler)
        .then((json): WheelmapCategory[] => json.categories || []);
    }

    function wheelmapNodeTypesFetch() {
      const url = `${config.wheelmapApiBaseUrl}/api/node_types?api_key=${env.REACT_APP_WHEELMAP_API_KEY}&locale=${languageCode}`;
      return globalFetchManager
        .fetch(url, { mode: 'no-cors' })
        .then(responseHandler)
        .then((json): WheelmapCategory[] => json.node_types || []);
    }

    const [accessibilityCloud, wheelmapCategories, wheelmapNodeTypes] = await Promise.all([
      hasAccessibilityCloudCredentials ? acCategoriesFetch() : Promise.resolve([]),
      useWheelmapSource ? wheelmapCategoriesFetch() : Promise.resolve([]),
      useWheelmapSource ? wheelmapNodeTypesFetch() : Promise.resolve([]),
    ]);

    return { accessibilityCloud, wheelmapCategories, wheelmapNodeTypes };
  }

  static generateLookupTables(prefetchedData: RawCategoryLists) {
    const lookupTable: CategoryLookupTables = {
      synonymCache: null,
      idsToWheelmapCategories: {},
      wheelmapCategoryNamesToCategories: {},
      wheelmapRootCategoryNamesToCategories: {},
    };

    Categories.generateSynonymCache(lookupTable, prefetchedData.accessibilityCloud);
    Categories.fillCategoryLookupTable(lookupTable, prefetchedData.wheelmapCategories);
    Categories.fillCategoryLookupTable(lookupTable, prefetchedData.wheelmapNodeTypes);

    return lookupTable;
  }
}

export function categoryNameFor(category: Category): string | void {
  if (!category) return;
  let idObject = null;

  if (category._tag === 'ACCategory') {
    idObject = category.translations._id;
  }

  return translatedStringFromObject(idObject);
}

export function getCategoryId(category?: Category | string | WheelmapCategoryOrNodeType | undefined): string | undefined {
  if (!category) {
    return;
  }
  // ac
  if (typeof category === 'string') {
    return category;
  }

  if (typeof category === 'object' && category) {
    // wheelmap node_type or category
    if (typeof category['identifier'] === 'string') {
      return category['identifier'];
    }
    // ac server category object
    if (typeof category['_id'] === 'string') {
      return category['_id'];
    }
  }
}

export function getCategoryIdFromProperties(
  props: AccessibilityCloudProperties | WheelmapProperties
): string | undefined {
  if (!props) {
    return;
  }

  if (isWheelmapProperties(props) && props.node_type && typeof props.node_type.identifier === 'string') {
    return getCategoryId(props.node_type.identifier);
  }

  return getCategoryId(props.category);
}
