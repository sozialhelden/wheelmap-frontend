// @flow
import React, { createContext } from 'react';

import { type RouterHistory, type RouteParams } from '../../lib/RouterHistory';

export type RouteContext = {
  params: RouteParams,
  history: RouterHistory,
  name: string,
};

const { Provider: RouteProvider, Consumer: BaseRouteConsumer } = createContext<?RouteContext>();

const RouteConsumer = ({ children }: { children: (context: RouteContext) => React$Node }) => (
  <BaseRouteConsumer>
    {(context: ?RouteContext) => {
      if (context == null) {
        throw new Error('Missing route context.');
      }

      return children(context);
    }}
  </BaseRouteConsumer>
);

export { RouteProvider, RouteConsumer };
