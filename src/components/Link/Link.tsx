import * as React from 'react';
import isUrl from 'is-url';

import { RouterHistory, RouteParams } from '../../lib/RouterHistory';
import { RouteContext, RouteConsumer, RouteProvider } from './RouteContext';

type Props = {
  to: string,
  replace?: boolean,
  params?: RouteParams,
  children?: React.ReactNode,
  className?: string | null,
  role?: string | null,
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void,
  onFocus?: () => void,
  onBlur?: () => void,
  style?: React.CSSProperties,
};

class Link extends React.Component<Props> {
  handleClick(
    routeName: string,
    history: RouterHistory,
    params?: RouteParams,
    event?: React.MouseEvent<HTMLAnchorElement>
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
    const { children, ...props } = this.props;

    delete props.replace;

    return (
      <RouteConsumer>
        {(context: RouteContext) => {
          const params = this.props.params || context.params;
          const finalRouteName = routeName || context.name;
          const href = context.history.generatePath(finalRouteName, params);
          if (!href) {
            return null;
          }

          return (
            <a
              {...props}
              href={context.history.generatePath(finalRouteName, params)}
              onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                this.handleClick(finalRouteName, context.history, params, event);
              }}
            >
              {children}
            </a>
          );
        }}
      </RouteConsumer>
    );
  };

  renderExternalLink = (to: string) => (
    <a {...this.props} href={to} target="_blank" rel="noopener noreferrer">
      {this.props.children}
    </a>
  );

  render() {
    const { to } = this.props;

    if (to?.match(/https?:\/\//)) {
      return this.renderExternalLink(to);
    } else if (typeof to === 'string') {
      return this.renderInternalLink(to);
    }

    throw new Error(
      'Failed to create Link component: `to` property was not a URL, route path or route name'
    );
  }
}

export default Link;

export { RouteProvider, RouteConsumer };
