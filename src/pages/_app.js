// @flow

// babel-preset-react-app uses useBuiltIn "entry". We therefore need an entry
// polyfill import to be replaced with polyfills we need for our targeted browsers.
import '@babel/polyfill';

import React from 'react';
import BaseApp, { Container } from 'next/app';
import Error from 'next/error';

import GlobalStyle from '../GlobalStyle';
import LeafletStyle from '../LeafletStyle';
import AppStyle from '../AppStyle';
import MapStyle from '../MapStyle';
import { parseAcceptLanguageString } from '../lib/i18n';
import router from '../app/router';
import {
  getInitialProps,
  getAppInitialProps,
  clientStoreAppInitialProps,
  clientStoreInitialProps,
} from '../app/getInitialProps';
import NextRouterHistory from '../lib/NextRouteHistory';

type Props = {};

export default class App extends BaseApp<Props> {
  static async getInitialProps({
    Component: PageComponent,
    ctx,
  }: {
    Component: React.Component<>,
    ctx: any,
  }) {
    let appProps;
    let routeProps;

    const isServer = !!(ctx && ctx.req);

    // handle 404 before the app is rendered, as we otherwise render the whole app again
    // this is very relevant for missing static files like translations
    if (isServer && ctx.res.statusCode === 404) {
      const error = new Error('Could not load');
      error.statusCode = 404;
      return { error };
    }

    // pass on errors
    if (ctx.err) {
      return { error: ctx.err };
    }

    try {
      // user agent
      const userAgentString = isServer ? ctx.req.headers['user-agent'] : undefined;

      // translations
      let languages = ['en'];

      if (ctx.req) {
        if (ctx.req.headers['accept-language']) {
          languages = parseAcceptLanguageString(ctx.req.headers['accept-language']);
        }
      } else {
        languages = window.navigator.languages;
      }

      appProps = await getAppInitialProps({ userAgentString, languages, ...ctx.query }, isServer);

      if (ctx.query.routeName) {
        routeProps = await getInitialProps(ctx.query, isServer);
      }
    } catch (error) {
      console.error(error);

      if (ctx.res) {
        ctx.res.statusCode = error.statusCode || 500;
      }

      return { error };
    }

    return { ...appProps, ...routeProps, routeName: ctx.query.routeName, isServer };
  }

  constructor(props: Props) {
    super(props);
    this.routerHistory = new NextRouterHistory(router);
  }

  render() {
    const { Component: PageComponent, error, routeName, isServer, ...props } = this.props;

    if (error && error.statusCode !== 404) {
      console.error(error);
    }

    if (isServer === false) {
      clientStoreAppInitialProps(props);

      if (routeName) {
        clientStoreInitialProps(routeName, props);
      }
    }

    return (
      <Container>
        {error ? (
          <div>
            {error.message}
            <Error statusCode={error.statusCode} />
          </div>
        ) : (
          <PageComponent routerHistory={this.routerHistory} {...props} />
        )}
        <GlobalStyle />
        <LeafletStyle />
        <AppStyle />
        <MapStyle />
      </Container>
    );
  }
}
