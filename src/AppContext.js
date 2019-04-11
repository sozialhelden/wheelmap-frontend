import { createContext } from 'react';

// Only extend this with value that are sensible global values that potentially might be needed
// everywhere
export type AppContext = {
  baseUrl: string,
};

// FIXME
// The next line should be rather:
// const { Provider, Consumer } = createContext<AppContext>();
//
// Adding the correct generic typing here produces errors during compilation though.
const { Provider, Consumer } = createContext();

export { Provider as AppContextProvider, Consumer as AppContextConsumer };
