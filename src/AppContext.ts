import { createContext } from 'react';
import { CategoryLookupTables } from './lib/Categories';
import { App } from './lib/App';

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
    clientSideConfiguration: {} as any,
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
