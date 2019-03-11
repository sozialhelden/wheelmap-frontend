import { createContext } from 'react';

export type AppContext = {
  baseUrl: string,
};

const { Provider, Consumer } = createContext<AppContext>();

export { Provider as AppContextProvider, Consumer as AppContextConsumer };
