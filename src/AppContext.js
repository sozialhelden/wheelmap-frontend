// @flow

import { createContext } from 'react';
import { type CategoryLookupTables } from './lib/Categories';
import { type App } from './lib/App';

// Only extend this with values that are sensible global values that potentially might be needed
// everywhere
export type AppContext = {
  app: App,
  baseUrl: string,
  categories: CategoryLookupTables,
  preferredLanguage: string,
};

const { Provider, Consumer } = createContext<AppContext>({
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
  },
  preferredLanguage: '',
});

export { Provider as AppContextProvider, Consumer as AppContextConsumer };
