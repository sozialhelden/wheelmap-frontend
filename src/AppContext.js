// @flow

import { createContext, type Context } from 'react';
import { type CategoryLookupTables } from './lib/Categories';

// Only extend this with value that are sensible global values that potentially might be needed
// everywhere
export type AppContext = {
  baseUrl: string,
  categories: CategoryLookupTables,
};

const { Provider, Consumer } = createContext<AppContext>({
  baseUrl: '',
  categories: {
    synonymCache: {},
    idsToWheelmapCategories: {},
    wheelmapCategoryNamesToCategories: {},
    wheelmapRootCategoryNamesToCategories: {},
  },
});

export { Provider as AppContextProvider, Consumer as AppContextConsumer };
