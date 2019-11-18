import React, { createContext } from 'react';

import { RouterHistory, RouteParams } from '../../lib/RouterHistory';

export type RouteContext = {
  params: RouteParams,
  history: RouterHistory,
  name: string,
};

// explicitly set defaultValue to undefined, see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/24509#issuecomment-382213106
const { Provider: RouteProvider, Consumer: BaseRouteConsumer } = createContext<RouteContext>(undefined);

const RouteConsumer = ({ children }: { children: (context: RouteContext) => React.ReactNode }) => (
  <BaseRouteConsumer>
    {(context: RouteContext | null) => {
      if (context == null) {
        throw new Error('Missing route context.');
      }

      return children(context);
    }}
  </BaseRouteConsumer>
);

export { RouteProvider, RouteConsumer };
