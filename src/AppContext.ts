import { createContext } from 'react';
import { CategoryLookupTables } from './lib/Categories';
import { App } from './lib/App';

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
    clientSideConfiguration: {} as any,
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
