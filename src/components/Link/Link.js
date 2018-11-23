// @flow
import * as React from 'react';
import isUrl from 'is-url';

import { type RouterHistory, type RouteParams } from '../../lib/RouterHistory';
import { type RouteContext, RouteConsumer, RouteProvider } from './RouteContext';

type Props = {
  to: string,
  replace?: boolean,
  params?: RouteParams,
  children?: React.Node,
  onClick?: (event: SyntheticEvent<HTMLLinkElement>) => void,
};

class Link extends React.Component<Props> {
  handleClick(
    routeName: string,
    history: RouterHistory,
    params?: RouteParams,
    event: SyntheticEvent<HTMLLinkElement>
  ) {
    const { replace, onClick } = this.props;

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

  renderInternalLink = (routeName: string) => {
    const { params, children, ...props } = this.props;

    delete props.replace;

    return (
      <RouteConsumer>
        {(context: RouteContext) => (
          <a
            {...props}
            href={context.history.generatePath(routeName, context.params)}
            onClick={(event: SyntheticEvent<HTMLLinkElement>) => {
              this.handleClick(routeName, context.history, context.params, event);
            }}
          >
            {children}
          </a>
        )}
      </RouteConsumer>
    );
  };

  renderExternalLink = (to: string) => (
    <a {...this.props} href={to}>
      {this.props.children}
    </a>
  );

  render() {
    const { to } = this.props;

    if (isUrl(to)) {
      return this.renderExternalLink(to);
    } else if (typeof to === 'string') {
      return this.renderInternalLink(to);
    }

    return null;
  }
}

export default Link;

export { RouteProvider, RouteConsumer };
