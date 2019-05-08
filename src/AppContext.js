// @flow

import { createContext } from 'react';
import { type CategoryLookupTables } from './lib/Categories';
import { App } from './lib/App';

// Only extend this with value that are sensible global values that potentially might be needed
// everywhere
export type AppContext = {
  organizationId?: string,
  appId?: string,
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
