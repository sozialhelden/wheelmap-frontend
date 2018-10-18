// @flow
import React, { createContext, Component } from 'react';

import { type RouterHistory, type RouteParams } from '../../lib/RouterHistory';
import { type RouteContext, RouteConsumer, RouteProvider } from './RouteContext';

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

    if (onClick) {
      onClick(event);
    }

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
    const href = history.generatePath(routeName, params);

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
