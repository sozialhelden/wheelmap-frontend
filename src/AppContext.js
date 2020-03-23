// @flow

import { createContext } from 'react';
import { type CategoryLookupTables } from './lib/Categories';
import { type App } from './lib/App';

// Only extend this with values that are sensible global values that potentially might be needed
// everywhere
export type AppContextData = {
  app: App,
  baseUrl: string,
  categories: CategoryLookupTables,
  preferredLanguage: string,
};

const AppContext = createContext<AppContextData>({
  app: {
    _id: '',
    organizationId: '',
    name: '',
    clientSideConfiguration: {},
    tokenString: '',
  },
  baseUrl: '',
  categories: {
    synonymCache: {},
    idsToWheelmapCategories: {},
    wheelmapCategoryNamesToCategories: {},
    wheelmapRootCategoryNamesToCategories: {},
    categoryTree: [],
  },
  preferredLanguage: '',
});

const { Provider, Consumer } = AppContext;

export { Provider as AppContextProvider, Consumer as AppContextConsumer };

export default AppContext;
