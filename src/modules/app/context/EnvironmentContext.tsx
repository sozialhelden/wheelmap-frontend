import { type ReactNode, createContext, useContext } from "react";
import { addToEnvironment, getEnvironment } from "~/lib/util/globalEnvironment";

export type EnvironmentVariables = Record<string, string | undefined>;

export const EnvironmentContext = createContext<EnvironmentVariables>({});

export function useEnvironmentContext() {
  return useContext(EnvironmentContext);
}

export function EnvironmentContextProvider({
  children,
  environmentVariables,
}: { children: ReactNode; environmentVariables: EnvironmentVariables }) {
  /**
   * TODO: Remove this when switching to the app router
   *  This is a temporary workaround that stores environment variables on the window object. We're doing this
   *  because getInitialProps in the _app.tsx is being called on the server for the initial request as well as
   *  on the client on every page navigation. This means that the given environmentVariables when this is used
   *  by the pages router are not available on the client side if not stored on the window object. When we switch
   *  to the app router, we can remove this and use the environment variables given by the layout component as this
   *  part is always rendered on the server.
   */
  addToEnvironment(environmentVariables);
  const environment = getEnvironment();

  return (
    <EnvironmentContext.Provider value={environment}>
      {children}
    </EnvironmentContext.Provider>
  );
}
