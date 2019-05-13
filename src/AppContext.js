// @flow

import { createContext } from 'react';
import { type CategoryLookupTables } from './lib/Categories';
import { type App } from './lib/App';

// Only extend this with values that are sensible global values that potentially might be needed
// everywhere
export type AppContext = {
  app?: App,
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
