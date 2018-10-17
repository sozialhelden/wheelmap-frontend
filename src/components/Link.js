// @flow
import React, { createContext, Component } from 'react';

import {
  type RouterHistory,
  type RouterHistoryMethod,
  type RouteParams,
} from '../lib/RouterHistory';

type RouteContext = {
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

type Props = {
  routeName: string,
  replace?: boolean,
  params?: RouteParams,
  onClick?: (event: SyntheticEvent<HTMLLinkElement>) => void,
};

class Link extends Component<Props> {
  handleClick(
    history: RouterHistory,
    params?: RouteParams,
    event: SyntheticEvent<HTMLLinkElement>
  ) {
    const { routeName, replace, onClick } = this.props;

    onClick && onClick(event);

    if (event.isDefaultPrevented()) {
      return;
    }

    event.preventDefault();

    if (replace) {
      history.replace(routeName, params);
    } else {
      history.push(routeName, params);
    }
  }

  renderLink = (context: RouteContext) => {
    const { history } = context;
    const { routeName, params, ...props } = this.props;
    const href = history.generate(routeName, params);

    delete props.replace;

    return (
      <a
        {...props}
        href={href}
        onClick={event => {
          this.handleClick(history, params, event);
        }}
      />
    );
  };

  render() {
    return <RouteConsumer>{this.renderLink}</RouteConsumer>;
  }
}

export default Link;

export { RouteProvider, RouteConsumer };
